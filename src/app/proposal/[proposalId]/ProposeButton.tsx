import React, {useState} from "react";
import { useEtherProviderContext } from "@/app/contexts/ProviderContext";
import ODGovernorType from "@/app/types/ODGovernorType";
import { ethers, Signer, Contract } from "ethers";
import { ProposalType } from "@/app/types/proposal";
import Loading from "@/app/components/Loading";

const ProposeButton:React.FC<any> = ({proposal}) => {

    const { signer, odGovernor, userVotes, proposalThreshold } = useEtherProviderContext();

    const [txWaiting, setTxWaiting] = useState<Boolean>(false)
    const [txError, setTxError] = useState<string | null>(null)
    const [txSuccess, setTxSuccess] = useState<string | null>(null)

    const propose = async (e: any, signer: Signer | null, odGovernor: ODGovernorType| null) => {
        e.preventDefault()
        if(odGovernor !== null){
            setTxWaiting(true)
            try{
                const proposeSignature = "propose(address[],uint256[],bytes[],string)"; 
                const tx = await odGovernor?.connect(signer)[proposeSignature](
                    proposal.targets,
                    proposal.values,
                    proposal.calldatas,
                    proposal.description
                );
                await tx.wait();
                setTxSuccess(tx.hash.toString())
            }catch(error: any){
                console.error("Error: " + error)
                setTxError(error.reason.toString())
            }finally{
                setTxWaiting(false)
            }
        }
    }

    const exitTxSuccess = (e: any) => {
        e.preventDefault()
        setTxSuccess(null)
    }

    const exitTxError = (e: any) => {
        e.preventDefault()
        setTxError(null)
    }

    return(
        <div className="propose-container">
            {
                (
                    userVotes === null ||
                    proposalThreshold === null 
                ) &&
                <Loading/>
            }
            {
                userVotes &&
                proposalThreshold &&
                userVotes > proposalThreshold ? (
                    <button 
                        className="propose-button" 
                        type="button" 
                        disabled
                    >
                        Not Enough Votes to Propose
                    </button>
                ) : (
                    <button 
                        className="propose-button-active" 
                        type="button" 
                        onClick={(e) => propose(e, signer, odGovernor)}
                    >
                        Propose
                    </button>
                )
            }
            {
                txError !== null &&
                <div className="propose-error-container">
                    <button
                        className="propose-error-exit-button"
                        onClick={(e) => exitTxError(e)}
                    >
                            x
                        </button>
                    <h2 className="propose-error-title">Error</h2>
                    <div className="propose-error-message">
                        {txError}
                    </div>
                </div>
            }
            {
                txWaiting === true &&
                <div className="propose-waiting-container">
                    <div className="propose-waiting-title">
                        Waiting for Your Transaction to Complete...
                    </div>
                </div>
            }
            {
                txSuccess !== null &&
                <div className="tx-success-container">
                    <button 
                        type="button" 
                        className="tx-success-exit"
                        onClick={(e) => exitTxSuccess(e)}
                    >
                        x
                    </button>
                    <div className="tx-success-title">
                        Transaction was Successful!
                    </div>
                    <a 
                        href={`https://arbiscan.io/tx/${txSuccess}`}
                        target="_blank"
                    >
                        View Transaction
                    </a>
                </div>
            }
        </div>
    )
}

export default ProposeButton