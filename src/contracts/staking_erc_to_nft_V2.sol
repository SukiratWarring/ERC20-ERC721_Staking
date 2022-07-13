// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;
import "./staking_erc_to_nft.sol";

contract staking_erc_to_nft_V2 is staking_erc_to_nft {
    //mapping for staked tokens
    mapping(uint256 => bool) public tokenToIsStaked;
    mapping(address => uint256) public addressTotokenid;

    function create_stake_and_mint_nft(
        address _to,
        uint256 _rate,
        int256 _stakedDuration,
        uint256 _amount
    ) public override {
        require(
            token.balanceOf(_msgSender()) >= _amount,
            "Account balance is less than the requested stake amount"
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
        //minting it to the contract it self
        _safeMint(_msgSender(), TOKEN_ID);

        stake(_to, TOKEN_ID);
        TOKEN_ID++;
    }

    function isStaked(uint256 tokenId) public view returns (bool) {
        return tokenToIsStaked[tokenId];
    }

    //stake fuction which assigns the particular nft to the
    function stake(address _to, uint256 tokenID) internal {
        //require that the token is not already staked
        require(!isStaked(tokenID), "token is already staked");
        //mapping address to tokenid
        addressTotokenid[_to] = tokenID;
        //updating to staked
        tokenToIsStaked[tokenID] = true;
    }

    function unstake(uint256 tokenID) internal {
        require(isStaked(tokenID), "token isn't staked");
        //updating to unstaked
        tokenToIsStaked[tokenID] = false;
    }

    function withdrawReward(address _person)
        public
        payable
        virtual
        override
        onlyOwner
    {
        require(addTOreward[_person] != 0, "Reward not calculated");
        //Burn the nft
        Stake storage rewardOf = addToStake[_person];
        _burn(rewardOf.tokenID);
        //run the ustake button
        unstake(rewardOf.tokenID);
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
