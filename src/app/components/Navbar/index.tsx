'use client'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const Navbar: React.FC = () => {
  return (
        <div className="navbar">
            <ul className="navbar-links-list">
                <li>
                    <Link
                        href={'/'}
                    >
                        <Image
                            src='/full-logo-open-dollar.svg'
                            alt="open-dollar-logo"
                            width={150}
                            height={35}
                            itemType="svg"
                        />
                    </Link>
                </li>
                <li className="navbar-link connect-button-container">
                    <w3m-button />
                </li>
            </ul>
            <h1 className="navbar-title">Open Dollar Governance Proposals</h1>
        </div>
  )
}

export default Navbar
