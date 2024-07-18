import { type ProposalType } from "../types/proposal";

// this script fetches proposal data from github
const fetchProposalNames = async (): Promise<any> => {
  const response = await fetch(
    "https://api.github.com/repos/open-dollar/od-governance-manager/contents/gov-output/mainnet?ref=main"
  );
  const data = await response.json();
  return data.map((file: any) => ({
    name: file.name,
    download_url: file.download_url,
  }));
};

export const fetchProposals = async (): Promise<any> => {
  const proposalNames = await fetchProposalNames();
  const proposals: ProposalType[] = [];
  for (let i = 0; i < proposalNames.length; i++) {
    const response = await fetch(proposalNames[i].download_url as string);
    const proposalData: ProposalType = await response.json();
    console.log(proposalData);
    proposalData.slug = proposalNames[i].name.split(".")[0];
    proposals.push(proposalData);
  }
  return proposals;
};
