
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level7 = await hre.ethers.getContractFactory("Force");
        const level7 = await Level7.deploy();
        await level7.deployed();
        const Level7Helper = await hre.ethers.getContractFactory("ForceHelper");
        const level7Helper = await Level7Helper.deploy(level7.address);
        await level7Helper.deployed();
        console.log(
          `Level7 deployed at address ${level7.address}`
        )
        console.log(
          `Level7Helper deployed at address ${level7Helper.address}`
        )
        return {level7, level7Helper, owner, otherAccount};
    }

    /*
    The goal of this level is to make the balance of the contract greater than zero.
    */
    describe("Solve", function() {
        it("Should solve level7", async function() {
            const {level7, level7Helper, owner, otherAccount} = await loadFixture(deployFallback);
            // send a transaction with some eth
            tx = { 
                to: level7Helper.address,
                value: ethers.utils.parseEther(".01")
            }
            await otherAccount.sendTransaction(tx);
            // selfdestruct the helper contract
            await level7Helper.connect(otherAccount).destroy()
            const balance = await ethers.provider.getBalance(level7.address)
            expect(balance > 0);
        })
    });
});