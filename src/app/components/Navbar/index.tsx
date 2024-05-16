import React, {
    useContext
} from "react";
import Link from "next/link";

const Navbar:React.FC = () => {

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