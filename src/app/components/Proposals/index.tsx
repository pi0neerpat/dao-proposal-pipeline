'use client'
import React from 'react'
import Proposal from './Proposal'
import Link from 'next/link'
import { useProposalContext } from '@/app/contexts/ProposalsContext'

const Proposals: React.FC = () => {
  const { proposalMetadata } = useProposalContext()

  return (
        <ul className="proposals-list">
            <div className="proposals-link">
                <div className='proposal-link-description-text'>
                    Pending proposals are fetched from our
                </div>
                <Link
                    href={'https://github.com/open-dollar/od-contracts/tree/dev/gov-output/mainnet'}
                    target="_blank"
                    className="proposal-link"
                >
                     GitHub

                </Link>
            </div>
            <div className="pending-proposals-container">
                <div className="proposals-subsection-title">
                    Pending Proposals
                </div>
                <div className="pending-proposals">
                    {
                        proposalMetadata.map((proposal, index) => {
                          if (proposal.proposer === '') {
                            return (
                                    <Proposal
                                        index={index}
                                        key={index}
                                    />
                            )
                          } else {
                            return null
                          }
                        })
                    }
                </div>
            </div>
            <div className="submitted-proposals-container">
                <div className="proposals-subsection-title">
                    Submitted Proposals
                </div>
                <div className="submitted-proposals">
                    {
                        proposalMetadata.map((proposal, index) => {
                          if (proposal.proposer !== '') {
                            return (
                                    <Proposal
                                        index={index}
                                        key={index}
                                    />
                            )
                          } else {
                            return null
                          }
                        })
                    }
                </div>
            </div>
        </ul>
  )
}

export default Proposals
