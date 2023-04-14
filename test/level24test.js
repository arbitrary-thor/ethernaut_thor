
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level24Helper = await hre.ethers.getContractFactory("MyBuyer");
        const level24Helper = await Level24Helper.deploy();
        await level24Helper.deployed();
        const Level24 = await hre.ethers.getContractFactory("Shop");
        const level24 = await Level24.deploy();
        await level24.deployed();
        console.log(
          `Level24 deployed at address ${level24.address}`
        )
        console.log(
          `Level24Helper deployed at address ${level24Helper.address}`
        )
        return {level24, level24Helper, owner, otherAccount};
    }

    /*
    Сan you get the item from the shop for less than the price asked?
    */
    describe("Solve", function() {
        it("Should solve level24", async function() {
            const {level24, level24Helper, owner, otherAccount} = await loadFixture(deployFallback);
            await level24Helper.connect(otherAccount).buy(level24.address);
            const price = await level24.connect(otherAccount).price();
            const isSold = await level24.connect(otherAccount).isSold();
            expect(price).lessThan(100);
            expect(isSold).equals(true);
        })
    });
});