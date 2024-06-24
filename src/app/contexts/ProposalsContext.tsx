'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from 'react'
import { type ProposalType } from '../types/proposal'
import { fetchProposals } from '../lib/fetchProposals'
import { useEtherProviderContext } from '@/app/contexts/ProviderContext'
import type ODGovernorType from '@/app/types/ODGovernorType'

interface ProposalContextType {
  proposals: ProposalType[]
  setProposals: React.Dispatch<React.SetStateAction<ProposalType[]>>
  proposalMetadata: any[]
  mergedProposals: any[]
}

const ProposalContext = createContext<ProposalContextType>({
  proposals: [],
  setProposals: () => {},
  proposalMetadata: [],
  mergedProposals: []
})

export const useProposalContext = (): ProposalContextType => useContext<ProposalContextType>(ProposalContext)

interface ProposalProviderProps {
  children: ReactNode
}

export const ProposalProvider: React.FC<ProposalProviderProps> = ({ children }) => {
  const [proposals, setProposals] = useState<ProposalType[]>([])
  const [proposalMetadata, setProposalMetadata] = useState<any[]>([])
  const [mergedProposals, setMergedProposals] = useState<any[]>([])

  const { odGovernor } = useEtherProviderContext()

  const loadData = async (): Promise<void> => {
    try {
      const fetchedProposals = await fetchProposals() as ProposalType[]
      setProposals(fetchedProposals)

      if (odGovernor) {
        const metadataPromises = fetchedProposals.map(async (proposal) => {
          try {
            const proposalId = proposal.proposalId
            const metadata = await odGovernor.proposals(proposalId)
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
              executed
            } = metadata
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
              executed
            }
          } catch (error: any) {
            if (error.reason.toString() === 'Governor: unknown proposal id') {
              return {
                id: proposal.proposalId,
                proposer: '',
                eta: '',
                startBlock: '',
                endBlock: '',
                forVotes: '',
                againstVotes: '',
                abstainVotes: '',
                canceled: '',
                executed: ''
              }
            }
            return null
          }
        })

        const metadataArray = await Promise.all(metadataPromises)
        setProposalMetadata(metadataArray)

        const merged = mergeProposalsWithMetadata(fetchedProposals, metadataArray)
        setMergedProposals(merged)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const mergeProposalsWithMetadata = (
    proposals: ProposalType[],
    proposalMetadata: any[]
  ) => {
    return proposals.map((proposal) => {
      const metadata = proposalMetadata.find(
        (md) => md.id === proposal.proposalId
      )

      const totalVotes =
        metadata?.forVotes && metadata?.againstVotes
          ? (
            BigInt(metadata?.forVotes) + BigInt(metadata?.againstVotes)
          ).toString()
          : '0'
      return { ...proposal, ...metadata, totalVotes }
    })
  }

  useEffect(() => {
    loadData()
  }, [odGovernor])

  return (
    <ProposalContext.Provider value={{ proposals, setProposals, proposalMetadata, mergedProposals }}>
      {children}
    </ProposalContext.Provider>
  )
}
