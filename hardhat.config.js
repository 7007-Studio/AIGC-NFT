/** @type import('hardhat/config').HardhatUserConfig */

// import toolbox
require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");

// config dotenv
dotenv.config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        // comment out this forking line to run on local network (faster)
        url: "https://eth-sepolia.g.alchemy.com/v2/YtuZNoSf4-21juvqHTpYM-qYKDJjn6bM",
      },
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/YtuZNoSf4-21juvqHTpYM-qYKDJjn6bM",
      chainId: 11155111,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: "5H7CR7NSYC2ZTJNQMFUY53Y8U2KVD6KF5G",
    },
  },

  allowUnlimitedContractSize: true,
};
