import { NextResponse } from "next/server";
import fs from "fs";

const OD_GOVERNOR_ADDRESS = "0xf704735CE81165261156b41D33AB18a08803B86F";
const TIMELOCK_CONTROLLER_ADDRESS =
  "0x7A528eA3E06D85ED1C22219471Cf0b1851943903";

export async function GET(request: any) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const proposals = await fetchProposals();
    const proposal = proposals.find((proposal) => proposal.proposalId === id);
    if (!proposal)
      return NextResponse.json({ message: "Proposal not found", status: 404 });

    const simulations = await simulate(proposal);
    fs.writeFileSync("simulations.json", JSON.stringify(simulations, null, 2));
    const urls = simulations.map(
      (simulation) =>
        `https://www.tdly.co/shared/simulation/${simulation.simulation.id}`
    );

    return NextResponse.json({ simulations: urls }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

const makeSimulationPublic = async (id: string) => {
  const url = `https://api.tenderly.co/api/v1/account/11/project/sodamachine/simulations/${id}/share`;
  const options: any = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Access-Key": process.env.TENDERLY_API_KEY,
    },
  };

  try {
    const response = await fetch(url, options);
    if (response.status !== 204)
      throw new Error("Failed to make simulation public");
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
        network_id: "42161",
        from: TIMELOCK_CONTROLLER_ADDRESS,
        to: proposal.targets[i],
        input: proposal.calldatas[i],
        value: proposal.values[i],
        save: true,
        save_if_fails: true,
        simulation_type: "full",
      });
    }

    const url =
      "https://api.tenderly.co/api/v1/account/11/project/sodamachine/simulate-bundle";
    const options: any = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Access-Key": process.env.TENDERLY_API_KEY,
      },
      body: JSON.stringify({ simulations: transactions }),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    if (data.error) throw data.error.message;

    for (const result of data.simulation_results) {
      await makeSimulationPublic(result.simulation.id);
    }

    return data.simulation_results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

interface ProposalType {
  calldatas: string[];
  chainid: number;
  description: string;
  descriptionHash: string;
  network: string;
  odGovernor: string;
  proposalId: string | bigint;
  proposalType: string;
  targets: string[];
  values: number[];
  arrayLength?: number; // This key is optional (shows up in the second proposal but not the first)
}

const fetchProposals = async () => {
  const response = await fetch(
    "https://api.github.com/repos/open-dollar/od-governance-manager/contents/gov-output/mainnet?ref=main"
  );

  const data = await response.json();
  const proposalNames = data.map((file: any) => ({
    name: file.name,
    download_url: file.download_url,
  }));
  const proposals: ProposalType[] = [];
  for (let i = 0; i < proposalNames.length; i++) {
    let response = await fetch(proposalNames[i].download_url as string);
    // response as json converts proposal id to scientific notation and rounds it :(
    const data = await response.text();
    let proposalIdString: string | undefined | bigint = "";
    const lines = data.split("\n");
    lines.forEach((line) => {
      const [key, value] = line.split(":").map((part) => part.trim());
      if (key === '"proposalId"') {
        // remove hanging comma
        proposalIdString = BigInt(value.slice(0, -1));
        proposalIdString = proposalIdString.toString();
      }
    });
    response = await fetch(proposalNames[i].download_url as string);
    const proposalData: ProposalType = await response.json();

    proposalData.proposalId = proposalIdString;
    proposals.push(proposalData);
  }
  return proposals;
};
