'use client'
import React, {
    useState,
    useEffect
} from "react";
import { ProposalType } from "@/app/types/proposal";
import Proposal from "./Proposal";
import Link from "next/link";
import Image from "next/image";


interface ProposalsProps{
    proposals: ProposalType[];
}

const Proposals:React.FC<ProposalsProps> = ({proposals}) => {
    
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