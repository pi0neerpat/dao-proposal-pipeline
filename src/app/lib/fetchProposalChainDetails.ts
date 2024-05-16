import { ethers } from "ethers";
import { 
    useWeb3ModalProvider, 
    useWeb3ModalAccount 
} from "@web3modal/ethers5/react";
import { useEtherProviderContext } from "../contexts/ProviderContext";


const fetchProposalChainDetails = async () => {


    // const { address, chainId, isConnected } = useWeb3ModalAccount()
    // const { walletProvider } = useWeb3ModalProvider()
    // const ethersProvider = new BrowserProvider(walletProvider)
    // const signer = await ethersProvider.getSigner()

}

export default fetchProposalChainDetails;