// this script fetches proposal data from github
export const fetchProposals = async () => {
    const response = await fetch(
      "https://api.github.com/repos/open-dollar/od-contracts/contents/gov-output/mainnet"
    );
    const data = await response.json();
    return data.map((file: any) => ({
      name: file.name,
      download_url: file.download_url,
    }));
  };