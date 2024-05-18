import React from "react";
import { BigNumber } from "ethers";

interface FunctionInput {
    name: string;
    type: string;
    indexed: boolean | null;
    components: any | null;
    arrayLength: number | null;
    arrayChildren: any | null;
    baseType: string;
    _isParamType: boolean;
}

// Define the interface for the function fragment
interface FunctionFragment {
    type: string;
    name: string;
    constant: boolean;
    inputs: FunctionInput[];
    outputs: any[];
    payable: boolean;
    stateMutability: string;
    gas: number | null;
    _isFragment: boolean;
}

// Define the interface for the decoded call data
interface DecodedCallData {
    args: any[]; // Allow for any number and type of arguments
    functionFragment: FunctionFragment;
    name: string;
    signature: string;
    sighash: string;
    value: BigNumber;
}

interface CallDataProps {
    calldata: DecodedCallData;
    index: number;
}

const CallData:React.FC<CallDataProps> = ({calldata, index}) => {
    return(
        <div 
            className="call-data-container"
            key={index}
        >
            <h2>Call Data</h2>
            <div className="call-data-function-name">
                {calldata.functionFragment.name}
            </div>
            {
                calldata.functionFragment.inputs.length > 0 &&
                calldata.functionFragment.inputs.map((input, index) => {
                    return (
                        <div className="call-data-inputs" key={index}>
                            <h4>Inputs</h4>
                            <h4 className="call-data-input-name">
                                {input.name}
                            </h4>
                        </div>
                    )
                })
            }
            <h3 className="call-data-inputs">
            </h3>

        </div>
    )
}

export default CallData;