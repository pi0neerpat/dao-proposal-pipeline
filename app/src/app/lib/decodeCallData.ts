import { ethers } from 'ethers'

const decodeCallData = (calldata: any, targetABI: any): ethers.utils.TransactionDescription | null => {
  try {
    const targetInterface = new ethers.utils.Interface(targetABI as string)
    const calldataReadable = targetInterface.parseTransaction({ data: calldata })
    return calldataReadable
  } catch (error) {
    console.error('Error decoding call data:', error)
    return null
  }
}
export default decodeCallData
