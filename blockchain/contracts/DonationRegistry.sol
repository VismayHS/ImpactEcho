// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DonationRegistry
 * @dev Smart contract for transparent donation tracking with AI verification
 * @notice This contract manages donation records, verification, and impact badges (NFTs)
 */
contract DonationRegistry is Ownable, ReentrancyGuard {
    uint256 private _nextDonationId = 1;
    
    // Donation structure
    struct Donation {
        uint256 id;
        address donor;
        uint256 amount;
        string ipfsCID;           // Evidence stored on IPFS
        uint256 timestamp;
        bool verified;
        string verifierCID;       // Verification report CID
        uint256 verificationScore;
        string campaign;
        bool badgeMinted;
    }
    
    // Mappings
    mapping(uint256 => Donation) public donations;
    mapping(address => uint256[]) public donorDonations;
    mapping(address => bool) public verifiers;  // Authorized AI verifiers
    
    // Statistics
    uint256 public totalDonations;
    uint256 public totalVerified;
    uint256 public totalAmount;
    
    // Events
    event DonationRegistered(
        uint256 indexed donationId,
        address indexed donor,
        uint256 amount,
        string ipfsCID,
        string campaign,
        uint256 timestamp
    );
    
    event DonationVerified(
        uint256 indexed donationId,
        bool verified,
        string verifierCID,
        uint256 score,
        uint256 timestamp
    );
    
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    
    // Modifiers
    modifier onlyVerifier() {
        require(verifiers[msg.sender] || msg.sender == owner(), "Not authorized verifier");
        _;
    }
    
    constructor() Ownable(msg.sender) {
        // Owner is automatically a verifier
        verifiers[msg.sender] = true;
    }
    
    /**
     * @dev Register a new donation
     * @param donor Address of the donor
     * @param amount Donation amount in wei
     * @param ipfsCID IPFS CID containing evidence
     * @param campaign Campaign name/identifier
     */
    function registerDonation(
        address donor,
        uint256 amount,
        string memory ipfsCID,
        string memory campaign
    ) external onlyOwner returns (uint256) {
        uint256 newDonationId = _nextDonationId++;
        
        donations[newDonationId] = Donation({
            id: newDonationId,
            donor: donor,
            amount: amount,
            ipfsCID: ipfsCID,
            timestamp: block.timestamp,
            verified: false,
            verifierCID: "",
            verificationScore: 0,
            campaign: campaign,
            badgeMinted: false
        });
        
        donorDonations[donor].push(newDonationId);
        totalDonations++;
        totalAmount += amount;
        
        emit DonationRegistered(
            newDonationId,
            donor,
            amount,
            ipfsCID,
            campaign,
            block.timestamp
        );
        
        return newDonationId;
    }
    
    /**
     * @dev Verify a donation (called by AI verification system)
     * @param donationId ID of the donation to verify
     * @param verified Whether the donation is verified
     * @param verifierCID IPFS CID of verification report
     * @param score Verification score (0-100)
     */
    function verifyDonation(
        uint256 donationId,
        bool verified,
        string memory verifierCID,
        uint256 score
    ) external onlyVerifier {
        require(donationId > 0 && donationId < _nextDonationId, "Invalid donation ID");
        require(!donations[donationId].verified, "Already verified");
        require(score <= 100, "Score must be 0-100");
        
        Donation storage donation = donations[donationId];
        donation.verified = verified;
        donation.verifierCID = verifierCID;
        donation.verificationScore = score;
        
        if (verified) {
            totalVerified++;
        }
        
        emit DonationVerified(
            donationId,
            verified,
            verifierCID,
            score,
            block.timestamp
        );
    }
    
    /**
     * @dev Mark badge as minted for a donation
     * @param donationId ID of the donation
     */
    function markBadgeMinted(uint256 donationId) external onlyOwner {
        require(donationId > 0 && donationId < _nextDonationId, "Invalid donation ID");
        require(donations[donationId].verified, "Donation not verified");
        donations[donationId].badgeMinted = true;
    }
    
    /**
     * @dev Get donation details
     * @param donationId ID of the donation
     */
    function getDonation(uint256 donationId) external view returns (Donation memory) {
        require(donationId > 0 && donationId < _nextDonationId, "Invalid donation ID");
        return donations[donationId];
    }
    
    /**
     * @dev Get all donations by a donor
     * @param donor Address of the donor
     */
    function getDonationsByDonor(address donor) external view returns (uint256[] memory) {
        return donorDonations[donor];
    }
    
    /**
     * @dev Get total number of donations
     */
    function getTotalDonations() external view returns (uint256) {
        return _nextDonationId - 1;
    }
    
    /**
     * @dev Add a verifier
     * @param verifier Address to authorize as verifier
     */
    function addVerifier(address verifier) external onlyOwner {
        require(verifier != address(0), "Invalid address");
        require(!verifiers[verifier], "Already a verifier");
        verifiers[verifier] = true;
        emit VerifierAdded(verifier);
    }
    
    /**
     * @dev Remove a verifier
     * @param verifier Address to remove from verifiers
     */
    function removeVerifier(address verifier) external onlyOwner {
        require(verifiers[verifier], "Not a verifier");
        verifiers[verifier] = false;
        emit VerifierRemoved(verifier);
    }
    
    /**
     * @dev Get statistics
     */
    function getStats() external view returns (
        uint256 _totalDonations,
        uint256 _totalVerified,
        uint256 _totalAmount
    ) {
        return (totalDonations, totalVerified, totalAmount);
    }
}

