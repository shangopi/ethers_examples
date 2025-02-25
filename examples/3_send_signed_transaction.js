const { ethers } = require("ethers");
const account2 = '0xD010154E8Cf663fE6af534721D309B680C1ccA80' // Your account address 2
const main = async () => {
    const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:8545`)
    txs = []
    let privateKey1 = '0x79ffac4f8ea5fcab09114a00e83e36b4c509ed46cdf20e5f9ba080a43fa1ebb6' // Private key of account 1
        var wallet = new ethers.Wallet(privateKey1, provider)
            nonce = await wallet.getTransactionCount();
    for (var i = 0; i <= 2; i++) {
        const tx1 = {
            to: account2, // Replace with recipient address
            value: ethers.utils.parseEther("0.1"), // Amount to send in Ether
            gasLimit: 21000, // Standard gas limit for Ether transfer
            gasPrice: ethers.utils.parseUnits("10", "gwei"), // Gas price in gwei
            nonce: nonce + i, // Get nonce for the wallet
        };
        const signedTx = await wallet.signTransaction(tx1);
        txs.push(signedTx)
    }
    console.log(txs)
}

main()