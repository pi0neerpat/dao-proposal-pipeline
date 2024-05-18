const ethers = require('ethers');
import DecodedCallData from "../types/DecodedCallDataType";

function decodeArguments(callData: DecodedCallData): any[] {
    const { args, functionFragment } = callData;
    const inputs = functionFragment.inputs;
    const abiCoder = new ethers.utils.AbiCoder();
    let decodedArgs = [];

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        const inputType = inputs[i].type;
        let decodedArg;
        // brute force handle different data types
        if (inputType.startsWith("uint") || inputType.startsWith("int")) {
            decodedArg = ethers.BigNumber.from(arg).toString();
        } else if (inputType === "address") {
            decodedArg = ethers.utils.getAddress(ethers.utils.hexZeroPad(arg, 32));
        } else if (inputType === "bool") {
            decodedArg = ethers.utils.hexValue(arg) === "0x01";
        } else if (inputType === "bytes") {
            decodedArg = ethers.utils.arrayify(arg);
        } else if (inputType === "bytes32") {
            decodedArg = ethers.utils.parseBytes32String(arg);
        } else if (inputType.startsWith("string")) {
            decodedArg = ethers.utils.toUtf8String(arg);
        } else {
            // Handle other types here
            decodedArg = arg;
        }

        decodedArgs.push(decodedArg);
    }

    return decodedArgs;
}

export default decodeArguments;
