require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { PRIVATE_KEY, API_KEY, API_URL } = process.env;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.18",
      },
      { 
        version: "0.6.0",
      },
      { 
        version: "0.6.12",
      },
    ],
  },
  networks: {
    goerli: {
      accounts: [`0x${PRIVATE_KEY}`],
      url: API_URL,
    },
    hardhat: {
      gas: 30000000,
      forking: {
        url: `https://eth-mainnet.g.alchemy.com/v2/${API_KEY}`,
        blockNumber: 17000408
      }
    }
  },
};
