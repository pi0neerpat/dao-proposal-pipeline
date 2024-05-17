'use client'

import Link from "next/link"
import React from "react"
import { ProposalType } from "@/app/types/proposal"
import { useProposalContext } from "@/app/contexts/ProposalsContext"

interface ProposalProps{
    index: number;
}

const Proposal:React.FC<ProposalProps> = ({index}) => {

    const {proposals, setProposals, proposalMetadata} = useProposalContext()

    return(
        <Link 
            key={index} 
            className="proposal-list-item"
            href={`/proposal/[proposalId]`}
            as={`/proposal/${proposals[index].proposalId.toString()}`}
        >
            <h3 className="proposal-description">
                {proposals[index].description}
            </h3>
            <div className="proposal-type">
                {proposals[index].proposalType}
            </div>
            <div className="proposal-id">
                {proposals[index].proposalId.toString().slice(0,10)}...
            </div>
            <div className="proposal-submitted">
                {
                    (
                        proposalMetadata.length > 0 &&
                        proposalMetadata[index].proposer == ""
                    ) ? (
                        "Unsubmitted"
                    ) : (
                        "Submitted"
                    )
                }
            </div>
        </Link>
    )
}

export default Proposal;