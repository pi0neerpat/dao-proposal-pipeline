import { type Metadata } from 'next'
import Proposal from './Proposal'
import React from 'react'

interface ProposalPageProps {
  params: {
    proposalId: string
  }
}

export const generateMetadata = ({ params }: ProposalPageProps): Metadata => {
  return {
    title: `Proposal ${params.proposalId.slice(0, 8)}...`,
    openGraph: {
      title: `Proposal ${params.proposalId.slice(0, 8)}...`,
      description: `A new Open Dollar Governance Proposal ${params.proposalId.slice(0, 8)}... for Submission`
    }
  }
}

const ProposalPage: React.FC<ProposalPageProps> = ({ params }) => {
  return (
    <Proposal params={params}/>
  )
}

export default ProposalPage
