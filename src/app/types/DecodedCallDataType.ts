import { type BigNumber } from 'ethers'

interface FunctionInput {
  name: string
  type: string
  indexed: boolean | null
  components: any | null
  arrayLength: number | null
  arrayChildren: any | null
  baseType: string
  _isParamType: boolean
}

// Define the interface for the function fragment
interface FunctionFragment {
  type: string
  name: string
  constant: boolean
  inputs: FunctionInput[]
  outputs: any[]
  payable: boolean
  stateMutability: string
  gas: number | null
  _isFragment: boolean
}

// Define the interface for the decoded call data
interface DecodedCallData {
  args: any[] // Allow for any number and type of arguments
  functionFragment: FunctionFragment
  name: string
  signature: string
  sighash: string
  value: BigNumber
}

export default DecodedCallData
