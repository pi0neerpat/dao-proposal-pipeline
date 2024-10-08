"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="navbar container">
      <div className="navbar-links-list">
        <div>
          <Link href={"/"}>
            <Image
              src="/full-logo.svg"
              alt="logo"
              width={150}
              height={35}
              itemType="svg"
            />
          </Link>
        </div>
        <div className="navbar-link connect-button-container">
          <w3m-button />
        </div>
      </div>
      <h1 className="navbar-title">DAO Proposal Pipeline</h1>
    </div>
  );
};

export default Navbar;
