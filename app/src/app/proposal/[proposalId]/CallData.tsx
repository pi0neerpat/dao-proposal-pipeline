import React, { useState, useEffect } from "react";
import type DecodedCallData from "@/app/types/DecodedCallDataType";
import decodeArguments from "@/app/lib/decodeArguments";
import { type ProposalType } from "@/app/types/proposal";
import Link from "next/link";
import Image from "next/image";

type Item = Record<string, string | number>;

type ArrayItem = Item | string | number;

interface CallDataProps {
  calldata: DecodedCallData;
  index: number;
  currentProposal: ProposalType;
}

const CallData: React.FC<CallDataProps> = ({
  calldata,
  index,
  currentProposal,
}) => {
  const [decodedArgs, setDecodedArgs] = useState<any[]>([]);
  useEffect(() => {
    calldata && setDecodedArgs(decodeArguments(calldata));
  }, [calldata]);

  const methodId = currentProposal.calldatas[index].slice(0, 10);
  const args = currentProposal.calldatas[index].slice(10)?.match(/.{1,64}/g);
  const formattedCallData = (
    <p>
      MethodID: {methodId}
      {args?.map((arg, i) => (
        <>
          <br />
          {`[${i}]: ${arg}`}
        </>
      ))}
    </p>
  );

  return (
    <div className="call-data-container" key={index}>
      <div className="proposal-page-function-title">
        Step {index + 1}. {calldata?.name}
      </div>

      <div className="proposal-page-item">
        <div className="proposal-page-label">Target:</div>
        <div className="proposal-page-value call-data-link">
          <Link
            href={`https://arbiscan.io/address/${currentProposal.targets[
              index
            ].toString()}`}
            target="_blank"
            className="call-data-link"
          >
            {currentProposal.targets[index].toString()}
            <Image
              src={"/external-link.svg"}
              alt="link"
              width={20}
              height={20}
            ></Image>
          </Link>
        </div>
      </div>

      <div className="proposal-page-item">
        <div className="proposal-page-label">Value:</div>
        <div className="proposal-page-value">
          {currentProposal.values[index]}
        </div>
      </div>

      <div className="proposal-page-item">
        <div className="proposal-page-label">Calldata: </div>
        <div className="proposal-page-value call-data-raw-value">
          {formattedCallData}
        </div>
      </div>

      {calldata && (
        <div className="proposal-page-item">
          <div className="proposal-page-label">Decoded Calldata: </div>
          <div className="proposal-page-value">
            {calldata.functionFragment.inputs.length > 0 &&
              decodedArgs.length > 0 &&
              calldata.functionFragment.inputs.map((input, inputIndex) => (
                <div key={inputIndex} className="call-data-input-value">
                  {input.name}:{" "}
                  <>
                    {Array.isArray(decodedArgs[inputIndex]) ? (
                      <div>
                        {decodedArgs[inputIndex].map(
                          (item: ArrayItem, arrayIndex: number) => (
                            <div key={arrayIndex}>
                              {typeof item === "object"
                                ? Object.keys(item)
                                    .map((key) => `${key}: ${item[key]}`)
                                    .join(", ")
                                : ` ${item as string} `}
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div>{decodedArgs[inputIndex]}</div>
                    )}
                  </>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CallData;
