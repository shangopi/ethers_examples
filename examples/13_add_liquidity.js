const { ethers } = require("ethers");
const WEIGHTED_POOL_FACTORY_HELP = require("./WeightedPoolFactory.json") 
const VAULT_HELP = require("./Vault.json") 


const WEIGHTED_POOL_HELP = require("./WeightedPool.json") 
// Initialize provider and wallet
 const provider = new ethers.providers.JsonRpcProvider({
        url: "http://127.0.0.1:8545",
    });
const privateKey1 = 'fffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306' // Private key of account 1
const wallet = new ethers.Wallet(privateKey1, provider)
const VAULT_ADDRESS = "0xbf01E7096d3247CD863e574Ea46f69C731EE5A05";
const WEIGHTED_POOL = "0x35B22d14A1E78FA1415e2613Fe46d56Ce9D80a30"



const main = async () => {
const createPoolTokens = [
  "0x459C653FaAE6E13b59cf8E005F5f709C7b2c2EB4",
  "0x18Df82C7E422A42D47345Ed86B0E935E9718eBda"
].sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);

// 50-50 weights (must add up to 1e18)
const normalizedWeights = [
  ethers.utils.parseUnits('1', 18),
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

  const weightedPoolHelper = new ethers.Contract(
    WEIGHTED_POOL,
    WEIGHTED_POOL_HELP.abi,
    wallet
  );

  console.log("tx")
  const tx1 = await weightedPoolHelper.getPoolId();
  console.log("pool id is", tx1)
  console.log(tx1)
  



  console.log("building transaction data");
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

console.log(joinPoolRequest);


for (const [i, tokenAddress] of createPoolTokens.entries()) {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    ["function approve(address spender, uint256 amount)"],
    wallet
  );

  const tx4 = await tokenContract.approve(VAULT_ADDRESS, amountsIn[i]);
  await tx4.wait()
}
  

  console.log("Joining Pool")
  const tx2 = await vault.joinPool(
    tx1,
    wallet.address,
    wallet.address,
    joinPoolRequest
  )

  const receipt = await tx2.wait()
  console.log(receipt);

  const tx22 = await weightedPoolHelper.getPoolId();
  console.log("pool id is", tx22)
  console.log(tx22)
  
  
}



main()
