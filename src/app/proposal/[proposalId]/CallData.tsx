import React, {
    useState,
    useEffect
} from "react";
import DecodedCallData from "@/app/types/DecodedCallDataType";
import decodeArguments from "@/app/lib/decodeArguments";

interface CallDataProps {
    calldata: DecodedCallData;
    index: number;
}

const CallData:React.FC<CallDataProps> = ({calldata, index}) => {

    const [decodedArgs, setDecodedArgs] = useState<any[]>([])
    useEffect(() => {
        const decodedArgs = decodeArguments(calldata)
        setDecodedArgs(decodedArgs)
    }, [calldata])

    return(
        <div 
            className="call-data-container"
            key={index}
        >
            <h2>Call Data</h2>
            <h3>Function</h3>
            <div className="call-data-function-name">
                {calldata.signature}
            </div>
            <h4>Inputs</h4>
            {
                calldata.functionFragment.inputs.length > 0 &&
                decodedArgs.length > 0 &&
                calldata.functionFragment.inputs.map((input, index) => {
                    return (
                        <div className="call-data-inputs" key={index}>
                            <p className="call-data-input-name">
                                <strong>{input.name}</strong>
                            </p>
                            <p className="call-data-input-value">
                                {decodedArgs[index]}
                            </p>
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