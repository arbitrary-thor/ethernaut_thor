
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level4 = await hre.ethers.getContractFactory("CoinFlip");
        const level4 = await Level4.deploy();
        await level4.deployed();

        const Level4Proxy = await hre.ethers.getContractFactory("TelephoneCaller");
        const level4proxy = await Level4Proxy.deploy(level4.address);

        await level4proxy.deployed();
      
        console.log(
          `Level4 deployed at address ${level4.address}`
        )
        console.log(
          `Level4Proxy deployed at address ${level4proxy.address}`
        );

        return {level4, level4proxy, owner, otherAccount};
    }

    /*
    Claim ownership of the contract below to complete this level.
    */
    describe("Solve", function() {
        it("Should solve level4", async function() {
            const {level4, level4proxy, owner, otherAccount} = await loadFixture(deployFallback);
            // deploy proxy contract
            // call changeOwner on proxy contract
            // win
            level4proxy.connect(otherAccount).changeOwner(otherAccount.address);
            const level4owner = level4.owner;
            expect(level4owner == otherAccount.address);
        })
    });
});