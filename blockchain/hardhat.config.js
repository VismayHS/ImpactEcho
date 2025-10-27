require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// 🏠 LOCALHOST ONLY - NO PAID APIs NEEDED!
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || 
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Hardhat test account #0

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // 🏠 LOCAL HARDHAT NETWORK (DEFAULT - FREE!)
    hardhat: {
      chainId: 31337, // Hardhat's default chain ID
      mining: {
        auto: true,
        interval: 0 // Instant mining
      },
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        count: 20, // 20 test accounts with 10,000 ETH each!
        accountsBalance: "10000000000000000000000" // 10,000 ETH
      }
    },
    
    // 🌐 LOCALHOST NETWORK (for `npx hardhat node`)
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337,
      accounts: [
        // Hardhat's default test accounts (safe to use on localhost!)
        DEPLOYER_PRIVATE_KEY,
        "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", // Account #1
        "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"  // Account #2
      ]
    }
    
    // 🚫 ALL PAID NETWORKS REMOVED - 100% FREE!
    // ❌ No Alchemy API needed
    // ❌ No Polygon Mumbai/Mainnet
    // ❌ No Ethereum Mainnet
    // ✅ Everything runs on YOUR computer!
  },
  
  // No Etherscan verification needed for localhost
  etherscan: {
    apiKey: {}
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY
  }
};
