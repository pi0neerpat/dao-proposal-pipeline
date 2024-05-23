'use client'

import React, {
  useState,
  useEffect
} from 'react'
import { useProposalContext } from '@/app/contexts/ProposalsContext'
import { type ProposalType } from '@/app/types/proposal'
import convertTokensToThousandsK from '@/app/lib/convertTokensToThousansK'
import fetchABI from '@/app/lib/fetchABI'
import decodeCallData from '@/app/lib/decodeCallData'
import CallData from './CallData'
import ProposeButton from './ProposeButton'
import Loading from '@/app/components/Loading'
import Link from 'next/link'
import Image from 'next/image'

interface ProposalPageProps {
  params: {
    proposalId: string
  }
}

const ProposalPage: React.FC<ProposalPageProps> = ({ params }) => {
  const { proposals, proposalMetadata } = useProposalContext()

  const [loading, setLoading] = useState<boolean>(true)

  // determin current proposal by id
  const [currentProposal, setCurrentProposal] = useState<ProposalType | null>(null)
  const getCurrentProposal = () => {
    const currentProposal = proposals.filter((proposal) => {
      return proposal.proposalId.toString() === decodeURIComponent(params.proposalId.toString())
    })
    if (currentProposal !== null) {
      setCurrentProposal(currentProposal[0])
    }
  }
  useEffect(() => {
    getCurrentProposal()
  }, [proposals])

  // get current proposal metadata using current proposal
  const [currentMetadata, setCurrentMetadata] = useState<any | null>(null)
  const filterCurrentMetadata = (proposalMetadata: any[]) => {
    const currentMetadata = proposalMetadata.filter((metadata: any) => {
      return metadata.id === currentProposal?.proposalId
    })
    if (currentMetadata.length > 0) {
      setCurrentMetadata(currentMetadata[0])
    }
  }
  useEffect(() => {
    if (currentProposal !== null && proposalMetadata.length > 0) {
      filterCurrentMetadata(proposalMetadata)
    }
  }, [currentProposal])

  // this gets abis for each of our targets so we can decode call data
  const [targetABIs, setTargetABIs] = useState<any[] | null>(null)
  const pullAllTargetABIs = async (currentProposal: ProposalType) => {
    if (currentProposal && currentProposal.targets.length > 0) {
      const abiPromises = currentProposal?.targets.map(async (target) => await fetchABI(target))
      let fetchedABIs = await Promise.all(abiPromises)
      fetchedABIs = fetchedABIs.map((abi) => {
        if (abi === undefined) { return null }
        return JSON.parse(abi)
      })
      setTargetABIs(fetchedABIs)
    }
  }
  useEffect(() => {
    if (currentProposal && currentProposal.targets.length > 0) {
      pullAllTargetABIs(currentProposal)
    }
  }, [currentProposal])

  // this makes our calldatas from our currentMetadata a human readable format
  const [decodedCallData, setDecodedCallData] = useState<any[]>([])
  useEffect(() => {
    if (
      currentProposal &&
            currentProposal?.calldatas.length > 0 &&
            targetABIs &&
            targetABIs?.length > 0
    ) {
      const decodedCallDatas = currentProposal.calldatas.map((calldata, index) => {
        return decodeCallData(calldata, targetABIs[index])
      })
      setDecodedCallData(decodedCallDatas)
      setLoading(false)
    }
  }, [targetABIs])

  if (loading) {
    return (
            <Loading/>
    )
  }

  return (
        <div className="proposal-page">
            <div className="proposal-page-row-one">
                <h1 className="proposal-page-description">
                    Proposal: {currentProposal?.description}
                </h1>
                <h2 className="proposal-page-id">
                    Proposal ID: {currentProposal?.proposalId.toString().slice(0, 8)}...
                </h2>
            </div>
            <div className="proposal-page-row-two">
                <div className="proposal-page-type">
                    Proposal Type: {currentProposal?.proposalType}
                </div>
                <div className="proposal-page-submitted">
                    {
                        (
                          currentMetadata !== null &&
                            currentMetadata.proposer === ''
                        )
                          ? (
                              'Unsubmitted'
                            )
                          : (
                              'Submitted'
                            )
                    }
                </div>
            </div>
            {
                currentMetadata !== null &&
                currentMetadata.proposer !== '' &&
                <div className="proposal-page-vote-details">
                    <div className="proposal-page-vote-state">
                        {
                            currentMetadata !== null &&
                            currentMetadata.proposer !== '' &&
                            currentMetadata.executed === true &&
                            <div className="proposal-page-executed">Executed</div>
                        }
                        {
                            currentMetadata !== null &&
                            currentMetadata.proposer !== '' &&
                            currentMetadata.cancelled === true &&
                            <div className="proposal-page-cancelled">Cancelled</div>
                        }
                        {
                            currentMetadata !== null &&
                            currentMetadata.proposer !== '' &&
                            currentMetadata.executed === false &&
                            currentMetadata.cancelled === false &&
                            <div className="proposal-page-pending">Pending</div>
                        }
                    </div>
                    <div className="proposal-page-vote-counts">
                        <div className="proposal-page-vote-counts-labels">
                            <div className="proposal-page-vote-counts-label">
                                For
                            </div>
                            <div className="proposal-page-vote-counts-label">
                                Against
                            </div>
                            <div className="proposal-page-vote-counts-label">
                                Total
                            </div>
                        </div>
                        <div className="proposal-page-vote-counts-values">
                            <div className="proposal-page-votes-for">
                                    {
                                        (
                                          currentMetadata !== null &&
                                            currentMetadata.proposer !== ''
                                        )
                                          ? (
                                            `${convertTokensToThousandsK(currentMetadata.forVotes)}`
                                            )
                                          : (
                                              ''
                                            )
                                    }
                            </div>
                            <div className="proposal-page-votes-against">
                                {
                                    (
                                      currentMetadata !== null &&
                                        currentMetadata.proposer !== ''
                                    )
                                      ? (
                                        `${convertTokensToThousandsK(currentMetadata.againstVotes)}`
                                        )
                                      : (
                                          ''
                                        )
                                }
                            </div>
                            <div className="proposal-page-votes-total">
                                {
                                    (
                                      currentMetadata !== null &&
                                        currentMetadata.proposer !== ''
                                    )
                                      ? (
                                        `${convertTokensToThousandsK(
                                            currentMetadata.againstVotes + currentMetadata.forVotes
                                        )}`
                                        )
                                      : (
                                          ''
                                        )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
            <ul className="call-data-list">
                {
                    currentProposal &&
                    currentProposal?.calldatas.length > 0 &&
                    decodedCallData &&
                    decodedCallData.length > 0 &&
                    decodedCallData.map((calldata, index) => (
                        <li
                            className="call-data"
                            key={index}
                        >
                            <CallData
                                calldata={calldata}
                                index={index}
                                currentProposal={currentProposal}
                            />
                        </li>
                    ))
                }
            </ul>
            <div className="propose-button-container">
                {
                    currentMetadata !== null &&
                    currentMetadata.proposer === '' &&
                    <ProposeButton proposal={currentProposal}/>
                }
            </div>
        </div>
  )
}

export default ProposalPage
