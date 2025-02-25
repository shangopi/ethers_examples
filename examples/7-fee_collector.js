const { ethers } = require("ethers");

const INFURA_ID = ''
const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:8547`)

const account1 = '0x20f33CE90A13a4b5E7697E3544c3083B8F8A51D4' // Your account address 1
const account2 = '0xD010154E8Cf663fE6af534721D309B680C1ccA80' // Your account address 2

const privateKey1 = 'fffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306' // Private key of account 1
const wallet = new ethers.Wallet(privateKey1, provider)

async function analyzeFeeCollector(provider, blockNumber) {
    const block = await provider.getBlockWithTransactions(blockNumber);

    const feeCollector = block.miner;
    let totalPriorityFee = ethers.BigNumber.from(0);

    // Calculate the total priority fee earned
    for (const tx of block.transactions) {
        const gasUsed = tx.gasLimit; // Note: Use tx.receipt.gasUsed for accurate results
        const priorityFee = tx.maxPriorityFeePerGas || ethers.BigNumber.from(0);

        totalPriorityFee = totalPriorityFee.add(gasUsed.mul(priorityFee));
    }

    const balance = await provider.getBalance(feeCollector);

    console.log(`Block Number: ${blockNumber}`);
    console.log(`Fee Collector (Block Proposer): ${feeCollector}`);
    console.log(`Fee Collector's Balance: ${ethers.utils.formatEther(balance)} ETH`);
    console.log(`Total Priority Fee Earned: ${ethers.utils.formatEther(totalPriorityFee)} ETH`);
}

async function getAllFeeCollectors(provider) {
    const endBlock = await provider.getBlockNumber();
    const startBlock = Math.max(0, endBlock - 200)
    const feeCollectors = new Set();

    for (let blockNumber = startBlock; blockNumber <= endBlock; blockNumber++) {
        try {
            const block = await provider.getBlock(blockNumber);
            feeCollectors.add(block.miner);
        } catch (err) {
            console.error(`Error fetching block ${blockNumber}:`, err);
        }
    }

    console.log(`Fee Collectors from block ${startBlock} to ${endBlock}:`);
    console.log([...feeCollectors]);
    for (const feeCollector of feeCollectors) {
        console.log(feeCollector)
        analyzeFeeCollector(provider, feeCollector)
    }
    


}




getAllFeeCollectors(provider);