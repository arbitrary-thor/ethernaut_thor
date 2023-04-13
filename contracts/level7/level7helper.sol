  // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ForceHelper {
    address payable private selfDestructTarget;
    constructor (address payable _selfDestructTarget) {
       selfDestructTarget = _selfDestructTarget; 
    }
    receive() external payable {}
    function destroy() external {
        selfdestruct(selfDestructTarget);
    }
}