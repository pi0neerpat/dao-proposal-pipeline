// proposal objects fetched from github
export interface ProposalType {
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
  slug: string;
  arrayLength?: number; // This key is optional (shows up in the second proposal but not the first)
  details: string;
}
