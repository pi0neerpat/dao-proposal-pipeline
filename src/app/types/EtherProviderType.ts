import { 
    ethers, 
    Signer, 
    providers 
} from "ethers";
import ODGovernorType from "./ODGovernorType";

export interface EtherProviderType {
    address: string | null | undefined;
    provider: providers.Web3Provider | null | undefined;
    signer: Signer | null;
    odGovernor: ODGovernorType | null;
    userVotes: number | null;
    proposalThreshold: number | null;
}