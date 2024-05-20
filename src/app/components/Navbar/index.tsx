'use client'
import React, {
    useContext
} from "react";
import { useEtherProviderContext } from "@/app/contexts/ProviderContext";
import Link from "next/link";

const Navbar:React.FC = () => {

    const { address, provider, signer, odGovernor, userGovernanceBalance } = useEtherProviderContext();
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
                            userGovernanceBalance &&
                            <h3>
                                <a 
                                    href={`https://arbiscan.io/address/${process.env.NEXT_PUBLIC_OD_GOVERNANCE_TOKEN}`}
                                    target="_blank"
                                >
                                    OD Governance Token Balance {userGovernanceBalance}
                                </a>
                            </h3>
                        }
                    </div>
                    <w3m-button />
                </li>
            </ul>
        </div>
    )
}

export default Navbar;