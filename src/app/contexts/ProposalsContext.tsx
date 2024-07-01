"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type ProposalType } from "../types/proposal";
import { fetchProposals } from "../lib/fetchProposals";
import { useEtherProviderContext } from "@/app/contexts/ProviderContext";
import type ODGovernorType from "@/app/types/ODGovernorType";

interface ProposalContextType {
  proposals: any[];
  setProposals: React.Dispatch<React.SetStateAction<any[]>>;
}

const ProposalContext = createContext<ProposalContextType>({
  proposals: [],
  setProposals: () => {},
});

export const useProposalContext = (): ProposalContextType =>
  useContext<ProposalContextType>(ProposalContext);

interface ProposalProviderProps {
  children: ReactNode;
}

export const ProposalProvider: React.FC<ProposalProviderProps> = ({
  children,
}) => {
  const [proposals, setProposals] = useState<any[]>([]);

  const { odGovernor } = useEtherProviderContext();

  const loadData = async (): Promise<void> => {
    console.log("Loading data")
    try {
      console.log("Fetching proposals")
      const fetchedProposals = (await fetchProposals()) as ProposalType[];
      console.log("Fetched proposals", fetchedProposals)
      if (odGovernor) {
        const metadataPromises = fetchedProposals.map(async (proposal) => {
          try {
            const proposalId = proposal.proposalId;
            const metadata = await odGovernor.proposals(proposalId);
            const {
              id,
              proposer,
              eta,
              startBlock,
              endBlock,
              forVotes,
              againstVotes,
              abstainVotes,
              canceled,
              executed,
            } = metadata;
            return {
              id: id.toString(),
              proposer,
              eta: eta.toString(),
              startBlock: startBlock.toString(),
              endBlock: endBlock.toString(),
              forVotes: forVotes.toString(),
              againstVotes: againstVotes.toString(),
              abstainVotes: abstainVotes.toString(),
              canceled,
              executed,
            };
          } catch (error: any) {
            if (error.reason.toString() === "Governor: unknown proposal id") {
              return {
                id: proposal.proposalId,
                proposer: "",
                eta: "",
                startBlock: "",
                endBlock: "",
                forVotes: "",
                againstVotes: "",
                abstainVotes: "",
                canceled: "",
                executed: "",
              };
            }
            return null;
          }
        });

        const metadataArray = await Promise.all(metadataPromises);
        const merged = mergeProposalsWithMetadata(
          fetchedProposals,
          metadataArray
        );
        setProposals(merged);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const mergeProposalsWithMetadata = (
    proposals: ProposalType[],
    proposalMetadata: any[]
  ) => {
    return proposals.map((proposal) => {
      const metadata = proposalMetadata.find(
        (md) => md.id === proposal.proposalId
      );

      const totalVotes =
        metadata?.forVotes && metadata?.againstVotes
          ? (
              BigInt(metadata?.forVotes) + BigInt(metadata?.againstVotes)
            ).toString()
          : "0";
      return { ...proposal, ...metadata, totalVotes };
    });
  };

  useEffect(() => {
    loadData();
  }, [odGovernor]);

  return (
    <ProposalContext.Provider value={{ proposals, setProposals }}>
      {children}
    </ProposalContext.Provider>
  );
};