/**
 * @title ImpactBadge
 * @dev NFT badges minted to donors upon successful verification
 */
contract ImpactBadge is ERC721, Ownable {
    uint256 private _nextTokenId = 1;
    
    struct BadgeMetadata {
        uint256 donationId;
        uint256 amount;
        string campaign;
        uint256 verificationScore;
        uint256 mintedAt;
        string metadataURI;
    }
    
    mapping(uint256 => BadgeMetadata) public badgeMetadata;
    mapping(uint256 => uint256) public donationToBadge;  // donationId => badgeId
    
    event BadgeMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        uint256 indexed donationId,
        string campaign,
        uint256 score
    );
    
    constructor() ERC721("ImpactEcho Badge", "IMPACT") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new impact badge
     * @param recipient Address to receive the badge
     * @param donationId Associated donation ID
     * @param amount Donation amount
     * @param campaign Campaign name
     * @param verificationScore Verification score
     * @param metadataURI IPFS URI for badge metadata
     */
    function mintBadge(
        address recipient,
        uint256 donationId,
        uint256 amount,
        string memory campaign,
        uint256 verificationScore,
        string memory metadataURI
    ) external onlyOwner returns (uint256) {
        require(donationToBadge[donationId] == 0, "Badge already minted for this donation");
        
        uint256 newTokenId = _nextTokenId++;
        
        _safeMint(recipient, newTokenId);
        
        badgeMetadata[newTokenId] = BadgeMetadata({
            donationId: donationId,
            amount: amount,
            campaign: campaign,
            verificationScore: verificationScore,
            mintedAt: block.timestamp,
            metadataURI: metadataURI
        });
        
        donationToBadge[donationId] = newTokenId;
        
        emit BadgeMinted(newTokenId, recipient, donationId, campaign, verificationScore);
        
        return newTokenId;
    }
    
    /**
     * @dev Get badge metadata
     */
    function getBadgeMetadata(uint256 tokenId) external view returns (BadgeMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return badgeMetadata[tokenId];
    }
    
    /**
     * @dev Override tokenURI to return IPFS metadata
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return badgeMetadata[tokenId].metadataURI;
    }
    
    /**
     * @dev Get total badges minted
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }
}
