
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
        let response = await fetch(
            proposalNames[i].download_url
            );
        let data = await response.text();
        let proposalIdString 
        const lines = data.split('\n');
        lines.forEach(line => {
            const [key, value] = line.split(':').map(part => part.trim());
            if (key === '"proposalId"') {
              // remove hanging comma
              proposalIdString = value.slice(0, -1);;
            }
        });
        response = await fetch(
          proposalNames[i].download_url
        );
        data = await response.json()
        data.proposalId = proposalIdString      
        proposals.push(data)
    }
    return proposals
  }