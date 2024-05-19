import React from "react";
import { useEtherProviderContext } from "@/app/contexts/ProviderContext";
import ODGovernorType from "@/app/types/ODGovernorType";
import { ethers, Signer, Contract } from "ethers";
import { ProposalType } from "@/app/types/proposal";

const ProposeButton:React.FC<any> = ({proposal}) => {

    const { address, provider, signer, odGovernor } = useEtherProviderContext();

    const propose = async (e: any, signer: Signer | null, odGovernor: ODGovernorType | null) => {
        e.preventDefault()
        if(odGovernor !== null){
            const proposeSignature = "propose(address[],uint256[],bytes[],string)"; 
            const tx = await odGovernor?.connect(signer)[proposeSignature](
                proposal.targets,
                proposal.values,
                proposal.calldatas,
                proposal.description
            );
            await tx.wait();
        }
    }

    return(
        <button className="propose-button" type="button" onClick={(e) => propose(e, signer, odGovernor)}>
            Propose
        </button>
    )
}

export default ProposeButton