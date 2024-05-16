'use client'

import React, {
    useState,
    useEffect
} from "react";
import { useProposalContext } from "@/app/contexts/ProposalsContext";
import { ProposalType } from "@/app/types/proposal";

interface ProposalPageProps {
    params: {
        proposalId: string;
    };
}

const ProposalPage:React.FC<ProposalPageProps> = ({params}) => {

    const {proposals, setProposals} = useProposalContext()

    // determin current proposal by id
    const [currentProposal, setCurrentProposal] = useState<ProposalType | null>(null)
    const getCurrentProposal = () => {
        const currentProposal = proposals.filter((proposal) => {
            return proposal.proposalId.toString() === decodeURIComponent(params.proposalId.toString())
        })
        if(currentProposal !== null){
            setCurrentProposal(currentProposal[0])
        }
    }
    useEffect(() => {
        getCurrentProposal()
        console.log(proposals)
    },[proposals])

    const propose = () => {
        // propose logic here
    }



    return(
        <div className="proposal-page">
            <h1 className="proposal-description">
                Proposal: {currentProposal?.description}
            </h1>
            <h2 className="proposal-id">
                Proposal ID: {currentProposal?.proposalId.toString().slice(0,10)}...
            </h2>
            <div className="proposal-type">
                Proposal Type: {currentProposal?.proposalType}
            </div>
            <ul className="call-data-list">
                <h2 className="call-data-title">Call Data</h2>
                {
                    currentProposal &&
                    currentProposal?.calldatas.length > 0 &&
                    currentProposal.calldatas.map((calldata, index) => (
                        <li 
                            className="call-data"
                            key={index}
                        >
                            {calldata.toString()}
                        </li>
                    ))
                }
            </ul>
            <ul className="targets-list">
                <h2 className="targets-title">Targets</h2>
                {
                    currentProposal &&
                    currentProposal?.targets.length > 0 &&
                    currentProposal.targets.map((target, index) => (
                        <li 
                            className="target"
                            key={index}
                        >
                            {target.toString()}
                        </li>
                    ))
                }
            </ul>
            <ul className="values-list">
                <h2 className="values-title">Values</h2>
                {
                    currentProposal &&
                    currentProposal?.values.length > 0 &&
                    currentProposal.values.map((value, index) => (
                        <li 
                            className="value"
                            key={index}
                        >
                            {value.toString()}
                        </li>
                    ))
                }
            </ul>
            <div className="propose-button-container">
                <button className="propose-button" onClick={() => propose()}>
                    Propose
                </button>
            </div>
        </div>
    )
}

export default ProposalPage;