"use client"


import React, { 
    createContext, 
    useContext, 
    useState, 
    useEffect,
    ReactNode 
} from 'react';
import { ProposalType } from '../types/proposal';
import { fetchProposals } from '../lib/fetchProposals';
import { useEtherProviderContext } from "@/app/contexts/ProviderContext";
import { ethers } from "ethers";
import ODGovernorType from "@/app/types/ODGovernorType";

interface ProposalContextType {
  proposals: ProposalType[];
  setProposals: React.Dispatch<React.SetStateAction<ProposalType[]>>;
  proposalMetadata: any[]
}

const ProposalContext = createContext<ProposalContextType>({
  proposals: [],
  setProposals: () => {},
  proposalMetadata: []
});

export const useProposalContext = () => useContext(ProposalContext);

interface ProposalProviderProps {
    children: ReactNode;
  }

export const ProposalProvider: React.FC<ProposalProviderProps> = ({ children }) => {
  const [proposals, setProposals] = useState<ProposalType[]>([]);
  const loadData = async () => {
    let proposals = await fetchProposals()
    setProposals(await proposals)
  }


  useEffect(() => {
    loadData()
  }, [])

  // after data is loaded we want to get the metadata from blockchain
  const [proposalMetadata, setProposalMetadata] = useState<any[]>([])

  const { address, provider, signer, odGovernor } = useEtherProviderContext();
  
  // this function fetches the proposal meta data for each proposal, creates an array of them
  // returns error if not submitted yet
  const fetchProposalMetadata = async (
      proposals: ProposalType[], 
      odGovernor: ODGovernorType
  ) => {
      if(!proposals || !odGovernor) return;
      const metadataPromises = proposals.map(async (proposal) => {
          try {
              let proposalId = proposal.proposalId;
              console.log(proposalId)
              //proposalId = ethers.BigNumber.from(proposalId);
              const metadata = await odGovernor.proposals(proposalId);
              console.log("metadata: "+  await metadata)
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
              if(error.reason.toString() === 'Governor: unknown proposal id'){
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
                          "id": proposal.proposalId,
                          "proposer": "",
                          "eta": "",
                          "startBlock": "",
                          "endBlock": "",
                          "forVotes": "",
                          "againstVotes": "",
                          "abstainVotes": "",
                          "canceled": "",
                          "executed": "",   
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
              };
              return null;
          }
      });

        const metadataArray = await Promise.all(metadataPromises);
        setProposalMetadata(metadataArray)
    }
    useEffect(() => {
        if (proposals.length > 0 && odGovernor) {
            fetchProposalMetadata(proposals, odGovernor);
          }
    },[proposals, odGovernor])

  return (
    <ProposalContext.Provider value={{ proposals, setProposals, proposalMetadata}}>
      {children}
    </ProposalContext.Provider>
  );
};
