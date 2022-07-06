const stakingcontract=require("../artifacts/contracts/staking_erc_to_nft.sol/staking_erc_to_nft.json");

async function main(){
const abi=stakingcontract.abi
// console.log(abi);
const provider=new ethers.providers.AlchemyProvider("rinkeby",process.env.REACT_APP_project_id_rinkeby);
const wallet= new ethers.Wallet(process.env.REACT_APP_key_rinkeby,provider)
const signer=wallet.connect(provider)
const instance= new ethers.Contract(process.env.REACT_APP_stakingcontract_address_rinkeby,abi,signer)
// await instance.initialize("0x71F27CB05a5a5DAD067501f558A1F15d9A1Bf3C2")
const out =await instance.mint_ex("0x5E0652adcD2F5d77298067C724d66A563238802A","1000000000000000000000000")
console.log(out);
console.log('MINTED THE TOKENS')
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });