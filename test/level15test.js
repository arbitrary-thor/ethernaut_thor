
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level15 = await hre.ethers.getContractFactory("NaughtCoin");
        const level15 = await Level15.deploy(owner.address);
        await level15.deployed();
        const Level15Helper = await hre.ethers.getContractFactory("HoldThis");
        const level15Helper = await Level15Helper.deploy(level15.address);
        await level15Helper.deployed();
        console.log(
          `Level15 deployed at address ${level15.address}`
        )
        return {level15, level15Helper, owner, otherAccount};
    }

    /*
    NaughtCoin is an ERC20 token and you're already holding all of them. The catch 
    is that you'll only be able to transfer them after a 10 year lockout period. 
    Can you figure out how to get them out to another address so that you can transfer 
    them freely? Complete this level by getting your token balance to 0.
    */
    describe("Solve", function() {
        it("Should solve level15", async function() {
            const {level15, level15Helper, owner, otherAccount} = await loadFixture(deployFallback);
            // Approve Level15Helper to call transfer_from
            // Call Level15Helper.drain
            // Should transfer all the tokens from owner to level15Helper
            const total = ethers.utils.parseEther("1000000");
            await level15.connect(owner).approve(level15Helper.address, total);
            await level15Helper.connect(owner).drain(total, owner.address);
            const balance = await level15.connect(owner).balanceOf(owner.address);
            expect (balance).equals(0);
        })
    });
});