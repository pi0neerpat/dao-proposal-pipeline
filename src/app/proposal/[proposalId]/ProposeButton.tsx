import React, { useState, useEffect, useRef } from "react";
import { useEtherProviderContext } from "@/app/contexts/ProviderContext";
import type ODGovernorType from "@/app/types/ODGovernorType";
import { type Signer } from "ethers";
import Loading from "@/app/components/Loading";

const ProposeButton: React.FC<any> = ({ proposal }) => {
  const {
    address,
    provider,
    signer,
    odGovernor,
    userVotes,
    proposalThreshold,
  } = useEtherProviderContext();

  const [txWaiting, setTxWaiting] = useState<boolean>(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState<string | null>(null);

  const propose = async (
    e: any,
    signer: Signer | null,
    odGovernor: ODGovernorType | null
  ): Promise<void> => {
    e.preventDefault();
    if (odGovernor !== null) {
      setTxWaiting(true);
      try {
        const proposeSignature = "propose(address[],uint256[],bytes[],string)";
        const tx = await odGovernor
          ?.connect(signer)
          [proposeSignature](
            proposal.targets,
            proposal.values,
            proposal.calldatas,
            proposal.description
          );
        await tx.wait();
        setTxSuccess(tx.hash.toString() as string);
      } catch (error: any) {
        console.error("Error: " + error);
        setTxError(error.reason.toString() as string);
      } finally {
        setTxWaiting(false);
      }
    }
  };

  const exitTxSuccess = (e: any): void => {
    e.preventDefault();
    setTxSuccess(null);
  };

  const exitTxError = (e: any): void => {
    e.preventDefault();
    setTxError(null);
  };
  // handle clicking outside
  const errorDivRef = useRef<HTMLDivElement>(null);
  const successDivRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent): void => {
    if (
      errorDivRef.current !== null &&
      !errorDivRef.current.contains(event.target as Node)
    ) {
      setTxError(null);
    }
    if (
      successDivRef.current !== null &&
      !successDivRef.current.contains(event.target as Node)
    ) {
      setTxSuccess(null);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log(userVotes, proposalThreshold);

  const Status = () => (
    <div className="balances">
      {address === null ||
      provider === null ||
      address === undefined ||
      provider === undefined ? (
        <div>No Web3 Connection</div>
      ) : userVotes === null || proposalThreshold === null ? (
        <Loading />
      ) : (
        address !== "" &&
        userVotes !== null &&
        proposalThreshold !== null && (
          <div>
            {userVotes > proposalThreshold
              ? "You have enough voting power!"
              : "You do NOT have enough voting power."}

            {` You have ${userVotes.toFixed(0)} votes.`}
          </div>
        )
      )}
    </div>
  );

  return (
    <div className="propose-container">
      Voting power must remain above the minimum proposal threshold until the
      vote is passed and queued.
      <br /> <i>Minimum proposal threshold: {proposalThreshold?.toFixed(0)}</i>
      <Status />
      <div className="button-and-balance">
        <div className="button-container">
          {userVotes !== null &&
          proposalThreshold !== null &&
          userVotes < proposalThreshold ? (
            <button className="propose-button" type="button" disabled>
              Propose
            </button>
          ) : (
            <button
              className="propose-button-active"
              type="button"
              onClick={(e) => {
                propose(e, signer, odGovernor).catch((error) => {
                  console.error(error);
                });
              }}
            >
              Propose
            </button>
          )}
        </div>
      </div>
      {txError !== null && (
        <div className="propose-error-container" ref={errorDivRef}>
          <button
            className="propose-error-exit-button"
            onClick={(e) => {
              exitTxError(e);
            }}
          >
            x
          </button>
          <h2 className="propose-error-title">Error</h2>
          <div className="propose-error-message">{txError}</div>
        </div>
      )}
      {txWaiting && (
        <div className="propose-waiting-container">
          <div className="propose-waiting-title">
            Waiting for Your Transaction to Complete...
          </div>
        </div>
      )}
      {txSuccess !== null && (
        <div className="tx-success-container" ref={successDivRef}>
          <button
            type="button"
            className="tx-success-exit"
            onClick={(e) => {
              exitTxSuccess(e);
            }}
          >
            x
          </button>
          <div className="tx-success-title">Transaction was Successful!</div>
          <a
            href={`https://arbiscan.io/tx/${txSuccess}`}
            target="_blank"
            rel="noreferrer"
          >
            View Transaction
          </a>
        </div>
      )}
    </div>
  );
};

export default ProposeButton;
