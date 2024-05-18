import { ethers } from "ethers";

const decodeCallData = (calldata: any, targetABI: any) => {
    try {
        const targetInterface = new ethers.utils.Interface(targetABI);
        const calldataReadable = targetInterface.parseTransaction({ data: calldata });
        return calldataReadable
    } catch (error) {
        console.error("Error decoding call data:", error);
        return null;
    }
};
export default decodeCallData;