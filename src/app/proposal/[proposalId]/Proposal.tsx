"use client";

import { useProposalContext } from "@/app/contexts/ProposalsContext";
import { type ProposalType } from "@/app/types/proposal";
import convertTokensToThousandsK from "@/app/lib/convertTokensToThousansK";
import fetchABI from "@/app/lib/fetchABI";
import decodeCallData from "@/app/lib/decodeCallData";
import CallData from "./CallData";
import ProposeButton from "./ProposeButton";
import React, { useState, useEffect } from "react";
import Simluation from "./Simulation";
import Loader from "@/app/components/Loader";
import Fork from "./Fork";

interface ProposalPageProps {
  params: {
    proposalId: string;
  };
}

const Proposal: React.FC<ProposalPageProps> = ({ params }) => {
  const [decodedCallData, setDecodedCallData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentMetadata, setCurrentMetadata] = useState<any | null>(null);
  const [currentProposal, setCurrentProposal] = useState<ProposalType | null>(
    null
  );
  const [targetABIs, setTargetABIs] = useState<any[] | null>(null);

  const { proposals } = useProposalContext();

  // determin current proposal by id

  const getCurrentProposal = (): any => {
    const currentProposal = proposals.filter((proposal) => {
      return (
        proposal.proposalId.toString() ===
        decodeURIComponent(params.proposalId.toString())
      );
    });
    if (currentProposal !== null) {
      setCurrentProposal(currentProposal[0]);
    }
  };
  useEffect(() => {
    if (proposals !== null && proposals !== undefined) {
      getCurrentProposal();
    }
  }, [proposals]);

  // get current proposal metadata using current proposal
  const filterCurrentMetadata = (proposalMetadata: any[]): any => {
    const currentMetadata = proposalMetadata.filter((metadata: any) => {
      return metadata.id === currentProposal?.proposalId;
    });
    if (currentMetadata.length > 0) {
      setCurrentMetadata(currentMetadata[0]);
    }
  };
  useEffect(() => {
    if (currentProposal !== null && proposals.length > 0) {
      filterCurrentMetadata(proposals);
    }
  }, [currentProposal]);

  // this gets abis for each of our targets so we can decode call data
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const pullAllTargetABIs = async (
    currentProposal: ProposalType
  ): Promise<any> => {
    if (currentProposal !== null && currentProposal.targets.length > 0) {
      const fetchedABIs = [];
      for (const target of currentProposal.targets) {
        try {
          const abi = await fetchABI(target);
          fetchedABIs.push(abi ? JSON.parse(abi as string) : null);
        } catch (error) {
          fetchedABIs.push(null);
        }
        await delay(200); // Adding a 200ms delay between each request
      }
      setTargetABIs(fetchedABIs);
    }
  };

  useEffect(() => {
    if (
      currentProposal !== null &&
      currentProposal !== undefined &&
      currentProposal.targets.length > 0
    ) {
      pullAllTargetABIs(currentProposal).catch((error) => {
        console.error(error);
      });
    }
  }, [currentProposal]);

  // this makes our calldatas from our currentMetadata a human readable format
  useEffect(() => {
    if (
      currentProposal !== null &&
      currentProposal?.calldatas.length > 0 &&
      targetABIs !== null &&
      targetABIs?.length > 0
    ) {
      const decodedCallDatas = currentProposal.calldatas.map(
        (calldata, index) => {
          return decodeCallData(calldata, targetABIs[index]);
        }
      );
      setDecodedCallData(decodedCallDatas);
      setLoading(false);
    }
  }, [targetABIs]);

  if (loading) {
    return (
      <div className="proposal-page container loader-container">
        <Loader width="160px" />
      </div>
    );
  }

  return (
    <div className="proposal-page container">
      <div className="proposal-page-block-row">
        <div className="proposal-page-block">
          <h3 className="proposal-page-title">Overview</h3>
          <div className="proposal-page-container">
            <div className="proposal-page-item">
              <div className="proposal-page-label">Description</div>
              <div className="proposal-page-value">
                {currentProposal?.description}
              </div>
            </div>

            <div className="proposal-page-item">
              <div className="proposal-page-label">Proposal ID</div>
              <div className="proposal-page-value">
                {currentProposal?.proposalId}
              </div>
            </div>

            <div className="proposal-page-item">
              <div className="proposal-page-label">Type</div>
              <div className="proposal-page-value">
                {currentProposal?.proposalType}
              </div>
            </div>

            <div className="proposal-page-item">
              <div className="proposal-page-label">Status</div>
              <div className="proposal-page-value">
                {currentMetadata !== null && currentMetadata.proposer === ""
                  ? "Unsubmitted"
                  : "Submitted"}
              </div>
            </div>
          </div>
        </div>

        {currentMetadata !== null && currentMetadata.proposer !== "" && (
          <div className="proposal-page-block">
            <h3 className="proposal-page-title">Voting</h3>
            <div className="proposal-page-container">
              <div className="proposal-page-item">
                <div className="proposal-page-label">Status</div>
                <div className="proposal-page-value">
                  {currentMetadata !== null &&
                    currentMetadata.proposer !== "" &&
                    currentMetadata.executed === true && (
                      <div className="proposal-page-executed">Executed</div>
                    )}
                  {currentMetadata !== null &&
                    currentMetadata.proposer !== "" &&
                    currentMetadata.cancelled === true && (
                      <div className="proposal-page-cancelled">Cancelled</div>
                    )}
                  {currentMetadata !== null &&
                    currentMetadata.proposer !== "" &&
                    currentMetadata.executed === false &&
                    currentMetadata.cancelled === false && (
                      <div className="proposal-page-pending">Pending</div>
                    )}
                </div>
              </div>

              <div className="proposal-page-item">
                <div className="proposal-page-label">For</div>
                <div className="proposal-page-value">
                  {currentMetadata !== null && currentMetadata.proposer !== ""
                    ? `${convertTokensToThousandsK(
                        currentMetadata.forVotes as string
                      )}`
                    : ""}
                </div>
              </div>

              <div className="proposal-page-item">
                <div className="proposal-page-label">Against</div>
                <div className="proposal-page-value">
                  {currentMetadata !== null && currentMetadata.proposer !== ""
                    ? `${convertTokensToThousandsK(
                        currentMetadata.againstVotes as string
                      )}`
                    : ""}
                </div>
              </div>

              <div className="proposal-page-item">
                <div className="proposal-page-label">Total</div>
                <div className="proposal-page-value">
                  {currentMetadata !== null && currentMetadata.proposer !== ""
                    ? `${convertTokensToThousandsK(
                        (currentMetadata.againstVotes +
                          currentMetadata.forVotes) as string
                      )}`
                    : ""}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="proposal-page-block">
        <h3 className="proposal-page-title">Execution</h3>
        <ul className="call-data-list">
          {currentProposal !== null &&
            currentProposal?.calldatas.length > 0 &&
            decodedCallData !== null &&
            decodedCallData.length > 0 &&
            decodedCallData.map((calldata, index) => (
              <li className="call-data" key={index}>
                <CallData
                  calldata={calldata}
                  index={index}
                  currentProposal={currentProposal}
                />
              </li>
            ))}
        </ul>
      </div>

      <div className="proposal-page-block">
        <h3 className="proposal-page-title">Simulate</h3>
        <div className="proposal-page-container">
          Simulate the proposal passing using Tenderly.
          <Simluation proposalId={currentMetadata.id} />
          Fork Arbitrum and execute the proposal to get a virtual testnet RPC.
          <Fork proposalId={currentMetadata.id} />
        </div>
      </div>

      <div className="proposal-page-block">
        <h3 className="proposal-page-title">Propose</h3>
        <div className="proposal-page-container">
          <ProposeButton proposal={currentProposal} />
        </div>
      </div>
    </div>
  );
};

export default Proposal;
