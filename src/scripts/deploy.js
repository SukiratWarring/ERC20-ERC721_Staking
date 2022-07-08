const { ethers, upgrades } = require("hardhat");

async function main() {
  const Erc20= await ethers.getContractFactory("warin")
  // console.log(Erc20);
  console.log("After 1")
  const erc20=await upgrades.deployProxy(Erc20, {kind:"uups"});
  // console.log(erc20);
  console.log("AFter2")
  await erc20.deployed();
  console.log(`The Token address is ${erc20.address}`)
  erc20_address = erc20.address;
  const Nft = await ethers.getContractFactory("staking_erc_to_nft");
  console.log("HERE")
  const nft = await upgrades.deployProxy(Nft, [erc20_address,60], { kind: 'uups' });
  await nft.deployed();
  console.log(`The Staking contract address is ${nft.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
