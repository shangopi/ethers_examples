const { ethers } = require("ethers");
const axios = require('axios');
const rpcUrl = 'http://127.0.0.1:8545';

const provider = new ethers.providers.JsonRpcProvider(rpcUrl)


const main = async () => {
    const jwtSecret = '0x1b8d34037ac04570b76cb1a13d1db17729a5b6a90f10497b2bc4422fbd39615a';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtSecret}` // Include JWT if required
    };
    const block = await provider.getBlockNumber()
    console.log(`\nBlock Number: ${block}\n`)
    let account2 = '0xD010154E8Cf663fE6af534721D309B680C1ccA80' // Your account address 2

    let senders = ["fffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306", "9b9bc88a144fff869ae2f4ea8e252f2494d9b52ea1008d0b3537dad27ab489d5",
        "0x23b19fd0ba67f921bc1f5a133bfe452060d129f025fcf1be75c6964551b1208a", "0x0e67856b2a42ca52862a60d11e3ac57871988aefe7a28ecd20bd8c2dec55da25",
        "0xa901724fadf8e33b97e907d903dda50553969f6c8be510199878989c459b629a", "0x110ecfb76a8a19b4fc32d7842548e00d7d6c1ba48bbc5d760eb97c9cd6fdbdc6",
        "0xc6b45ae662b588d7419202030581e1c104414dcd79b2c7d43b29908190b4b983", "0x668eedaaaa05e87a9e62364f4ee75aba0aa78e13fb0142882ecb5beb2b58eb09",
        "0x11c442db1d30e3f926f7e8c4a4208574d682669c6d720cb7d4eec910c0cfc863", "0x2ad0867fb0a18a3c0d8ef4dfce28e5356575f7a4a583ea1be7e50b0294d44614"
    ]

    for (var sender of senders) {
        var wallet = new ethers.Wallet(sender, provider)
        nonce = await wallet.getTransactionCount();
        for (var i = 0; i <= 1; i++) {
            const tx1 = {
                to: account2, // Replace with recipient address
                value: ethers.utils.parseEther("0.1"), // Amount to send in Ether
                gasLimit: 21000, // Standard gas limit for Ether transfer
                gasPrice: ethers.utils.parseUnits("10", "gwei"), // Gas price in gwei
                nonce: nonce + i, // Get nonce for the wallet
            };
            const signedTx = await wallet.signTransaction(tx1);
            const requestData = {
                jsonrpc: '2.0',
                method: 'eth_sendRawTransaction',
                params: [signedTx],
                id: 1
            };

            axios.post(rpcUrl, requestData, { headers })
                .then(response => {
                    console.log('Response:', response.data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });

        }

    }


    // sender 1 
    console.log("sender1")
    let privateKey1 = '0x79ffac4f8ea5fcab09114a00e83e36b4c509ed46cdf20e5f9ba080a43fa1ebb6' // Private key of account 1
    var wallet = new ethers.Wallet(privateKey1, provider)
        nonce = await wallet.getTransactionCount();


    txs = []
    for (var i = 0; i <= 2; i++) {
        const tx1 = {
            to: account2, // Replace with recipient address
            value: ethers.utils.parseEther("0.1"), // Amount to send in Ether
            gasLimit: 19000+1000*i, // Standard gas limit for Ether transfer
            gasPrice: ethers.utils.parseUnits("10", "gwei"), // Gas price in gwei
            nonce: nonce + i, // Get nonce for the wallet
        };
        const signedTx = await wallet.signTransaction(tx1);
        txs.push(signedTx)
    }


    const requestData = {
        jsonrpc: '2.0',
        method: 'eth_sendBatchPrivateRawTransactions',
        params: [txs],
        id: 1
    };

    axios.post(rpcUrl, requestData, { headers })
        .then(response => {
            console.log('Response:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        senders = ["0xe8a6d4a8d7e48ad04111ef3c0727c77548a4e3f63ffae670a9a795c3c4273889", "0x306e4df414d24524c01716fc26162506e760503a6ec8646fbdc7711a603608aa",
            "0x51dd5ac7fa687e86670623dbe48d19733fc89ed4ffec78effa6db68956afd3e5", "0xde57bd35f2dec5cd25c524f0bf0d62dcca84709fb1a9371a7efcd30a9af945cb"
        ]
    
        for (var sender of senders) {
            var wallet = new ethers.Wallet(sender, provider)
            nonce = await wallet.getTransactionCount();
            for (var i = 0; i <= 1; i++) {
                const tx1 = {
                    to: account2, // Replace with recipient address
                    value: ethers.utils.parseEther("0.1"), // Amount to send in Ether
                    gasLimit: 21000, // Standard gas limit for Ether transfer
                    gasPrice: ethers.utils.parseUnits("10", "gwei"), // Gas price in gwei
                    nonce: nonce + i, // Get nonce for the wallet
                };
                const signedTx = await wallet.signTransaction(tx1);
                const requestData = {
                    jsonrpc: '2.0',
                    method: 'eth_sendRawTransaction',
                    params: [signedTx],
                    id: 1
                };
    
                axios.post(rpcUrl, requestData, { headers })
                    .then(response => {
                        console.log('Response:', response.data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
    
            }
    
        }
}

main()