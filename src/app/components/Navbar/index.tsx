'use client'
import React, {
    useContext
} from "react";
import { useEtherProviderContext } from "@/app/contexts/ProviderContext";
import Link from "next/link";

const Navbar:React.FC = () => {

    const { address, provider, signer } = useEtherProviderContext();
    console.log(provider);

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
                    <w3m-button />
                </li>
            </ul>
        </div>
    )
}

export default Navbar;