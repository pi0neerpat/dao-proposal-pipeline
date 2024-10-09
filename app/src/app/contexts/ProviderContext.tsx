"use client";
import { type BigNumber, ethers, type providers, type Signer } from "ethers";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers5/react";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type EtherProviderType } from "../types/EtherProviderType";
import ODGovernorABI from "../abis/ODGovernor.json";
import type ODGovernorType from "../types/ODGovernorType";
import GovernanceToken from "../abis/GovernanceToken.json";

const ProviderContext = createContext<EtherProviderType | undefined>(undefined);

const GOVERNANCE_TOKEN = process.env.NEXT_PUBLIC_GOVERNANCE_TOKEN!;

export const useEtherProviderContext = (): EtherProviderType => {
  const context = useContext(ProviderContext);
  if (context === null || context === undefined) {
    throw new Error(
      "useEtherProviderContext must be used within a ProviderProvider"
    );
  }
  return context;
};

export const ProviderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [provider, setProvider] = useState<
    providers.Web3Provider | null | providers.JsonRpcProvider
  >(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [odGovernor, setOdGovernor] = useState<ODGovernorType | null>(null);
  const [userVotes, setUserVotes] = useState<Number | null>(null);
  const [proposalThreshold, setProposalThreshold] = useState<Number | null>(
    null
  );

  const loadProvider = async (): Promise<any> => {
    try {
      let ethersProvider;
      let signer;
      if (walletProvider) {
        // provider
        ethersProvider = new ethers.providers.Web3Provider(walletProvider);
        // signer
        signer = ethersProvider.getSigner();
      } else {
        ethersProvider = new ethers.providers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_RPC_URL
        );
      }
      setProvider(ethersProvider);
      // od gov contract
      const governorAddress = process.env.NEXT_PUBLIC_GOVERNOR_ADDRESS!;
      const odGovernor = new ethers.Contract(
        governorAddress,
        ODGovernorABI.abi,
        signer ? signer : ethersProvider
      ) as unknown as ODGovernorType;
      setOdGovernor(odGovernor);
      // proposal threshold
      const proposalThreshold: BigNumber = await odGovernor.proposalThreshold();
      const proposalThresholdFormatted: string = ethers.utils.formatUnits(
        proposalThreshold.toString(),
        18
      );
      setProposalThreshold(Number(proposalThresholdFormatted));

      if (signer) {
        // get user votes
        const protocolToken = new ethers.Contract(
          GOVERNANCE_TOKEN,
          GovernanceToken.abi,
          signer
        );
        const userVotes: string = await protocolToken.getVotes(
          await signer.getAddress()
        );
        const parsedUserVotes = ethers.utils.formatUnits(userVotes, 18);

        setUserVotes(Number(parsedUserVotes));
        setSigner(signer);
      }
    } catch (error) {
      console.error("Error initializing ethers connection:", error);
    }
  };

  useEffect(() => {
    loadProvider().catch((error) => {
      console.error(error);
    });
  }, [walletProvider, address]);

  return (
    <ProviderContext.Provider
      value={{
        address,
        provider,
        signer,
        odGovernor,
        userVotes,
        proposalThreshold,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
};
