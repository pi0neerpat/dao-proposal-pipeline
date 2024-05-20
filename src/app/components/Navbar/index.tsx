'use client'
import React, {
    useContext
} from "react";
import { useEtherProviderContext } from "@/app/contexts/ProviderContext";
import Link from "next/link";
import Loading from "../Loading";

const Navbar:React.FC = () => {

    const { address, userVotes, proposalThreshold } = useEtherProviderContext();
    // console.log(odGovernor);

    return(
        <div className="navbar">
            <h1>OD Governance</h1>
            <ul className="navbar-links-list">
                <li className="navbar-link">
                    <Link
                        href={'/'}
                    >
                        Home
                    </Link>
                    <div className="user-token-balance-container">
                        {
                            (
                                !address ||
                                userVotes === null ||
                                proposalThreshold === null
                            ) ? (
                                <Loading/>
                            ) : (
                                (
                                    address &&
                                    userVotes !== null &&
                                    proposalThreshold !== null &&
                                    userVotes > proposalThreshold
                                ) ? (
                                    <a 
                                        href={`https://arbiscan.io/address/${process.env.NEXT_PUBLIC_OD_GOVERNANCE_TOKEN}`}
                                        target="_blank"
                                    >
                                        {`${address?.slice(0,6)}... Has ${userVotes} Votes (${proposalThreshold} Votes Required to Propose)`}
                                    </a>
                                ) : (
                                    <a 
                                        href={`https://arbiscan.io/address/${process.env.NEXT_PUBLIC_OD_GOVERNANCE_TOKEN}`}
                                        target="_blank"
                                    >
                                        {`You Do NOT Have Enough Votes to Propose. (${address?.slice(0,6)}... Has ${userVotes} Votes, Need at Least ${proposalThreshold})`}
                                    </a>
                                )
                            )
                            
                        }
                    </div>
                    <w3m-button />
                </li>
            </ul>
        </div>
    )
}

export default Navbar;