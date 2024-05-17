'use client'
import { ethers, providers, Signer, Contract } from "ethers";
import { 
    useWeb3ModalProvider, 
    useWeb3ModalAccount 
} from "@web3modal/ethers5/react";
import React, {
    createContext,
    useContext, 
    useState, 
    useEffect,
    ReactNode
} from "react";
import { EtherProviderType } from "../types/EtherProviderType";
import ODGovernorABI from '../abis/ODGovernor.json'
import ODGovernorType from "../types/ODGovernorType";


const ProviderContext = createContext<EtherProviderType | undefined>(undefined);

export const useEtherProviderContext = () => {
    const context = useContext(ProviderContext);
    if (!context) {
        throw new Error('useEtherProviderContext must be used within a ProviderProvider');
    }
    return context;
};

export const ProviderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const { address, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
    const [signer, setSigner] = useState<Signer | null>(null);
    const [odGovernor, setOdGovernor] = useState<ODGovernorType | null>(null)

    const loadProvider = async () => {
        try {
            if(walletProvider){
                const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
                const signer = ethersProvider.getSigner();
                const odGovernorAddress = "0xf704735CE81165261156b41D33AB18a08803B86F"
                const odGovernor = new ethers.Contract(
                    odGovernorAddress,
                    ODGovernorABI.abi,
                    signer
                ) as unknown as ODGovernorType
                setProvider(ethersProvider);
                setSigner(signer);
                setOdGovernor(odGovernor)
            }
          } catch (error) {
            console.error('Error initializing ethers connection:', error);
          }
    }

    useEffect(() => {
        if (!isConnected) return;
        loadProvider()

    },[isConnected, walletProvider, address])

    return(
        <ProviderContext.Provider value={{ address, provider, signer, odGovernor }}>
            {children}
        </ProviderContext.Provider>
    )

}
