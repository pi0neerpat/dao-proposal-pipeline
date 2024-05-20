'use client'

import Link from "next/link"
import React, {
    useState,
    useEffect
} from "react"
import { ProposalType } from "@/app/types/proposal"
import { useProposalContext } from "@/app/contexts/ProposalsContext"
import { useEtherProviderContext } from "@/app/contexts/ProviderContext"
import convertTokensToThousandsK from "@/app/lib/convertTokensToThousansK"
import { time } from "console"
const { ethers } = require('ethers');


interface ProposalProps{
    index: number;
}

const Proposal:React.FC<ProposalProps> = ({index}) => {

    const {proposals, setProposals, proposalMetadata} = useProposalContext()
    const { address, provider, signer, odGovernor, userGovernanceBalance } = useEtherProviderContext();

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
                        proposalMetadata[index].proposer === ""
                    ) ? (
                        "Unsubmitted"
                    ) : (
                        "Submitted"
                    )
                }
            </div>
            {
                proposalMetadata.length > 0 &&
                proposalMetadata[index].proposer !== "" &&
                proposalMetadata[index].executed === true &&
                <div className="proposal-executed">Executed</div>
            }
            {
                proposalMetadata.length > 0 &&
                proposalMetadata[index].proposer !== "" &&
                proposalMetadata[index].cancelled === true &&
                <div className="proposal-cancelled">Cancelled</div>
            }
            {
                proposalMetadata.length > 0 &&
                proposalMetadata[index].proposer !== "" &&
                proposalMetadata[index].executed === false &&
                proposalMetadata[index].cancelled === false &&
                <div className="proposal-pending">Pending</div>
            }
            <div className="proposal-votes-for">
                { 
                    (
                        proposalMetadata.length > 0 &&
                        proposalMetadata[index].proposer !== "" 
                    ) ? (
                        `${convertTokensToThousandsK(proposalMetadata[index].forVotes)}`
                    ) : (
                        ""
                    )
                }
            </div>
            <div className="proposal-votes-against">
                { 
                    (
                        proposalMetadata.length > 0 &&
                        proposalMetadata[index].proposer !== "" 
                    ) ? (
                        `${convertTokensToThousandsK(proposalMetadata[index].againstVotes)}`
                    ) : (
                        ""
                    )
                }
            </div>
            <div className="proposal-votes-total">
                { 
                    (
                        proposalMetadata.length > 0 &&
                        proposalMetadata[index].proposer !== "" 
                    ) ? (
                        `${convertTokensToThousandsK(
                            proposalMetadata[index].againstVotes + proposalMetadata[index].forVotes
                        )}`
                    ) : (
                        ""
                    )
                }
            </div>
        </Link>
    )
}

export default Proposal;