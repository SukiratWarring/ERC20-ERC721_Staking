// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";




interface Imytoken{
   function mintfortoken(address to, uint256 amount) external;
   function burnfortoken(address account, uint256 amount) external;
   function initialize() external;
   
}
contract staking_erc_to_nft is Initializable,UUPSUpgradeable,ERC721Upgradeable,OwnableUpgradeable {
    //NFT information
    struct Stake{
        uint amount;
        int current_duration;
        int stakedDuration;
        uint rate;
        uint tokenID;
        address owner;
    }
    //function to mint
    function mint_ex(address _to,uint _amount) external {
        token.mintfortoken(_to,_amount);
    }
    uint TOKEN_ID;
    bool ENTERED;
    Imytoken token;

    //Run the initialise function
    function initialize(address warin_address ) initializer public {
        //Add address of the newly deployed Warin contract  
        token =Imytoken(warin_address) ;
        TOKEN_ID=1;
        ENTERED=false;
        __ERC721_init("WarNFT", "WFT");
        __Ownable_init();
        __UUPSUpgradeable_init();
        //minting tokens for the address
        token.mintfortoken(_msgSender(),100000000);
    }
        // Imytoken token=token2;
        // uint TOKEN_ID=TOKEN_ID2;
        // bool ENTERED =ENTERED2;
    //UUPS
        function _authorizeUpgrade(address newImplementation)internal override onlyOwner{}

    //mapping
    mapping (address=>Stake) public addToStake;
    mapping(address=>uint) public addTOreward;
    address[] public stakeholder;
   
    //function to mint
    function create_stake_and_mint_nft(address _to,uint _rate,int _stakedDuration,uint _amount) public {

        Stake storage instance=addToStake[_to];
        instance.current_duration=int(block.timestamp);
        instance.rate=_rate;
        instance.amount=_amount;
        instance.stakedDuration=_stakedDuration;
        instance.owner=_to;
        instance.tokenID=TOKEN_ID;
        stakeholder.push(_to);
        //creating a Stake
        token.burnfortoken(_to,instance.amount);
        //minitng a NFT to the same address
        _safeMint(_to,TOKEN_ID);
        TOKEN_ID++;
        ENTERED=true;
    }
    
    //calculating reward 
    function reward_per_person(address _person) public returns(uint) {
        require(ENTERED==true,"Run the create_stake_and_mint_nft Function");
        Stake memory rewardOf=addToStake[_person];
        int difference=rewardOf.stakedDuration-int(block.timestamp);
        if(difference>rewardOf.stakedDuration){
            //Actual amount if duration is met
            uint Reward=(rewardOf.rate*rewardOf.amount)/100;
            addTOreward[_person]=Reward;
            
        }
        else{
            //Reduced amount if duration is not met
            uint Reward=((rewardOf.rate*rewardOf.amount)*40)/10000;
            addTOreward[_person]=Reward;
        }
        return addTOreward[_person];
    }

    //withdraw per person
    function withdrawReward() public payable onlyOwner{
        require(ENTERED==true,"Run the making_and_minting Function");
        require(addTOreward[_msgSender()]!=0,"Reward not calculated");
        //Burn the nft
        Stake storage rewardOf=addToStake[_msgSender()];
        _burn(rewardOf.tokenID);
        uint256 reward = addTOreward[_msgSender()];
        addTOreward[_msgSender()] = 0;
        //Declaring the struct to zero
        token.mintfortoken(_msgSender(), reward);
        rewardOf.amount=0;
        rewardOf.current_duration =0;
        rewardOf.stakedDuration =0;
        rewardOf.rate =0;
        rewardOf.tokenID =0;
        rewardOf.owner=address(0);
        TOKEN_ID--;

    }
    
}