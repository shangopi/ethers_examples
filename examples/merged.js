const { ethers } = require("ethers");
const WEIGHTED_POOL_FACTORY_HELP = require("./WeightedPoolFactory.json")

const WEIGHTED_POOL_HELP = require("./WeightedPool.json")
// Initialize provider and wallet
const provider = new ethers.providers.JsonRpcProvider({
  url: "http://127.0.0.1:8545",
});
const privateKey1 = 'fffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306' // Private key of account 1
const wallet = new ethers.Wallet(privateKey1, provider)
const VAULT_ADDRESS = "0xbf01E7096d3247CD863e574Ea46f69C731EE5A05";
const WEIGHTED_POOL_FACTORY = "0x467DF22467ED878cECCD43766b9F4071dcc1cEe1"



const main = async () => {
  // Pool parameters
  const poolName = "LPTOKEN";
  const poolSymbol = "LPTOK";
  const createPoolTokens = [
    "0x459C653FaAE6E13b59cf8E005F5f709C7b2c2EB4",
    "0x18Df82C7E422A42D47345Ed86B0E935E9718eBda"
  ].sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);



  console.log("four")
  // 50-50 weights (must add up to 1e18)
  const normalizedWeights = [
    ethers.utils.parseUnits('0.5', 18),
    ethers.utils.parseUnits('0.5', 18)
  ];


  console.log(ethers.utils.parseUnits('0.5', 18));

  console.log("Initial liquidity amounts")

  // Initial liquidity amounts
  const amountsIn = [
    ethers.utils.parseUnits('1', 18),     // 1 HONEY (18 decimals)
    ethers.utils.parseUnits('1', 18)  // 0.0001 WBTC (8 decimals)
  ];

  console.log("Initial vault")

  const vault = new ethers.Contract(
    VAULT_ADDRESS,
    [
      "function setRelayerApproval(address sender, address relayer, bool approved)",
    ],
    wallet
  );

  console.log("set relayuer approval")

  const weightedPoolCreationHelper = new ethers.Contract(
    WEIGHTED_POOL_FACTORY,
    WEIGHTED_POOL_FACTORY_HELP.abi,
    wallet
  );

  console.log("tx")

  console.log(normalizedWeights);
  console.log(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`${poolName}-${wallet.address}"`)));
  console.log(createPoolTokens.map(() => "0x0000000000000000000000000000000000000000"));

  const tx = await weightedPoolCreationHelper.create(
    poolName,
    poolSymbol,
    createPoolTokens,
    ["500000000000000000", "500000000000000000"],
    createPoolTokens.map(() => "0x0000000000000000000000000000000000000000"), // no rate providers
    "10000000000000000", // 1% swap fee
    wallet.address, // pool owner
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`${poolName}-${wallet.address}"`)) // salt
  );



  const receipt = await tx.wait()
  console.log(receipt);

  const event = receipt.events.find(e => e.event === "PoolCreated"); if (!event) { console.error("PoolCreated event not found in transaction logs"); } else {
    const poolAddress = event.args.pool;
    console.log(event.args);

    console.log("New Pool Address:", poolAddress);
  }






}



main()
