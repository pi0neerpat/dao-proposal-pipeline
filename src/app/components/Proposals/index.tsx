'use client';
import React from 'react';
import Proposal from './Proposal';
import Link from 'next/link';
import { useProposalContext } from '@/app/contexts/ProposalsContext';
import Table from '../Table';
import convertTokensToThousandsK from '@/app/lib/convertTokensToThousansK';

type Proposal = {
  id: string;
  description: string;
  type: 'Unsubmitted' | 'Submitted';
  status: 'Executed' | 'Canceled' | 'Pending';
  forVotes: string;
  againstVotes: string;
  totalVotes: string;
};

const Proposals: React.FC = () => {
  const { proposalMetadata, proposals } = useProposalContext();

  const mergeProposalsWithMetadata = (
    proposals: any[],
    proposalMetadata: any[]
  ) => {
    return proposals.map((proposal) => {
      const metadata = proposalMetadata.find(
        (md) => md.id === proposal.proposalId
      );
      
      const totalVotes =
        metadata?.forVotes && metadata?.againstVotes
          ? (
              BigInt(metadata?.forVotes) + BigInt(metadata?.againstVotes)
            ).toString()
          : '0';
      return { ...proposal, ...metadata, totalVotes };
    });
  };

  const mergedProposals = mergeProposalsWithMetadata(
    proposals,
    proposalMetadata
  );
  const submittedProposals = mergedProposals.filter(
    (proposal) => proposal.proposer !== ''
  );
  const pendingProposals = mergedProposals.filter(
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
