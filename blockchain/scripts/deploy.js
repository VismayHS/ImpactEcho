const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment to", hre.network.name);
  console.log("⏳ Deploying contracts...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "MATIC\n");

  // Deploy DonationRegistry
  console.log("📜 Deploying DonationRegistry...");
  const DonationRegistry = await hre.ethers.getContractFactory("DonationRegistry");
  const donationRegistry = await DonationRegistry.deploy();
  await donationRegistry.waitForDeployment();
  const donationRegistryAddress = await donationRegistry.getAddress();
  
  console.log("✅ DonationRegistry deployed to:", donationRegistryAddress);

  // Deploy ImpactBadge
  console.log("\n📜 Deploying ImpactBadge NFT...");
  const ImpactBadge = await hre.ethers.getContractFactory("ImpactBadge");
  const impactBadge = await ImpactBadge.deploy();
  await impactBadge.waitForDeployment();
  const impactBadgeAddress = await impactBadge.getAddress();
  
  console.log("✅ ImpactBadge deployed to:", impactBadgeAddress);

  // Wait for block confirmations on testnet/mainnet
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    await donationRegistry.deploymentTransaction().wait(6);
    await impactBadge.deploymentTransaction().wait(6);
    console.log("✅ Confirmed!");

    // Verify contracts on Polygonscan
    console.log("\n🔍 Verifying contracts on Polygonscan...");
    try {
      await hre.run("verify:verify", {
        address: donationRegistryAddress,
        constructorArguments: []
      });
      console.log("✅ DonationRegistry verified!");
    } catch (error) {
      console.log("❌ Error verifying DonationRegistry:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: impactBadgeAddress,
        constructorArguments: []
      });
      console.log("✅ ImpactBadge verified!");
    } catch (error) {
      console.log("❌ Error verifying ImpactBadge:", error.message);
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE");
  console.log("=".repeat(60));
  console.log("\n📋 Contract Addresses:");
  console.log("   DonationRegistry:", donationRegistryAddress);
  console.log("   ImpactBadge:     ", impactBadgeAddress);
  console.log("\n📝 Next Steps:");
  console.log("   1. Copy DonationRegistry address to backend/.env");
  console.log("   2. Copy addresses to frontend/.env.local");
  console.log("   3. Add backend wallet as verifier:");
  console.log(`      npx hardhat run scripts/addVerifier.js --network ${hre.network.name}`);
  console.log("\n🌐 View on PolygonScan:");
  if (hre.network.name === "mumbai") {
    console.log(`   https://mumbai.polygonscan.com/address/${donationRegistryAddress}`);
    console.log(`   https://mumbai.polygonscan.com/address/${impactBadgeAddress}`);
  } else if (hre.network.name === "polygon") {
    console.log(`   https://polygonscan.com/address/${donationRegistryAddress}`);
    console.log(`   https://polygonscan.com/address/${impactBadgeAddress}`);
  }
  console.log("=".repeat(60) + "\n");

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      DonationRegistry: donationRegistryAddress,
      ImpactBadge: impactBadgeAddress
    }
  };

  const deploymentsDir = "./deployments";
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  fs.writeFileSync(
    `${deploymentsDir}/${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`📁 Deployment info saved to deployments/${hre.network.name}.json\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
