'use client'

import React from "react";
import { useProposalContext } from "@/app/contexts/ProposalsContext";

const ProposalPage:React.FC = () => {

    const {proposals, setProposals} = useProposalContext()

    return(
        <div className="proposal-page">
            Proposal Page
        </div>
    )
}

export default ProposalPage;