
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Level12 = await hre.ethers.getContractFactory("Privacy");
        const password = "0x0000000011111111222222223333333344444444555555556666666677777777"
        const data = ethers.utils.solidityPack(["bytes32"], [password])
        const level12 = await Level12.deploy([data, data, data]);
        await level12.deployed();
        console.log(
          `Level12 deployed at address ${level12.address}`
        )
        return {level12, owner, otherAccount};
    }

    /*
    Unlock this contract to beat the level.
    */
    describe("Solve", function() {
        it("Should solve level12", async function() {
            const {level12, owner, otherAccount} = await loadFixture(deployFallback);
            /*
                State variables are laid out as follows:
                  bool public locked = true;                             <-- SLOT 0
                  uint256 public ID = block.timestamp;                   <-- SLOT 1
                  uint8 private flattening = 10;                         <-- SLOT 2
                  uint8 private denomination = 255;                      <-- SLOT 2
                  uint16 private awkwardness = uint16(block.timestamp);  <-- SLOT 2
                  bytes32[3] private data;                               <-- SLOTS 3, 4, 5
                We're interestd in data[2], so we need to read slot 4
                Cast that value to bytes16 to get the key
            */
            let locked = await level12.connect(otherAccount).locked();
            expect(locked == true)
            const data = await ethers.provider.getStorageAt(level12.address, 4);
            const key = data.slice(0,34);
            await level12.connect(otherAccount).unlock(ethers.utils.solidityPack(["bytes16"], [key]));
            locked = await level12.connect(otherAccount).locked();
            expect(locked).equals(false);
    
        })
    });
});