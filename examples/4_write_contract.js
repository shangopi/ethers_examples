const { ethers } = require("ethers");

const INFURA_ID = ''
const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:8545`)

const account1 = '0x20f33CE90A13a4b5E7697E3544c3083B8F8A51D4' // Your account address 1
const account2 = '0x5C59C83c099F72FcE832208f96a23a1E43737a14' // Your account address 2

const privateKey1 = 'fffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306' // Private key of account 1
const wallet = new ethers.Wallet(privateKey1, provider)

const ERC20_ABI = [
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount) returns (bool)",
];



const main = async () => {
    const address = '0x18Df82C7E422A42D47345Ed86B0E935E9718eBda'
    const contract = new ethers.Contract(address, ERC20_ABI, provider)
    const balance = ethers.utils.parseEther("0.002");

    console.log(`\nReading from ${address}\n`)
    console.log(`Balance of sender: ${balance}\n`)

    const contractWithWallet = contract.connect(wallet)

    const tx = await contractWithWallet.transfer(account2, balance)
    await tx.wait()

    console.log(tx)

    const balanceOfSender = await contract.balanceOf(account1)
    const balanceOfReciever = await contract.balanceOf(account2)

    console.log(`\nBalance of sender: ${balanceOfSender}`)
    console.log(`Balance of reciever: ${balanceOfReciever}\n`)
}

main()