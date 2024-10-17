import { type ProposalType } from "../types/proposal";

const GITHUB_REPO_API: string = `${
  process.env.NEXT_PUBLIC_GITHUB_REPO_API
}?_=${new Date().getTime()}`; // Append timestamp to prevent caching

const fetchProposalNames = async (noCache: boolean): Promise<any> => {
  let headers: any = noCache
    ? {
        cache: "no-store",
        "cache-Control": "no-cache",
        Authorization: `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
        // ...(etag && { 'If-None-Match': etag }), // Add ETag if available
      }
    : {};

  try {
    const response = await fetch(GITHUB_REPO_API, { headers });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    const newEtag = response.headers.get("ETag"); // Get the new ETag from the response
    console.log("API Response Data:", data); // Log the full response data

    return { data, etag: newEtag }; // Return both data and ETag
  } catch (error) {
    console.error("Error fetching proposal names:", error);
    throw error; // Rethrow the error after logging
  }
};

export const fetchProposals = async (noCache: boolean): Promise<any> => {
  const { data: proposalNames } = await fetchProposalNames(noCache);
  const proposals: ProposalType[] = [];
  for (let i = 0; i < proposalNames.length; i++) {
    try {
      const response = await fetch(proposalNames[i].download_url as string);
      if (!response.ok) {
        throw new Error(`Error fetching proposal data: ${response.statusText}`);
      }
      const proposalData: ProposalType = await response.json();
      proposalData.slug = proposalNames[i].name.split(".")[0];
      proposals.push(proposalData);
    } catch (error) {
      console.error(`Error fetching proposal ${proposalNames[i].name}:`, error);
    }
  }
  return proposals;
};
