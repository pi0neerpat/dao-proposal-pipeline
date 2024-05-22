'use client'
import React, {
    useState,
    useEffect
} from "react";
import { ProposalType } from "@/app/types/proposal";
import Proposal from "./Proposal";
import Link from "next/link";
import Image from "next/image";
import { useProposalContext } from "@/app/contexts/ProposalsContext";

const Proposals:React.FC = () => {

    const {proposalMetadata} = useProposalContext()
    
    return(
        <ul className="proposals-list">
            <div className="proposals-header">
                <h2>Proposals</h2>
            </div>
            <div className="proposal-link-container">
                <Link
                    href={'https://github.com/open-dollar/od-contracts/tree/dev/gov-output/mainnet'}
                    target="_blank"
                    className="proposals-link"
                >
                    Pending proposals are fetched from our GitHub
                    <Image
                        src={'/external-link-white.svg'}
                        alt="link"
                        width={25}
                        height={25}
                        className="external-link-svg"
                    ></Image>

                </Link>
            </div>
            <div className="pending-proposals-container">
                <div className="proposals-subsection-title">
                    Pending Proposals
                </div>
                <div className="pending-proposals">
                    {
                        proposalMetadata.map((proposal, index) => {
                            if(proposal.proposer === ""){
                                return(
                                    <Proposal
                                        index={index}
                                        key={index}
                                    />
                                )
                            }
                        })
                    }
                </div>
            </div>
            <div className="submitted-proposals-container">
                <div className="proposals-subsection-title">
                    Submitted Proposals
                </div>
                <div className="submitted-proposals">
                    {
                        proposalMetadata.map((proposal, index) => {
                            if(proposal.proposer !== ""){
                                return(
                                    <Proposal
                                        index={index}
                                        key={index}
                                    />
                                )
                            }
                        })
                    }
                </div>
            </div>
        </ul>
    )
}

export default Proposals;