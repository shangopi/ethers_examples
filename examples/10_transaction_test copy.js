const { ethers } = require("ethers");
const axios = require('axios');
const rpcUrl = 'http://127.0.0.1:32987';

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

    let senders = ["bcdf20249abf0ed6d944c0288fad489e33f66b3960d9e6229c1cd214ed3bbe31", "39725efee3fb28614de3bacaffe4cc4bd8c436257e2c8bb887c4b5c4be45e76d",
        "53321db7c1e331d93a11a41d16f004d7ff63972ec8ec7c25db329728ceeb1710", "ab63b23eb7941c1251757e24b3d2350d2bc05c3c388d06f8fe6feafefb1e8c70",
        "5d2344259f42259f82d2c140aa66102ba89b57b4883ee441a8b312622bd42491", "27515f805127bebad2fb9b183508bdacb8c763da16f54e0678b16e8f28ef3fff"
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
    let privateKey1 = '94eb3102993b41ec55c241060f47daa0f6372e2e3ad7e91612ae36c364042e44' // Private key of account 1
    var wallet = new ethers.Wallet(privateKey1, provider)
        nonce = await wallet.getTransactionCount();


    txs = []
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

        senders = ["7ff1a4c1d57e5e784d327c4c7651e952350bc271f156afb3d00d20f5ef924856", "3a91003acaf4c21b3953d94fa4a6db694fa69e5242b2e37be05dd82761058899",
            "bb1d0f125b4fb2bb173c318cdead45468474ca71474e2247776b2b4c0fa2d3f5", "850643a0224065ecce3882673c21f56bcf6eef86274cc21cadff15930b59fc8c"
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
            const block2 = await provider.getBlockNumber()
        console.log(`\nBlock Number: ${block2}\n`)          
    
        }
        
}

main()