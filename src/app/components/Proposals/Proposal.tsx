'use client';

import Link from 'next/link';
import React from 'react';
import { useProposalContext } from '@/app/contexts/ProposalsContext';
import convertTokensToThousandsK from '@/app/lib/convertTokensToThousansK';

interface ProposalProps {
    index: number;
}

const Proposal: React.FC<ProposalProps> = ({ index }) => {
    const { proposals, proposalMetadata } = useProposalContext();

    return (
        <Link
            key={index}
            className="proposal-list-item"
            href={'/proposal/[proposalId]'}
            as={`/proposal/${proposals[index].proposalId.toString()}`}
        >
            <div className="proposal-row-one">
                <div className="proposal-id">
                    Proposal ID:{' '}
                    {proposals[index].proposalId.toString().slice(0, 8)}...
                </div>
                <div className="proposal-description">
                    {proposals[index].description}
                </div>
            </div>
            <div className="proposal-process">
                {proposalMetadata.length > 0 &&
                    proposalMetadata[index].proposer !== '' && (
                        <div className="proposal-vote-details">
                            <h4 className="proposal-vote-detail-title">
                                Vote Details
                            </h4>
                            <div className="proposal-votes-detail-labels">
                                <div className="proposal-vote-detail-label">
                                    For
                                </div>
                                <div className="proposal-vote-detail-label">
                                    Against
                                </div>
                                <div className="proposal-vote-detail-label">
                                    Total
                                </div>
                            </div>
                            <div className="proposal-vote-detail-values">
                                <div className="proposal-votes-for">
                                    {proposalMetadata.length > 0 &&
                                    proposalMetadata[index].proposer !== ''
                                        ? `${convertTokensToThousandsK(
                                              proposalMetadata[index]
                                                  .forVotes as string
                                          )}`
                                        : ''}
                                </div>
                                <div className="proposal-votes-against">
                                    {proposalMetadata.length > 0 &&
                                    proposalMetadata[index].proposer !== ''
                                        ? `${convertTokensToThousandsK(
                                              proposalMetadata[index]
                                                  .againstVotes as string
                                          )}`
                                        : ''}
                                </div>
                                <div className="proposal-votes-total">
                                    {proposalMetadata.length > 0 &&
                                    proposalMetadata[index].proposer !== ''
                                        ? `${convertTokensToThousandsK(
                                              (proposalMetadata[index]
                                                  .againstVotes +
                                                  proposalMetadata[index]
                                                      .forVotes) as string
                                          )}`
                                        : ''}
                                </div>
                            </div>
                        </div>
                    )}
                {proposalMetadata.length > 0 &&
                    proposalMetadata[index].proposer !== '' &&
                    proposalMetadata[index].executed === true && (
                        <div className="proposal-executed proposal-state">
                            Executed
                        </div>
                    )}
                {proposalMetadata.length > 0 &&
                    proposalMetadata[index].proposer !== '' &&
                    proposalMetadata[index].cancelled === true && (
                        <div className="proposal-cancelled proposal-state">
                            Cancelled
                        </div>
                    )}
                {proposalMetadata.length > 0 &&
                    proposalMetadata[index].proposer !== '' &&
                    proposalMetadata[index].executed === false &&
                    proposalMetadata[index].cancelled === false && (
                        <div className="proposal-pending proposal-state">
                            Pending
                        </div>
                    )}
            </div>
        </Link>
    );
};

export default Proposal;
