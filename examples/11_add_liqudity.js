const { ethers } = require("ethers");

// Initialize provider and wallet
 const provider = new ethers.providers.JsonRpcProvider({
        url: "http://127.0.0.1:8545",
    });
const privateKey1 = 'fffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306' // Private key of account 1
const wallet = new ethers.Wallet(privateKey1, provider)
const VAULT_ADDRESS = "0x1cAA8176D0cf6fB67947121e3F2A1Dd330eb1089";
const POOL_CREATION_HELPER_ADDRESS = "0x088ef893BBbC40E8746896a2936a67c4815cDce8"
const PoolCreationHelper = require("./PoolCreationHelper.json")



const main = async () => {
    // Pool parameters
const poolName = "HONEY-WBTC-WEIGHTED23";
const poolSymbol = "50HONEY-50WBTC12";
const createPoolTokens = [
  "0x459C653FaAE6E13b59cf8E005F5f709C7b2c2EB4",
  "0x124363b6D0866118A8b6899F2674856618E0Ea4c"
].sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);



console.log("four")
// 50-50 weights (must add up to 1e18)
const normalizedWeights = [
  ethers.utils.parseUnits('0.5', 18),
  ethers.utils.parseUnits('0.5', 18)
];

console.log("Initial liquidity amounts")

// Initial liquidity amounts
const amountsIn = [
  ethers.utils.parseUnits('1', 18),     // 1 HONEY (18 decimals)
  ethers.utils.parseUnits('0.0001', 18)  // 0.0001 WBTC (8 decimals)
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

  
  const res = await vault.setRelayerApproval(
    wallet.address, // sender
    POOL_CREATION_HELPER_ADDRESS, // relayer
    true // approved
  );    

  console.log(await res.wait());
  

  console.log("token approval")


  for (const [i, tokenAddress] of createPoolTokens.entries()) {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ["function approve(address spender, uint256 amount)"],
      wallet
    );
  
    const res = await tokenContract.approve(VAULT_ADDRESS, amountsIn[i]);
    console.log(await res.wait())
  }

  console.log("poolCreationHelper")

  const poolCreationHelper = new ethers.Contract(
    POOL_CREATION_HELPER_ADDRESS,
    PoolCreationHelper.abi,
    wallet
  );

  console.log("tx")

  const tx = await poolCreationHelper.createAndJoinWeightedPool(
    poolName,
    poolSymbol,
    createPoolTokens,
    createPoolTokens, // joinPoolTokens same as createPoolTokens
    ["500000000000000000","500000000000000000"],
    createPoolTokens.map(() => "0x0000000000000000000000000000000000000000"), // no rate providers
    "10000000000000000",
    amountsIn,
    wallet.address, // pool owner
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`${poolName}-${wallet.address}`)) // salt
  );

  
  const receipt = await tx.wait()
  console.log(receipt);
  
  const event = receipt.events.find(e => e.event === "PoolCreated"); if (!event) { console.error("PoolCreated event not found in transaction logs"); } else { const poolAddress = event.args.pool; console.log("New Pool Address:", poolAddress); }







  
  
}



main()
