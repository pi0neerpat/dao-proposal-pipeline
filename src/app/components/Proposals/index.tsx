import React from "react";
import { Proposal } from "@/app/types/proposal";

interface ProposalsProps{
    proposals: Proposal[] | [];
}

const Proposals:React.FC<ProposalsProps> = ({proposals}) => {
    return(
        <div>proposals</div>
    )
}

export default Proposals;