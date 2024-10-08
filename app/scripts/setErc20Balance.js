const fs = require('fs')
const dotenv = require('dotenv');
const { send } = require('process');
const ethers = require('ethers');
dotenv.config()

const args = process.argv.slice(2);
const token = args[0];
const address = args[1];

// node scripts/setErc20Balance.js <token> <wallet>
// node scripts/setErc20Balance.js 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1 0xC295763Eed507d4A0f8B77241c03dd3354781a15
const setErc20Balance = async (token, address) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.TENDERLY_VIRTUAL_TESTNET_ADMIN_RPC);

    await provider.send("tenderly_setBalance", [
      address,
      "0x8ac7230489e80000"
    ]);
    await provider.send("tenderly_setErc20Balance", [
      token,
      address,
      // "0x8ac7230489e80000" // 10
      "0x21e19e0c9bab2400000" // 10K
    ]);
    console.log("Success")
  } catch (e) { console.log(e) }
}

setErc20Balance(token, address)