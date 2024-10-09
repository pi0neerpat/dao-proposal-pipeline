const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
require("dotenv").config();

const args = process.argv.slice(2);
const jsonPath = "../" + args[0];

const basePath = path.join(__dirname, jsonPath);
const currentJson = JSON.parse(fs.readFileSync(basePath));
const network = currentJson.network;

if (currentJson.objectArray != undefined) {
  // create correct number of modifications
  currentJson["arrayLength"] = currentJson.objectArray.length.toString();

  fs.writeFile(basePath, JSON.stringify(currentJson, null, 2), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

const PROPOSAL_TYPES_NEEDING_PREDICTION = [
  "DeployChainlinkRelayers",
  "DeployDelayedOracle",
  "DeployDenominatedOracle",
  "AddCollateral"
]

if (
  PROPOSAL_TYPES_NEEDING_PREDICTION.includes(currentJson.proposalType)
) {
  const [signer, provider] = getNetwork(network);
  if (signer && provider) {
    predictAddressAndWriteToFile(currentJson, provider);
  } else {
    process.exitCode(2);
  }
}

function getNetwork(network) {
  let signer; //ethers.getCreateAddress(from: , nonce: 1)
  let provider;
  if (network == "anvil") {
    let anvilRpc = process.env.ANVIL_RPC;
    let anvilPK = process.env.ANVIL_ONE;
    provider = new ethers.JsonRpcProvider(anvilRpc, provider);
    signer = new ethers.Wallet(anvilPK, provider);
  } else if (network == "arb-sepolia") {
    const rpc_endpoint = process.env.ARB_SEPOLIA_RPC;
    provider = new ethers.JsonRpcProvider(rpc_endpoint);
    signer = new ethers.Wallet(process.env.ARB_SEPOLIA_PK.slice(2), provider);
  } else if (network == "arb") {
    const rpc_endpoint = process.env.ARB_RPC;
    provider = new ethers.JsonRpcProvider(rpc_endpoint);
    signer = new ethers.Wallet(process.env.ARB_PK.slice(2), provider);
  } else if (network == "base") {
    const rpc_endpoint = process.env.BASE_RPC;
    provider = new ethers.JsonRpcProvider(rpc_endpoint);
    signer = new ethers.Wallet(process.env.BASE_PK.slice(2), provider);
  }
  return [signer, provider];
}

async function predictAddress(currentJson, provider) {
  const { proposalType, arrayLength } = currentJson
  let factoryAddress;
  let numberOfAddressesToPredict = arrayLength;

  if (proposalType == "AddCollateral") {
    const contractJSON = JSON.parse(
      fs.readFileSync(
        path.join(
          __dirname,
          "../out/GlobalSettlement.sol/GlobalSettlement.json"
        )
      )
    );
    const globalSettlement = new ethers.Contract(
      currentJson.GlobalSettlement_Address,
      contractJSON.abi,
      provider
    );
    factoryAddress = await globalSettlement.collateralAuctionHouseFactory();
    numberOfAddressesToPredict = 1;
  } else if (proposalType == "DeployChainlinkRelayers") {
    factoryAddress = currentJson.ChainlinkRelayerFactory_Address;
  } else if (proposalType == "DeployDelayedOracle") {
    factoryAddress = currentJson.DelayedOracleFactory_Address;
  } else if (proposalType == "DeployDenominatedOracle") {
    factoryAddress = currentJson.DenominatedOracleFactory_Address;
  } else {
    throw new Error("Parse Prop path: unrecognized proposal type.");
  }
  const nonce = await provider.getTransactionCount(factoryAddress);
  let predictedAddresses = [];
  for (let i = 0; i < numberOfAddressesToPredict; i++) {
    const predictedAddress = ethers.getCreateAddress({
      from: factoryAddress,
      nonce: nonce + i,
    });
    predictedAddresses.push(predictedAddress);
  }
  return predictedAddresses;
}

async function predictAddressAndWriteToFile(currentJson, provider) {
  const predictedAddresses = await predictAddress(currentJson, provider);
  if (currentJson.proposalType == "AddCollateral") {
    currentJson["LiquidationEngineCollateralParams"]["newCAHChild"] =
      predictedAddresses[0];
  } else if (currentJson.proposalType == "DeployChainlinkRelayers") {
    let numberOfAddresses = currentJson.arrayLength;
    currentJson["PredictedRelayerAddresses"] = [];
    for (let i = 0; i < numberOfAddresses; i++) {
      currentJson["PredictedRelayerAddresses"].push({
        symbol: currentJson.objectArray[i].symbol,
        address: predictedAddresses[i],
      });
    }
  } else if (currentJson.proposalType == "DeployDelayedOracles") {
    let numberOfAddresses = currentJson.arrayLength;
    currentJson["PredictedDelayedOracleAddresses"] = [];
    for (let i = 0; i < numberOfAddresses; i++) {
      currentJson["PredictedDelayedOracleAddresses"][
        currentJson.objectArray[i].symbol
      ] = predictedAddresses[i];
    }
  } else if (currentJson.proposalType == "DeployDenominatedOracles") {
    let numberOfAddresses = currentJson.arrayLength;
    currentJson["PredictedDenominatedOracleAddresses"] = [];
    for (let i = 0; i < numberOfAddresses; i++) {
      currentJson["PredictedDenominatedOracleAddresses"][
        currentJson.objectArray[i].symbol
      ] = predictedAddresses[i];
    }
  }

  fs.writeFile(basePath, JSON.stringify(currentJson, null, 2), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

const proposalType =
  currentJson.proposalType[0].toUpperCase() + currentJson.proposalType.slice(1);

// output desired path.
let desiredPath = `src/contracts/Generate/Generate${proposalType}Proposal.s.sol:Generate${proposalType}Proposal`;

console.log(desiredPath);
return;
