// proposal objects fetched from github
export interface Proposal {
    calldatas: string[];
    chainid: number;
    description: string;
    descriptionHash: string;
    network: string;
    odGovernor: string;
    proposalId: number;
    proposalType: string;
    targets: string[];
    values: number[];
    arrayLength?: number; // This key is optional (shows up in the second proposal but not the first)
  }