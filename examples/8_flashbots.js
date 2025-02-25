const ethers = require("ethers");
const {
    FlashbotsBundleProvider,
} = require("@flashbots/ethers-provider-bundle");


const main = async () => {
    const provider = new ethers.providers.JsonRpcProvider({
        url: "http://127.0.0.1:8547",
    });

    const privateKey1 = 'fffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306' // Private key of account 1
    const wallet = new ethers.Wallet(privateKey1, provider)
    const authSigner = wallet
    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        authSigner
    );

    const signedTransactions = await flashbotsProvider.signBundle([
        {
            signer: wallet,
            transaction: {
                to: "0xf1a54b075fb71768ac31b33fd7c61ad8f9f7dd18",
                gasPrice: 10,
                gasLimit: 21000,
                chainId: 5,
                value: 0,
            },
        },
        {
            signer: wallet,
            transaction: {
                to: "0xf1a54b075fb71768ac31b33fd7c61ad8f9f7dd18",
                gasPrice: 10,
                gasLimit: 21000,
                chainId: 5,
                value: 0,
            },
        },
    ]);

    const blockNumber = await provider.getBlockNumber();

    console.log(new Date());
    const simulation = await flashbotsProvider.simulate(
        signedTransactions,
        blockNumber + 1
    );
    console.log(new Date());

    // Using TypeScript discrimination
    if ("error" in simulation) {
        console.log(`Simulation Error: ${simulation.error.message}`);
    } else {
        console.log(
            `Simulation Success: ${blockNumber} ${JSON.stringify(
                simulation,
                null,
                2
            )}`
        );
    }
    console.log(signedTransactions);

    for (var i = 1; i <= 10; i++) {
        const bundleSubmission = flashbotsProvider.sendRawBundle(
            signedTransactions,
            blockNumber + i
        );
        console.log("submitted for block # ", blockNumber + i);
    }
    console.log("bundles submitted");


}

main()