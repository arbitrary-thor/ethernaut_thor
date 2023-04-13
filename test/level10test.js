
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level10 = await hre.ethers.getContractFactory("Reentrance");
        const level10 = await Level10.deploy();
        await level10.deployed();
        const Level10Helper = await hre.ethers.getContractFactory("ReentranceHelper");
        const level10Helper = await Level10Helper.deploy(level10.address);
        await level10Helper.deployed();
        console.log(
          `Level10 deployed at address ${level10.address}`
        )
        return {level10, level10Helper, owner, otherAccount};
    }

    /*
    The goal of this level is for you to steal all the funds from the contract.
    */
    describe("Solve", function() {
        it("Should solve level10", async function() {
            const {level10, level10Helper, owner, otherAccount} = await loadFixture(deployFallback);
            // Send some eth to drain
            tx = {to: level10.address, value: ethers.utils.parseEther("100")};
            await owner.sendTransaction(tx);
            // Ensure the balance is 100 
            let balance = await ethers.provider.getBalance(level10.address);
            expect (balance == ethers.utils.parseEther("100"));
            // Drain the contract using our helper
            await level10Helper.connect(otherAccount).draino({value: ethers.utils.parseEther("1")});
            balance = await ethers.provider.getBalance(level10.address)
            expect (balance == 0);
        })
    });
});