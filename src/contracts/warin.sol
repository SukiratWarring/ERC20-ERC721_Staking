// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract warin is Initializable, ERC20Upgradeable,OwnableUpgradeable,UUPSUpgradeable {
    function initialize() initializer public {
        __ERC20_init("Warin", "WARIN");
        __UUPSUpgradeable_init();
        __Ownable_init();
    }
    function _authorizeUpgrade(address newImplementation)internal override onlyOwner{}

    function mintfortoken(address to, uint256 amount) external  {
        _mint(to, amount);
    }
    function burnfortoken(address to, uint amount) external{
        _burn(to,amount);
    }
    
}