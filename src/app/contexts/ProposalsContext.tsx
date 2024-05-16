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

interface ProposalContextType {
  proposals: ProposalType[];
  setProposals: React.Dispatch<React.SetStateAction<ProposalType[]>>;
}

const ProposalContext = createContext<ProposalContextType>({
  proposals: [],
  setProposals: () => {}
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

  return (
    <ProposalContext.Provider value={{ proposals, setProposals }}>
      {children}
    </ProposalContext.Provider>
  );
};
