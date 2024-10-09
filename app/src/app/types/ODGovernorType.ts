import {
  type BigNumber,
  type BigNumberish,
  type BytesLike,
  type PayableOverrides,
} from "ethers";

interface ODGovernorType {
  BALLOT_TYPEHASH: string;
  COUNTING_MODE: string;
  EXTENDED_BALLOT_TYPEHASH: string;
  Empty: Error;
  ProposalCanceled: Event;
  ProposalCreated: Event;
  ProposalExecuted: Event;
  ProposalQueued: Event;
  ProposalThresholdSet: Event;
  QuorumNumeratorUpdated: Event;
  TimelockChange: Event;
  VoteCast: Event;
  VoteCastWithParams: Event;
  VotingDelaySet: Event;
  VotingPeriodSet: Event;
  cancel: (proposalId: BigNumberish) => Promise<void>;
  castVote: (proposalId: BigNumberish, support: number) => Promise<BigNumber>;
  castVoteBySig: (
    proposalId: BigNumberish,
    support: number,
    v: number,
    r: BytesLike,
    s: BytesLike
  ) => Promise<BigNumber>;
  castVoteWithReason: (
    proposalId: BigNumberish,
    support: number,
    reason: string
  ) => Promise<BigNumber>;
  castVoteWithReasonAndParams: (
    proposalId: BigNumberish,
    support: number,
    reason: string,
    params: BytesLike
  ) => Promise<BigNumber>;
  castVoteWithReasonAndParamsBySig: (
    proposalId: BigNumberish,
    support: number,
    reason: string,
    params: BytesLike,
    v: number,
    r: BytesLike,
    s: BytesLike
  ) => Promise<BigNumber>;
  execute: (
    proposalId: BigNumberish,
    overrides?: PayableOverrides
  ) => Promise<BigNumber>;
  getActions: (proposalId: BigNumberish) => Promise<{
    targets: string[];
    values: BigNumber[];
    signatures: string[];
    calldatas: BytesLike[];
  }>;
  getReceipt: (
    proposalId: BigNumberish,
    voter: string
  ) => Promise<{
    hasVoted: boolean;
    support: number;
    votes: BigNumber;
  }>;
  getVotes: (account: string, blockNumber: BigNumberish) => Promise<BigNumber>;
  getVotesWithParams: (
    account: string,
    blockNumber: BigNumberish,
    params: BytesLike
  ) => Promise<BigNumber>;
  hasVoted: (proposalId: BigNumberish, account: string) => Promise<boolean>;
  hashProposal: (
    targets: string[],
    values: BigNumber[],
    calldatas: BytesLike[],
    descriptionHash: BytesLike
  ) => Promise<BigNumber>;
  name: () => Promise<string>;
  onERC1155BatchReceived: (
    arg0: string,
    arg1: string,
    arg2: BigNumber[],
    arg3: BigNumber[],
    arg4: BytesLike
  ) => Promise<string>;
  onERC1155Received: (
    arg0: string,
    arg1: string,
    arg2: BigNumber,
    arg3: BigNumber,
    arg4: BytesLike
  ) => Promise<string>;
  onERC721Received: (
    arg0: string,
    arg1: string,
    arg2: BigNumber,
    arg3: BytesLike
  ) => Promise<string>;
  proposalDeadline: (proposalId: BigNumberish) => Promise<BigNumber>;
  proposalEta: (proposalId: BigNumberish) => Promise<BigNumber>;
  proposalSnapshot: (proposalId: BigNumberish) => Promise<BigNumber>;
  proposalThreshold: () => Promise<BigNumber>;
  proposals: (proposalId: BigNumberish) => Promise<{
    id: BigNumber;
    proposer: string;
    eta: BigNumber;
    startBlock: BigNumber;
    endBlock: BigNumber;
    forVotes: BigNumber;
    againstVotes: BigNumber;
    abstainVotes: BigNumber;
    canceled: boolean;
    executed: boolean;
  }>;
  proposalVotes: (proposalId: BigNumberish) => Promise<{
    forVotes: BigNumber;
    againstVotes: BigNumber;
    abstainVotes: BigNumber;
  }>;
  propose: (
    targets: string[],
    values: BigNumber[],
    signatures: string[],
    calldatas: BytesLike[],
    description: string
  ) => Promise<BigNumber>;
  queue: (proposalId: BigNumberish) => Promise<BigNumber>;
  quorum: (blockNumber: BigNumberish) => Promise<BigNumber>;
  quorumDenominator: () => Promise<BigNumber>;
  quorumNumerator: (blockNumber: BigNumberish) => Promise<BigNumber>;
  quorumVotes: () => Promise<BigNumber>;
  relay: (
    target: string,
    value: BigNumberish,
    data: BytesLike,
    overrides?: PayableOverrides
  ) => Promise<void>;
  setProposalThreshold: (newProposalThreshold: BigNumberish) => Promise<void>;
  setVotingDelay: (newVotingDelay: BigNumberish) => Promise<void>;
  setVotingPeriod: (newVotingPeriod: BigNumberish) => Promise<void>;
  state: (proposalId: BigNumberish) => Promise<number>;
  supportsInterface: (interfaceId: BytesLike) => Promise<boolean>;
  timelock: () => Promise<string>;
  token: () => Promise<string>;
  updateQuorumNumerator: (newQuorumNumerator: BigNumberish) => Promise<void>;
  updateTimelock: (newTimelock: string) => Promise<void>;
  version: () => Promise<string>;
  votingDelay: () => Promise<BigNumber>;
  votingPeriod: () => Promise<BigNumber>;
  connect: (arg0: any) => any;
}

interface Event {
  connect: (listener: (event: any) => void) => {
    off: () => void;
  };
}

export default ODGovernorType;
