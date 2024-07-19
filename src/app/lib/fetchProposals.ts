import { type ProposalType } from "../types/proposal";

// this script fetches proposal data from github
const fetchProposalNames = async (noCache: boolean): Promise<any> => {
  let headers: any = noCache ? { "cache-Control": "no-cache" } : {}; // Server side must be no-cache, otherwise Github will return old data!
  const response = await fetch(
    "https://api.github.com/repos/open-dollar/od-governance-manager/contents/gov-output/mainnet",
    {
      headers,
    }
  );
  const data = await response.json();
  return data.map((file: any) => ({
    name: file.name,
    download_url: file.download_url,
  }));
};

export const fetchProposals = async (noCache: boolean): Promise<any> => {
  const proposalNames = await fetchProposalNames(noCache);
  const proposals: ProposalType[] = [];
  for (let i = 0; i < proposalNames.length; i++) {
    const response = await fetch(proposalNames[i].download_url as string);
    const proposalData: ProposalType = await response.json();
    proposalData.slug = proposalNames[i].name.split(".")[0];
    proposals.push(proposalData);
  }
  return proposals;
};
