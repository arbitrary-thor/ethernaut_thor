pragma solidity ^0.8.0;

import 'hardhat/console.sol';
abstract contract AbstractShop {
    uint public price;
    bool public isSold;
    function buy() virtual public;
}

contract MyBuyer {
    function price() external view returns (uint) {
        AbstractShop shop = AbstractShop(msg.sender);
        if (shop.isSold()) {
            return 10;
        }
        return 100;
    }
    function buy(address _shop) public {
        AbstractShop shop = AbstractShop(_shop);
        shop.buy();
    }
}