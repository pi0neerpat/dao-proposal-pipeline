import { type ProposalType } from '../types/proposal'

// this script fetches proposal data from github
const fetchProposalNames = async (): Promise<any> => {
  const response = await fetch(
    'https://api.github.com/repos/open-dollar/od-governance-manager/contents/gov-output/mainnet'
  )
  const data = await response.json()
  return data.map((file: any) => ({
    name: file.name,
    download_url: file.download_url
  }))
}

export const fetchProposals = async (): Promise<any> => {
  const proposalNames = await fetchProposalNames()
  const proposals: ProposalType[] = []
  for (let i = 0; i < proposalNames.length; i++) {
    let response = await fetch(
      proposalNames[i].download_url as string
    )
    // response as json converts proposal id to scientific notation and rounds it :(
    const data = await response.text()
    let proposalIdString: string | undefined | bigint
    const lines = data.split('\n')
    lines.forEach(line => {
      const [key, value] = line.split(':').map(part => part.trim())
      if (key === '"proposalId"') {
        // remove hanging comma
        proposalIdString = BigInt(value.slice(0, -1))
        proposalIdString = proposalIdString.toString()
      }
    })
    response = await fetch(
      proposalNames[i].download_url as string
    )
    const proposalData: ProposalType = await response.json()
    if (proposalIdString === undefined) {
      proposalIdString = ''
    }
    proposalData.proposalId = proposalIdString
    proposals.push(proposalData)
  }
  return proposals
}
