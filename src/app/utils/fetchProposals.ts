// this script fetches proposal data from github
const fetchProposalNames = async () => {
    const response = await fetch(
      "https://api.github.com/repos/open-dollar/od-contracts/contents/gov-output/mainnet"
    );
    const data = await response.json();
    return data.map((file: any) => ({
      name: file.name,
      download_url: file.download_url,
    }));
  };

  export const fetchProposals = async () => {
    const proposalNames = await fetchProposalNames()
    let proposals:any = []
    for(let i =0; i<proposalNames.length; i++){
        const response = await fetch(
            proposalNames[i].download_url
            );
        const data = await response.json();
        proposals.push(data)
    }
    return proposals
  }