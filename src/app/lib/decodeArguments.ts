import type DecodedCallData from "../types/DecodedCallDataType";
import { type BytesLike, ethers } from "ethers";

function decodeArguments(callData: DecodedCallData): any[] {
  const { args, functionFragment } = callData;
  const inputs = functionFragment.inputs;
  const decodedArgs = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const inputType = inputs[i].type;
    let decodedArg;
    if (inputType.startsWith("uint") || inputType.startsWith("int")) {
      decodedArg = ethers.BigNumber.from(arg).toString();
    } else if (inputType === "address") {
      decodedArg = ethers.utils.getAddress(arg);
    } else if (inputType === "bool") {
      decodedArg = ethers.utils.hexValue(arg as BytesLike) === "0x01";
    } else if (inputType === "bytes") {
      decodedArg = arg.split("0x")[1]?.match(/.{1,64}/g);
    } else if (inputType === "bytes32") {
      decodedArg = ethers.utils.parseBytes32String(arg as BytesLike);
    } else if (inputType.startsWith("string")) {
      decodedArg = ethers.utils.toUtf8String(arg as BytesLike);
    } else {
      // Handle other types here
      decodedArg = arg;
    }

    decodedArgs.push(decodedArg);
  }

  return decodedArgs;
}

export default decodeArguments;
