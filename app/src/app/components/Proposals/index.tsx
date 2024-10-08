"use client";
import React from "react";
import Link from "next/link";
import { useProposalContext } from "@/app/contexts/ProposalsContext";
import Table from "../Table";
import { Tooltip } from "react-tooltip";

const Proposals: React.FC = () => {
  const { proposals } = useProposalContext();

  const submittedProposals = proposals.filter(
    (proposal) => proposal.proposer !== ""
  );
  const pendingProposals = proposals.filter(
    (proposal) => proposal.proposer === ""
  );

  return (
    <div className="proposals-list container">
      <div className="proposals-link">
        <span className="proposal-link-description-text">
          Proposals published from
        </span>
        <a href={process.env.NEXT_PUBLIC_GITHUB_REPO_URL} target="_blank">
          GitHub
        </a>
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
