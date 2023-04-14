
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level20 = await hre.ethers.getContractFactory("Denial");
        const level20 = await Level20.deploy();
        await level20.deployed();
        const Level20Helper = await hre.ethers.getContractFactory("DenialHelper");
        const level20Helper = await Level20Helper.deploy(level20.address);
        await level20Helper.deployed();
        console.log(
          `Level20 deployed at address ${level20.address}`
        )
        console.log(
          `Level20Helper deployed at address ${level20Helper.address}`
        )
        return {level20, level20Helper, owner, otherAccount};
    }

    /*
    If you can deny the owner from withdrawing funds when they call withdraw()
    (whilst the contract still has funds, and the transaction is of 1M gas or less)
    you will win this level.
    */
    describe("Solve", function() {
        it("Should solve level20", async function() {
            const {level20, level20Helper, owner, otherAccount} = await loadFixture(deployFallback);
            const originalBalance = await ethers.provider.getBalance(owner.address);
            tx = {to: level20.address, value: ethers.utils.parseEther("10")}
            await otherAccount.sendTransaction(tx);
            try {
                await level20Helper.connect(otherAccount).withdraw();
            }
            catch {}
            // Ensure the owner's balance didn't change
            const endBalance = await ethers.provider.getBalance(owner.address);
            expect (originalBalance).equals(endBalance);
        })
    });
});