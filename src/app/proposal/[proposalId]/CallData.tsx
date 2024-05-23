import React, { useState, useEffect } from 'react'
import type DecodedCallData from '@/app/types/DecodedCallDataType'
import decodeArguments from '@/app/lib/decodeArguments'
import { type ProposalType } from '@/app/types/proposal'
import Link from 'next/link'
import Image from 'next/image'

type Item = Record<string, string | number>

type ArrayItem = Item | string | number

interface CallDataProps {
  calldata: DecodedCallData
  index: number
  currentProposal: ProposalType
}

const CallData: React.FC<CallDataProps> = ({ calldata, index, currentProposal }) => {
  const [decodedArgs, setDecodedArgs] = useState<any[]>([])
  useEffect(() => {
    const decodedArgs = decodeArguments(calldata)
    setDecodedArgs(decodedArgs)
  }, [calldata])

  return (
        <div className="call-data-container" key={index}>
            <h2 className="call-data-title">Call Data</h2>
            <div className="call-data-row-one">
                <div className="call-data-function-column-one">
                    <h3>Function</h3>
                    <div className="call-data-function-name">
                        {calldata.signature}
                    </div>
                    <h3>Target</h3>
                    <div className="target">
                        <Link
                            href={`https://arbiscan.io/address/${currentProposal.targets[index].toString()}`}
                            target="_blank"
                            className="target-link"
                        >
                            {currentProposal.targets[index].toString()}
                            <Image
                                src={'/external-link.svg'}
                                alt="link"
                                width={25}
                                height={25}
                                className="external-link-svg"
                            ></Image>
                        </Link>
                    </div>
                    <h3>Value</h3>
                    <div className="value">
                        {currentProposal.values[index]}
                    </div>
                </div>
                <div className="call-data-function-column-two">
                    <h4 className="call-data-function-inputs-title">
                        Inputs
                    </h4>
                    {
                        calldata.functionFragment.inputs.length > 0 &&
                        decodedArgs.length > 0 &&
                        calldata.functionFragment.inputs.map((input, inputIndex) => (
                            <div className="call-data-inputs" key={inputIndex}>
                                <p className="call-data-input-name">
                                    <strong>{input.name}</strong>
                                </p>
                                <div className="call-data-input-value">
                                    {
                                        Array.isArray(decodedArgs[inputIndex])
                                          ? (
                                            <div className="call-data-input-value-array">
                                                {
                                                    decodedArgs[inputIndex].map((item: ArrayItem, arrayIndex: number) => (
                                                        <div key={arrayIndex}>
                                                            {
                                                                typeof item === 'object'
                                                                  ? (
                                                                      Object.keys(item).map(key => `${key}: ${item[key]}`).join(', ')
                                                                    )
                                                                  : (
                                                                    ` ${item as string} `
                                                                    )
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            )
                                          : (
                                            <div className="call-data-input-value-scalar">
                                                {decodedArgs[inputIndex]}
                                            </div>
                                            )
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="call-data-raw">
                <h3 className='call-data-raw-title'>Raw Call Data</h3>
                <div className='call-data-raw-value'>
                    {currentProposal.calldatas[index].toString()}
                </div>
            </div>
        </div>
  )
}

export default CallData
