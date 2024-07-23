import "@typechain/hardhat";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "solidity-coverage";

require("dotenv").config();

type GasReportConfig = {
  token: string;
  gasPriceApi: string;
};

const gasReportConfigs: Record<string, GasReportConfig> = {
  Mainnet: {
    token: "ETH",
    gasPriceApi:
      "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
  },
  Polygon: {
    token: "MATIC",
    gasPriceApi:
      "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice",
  },
  Base: {
    token: "ETH",
    gasPriceApi: `https://api.basescan.com/api?module=proxy&action=eth_gasPrice&apikey=${process.env.BASESCAN_API_KEY}`,
  },
};

const etherscanConfig = {
  mainnet: {
    apiUrl: "https://api.etherscan.io/",
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
  sepolia: {
    apiUrl: "https://api-sepolia.etherscan.io/api",
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
  polygon: {
    apiUrl: "https://api.polygonscan.com/api",
    apiKey: process.env.POLYGONSCAN_API_KEY || "",
  },
  mumbai: {
    apiUrl: "https://api-testnet.polygonscan.com/api",
    apiKey: process.env.POLYGONSCAN_API_KEY || "",
  },
};

const config = {
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 20,
      },
    },
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
  },
  namedAccounts: {
    owner: { default: 0 },
    sender1: { default: 1 },
    sender: { default: 2 },
  },
  gasReporter: {
    enabled: true,
    coinmarketcap: process.env.COINMARKETCAP_API || "",
    // Uncomment below for outputting the gas report to a file
    // outputFile: "gas-report.txt",
    // noColors: true,
    // ===============
    token: gasReportConfigs[process.env.GAS_REPORT_NETWORK || "Mainnet"].token,
    // gasPrice: 300,
    gasPriceApi:
      gasReportConfigs[process.env.GAS_REPORT_NETWORK || "Mainnet"].gasPriceApi,
  },
  typechain: {
    outDir: "dist/types",
    target: "ethers-v6",
  },
  networks: {
    hardhat: {
      chainId: 1337,
      mining: {
        auto: true,
      },
      gas: 20000000,
      blockGasLimit: 20000000,
      gasPrice: 10000000000, // 10 Gwei
      gasMultiplier: 2,
      hardfork: "muirGlacier",
      throwOnCallFailures: true,
      throwOnTransactionFailures: true,
      accounts: {
        count: 10,
        accountsBalance: "1000000000000000000000",
      },
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: {
        mnemonic:
          process.env.DEPLOYER_MNEMONIC ||
          "test test test test test test test test test test test test ",
      },
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: {
        mnemonic:
          process.env.DEPLOYER_MNEMONIC ||
          "test test test test test test test test test test test test ",
      },
    },
  },
};

export default config;
