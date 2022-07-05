const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Token Contract", async () => {
  let Erc20;
  let erc20;
  let erc20_address;
  let Nft;
  let nft;
  let owner;
  let add1;
  let add2;
  let addr;
  beforeEach(async () => {
    Erc20 = await ethers.getContractFactory("warin");
    erc20 = await upgrades.deployProxy(Erc20, { kind: "uups" })
    await erc20.deployed();
    erc20_address = erc20.address;
    console.log(erc20_address)
    Nft = await ethers.getContractFactory("staking_erc_to_nft");
    nft = await upgrades.deployProxy(Nft, [erc20_address], { kind: 'uups' });
    await nft.deployed();
    [owner, add1, add2, ...addr] = await ethers.getSigners();
    // console.log(owner);
    // console.log(add1);
  });

  describe("staking_erc_to_nft", async function () {

    it("Should return the name of erc20 and erc721 contract", async function () {
      expect(await erc20.name()).to.equal("Warin");
      expect(await nft.name()).to.equal("WarNFT");
    });
    it("should return the total supply of erc20 contract", async function () {
      expect(await erc20.totalSupply()).to.equal(100000000);
    });
    it("SHould Transfer tokens from the owner to other accounts", async () => {
      await erc20.transfer(add1.address, 5);
      const add1Balance = await erc20.balanceOf(add1.address)
      expect(add1Balance).to.equal(5)
      // console.log(await(erc20.balanceOf(add2.address)))
      await erc20.connect(add1).transfer(add2.address, 5)
      const add2Balance = await erc20.balanceOf(add2.address);
      // console.log(add2Balance)
      expect(add2Balance).to.equal(5);
    })
    it("Check if the Sender has adequate funds", async () => {
      const initialownerBalance = await erc20.balanceOf(owner.address);
      console.log(`Thi is initial owner balance ${initialownerBalance}`)
      const initialadd1Balance = await erc20.balanceOf(add1.address)
      console.log(initialadd1Balance);
      await expect(erc20.connect(add1).transfer(owner.address, 1))
        .to.be.revertedWith("ERC20: transfer amount exceeds balance");
      expect(await erc20.balanceOf(owner.address)).to.equal(initialownerBalance);

    });
    it("Should update balances after transfer", async () => {
      const initialownerBalance = await erc20.balanceOf(owner.address);
      await erc20.transfer(add1.address, 20);
      await erc20.transfer(add2.address, 30);
      expect(await erc20.balanceOf(owner.address)).to.equal(initialownerBalance - 50)

    })
    //Writing Tests for NFT CONTRACT
    it("Checking the mapping",async()=>{
      await nft.create_stake_and_mint_nft(owner.address,2,10,20000);
      console.log(`This is the mapping output ${await nft.addToStake(owner.address)}`);
      const [output2]=await nft.addToStake(owner.address);
      expect(output2).to.equal(20000)
    })
    it("Check if the person has staked anything", async () => {
      await expect(nft.reward_per_person(add1.address)).to.be.revertedWith("User has not staked any thing yet");
    })
    it("Check if the reward is calculated correctly",async()=>{
      await nft.create_stake_and_mint_nft(owner.address,10,10,20000);
      await nft.reward_per_person(owner.address);
      const reward= await nft.addTOreward(owner.address);
      console.log(reward)
      expect(reward).to.equal(800);
      
    })


  })
});
