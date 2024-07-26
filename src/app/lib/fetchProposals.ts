import { type ProposalType } from "../types/proposal";

// this script fetches proposal data from github
const fetchProposalNames = async (noCache: boolean): Promise<any> => {
  // Server side must restrict caching, otherwise Github returns stale data
  let headers: any = noCache
    ? {
        cache: "no-store",
        "cache-Control": "no-cache",
        Authorization: `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
      }
    : {};
  const response = await fetch(
    "https://api.github.com/repos/open-dollar/od-governance-manager/contents/gov-output/mainnet",
    {
      headers,
    }
  );
  const data = await response.json();
  return data.map((file: any) => {
    return {
      name: file.name,
      download_url: file.download_url,
    };
  });
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
