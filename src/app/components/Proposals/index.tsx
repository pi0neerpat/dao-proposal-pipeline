'use client';
import React from 'react';
import Link from 'next/link';
import { useProposalContext } from '@/app/contexts/ProposalsContext';
import Table from '../Table';

const Proposals: React.FC = () => {
  const { proposals } = useProposalContext();

  const submittedProposals = proposals.filter(
    (proposal) => proposal.proposer !== ''
  );
  const pendingProposals = proposals.filter(
    (proposal) => proposal.proposer === ''
  );

  return (
    <div className="proposals-list">
      <div className="proposals-link">
        <span className="proposal-link-description-text">
          Pending proposals are fetched from our
        </span>
        <Link
          href={
            'https://github.com/open-dollar/od-contracts/tree/dev/gov-output/mainnet'
          }
          target="_blank"
          className="proposal-link"
        >
          <span>GitHub</span>
        </Link>
      </div>
      <div className="pending-proposals-container">
        <div className="proposals-subsection-title">Pending Proposals</div>
        <div className="pending-proposals proposals-container">
          <Table data={pendingProposals!} submitted={false} />
        </div>
      </div>
      <div className="submitted-proposals-container">
        <div className="proposals-subsection-title">Submitted Proposals</div>
        <div className="submitted-proposals proposals-container">
          <Table data={submittedProposals!} submitted={true} />
        </div>
      </div>
    </div>
  );
};

export default Proposals;
