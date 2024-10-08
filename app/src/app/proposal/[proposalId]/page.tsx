import { type Metadata } from "next";
import Proposal from "./Proposal";
import React from "react";

interface ProposalPageProps {
  params: {
    proposalId: string;
  };
}

export const generateMetadata = ({ params }: ProposalPageProps): Metadata => {
  return {
    title: `Proposal ${params.proposalId.slice(0, 8)}...`,
    openGraph: {
      title: `Proposal ${params.proposalId.slice(0, 8)}...`,
      description: `Governance Proposal ${params.proposalId.slice(
        0,
        8
      )}... for Submission`,
    },
    twitter: {
      card: "summary_large_image",
      // site: '@open_dollar',
      // creator: '@open_dollar',
      title: `Governance Proposal ${params.proposalId.slice(0, 8)}...`,
      description: `Proposal $${params.proposalId.slice(
        0,
        8
      )}... submission to vote`,
      images: "/full-logo.svg",
    },
  };
};

const ProposalPage: React.FC<ProposalPageProps> = ({ params }) => {
  return <Proposal params={params} />;
};

export default ProposalPage;
