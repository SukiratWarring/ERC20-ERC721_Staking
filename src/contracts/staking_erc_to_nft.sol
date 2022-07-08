// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";


interface Imytoken {
    function mintfortoken(address to, uint256 amount) external;

    function burnfortoken(address account, uint256 amount) external;

    function initialize() external;

    function balanceOf(address account) view external returns (uint256);

    function transfer(address _to,uint amount) external returns(bool);
}

contract staking_erc_to_nft is
    Initializable,
    UUPSUpgradeable,
    ERC721Upgradeable,
    OwnableUpgradeable,
    KeeperCompatibleInterface
{
    //NFT information
    struct Stake {
        uint256 amount;
        int256 current_duration;
        int256 stakedDuration;
        uint256 rate;
        uint256 tokenID;
        address owner;
    }

    //function to mint
    function mint_ex(address _to, uint256 _amount) external onlyOwner {
        token.mintfortoken(_to, _amount);
    }

    uint256 TOKEN_ID;
    Imytoken token;
        //Chain link keeper state variables
    uint public  interval;
    uint public lastTimeStamp;

    //Run the initialise function
    function initialize(address _token_contract,uint updateInterval) public initializer {
        //Add address of the newly deployed Warin contract
        token = Imytoken(_token_contract);
        TOKEN_ID = 1;
        __ERC721_init("WarNFT", "WFT");
        __Ownable_init();
        __UUPSUpgradeable_init();
        //minting tokens for the address
        //initialising parameters for Chainlink 
        interval = updateInterval;
        lastTimeStamp = block.timestamp;

        token.mintfortoken(_msgSender(), 1**18);//EDIT this will only mint 1 Warin TOKEN

    }
    
    //chainlink upkeep
    function checkUpkeep(bytes calldata checkData) external override view returns(bool upkeepNeeded,bytes memory performData){
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        performData=checkData;
    }
    function performUpkeep(bytes calldata performData ) external override {
        if ((block.timestamp - lastTimeStamp) > interval ) {
            lastTimeStamp = block.timestamp;
            for(uint i=0;i<stakeholder.length;i++){
                address fetchedAddress=stakeholder[i];
                addTOreward[fetchedAddress]+=100;
            }

        }
        performData;
    }

    //UUPS
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}
    //Balance OF ERC-20
    function displayBalanceOF(address _of) view public returns(uint){
        return token.balanceOf(_of);
    }
    //TRANSFER ERC20 tokens
    function transferTokens(address _to,uint _amount) public {
        token.transfer(_to,_amount);
    }

    //mapping
    mapping(address => Stake) public addToStake;
    mapping(address => uint256) public addTOreward;
    address[] public stakeholder;

    //function to mint
    function create_stake_and_mint_nft(
        address _to,
        uint256 _rate,
        int256 _stakedDuration,
        uint256 _amount
    ) public {
        require(
            token.balanceOf(_msgSender()) >= _amount,
            "Account balance is less than the requested stake amount "
        );
        Stake storage instance = addToStake[_to];
        instance.current_duration = int256(block.timestamp);
        instance.rate = _rate;
        instance.amount = _amount;
        instance.stakedDuration = _stakedDuration;
        instance.owner = _to;
        instance.tokenID = TOKEN_ID;
        stakeholder.push(_to);
        //creating a Stake
        token.burnfortoken(_to, instance.amount);
        //minitng a NFT to the same address
        _safeMint(_to, TOKEN_ID);
        TOKEN_ID++;
    }

    function hasStaked(address _of) public view returns (bool) {
        for (uint256 i = 0; i < stakeholder.length; i++) {
            if (stakeholder[i] == _of) {
                //then proceed
                return (true);
            }
        }
        return (false);
    }

    //calculating reward
    function reward_per_person(address _person) public returns (uint256) {
        require(
            hasStaked(_person) == true,
            "User has not staked any thing yet"
        );
        Stake memory rewardOf = addToStake[_person];
        int256 difference = rewardOf.stakedDuration - int256(block.timestamp);
        if (difference > rewardOf.stakedDuration) {
            //Actual amount if duration is met
            uint256 Reward = (rewardOf.rate * rewardOf.amount) / 100;
            
            addTOreward[_person] = Reward;
        } else {
            uint256 ActualReward = (rewardOf.rate * rewardOf.amount) / 100;
            //Reduced amount if duration is not met
            uint256 Reward = (ActualReward*40) / 100;
            addTOreward[_person] = Reward;
        }
        return addTOreward[_person];
    }

    //withdraw per person
    function withdrawReward(address _person) public payable onlyOwner {
        require(addTOreward[_person] != 0, "Reward not calculated");
        //Burn the nft
        Stake storage rewardOf = addToStake[_person];
        _burn(rewardOf.tokenID);
        uint256 reward = addTOreward[_person];
        addTOreward[_person] = 0;
        //Declaring the struct to zero
        token.mintfortoken(_person, reward);
        rewardOf.amount = 0;
        rewardOf.current_duration = 0;
        rewardOf.stakedDuration = 0;
        rewardOf.rate = 0;
        rewardOf.tokenID = 0;
        rewardOf.owner = address(0);
        TOKEN_ID--;
    }
}
