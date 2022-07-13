const { ethers, upgrades } = require("hardhat");

async function main(){
    const stakingV2=await ethers.getContractFactory("staking_erc_to_nft_V2");
    console.log("Upgrading....")
    await upgrades.upgradeProxy("0xE4923fc12566aAD04E00484922933bb0eA5Ee95D",stakingV2);
    console.log("Contract Upgraded");
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
