import type { Metadata } from "next";
import { Barlow, Open_Sans } from "next/font/google";
import "./globals.css";
import { ProposalProvider } from "./contexts/ProposalsContext";
import { Web3Modal } from "./contexts/Web3ModalContext";
import { ProviderProvider } from "./contexts/ProviderContext";
import Navbar from "./components/Navbar";
import React from "react";
import Footer from "./components/Footer";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Governance Proposal Pipeline",
    template: "%s | DAO Governance",
  },
  description: "DAO proposals made easy and secure.",
  openGraph: {
    title: "Governance Proposal Pipeline",
    description: "DAO proposals made easy and secure",
    images: [
      {
        url: "/full-logo.svg",
        width: 800,
        height: 600,
        alt: "DAO Proposal Pipeline",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@pi0neerpat",
    creator: "@pi0neerpat",
    title: "Governance Proposal Pipeline",
    description: "DAO proposals made easy and secure",
    images: "/full-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <Web3Modal>
      <ProviderProvider>
        <ProposalProvider>
          <html
            lang="en"
            className={`${barlow.className} ${openSans.className} ${barlow.variable} ${openSans.variable}`}
          >
            <head>
              <link rel="icon" href="./favicon.ico" />
              <title>Governance Proposal Pipeline</title>
            </head>
            <body>
              <Navbar />
              {children}
              <Footer />
            </body>
          </html>
        </ProposalProvider>
      </ProviderProvider>
    </Web3Modal>
  );
}
