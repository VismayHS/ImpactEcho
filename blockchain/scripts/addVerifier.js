const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const donationRegistryAddress = process.env.CONTRACT_ADDRESS;
  const verifierAddress = process.env.VERIFIER_ADDRESS;

  if (!donationRegistryAddress || !verifierAddress) {
    console.error("❌ Please set CONTRACT_ADDRESS and VERIFIER_ADDRESS in .env");
    process.exit(1);
  }

  console.log("📝 Adding verifier to DonationRegistry");
  console.log("   Contract:", donationRegistryAddress);
  console.log("   Verifier:", verifierAddress);

  const DonationRegistry = await hre.ethers.getContractFactory("DonationRegistry");
  const contract = DonationRegistry.attach(donationRegistryAddress);

  const tx = await contract.addVerifier(verifierAddress);
  console.log("\n⏳ Transaction sent:", tx.hash);
  
  await tx.wait();
  console.log("✅ Verifier added successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
