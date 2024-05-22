'use client'
import Link from "next/link";
import Image from "next/image";

const Navbar:React.FC = () => {

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
            <h1 className="navbar-title">Open Dollar Governance Proposals</h1>
        </div>
    )
}

export default Navbar;