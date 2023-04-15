// SPDX-License-Identifier: MIT

pragma solidity <0.7.0;

import "hardhat/console.sol";
contract BadEngine {
    address payable owner;
    constructor() public{
        owner = payable(msg.sender);
    }
    function destroy() public {
        console.log("BYE");
        selfdestruct(owner);
    }
    function hi() public {
        console.log("HI");
    }
}