
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level11 = await hre.ethers.getContractFactory("Elevator");
        const level11 = await Level11.deploy();
        await level11.deployed();
        const Level11Helper = await hre.ethers.getContractFactory("MyBuilding");
        const level11Helper = await Level11Helper.deploy(level11.address);
        await level11Helper.deployed();
        console.log(
          `Level11 deployed at address ${level11.address}`
        )
        console.log(
          `Level11Helper deployed at address ${level11Helper.address}`
        )
        return {level11, level11Helper, owner, otherAccount};
    }

    /*
    This elevator won't let you reach the top of your building. Right?
    */
    describe("Solve", function() {
        it("Should solve level11", async function() {
            const {level11, level11Helper, owner, otherAccount} = await loadFixture(deployFallback);
            await level11Helper.connect(otherAccount).changeFloor(10);
            const top = await level11.connect(otherAccount).top();
            expect(top).equals(true);
        })
    });
});