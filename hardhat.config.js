require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("dotenv").config();
require("@nomicfoundation/hardhat-verify");
require("solidity-coverage");

task("deploy", "Deploy contracts")
  .addFlag("simpleAccountFactory", "deploy sample factory (by default, enabled only on localhost)");

const config = {
  solidity: {
    compilers: [
      {
        version: "0.5.16"
      },
      {
        version: "0.8.9",
        optimizer: { enabled: true, runs: 1000000 }
      },
      {
        version: "0.8.28",
        optimizer: { enabled: true, runs: 1000000 }
      }
    ],
  },
  networks: {
    hardhat: {
      // ローカルテスト用
    }
  },
  mocha: {
    timeout: 10000
  },
  etherscan: {
    apiKey: {
      "base-sepolia": process.env.BASESCAN_API_KEY || process.env.ETHERSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || ""
    },
    customChains: [
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api.etherscan.io/v2/api?chainid=84532",
          browserURL: "https://sepolia.basescan.org"
        }
      },
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api.etherscan.io/v2/api?chainid=11155111",
          browserURL: "https://sepolia.etherscan.io"
        }
      }
    ]
  },
  sourcify: {
    enabled: false
  }
};

// 環境変数が存在する場合のみSepoliaネットワークを追加
if (process.env.SECRET_KEY && process.env.INFURA_ID) {
  config.networks.sepolia = {
    url: `https://sepolia.infura.io/v3/${process.env.INFURA_ID}`,
    accounts: [process.env.SECRET_KEY]
  };
}

// Base Sepoliaネットワークの設定
if (process.env.INFURA_ID) {
  config.networks["base-sepolia"] = {
    url: `https://base-sepolia.infura.io/v3/${process.env.INFURA_ID}`,
    accounts: [process.env.SECRET_KEY],
    chainId: 84532
  };
}
else {
  config.networks["base-sepolia"] = {
    url: "https://sepolia.base.org",
    accounts: [process.env.SECRET_KEY],
    chainId: 84532
  };
}

if (process.env.COVERAGE != null) {
  config.solidity = config.solidity.compilers[0];
}

module.exports = config;