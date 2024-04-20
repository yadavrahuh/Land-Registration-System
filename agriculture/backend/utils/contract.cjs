require('dotenv').config()
const { Web3 } = require('web3')
const fs = require('fs');

function readContractAddress() {
    const configFilePath = "../backend/config.json"
    try {
        const configData = fs.readFileSync(configFilePath);
        const { contractAddress } = JSON.parse(configData);
        return contractAddress;
    } catch (error) {
        console.error('Error reading contract address:', error);
        return null;
    }
}

let contractABI = null;
let walletaddr = null;
let adminAddress = null;

try {
    const abiFilePath = '../artifacts/contracts/Land.sol/Land.json'
    const abiData = fs.readFileSync(abiFilePath, 'utf8');
    contractABI = JSON.parse(abiData).abi;
} catch (error) {
    console.error('Error reading ABI:', error);
}
var web3Provider = new Web3.providers.HttpProvider(process.env.HARDHAT_RPC_URL)

const web3 = new Web3(web3Provider)
let contractAddr = readContractAddress()
let contract = new web3.eth.Contract(contractABI, contractAddr)

const assignWallet = async (_addr) => {
    walletaddr = _addr
    return true;
}
const getaddress = () => {
    return walletaddr;
}

const assignAdmin = async (_addr) => {
    adminAddress = _addr
    return true;
}

const getAdmin = () => {
    return adminAddress;
}

module.exports = { getaddress, contract, assignWallet, assignAdmin, getAdmin }
