'use client'
import React, {
    useState,
    useEffect
} from "react";
import { ProposalType } from "@/app/types/proposal";
import Proposal from "./Proposal";


interface ProposalsProps{
    proposals: ProposalType[];
}

const Proposals:React.FC<ProposalsProps> = ({proposals}) => {
    
    return(
        <ul className="proposals-list">
            <div className="proposals-header">
                <h2>Proposals</h2>
            </div>
            {
                proposals.map((proposal, index) => {
                    return(
                        <Proposal
                            index={index}
                            key={index}
                        />
                    )
                })
            }
        </ul>
    )
}

export default Proposals;