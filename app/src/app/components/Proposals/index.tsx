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
          Publish a new proposal by making a PR on the
        </span>
        <a href={process.env.NEXT_PUBLIC_GITHUB_REPO_URL} target="_blank">
          GitHub
        </a>
        . <br />
        Proposal IDs are consistent. The entire 78-character ID should be used
        for verification, eg. by copying the URL. <br />
        NOTE: Only proposals in the repo will appear here. This is not a
        complete list.
      </div>
      <div className="pending-proposals-container">
        <div className="proposals-subsection-title">Published</div>

        <div className="pending-proposals proposals-container">
          <Table data={pendingProposals!} submitted={false} />
        </div>
      </div>
      <div className="submitted-proposals-container">
        <div className="proposals-subsection-title">Submitted</div>

        <div className="submitted-proposals proposals-container">
          <Table data={submittedProposals!} submitted={true} />
        </div>
      </div>
    </div>
  );
};

export default Proposals;
