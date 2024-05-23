'use client'
import {
  type BigNumber,
  ethers,
  type providers,
  type Signer
} from 'ethers'
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount
} from '@web3modal/ethers5/react'
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from 'react'
import { type EtherProviderType } from '../types/EtherProviderType'
import ODGovernorABI from '../abis/ODGovernor.json'
import type ODGovernorType from '../types/ODGovernorType'
import GovernanceToken from '../abis/GovernanceToken.json'

const ProviderContext = createContext<EtherProviderType | undefined>(undefined)

export const useEtherProviderContext = (): EtherProviderType => {
  const context = useContext(ProviderContext)
  if (context === null || context === undefined) {
    throw new Error('useEtherProviderContext must be used within a ProviderProvider')
  }
  return context
}

export const ProviderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { address, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const [provider, setProvider] = useState<providers.Web3Provider | null | providers.JsonRpcProvider>(null)
  const [signer, setSigner] = useState<Signer | null>(null)
  const [odGovernor, setOdGovernor] = useState<ODGovernorType | null>(null)
  const [userVotes, setUserVotes] = useState<string | null>(null)
  const [proposalThreshold, setProposalThreshold] = useState<string | null>(null)

  const loadProvider = async (): Promise<any> => {
    try {
      let ethersProvider
      let signer
      if (walletProvider !== null && walletProvider !== undefined) {
        // provider
        ethersProvider = new ethers.providers.Web3Provider(walletProvider)
        // signer
        signer = ethersProvider.getSigner()
      } else {
        // fallback provider (infura etc, nees environmental var)
        ethersProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_ENDPOINT)
        signer = ethersProvider.getSigner()
      }
      // od gov contract
      const odGovernorAddress = '0xf704735CE81165261156b41D33AB18a08803B86F'
      const odGovernor = new ethers.Contract(
        odGovernorAddress,
        ODGovernorABI.abi,
        signer
      ) as unknown as ODGovernorType
      // proposal threshold
      const proposalThreshold: BigNumber = await odGovernor.proposalThreshold()
      const proposalThresholdFormatted: string = ethers.utils.formatUnits(proposalThreshold.toString(), 18)
      setProposalThreshold(proposalThresholdFormatted)
      // get user votes
      if (process.env.NEXT_PUBLIC_OD_GOVERNANCE_TOKEN !== null && process.env.NEXT_PUBLIC_OD_GOVERNANCE_TOKEN !== undefined) {
        const protocolToken = new ethers.Contract(
          process.env.NEXT_PUBLIC_OD_GOVERNANCE_TOKEN,
          GovernanceToken.abi,
          signer
        )
        const userVotes: string = await protocolToken.getVotes(await signer.getAddress())
        setUserVotes(userVotes.toString())
      }
      setProvider(ethersProvider)
      setSigner(signer)
      setOdGovernor(odGovernor)
    } catch (error) {
      console.error('Error initializing ethers connection:', error)
    }
  }

  useEffect(() => {
    if (!isConnected) return
    loadProvider().catch((error) => { console.error(error) })
  }, [isConnected, walletProvider, address])

  return (
        <ProviderContext.Provider value={{ address, provider, signer, odGovernor, userVotes, proposalThreshold }}>
            {children}
        </ProviderContext.Provider>
  )
}
