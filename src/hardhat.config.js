require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('@openzeppelin/hardhat-upgrades');
require("dotenv").config()

// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

module.exports = {
  solidity: "0.8.15",
  networks:{
    mumbai:{
      url:process.env.REACT_APP_url,
      accounts:[process.env.REACT_APP_key],
      
    }
  },
  etherscan:{
    apiKey:process.env.REACT_APP_apikey,
  }
};
