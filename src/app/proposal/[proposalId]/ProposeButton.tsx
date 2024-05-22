import React, {
    useState,
    useEffect,
    useRef
} from "react";
import { useEtherProviderContext } from "@/app/contexts/ProviderContext";
import ODGovernorType from "@/app/types/ODGovernorType";
import { Signer } from "ethers";
import Loading from "@/app/components/Loading";

const ProposeButton:React.FC<any> = ({proposal}) => {

    const { address, provider, signer, odGovernor, userVotes, proposalThreshold } = useEtherProviderContext();

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
    //handle clicking outside
    const errorDivRef = useRef<HTMLDivElement>(null);
    const successDivRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = (event: MouseEvent) => {
        if (errorDivRef.current && !errorDivRef.current.contains(event.target as Node)) {
            setTxError(null);
        }
        if (successDivRef.current && !successDivRef.current.contains(event.target as Node)) {
            setTxSuccess(null);
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return(
        <div className="propose-container">
            <div className="button-and-balance">
                <div className="button-container">
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
                </div>
                <div className="balances">
                    {
                        (
                            !address || !provider ? (
                                <div>No Web3 Connection</div>
                            ) : (
                                userVotes === null ||
                                proposalThreshold === null
                            ) ? (
                                <Loading/>
                            ) : (
                                (
                                    address &&
                                    userVotes !== null &&
                                    proposalThreshold !== null &&
                                    userVotes > proposalThreshold
                                ) ? (
                                    <a 
                                        href={`https://arbiscan.io/address/${process.env.NEXT_PUBLIC_OD_GOVERNANCE_TOKEN}`}
                                        target="_blank"
                                    >
                                        {`${address?.slice(0,6)}... Has ${userVotes} Votes (${proposalThreshold} Votes Required to Propose)`}
                                    </a>
                                ) : (
                                    <a 
                                        href={`https://arbiscan.io/address/${process.env.NEXT_PUBLIC_OD_GOVERNANCE_TOKEN}`}
                                        target="_blank"
                                    >
                                        {`You Do NOT Have Enough Votes to Propose. (${address?.slice(0,6)}... Has ${userVotes} Votes, Need at Least ${proposalThreshold})`}
                                    </a>
                                )
                            )
                        )
                        
                    }
                </div>
            </div>
            {
                txError !== null &&
                <div 
                    className="propose-error-container"
                    ref={errorDivRef}
                >
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
                <div 
                    className="tx-success-container"
                    ref={successDivRef}
                >
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