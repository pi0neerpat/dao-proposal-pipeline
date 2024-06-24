'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { type ProposalType } from '../types/proposal';
import { fetchProposals } from '../lib/fetchProposals';
import { useEtherProviderContext } from '@/app/contexts/ProviderContext';
import type ODGovernorType from '@/app/types/ODGovernorType';

interface ProposalContextType {
  proposals: ProposalType[];
  setProposals: React.Dispatch<React.SetStateAction<ProposalType[]>>;
  proposalMetadata: any[];
  mergedProposals: any[];
}

const ProposalContext = createContext<ProposalContextType>({
  proposals: [],
  setProposals: () => {},
  proposalMetadata: [],
  mergedProposals: [],
});

export const useProposalContext = (): ProposalContextType =>
  useContext<ProposalContextType>(ProposalContext);

interface ProposalProviderProps {
  children: ReactNode;
}

export const ProposalProvider: React.FC<ProposalProviderProps> = ({
  children,
}) => {
  const [proposals, setProposals] = useState<ProposalType[]>([]);
  const [proposalMetadata, setProposalMetadata] = useState<any[]>([]);
  const [mergedProposals, setMergedProposals] = useState<any[]>([]);

  const loadData = async (): Promise<any> => {
    const proposals = await fetchProposals();
    setProposals((await proposals) as ProposalType[]);
  };

  useEffect(() => {
    loadData().catch((error) => {
      console.error(error);
    });
  }, []);

  // after data is loaded we want to get the metadata from blockchain

  const { odGovernor } = useEtherProviderContext();

  // this function fetches the proposal meta data for each proposal, creates an array of them
  // returns error if not submitted yet
  const fetchProposalMetadata = async (
    proposals: ProposalType[],
    odGovernor: ODGovernorType
  ): Promise<any> => {
    if (proposals === undefined || odGovernor === undefined) return;
    const metadataPromises = proposals.map(async (proposal) => {
      try {
        const proposalId = proposal.proposalId;
        // proposalId = ethers.BigNumber.from(proposalId);
        const metadata = await odGovernor.proposals(proposalId);
        // handle response object
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
        // this is the case where the proposal has not been submitted
        if (error.reason.toString() === 'Governor: unknown proposal id') {
          // default null response object
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
          } = {
            id: proposal.proposalId,
            proposer: '',
            eta: '',
            startBlock: '',
            endBlock: '',
            forVotes: '',
            againstVotes: '',
            abstainVotes: '',
            canceled: '',
            executed: '',
          };
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
        }
        return null;
      }
    });

    const metadataArray = await Promise.all(metadataPromises);
    setProposalMetadata(metadataArray);
  };

  const mergeProposalsWithMetadata = (
    proposals: any[],
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
          : '0';
      return { ...proposal, ...metadata, totalVotes };
    });
  };

  useEffect(() => {
    if (proposals.length > 0 && odGovernor !== null) {
      fetchProposalMetadata(proposals, odGovernor).catch((error) => {
        console.log(error);
      });
    }
  }, [proposals, odGovernor]);

  useEffect(() => {
    const merged = mergeProposalsWithMetadata(proposals, proposalMetadata);
    setMergedProposals(merged);
  }, [proposals, proposalMetadata]);

  return (
    <ProposalContext.Provider
      value={{ proposals, setProposals, proposalMetadata, mergedProposals }}
    >
      {children}
    </ProposalContext.Provider>
  );
};
