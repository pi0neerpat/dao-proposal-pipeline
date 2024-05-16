import { 
    ethers, 
    Signer, 
    providers 
} from "ethers";

export interface EtherProviderType {
    address: string | null | undefined;
    provider: providers.Web3Provider | null | undefined;
    signer: Signer | null;
}