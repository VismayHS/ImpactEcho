const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DonationRegistry", function () {
  let donationRegistry;
  let impactBadge;
  let owner;
  let verifier;
  let donor;

  beforeEach(async function () {
    [owner, verifier, donor] = await ethers.getSigners();

    const DonationRegistry = await ethers.getContractFactory("DonationRegistry");
    donationRegistry = await DonationRegistry.deploy();
    await donationRegistry.waitForDeployment();

    const ImpactBadge = await ethers.getContractFactory("ImpactBadge");
    impactBadge = await ImpactBadge.deploy();
    await impactBadge.waitForDeployment();

    // Add verifier
    await donationRegistry.addVerifier(verifier.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await donationRegistry.owner()).to.equal(owner.address);
    });

    it("Should have owner as default verifier", async function () {
      expect(await donationRegistry.verifiers(owner.address)).to.be.true;
    });
  });

  describe("Donation Registration", function () {
    it("Should register a donation", async function () {
      const tx = await donationRegistry.registerDonation(
        donor.address,
        ethers.parseEther("1.0"),
        "QmTest123",
        "Clean Water Project"
      );

      await expect(tx)
        .to.emit(donationRegistry, "DonationRegistered")
        .withArgs(1, donor.address, ethers.parseEther("1.0"), "QmTest123", "Clean Water Project", await ethers.provider.getBlock('latest').then(b => b.timestamp));

      const donation = await donationRegistry.getDonation(1);
      expect(donation.donor).to.equal(donor.address);
      expect(donation.amount).to.equal(ethers.parseEther("1.0"));
      expect(donation.ipfsCID).to.equal("QmTest123");
      expect(donation.verified).to.be.false;
    });

    it("Should increment donation count", async function () {
      await donationRegistry.registerDonation(donor.address, ethers.parseEther("1.0"), "QmTest1", "Project 1");
      await donationRegistry.registerDonation(donor.address, ethers.parseEther("2.0"), "QmTest2", "Project 2");
      
      expect(await donationRegistry.getTotalDonations()).to.equal(2);
    });

    it("Should only allow owner to register donations", async function () {
      await expect(
        donationRegistry.connect(donor).registerDonation(donor.address, ethers.parseEther("1.0"), "QmTest", "Project")
      ).to.be.reverted;
    });
  });

  describe("Verification", function () {
    beforeEach(async function () {
      await donationRegistry.registerDonation(
        donor.address,
        ethers.parseEther("1.0"),
        "QmTest123",
        "Clean Water"
      );
    });

    it("Should verify a donation", async function () {
      const tx = await donationRegistry.connect(verifier).verifyDonation(
        1,
        true,
        "QmVerify123",
        85
      );

      await expect(tx)
        .to.emit(donationRegistry, "DonationVerified")
        .withArgs(1, true, "QmVerify123", 85, await ethers.provider.getBlock('latest').then(b => b.timestamp));

      const donation = await donationRegistry.getDonation(1);
      expect(donation.verified).to.be.true;
      expect(donation.verificationScore).to.equal(85);
    });

    it("Should only allow verifiers to verify", async function () {
      await expect(
        donationRegistry.connect(donor).verifyDonation(1, true, "QmVerify", 75)
      ).to.be.reverted;
    });

    it("Should reject score > 100", async function () {
      await expect(
        donationRegistry.connect(verifier).verifyDonation(1, true, "QmVerify", 101)
      ).to.be.revertedWith("Score must be 0-100");
    });

    it("Should not allow re-verification", async function () {
      await donationRegistry.connect(verifier).verifyDonation(1, true, "QmVerify", 85);
      
      await expect(
        donationRegistry.connect(verifier).verifyDonation(1, true, "QmVerify2", 90)
      ).to.be.revertedWith("Already verified");
    });
  });

  describe("Verifier Management", function () {
    it("Should add verifier", async function () {
      const newVerifier = ethers.Wallet.createRandom().address;
      await donationRegistry.addVerifier(newVerifier);
      expect(await donationRegistry.verifiers(newVerifier)).to.be.true;
    });

    it("Should remove verifier", async function () {
      await donationRegistry.removeVerifier(verifier.address);
      expect(await donationRegistry.verifiers(verifier.address)).to.be.false;
    });

    it("Should only allow owner to manage verifiers", async function () {
      const newVerifier = ethers.Wallet.createRandom().address;
      await expect(
        donationRegistry.connect(donor).addVerifier(newVerifier)
      ).to.be.reverted;
    });
  });

  describe("Statistics", function () {
    it("Should track statistics correctly", async function () {
      await donationRegistry.registerDonation(donor.address, ethers.parseEther("1.0"), "Qm1", "P1");
      await donationRegistry.registerDonation(donor.address, ethers.parseEther("2.0"), "Qm2", "P2");
      await donationRegistry.connect(verifier).verifyDonation(1, true, "QmV1", 80);

      const stats = await donationRegistry.getStats();
      expect(stats._totalDonations).to.equal(2);
      expect(stats._totalVerified).to.equal(1);
      expect(stats._totalAmount).to.equal(ethers.parseEther("3.0"));
    });
  });
});

describe("ImpactBadge", function () {
  let impactBadge;
  let owner;
  let recipient;

  beforeEach(async function () {
    [owner, recipient] = await ethers.getSigners();

    const ImpactBadge = await ethers.getContractFactory("ImpactBadge");
    impactBadge = await ImpactBadge.deploy();
    await impactBadge.waitForDeployment();
  });

  describe("Badge Minting", function () {
    it("Should mint a badge", async function () {
      const tx = await impactBadge.mintBadge(
        recipient.address,
        1,
        ethers.parseEther("1.0"),
        "Clean Water",
        85,
        "ipfs://QmBadge123"
      );

      await expect(tx)
        .to.emit(impactBadge, "BadgeMinted")
        .withArgs(1, recipient.address, 1, "Clean Water", 85);

      expect(await impactBadge.ownerOf(1)).to.equal(recipient.address);
    });

    it("Should store badge metadata", async function () {
      await impactBadge.mintBadge(
        recipient.address,
        1,
        ethers.parseEther("1.0"),
        "Clean Water",
        85,
        "ipfs://QmBadge123"
      );

      const metadata = await impactBadge.getBadgeMetadata(1);
      expect(metadata.donationId).to.equal(1);
      expect(metadata.campaign).to.equal("Clean Water");
      expect(metadata.verificationScore).to.equal(85);
    });

    it("Should prevent duplicate badges", async function () {
      await impactBadge.mintBadge(recipient.address, 1, ethers.parseEther("1.0"), "Project", 85, "ipfs://Qm1");
      
      await expect(
        impactBadge.mintBadge(recipient.address, 1, ethers.parseEther("1.0"), "Project", 85, "ipfs://Qm2")
      ).to.be.revertedWith("Badge already minted for this donation");
    });

    it("Should only allow owner to mint", async function () {
      await expect(
        impactBadge.connect(recipient).mintBadge(recipient.address, 1, ethers.parseEther("1.0"), "Project", 85, "ipfs://Qm1")
      ).to.be.reverted;
    });
  });

  describe("Token URI", function () {
    it("Should return correct token URI", async function () {
      await impactBadge.mintBadge(
        recipient.address,
        1,
        ethers.parseEther("1.0"),
        "Clean Water",
        85,
        "ipfs://QmBadge123"
      );

      expect(await impactBadge.tokenURI(1)).to.equal("ipfs://QmBadge123");
    });
  });
});
