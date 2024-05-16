import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProposalProvider } from "./contexts/ProposalsContext";
import { Web3Modal } from './contexts/Web3ModalContext'
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Web3Modal>
      <ProposalProvider>
        <html lang="en">
          <body className={inter.className}>
            <Navbar/>
            {children}
          </body>
        </html>
      </ProposalProvider>
    </Web3Modal>
  );
}
