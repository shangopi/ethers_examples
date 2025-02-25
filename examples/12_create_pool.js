const { ethers } = require("ethers");
const fs = require('fs');
const path = require('path');
const WEIGHTED_POOL_FACTORY_HELP = require("./WeightedPoolFactory.json")
const WEIGHTED_POOL_HELP = require("./WeightedPool.json")
// Initialize provider and wallet
const provider = new ethers.providers.JsonRpcProvider({
  url: "http://127.0.0.1:8545",
});
const privateKey1 = 'fffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306' // Private key of account 1
const wallet = new ethers.Wallet(privateKey1, provider)
const VAULT_ADDRESS = "0xbf01E7096d3247CD863e574Ea46f69C731EE5A05";
const VAULT_HELP = require("./Vault.json")
const WEIGHTED_POOL_FACTORY = "0x467DF22467ED878cECCD43766b9F4071dcc1cEe1"

const main = async () => {
  // Pool parameters
  const poolName = "LPTOKEN";
  const poolSymbol = "LPTOK";
  const createPoolTokens = [
    "0x18Df82C7E422A42D47345Ed86B0E935E9718eBda",
    "0x459C653FaAE6E13b59cf8E005F5f709C7b2c2EB4"
  ].sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);

  // 50-50 weights (must add up to 1e18)
  const normalizedWeights = [
    ethers.utils.parseUnits('0.5', 18),
    ethers.utils.parseUnits('0.5', 18)
  ];


  // Initial liquidity amounts
  const amountsIn = [
    ethers.utils.parseUnits('10', 18),     // 1 HONEY (18 decimals)
    ethers.utils.parseUnits('10', 18)  // 0.0001 WBTC (8 decimals)
  ];

  const vault = new ethers.Contract(
    VAULT_ADDRESS,
    VAULT_HELP.abi,
    wallet
  );

  const weightedPoolCreationHelper = new ethers.Contract(
    WEIGHTED_POOL_FACTORY,
    WEIGHTED_POOL_FACTORY_HELP.abi,
    wallet
  );

  console.log("Creating custom pool")

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
  let poolAddress;

  const event = receipt.events.find(e => e.event === "PoolCreated"); if (!event) { console.error("PoolCreated event not found in transaction logs"); } else {
    poolAddress = event.args.pool;
    console.log(event.args);
    console.log("New Pool Address:", poolAddress);
  }

  const WEIGHTED_POOL = poolAddress;


  const weightedPoolHelper = new ethers.Contract(
    WEIGHTED_POOL,
    WEIGHTED_POOL_HELP.abi,
    wallet
  );

  const tx1 = await weightedPoolHelper.getPoolId();
  console.log("pool id is", tx1)


  console.log("Adding liqudity to the pool");
  //   const joinPoolRequest = {
  //     assets: createPoolTokens,
  //     maxAmountsIn: amountsIn,
  //     userData: ethers.utils.defaultAbiCoder.encode(
  //         ["uint256", "uint256[]", "uint256"],
  //         [1, amountsIn, 0] 
  //     ),
  //     fromInternalBalance: false
  // };

  const joinPoolRequest = {
    assets: createPoolTokens,
    maxAmountsIn: amountsIn,
    userData: ethers.utils.defaultAbiCoder.encode(
      ["uint256", "uint256[]"],
      [0, amountsIn]
    ),
    fromInternalBalance: false
  };

  for (const [i, tokenAddress] of createPoolTokens.entries()) {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ["function approve(address spender, uint256 amount)"],
      wallet
    );

    const tx4 = await tokenContract.approve(VAULT_ADDRESS, amountsIn[i]);
    await tx4.wait()
  }

  console.log("calling Join Pool")
  const tx2 = await vault.joinPool(
    tx1,
    wallet.address,
    wallet.address,
    joinPoolRequest
  )

  const receipt12 = await tx2.wait()
  console.log(receipt12);

  const tx22 = await weightedPoolHelper.getPoolId();
  console.log("pool id is", tx22)
  console.log(tx22)
  console.log("pool address is ", poolAddress)


  const addresses = {
    PoolId: tx22,
    PoolAddress: poolAddress
};

const filePath = path.join('/home/gopi/Desktop/mock-contracts (copy)/contracts', 'deployedSwapPool.json');
fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));

console.log('Addresses written to', filePath);
}

main()
