const { ethers } = require("ethers");

const INFURA_ID = 'c99bdc79660e494396244a76822331b4'
const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:8547`)
console.log(provider)
const address = '0x20f33CE90A13a4b5E7697E3544c3083B8F8A51D4'

const main = async () => {
    const balance = await provider.getBalance(address)
    console.log(`\nETH Balance of ${address} --> ${ethers.utils.formatEther(balance)} ETH\n`)
}

main()

