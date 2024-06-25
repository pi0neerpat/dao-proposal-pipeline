'use client';

import Link from 'next/link';
import React from 'react';
import { useProposalContext } from '@/app/contexts/ProposalsContext';
import convertTokensToThousandsK from '@/app/lib/convertTokensToThousansK';

interface ProposalProps {
  index: number;
}

const Proposal: React.FC<ProposalProps> = ({ index }) => {
  const { proposals } = useProposalContext();

  
    console.log('just one', proposals);
  return (
    <Link
      key={index}
      className="proposal-list-item"
      href={'/proposal/[proposalId]'}
      as={`/proposal/${proposals[index].proposalId.toString()}`}
    >
      <div className="proposal-row-one">
        <div className="proposal-id">
          Proposal ID: {proposals[index].proposalId.toString().slice(0, 8)}...
        </div>
        <div className="proposal-description">
          {proposals[index].description}
        </div>
      </div>
      <div className="proposal-process">
        {proposals.length > 0 &&
          proposals[index].proposer !== '' && (
            <div className="proposal-vote-result">
              <div className="proposal-vote-item">
                <div className="proposal-vote-label">For</div>
                <div className="proposal-vote-value">
                  {proposals.length > 0 &&
                  proposals[index].proposer !== ''
                    ? `${convertTokensToThousandsK(
                        proposals[index].forVotes as string
                      )}`
                    : ''}
                </div>
              </div>

              <div className="proposal-vote-item">
                <div className="proposal-vote-label">Against</div>
                <div className="proposal-vote-value">
                  {proposals.length > 0 &&
                  proposals[index].proposer !== ''
                    ? `${convertTokensToThousandsK(
                        proposals[index].againstVotes as string
                      )}`
                    : ''}
                </div>
              </div>

              <div className="proposal-vote-item">
                <div className="proposal-vote-label">Total</div>
                <div className="proposal-vote-value">
                  {proposals.length > 0 &&
                  proposals[index].proposer !== ''
                    ? `${convertTokensToThousandsK(
                        (proposals[index].againstVotes +
                            proposals[index].forVotes) as string
                      )}`
                    : ''}
                </div>
              </div>

              <div className="proposal-vote-item">
                <div className="proposal-vote-label">Status</div>
                <div className="proposal-vote-value">
                  {proposals.length > 0 &&
                    proposals[index].proposer !== '' &&
                    proposals[index].executed === true && (
                      <div className="proposal-executed proposal-state">
                        Executed
                      </div>
                    )}
                  {proposals.length > 0 &&
                    proposals[index].proposer !== '' &&
                    proposals[index].cancelled === true && (
                      <div className="proposal-cancelled proposal-state">
                        Cancelled
                      </div>
                    )}
                  {proposals.length > 0 &&
                    proposals[index].proposer !== '' &&
                    proposals[index].executed === false &&
                    proposals[index].cancelled === false && (
                      <div className="proposal-pending proposal-state">
                        Pending
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
      </div>
    </Link>
  );
};

export default Proposal;
