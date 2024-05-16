'use client'

import React from "react"
import { ProposalType } from "@/app/types/proposal"

interface ProposalProps{
    proposal: ProposalType;
    index: number;
}

const Proposal:React.FC<ProposalProps> = ({proposal, index}) => {
    return(
        <li key={index} className="proposal-list-item">
            <h3 className="proposal-description">
                {proposal.description}
            </h3>
            <div className="proposal-type">
                {proposal.proposalType}
            </div>
            <div className="proposal-id">
                {proposal.proposalId.toString().slice(0,10)}...
            </div>
        </li>
    )
}

export default Proposal;