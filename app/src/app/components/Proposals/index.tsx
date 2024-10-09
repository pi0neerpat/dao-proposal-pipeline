"use client";
import React from "react";
import Image from "next/image";

import { useProposalContext } from "@/app/contexts/ProposalsContext";
import Table from "../Table";
import { Tooltip } from "react-tooltip";

const Proposals: React.FC = () => {
  const { proposals } = useProposalContext();

  const pendingProposals = proposals.filter(
    (proposal) =>
      proposal.proposer === "0x0000000000000000000000000000000000000000"
  );
  const submittedProposals = proposals.filter(
    (proposal) => !pendingProposals.includes(proposal)
  );

  return (
    <div className="proposals-list container">
      <div className="proposals-link">
        <span className="proposal-link-description-text">
          <Image src={"/github.svg"} alt="github-icon" width={20} height={20} />{" "}
          Publish new proposals via the GitHub repo
        </span>
        <a href={process.env.NEXT_PUBLIC_GITHUB_REPO_URL} target="_blank">
          here
        </a>
        . <br />
        📋 Copy the URL to verify proposals using the complete 78-character ID.{" "}
        <br />
        🏗️ Only proposals in the pipeline appear here; this is not meant to be a
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
