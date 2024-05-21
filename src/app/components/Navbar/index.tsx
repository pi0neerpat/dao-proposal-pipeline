'use client'
import React, {
    useContext
} from "react";
import { useEtherProviderContext } from "@/app/contexts/ProviderContext";
import Link from "next/link";
import Loading from "../Loading";
import Image from "next/image";

const Navbar:React.FC = () => {

    const { provider, address, userVotes, proposalThreshold } = useEtherProviderContext();

    return(
        <div className="navbar">
            <ul className="navbar-links-list">
                <li className="navbar-link">
                    <Link
                        href={'/'}
                    >
                        <Image 
                            src="/home-icon.svg" 
                            alt="Home" 
                            width={28} 
                            height={28} 
                            itemType="svg"
                            className="home-icon"
                        />
                    </Link>
                </li>
                <li>
                    <Image
                        src='/full-logo-open-dollar.svg'
                        alt="open-dollar-logo"
                        width={150}
                        height={35}
                        itemType="svg"
                    />
                </li>
                <li className="navbar-link connect-button-container">
                    <w3m-button />
                </li>
            </ul>
            <div className="user-token-balance-container">
                        {
                            (
                                !address || !provider ? (
                                    <div>No Web3 Connection</div>
                                ) : (
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
                            )
                            
                        }
                    </div>
            <h1 className="navbar-title">Open Dollar Governance Proposals</h1>
        </div>
    )
}

export default Navbar;