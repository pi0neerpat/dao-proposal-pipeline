// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

//solhint-disable

import 'forge-std/Script.sol';
import {ForkManagement} from '@opendollar/script/gov/helpers/ForkManagement.s.sol';
import 'forge-std/console2.sol';

contract Generator is ForkManagement {
  using stdJson for string;

  struct FileNameStrings {
    uint256 proposalIdUint;
    string shortProposalId;
    string proposalId;
    string formattedDate;
    uint256 year;
    uint256 month;
    uint256 day;
  }

  string public _version = 'version 0.1';

  function _loadBaseData(string memory json) internal virtual {
    // empty
  }

  function run(string memory _filePath) public {
    _loadJson(_filePath);
    _loadBaseData(json);
    _network = json.readString(string(abi.encodePacked('.network')));
    uint256 chainId = json.readUint(string(abi.encodePacked('.chainid')));
    require(chainId != 0, 'Chain ID is not defined');
    string memory rpcUrl;
    if (chainId == 421_614) {
      rpcUrl = vm.rpcUrl('arbitrum-sepolia');
    } else if (chainId == 42_161) {
      rpcUrl = vm.rpcUrl('arb');
    } else if (chainId == 8453) {
      rpcUrl = vm.rpcUrl('base');
    }
    require(bytes(rpcUrl).length > 0, 'RPC URL is null');
    vm.createSelectFork(rpcUrl);
    _generateProposal();
  }

  function _generateProposal() internal virtual {
    // empty
  }

  function timestampToDate(uint256 timestamp) internal pure returns (uint256 year, uint256 month, uint256 day) {
    unchecked {
      (year, month, day) = _daysToDate(timestamp / (24 * 60 * 60));
    }
  }

  function _daysToDate(uint256 _days) internal pure returns (uint256 year, uint256 month, uint256 day) {
    unchecked {
      int256 __days = int256(_days);

      int256 L = __days + 68_569 + 2_440_588;
      int256 N = (4 * L) / 146_097;
      L = L - (146_097 * N + 3) / 4;
      int256 _year = (4000 * (L + 1)) / 1_461_001;
      L = L - (1461 * _year) / 4 + 31;
      int256 _month = (80 * L) / 2447;
      int256 _day = L - (2447 * _month) / 80;
      L = _month / 11;
      _month = _month + 2 - 12 * L;
      _year = 100 * (N - 49) + _year + L;

      year = uint256(_year);
      month = uint256(_month);
      day = uint256(_day);
    }
  }
}
