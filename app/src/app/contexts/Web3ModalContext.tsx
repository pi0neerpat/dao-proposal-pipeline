"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";

// Your WalletConnect Cloud project ID
export const projectId = process.env.NEXT_PUBLIC_WEB_MODAL_PROJECT_ID;

// 2. Set chains
const mainnet = {
  chainId: process.env.NEXT_PUBLIC_NETWORK_ID,
  name: "Base",
  currency: "ETH",
  explorerUrl: "https://basescan.org",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
};
// const fork = {
//   chainId: 31337,
//   name: 'Arbitrum Fork',
//   currency: 'ETH',
//   explorerUrl: '',
//   rpcUrl: 'http://localhost:8545'
// }

// 3. Create a metadata object
const metadata = {
  name: "dao-proposal-pipeline",
  description: "DAO proposals made easy and secure",
  //   url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
  // this will need to be updated
  url: "https://www.google.com",
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /* Required */
  metadata,
});

// 5. Create a Web3Modal instance
if (projectId !== undefined) {
  createWeb3Modal({
    ethersConfig,
    chains: [mainnet],
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true, // Optional - false as default
    themeMode: "light",
  });
}

export function Web3Modal({ children }: any): JSX.Element {
  return children;
}
