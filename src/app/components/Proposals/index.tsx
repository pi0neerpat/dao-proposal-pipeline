'use client'
import React, {
    useState,
    useEffect
} from "react";
import { ProposalType } from "@/app/types/proposal";
import Proposal from "./Proposal";
import { useEtherProviderContext } from "@/app/contexts/ProviderContext";
import { ethers } from "ethers";


interface ProposalsProps{
    proposals: ProposalType[];
}

const Proposals:React.FC<ProposalsProps> = ({proposals}) => {

    const [isSubmitted, setIsSubmitted] = useState<boolean[]>([])

    const { address, provider, signer, odGovernor } = useEtherProviderContext();
    
    const fetchProposalSubmission = async (proposals, odGovernor) => {
        if(!proposals || !odGovernor) return;
        //console.log(proposals)
        const submissionsPromises = proposals.map(async (proposal) => {
            try {
                let proposalId = proposal.proposalId;
                console.log(proposalId)
                //proposalId = ethers.BigNumber.from(proposalId);
                const submitted = await odGovernor.proposals(proposalId);
                console.log("submitted: "+  await submitted)
                return submitted;
            } catch (error) {
                console.error("Error encountered fetching proposal submission states: ", error.toString());
                return null;
            }
        });

        const submissions = await Promise.all(submissionsPromises);
        setIsSubmitted(submissions)
    }
    useEffect(() => {
        if (proposals.length > 0 && odGovernor) {
            fetchProposalSubmission(proposals, odGovernor);
          }
    },[proposals, odGovernor])
    console.log(isSubmitted)
    return(
        <ul className="proposals-list">
            <div className="proposals-header">
                <h2>Proposals</h2>
            </div>
            {
                proposals.map((proposal, index) => {
                    return(
                        <Proposal
                            index={index}
                            key={index}
                        />
                    )
                })
            }
        </ul>
    )
}

export default Proposals;