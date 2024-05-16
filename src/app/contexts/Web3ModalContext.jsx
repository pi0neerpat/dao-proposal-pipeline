'use client'


import React, { createContext, useContext, useEffect, useState } from 'react';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';

const Web3ModalContext = createContext(null);

const Web3ModalProvider = ({ children }) => {
  const [web3Modal, setWeb3Modal] = useState(null);

  useEffect(() => {
    // 1. Get projectId
    const projectId = '5fe4a98e97c26e3fbb116206553b0c66';

    // 2. Set chains
    const mainnet = {
      chainId: 42161,
      name: 'Arbitrum',
      currency: 'ETH',
      explorerUrl: 'https://arbiscan.io',
      rpcUrl: 'https://arb1.arbitrum.io/rpc'
    };
    const fork = {
        chainId: 31337,
        name: 'Arbitrum Fork',
        currency: 'ETH',
        explorerUrl: 'https://arbiscan.io',
        rpcUrl: 'https://arb1.arbitrum.io/rpc'
      };

    // 3. Create a metadata object
    const metadata = {
      name: 'od-governance-app',
      description: 'Governance App for Open Dollar',
    //   url: 'https://mywebsite.com', // origin must match your domain & subdomain
      icons: ['https://avatars.mywebsite.com/']
    };

    // 4. Create Ethers config
    const ethersConfig = defaultConfig({
      /*Required*/
      metadata
    });

    // 5. Create a Web3Modal instance
    const web3ModalInstance = createWeb3Modal({
      ethersConfig,
      chains: [fork, mainnet],
      projectId,
      enableAnalytics: true // Optional - defaults to your Cloud configuration
    });

    setWeb3Modal(web3ModalInstance);
  }, []);

  return (
    <Web3ModalContext.Provider value={web3Modal}>
      {children}
    </Web3ModalContext.Provider>
  );
};

export { Web3ModalProvider, Web3ModalContext };
