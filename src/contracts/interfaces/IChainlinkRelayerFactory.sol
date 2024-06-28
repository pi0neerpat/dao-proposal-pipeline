// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;

import {IBaseOracle} from '@opendollar/interfaces/oracles/IBaseOracle.sol';

interface IChainlinkRelayerFactory {
  // --- Events ---
  event NewChainlinkRelayer(address indexed _chainlinkRelayer, address _aggregator, uint256 _staleThreshold);

  function deployChainlinkRelayer(address _aggregator, uint256 _staleThreshold) external returns (IBaseOracle _relayer);

  function deployChainlinkRelayerWithL2Validity(
    address _priceAggregator,
    address _sequencerAggregator,
    uint256 _staleThreshold,
    uint256 _gracePeriod
  ) external returns (IBaseOracle _chainlinkRelayer);
}
