import { NextResponse } from "next/server";
import fs from "fs";
import { fetchProposals } from "../../lib/fetchProposals";
import { type ProposalType } from "../../types/proposal";

const TIMELOCK_CONTROLLER_ADDRESS = process.env.TIMELOCK_CONTROLLER_ADDRESS;
const TENDERLY_API_URL = process.env.TENDERLY_API_URL;
const NETWORK_ID = 42161;

const TENDERLY_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Access-Key": process.env.TENDERLY_API_KEY,
};

export async function GET(request: any) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const fork = searchParams.get("fork");

    const proposals = await fetchProposals(true);
    const proposal = proposals.find(
      (proposal: any) => proposal.proposalId === id
    );
    if (!proposal)
      return NextResponse.json({ message: "Proposal not found", status: 404 });

    if (fork) {
      const forkUrl = await forkAndExecute(proposal);
      return NextResponse.json({ url: forkUrl }, { status: 200 });
    } else {
      const simulations = await simulate(proposal);

      const responseData = simulations.map((item: any) => ({
        url: `https://www.tdly.co/shared/simulation/${item.simulation.id}`,
        ...item,
      }));

      return NextResponse.json({ simulations: responseData }, { status: 200 });
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: `Error: ${error}` }, { status: 500 });
  }
}

const postTenderly = async (url: string, body: any) => {
  const options: any = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Access-Key": process.env.TENDERLY_API_KEY,
    },
  };
  let response = null;
  if (body)
    response = await fetch(url, { ...options, body: JSON.stringify(body) });
  else response = await fetch(url, options);
  console.log(url);
  console.log(response.status);
  console.log(response.statusText);
  if (response.status === 204) return response;
  return response.json();
};

const getTenderly = async (url: string) => {
  const options: any = {
    method: "GET",
    headers: TENDERLY_HEADERS,
  };
  const response = await fetch(url, options);
  return response.json();
};

const makeSimulationPublic = async (id: string) => {
  try {
    const url = `${TENDERLY_API_URL}/simulations/${id}/share`;
    await postTenderly(url, null);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const simulate = async (proposal: ProposalType) => {
  try {
    let transactions = [];
    for (let i = 0; i < proposal.targets.length; i++) {
      transactions.push({
        network_id: NETWORK_ID,
        from: TIMELOCK_CONTROLLER_ADDRESS,
        to: proposal.targets[i],
        input: proposal.calldatas[i],
        value: proposal.values[i],
        save: true,
        save_if_fails: true,
        simulation_type: "full",
      });
    }

    const url = `${TENDERLY_API_URL}/simulate-bundle`;

    const data = await postTenderly(url, { simulations: transactions });

    for (const result of data.simulation_results) {
      if (result.simulation.id)
        await makeSimulationPublic(result.simulation.id);
    }

    return data.simulation_results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const fork = async (proposal: ProposalType) => {
  const url = `${TENDERLY_API_URL}/vnets`;
  const body = {
    display_name: `OD Proposal: ${proposal.description.slice(0, 30)}`,
    slug: proposal.slug.replace(/[^a-zA-Z0-9-]/g, "").slice(-8),
    fork_config: {
      network_id: NETWORK_ID,
    },
    virtual_network_config: {
      chain_config: {
        chain_id: NETWORK_ID,
      },
    },
    explorer_page_config: {
      enabled: true,
      verification_visibility: "src",
    },
  };
  const vnetData = await postTenderly(url, body);
  if (vnetData.error) throw vnetData.error.message;
  return vnetData;
};

const executeForkProposal = async (proposal: ProposalType, vnetId: string) => {
  const url = `${TENDERLY_API_URL}/vnets/${vnetId}/transactions`;
  for (let i = 0; i < proposal.targets.length; i++) {
    const body = {
      callArgs: {
        from: TIMELOCK_CONTROLLER_ADDRESS,
        to: proposal.targets[i],
        data: proposal.calldatas[i],
        value: `0x${Number(proposal.values[i]).toString(16)}`,
      },
    };
    await postTenderly(url, body);
  }
};

const forkAndExecute = async (proposal: ProposalType) => {
  try {
    const vnetData = await fork(proposal);

    await executeForkProposal(proposal, vnetData.id);

    return `https://dashboard.tenderly.co/11/sodamachine/testnet/${vnetData.id}`;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
