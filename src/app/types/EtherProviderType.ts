import {
  type Signer,
  type providers
} from 'ethers'
import type ODGovernorType from './ODGovernorType'

export interface EtherProviderType {
  address: string | null | undefined
  provider: providers.Web3Provider | null | undefined | providers.JsonRpcProvider
  signer: Signer | null
  odGovernor: ODGovernorType | null
  userVotes: string | null
  proposalThreshold: string | null
}
