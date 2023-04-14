
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level21Helper = await hre.ethers.getContractFactory("MyBuyer");
        const level21Helper = await Level21Helper.deploy();
        await level21Helper.deployed();
        const Level21 = await hre.ethers.getContractFactory("Shop");
        const level21 = await Level21.deploy();
        await level21.deployed();
        console.log(
          `Level21 deployed at address ${level21.address}`
        )
        console.log(
          `Level21Helper deployed at address ${level21Helper.address}`
        )
        return {level21, level21Helper, owner, otherAccount};
    }

    /*
    Сan you get the item from the shop for less than the price asked?
    */
    describe("Solve", function() {
        it("Should solve level21", async function() {
            const {level21, level21Helper, owner, otherAccount} = await loadFixture(deployFallback);
            await level21Helper.connect(otherAccount).buy(level21.address);
            const price = await level21.connect(otherAccount).price();
            const isSold = await level21.connect(otherAccount).isSold();
            expect(price).lessThan(100);
            expect(isSold).equals(true);
        })
    });
});