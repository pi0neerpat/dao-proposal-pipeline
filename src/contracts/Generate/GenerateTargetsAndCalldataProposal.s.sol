// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;

import {JSONScript} from '../helpers/JSONScript.s.sol';
import {ODGovernor} from '@opendollar/contracts/gov/ODGovernor.sol';
import {TimelockController} from '@openzeppelin/governance/TimelockController.sol';
import {Generator} from '../Generator.s.sol';
import {Strings} from '@openzeppelin/utils/Strings.sol';
import 'forge-std/StdJson.sol';

contract GenerateTargetsAndCalldataProposal is Generator, JSONScript {
  using stdJson for string;

  address public _odGovernor;
  string public _description;
  address[] public targets;
  bytes[] public calldatas;

  function _loadBaseData(string memory json) internal override {
    _description = json.readString(string(abi.encodePacked('.description')));
    _odGovernor = json.readAddress(string(abi.encodePacked('.ODGovernor_Address:')));
    uint256 len = json.readUint(string(abi.encodePacked('.arrayLength')));
    for (uint256 i; i < len; i++) {
      string memory index = Strings.toString(i);
      address target = json.readAddress(string(abi.encodePacked('.objectArray[', index, '].target')));
      bytes memory callData = json.readBytes(string(abi.encodePacked('.objectArray[', index, '].calldata')));
      targets.push(target);
      calldatas.push(callData);
    }
  }

  function _generateProposal() internal override {
    ODGovernor gov = ODGovernor(payable(_odGovernor));

    uint256[] memory values = new uint256[](targets.length);
    for (uint256 i; i < targets.length; i++) {
      values[i] = 0;
    }

    bytes32 descriptionHash = keccak256(bytes(_description));
    FileNameStrings memory fileNameStrings;

    // Propose the action
    fileNameStrings.proposalIdUint = gov.hashProposal(targets, values, calldatas, descriptionHash);
    fileNameStrings.shortProposalId = vm.toString(fileNameStrings.proposalIdUint / 10 ** 69);
    fileNameStrings.proposalId = vm.toString(fileNameStrings.proposalIdUint);

    (fileNameStrings.year, fileNameStrings.month, fileNameStrings.day) = timestampToDate(block.timestamp);
    fileNameStrings.formattedDate = string.concat(
      vm.toString(fileNameStrings.month), '_', vm.toString(fileNameStrings.day), '_', vm.toString(fileNameStrings.year)
    );

    {
      string memory objectKey = 'TARGETS-CALLDATA';
      // Build the JSON output
      string memory jsonOutput = _buildProposalParamsJSON(
        fileNameStrings.proposalId, objectKey, targets, values, calldatas, _description, descriptionHash
      );
      vm.writeJson(
        jsonOutput,
        string.concat(
          './gov-output/',
          _network,
          '/targetsAndCalldata-',
          fileNameStrings.formattedDate,
          '-',
          fileNameStrings.shortProposalId,
          '.json'
        )
      );
    }
  }

  function _serializeCurrentJson(string memory _objectKey) internal override returns (string memory _serializedInput) {
    _serializedInput = vm.serializeJson(_objectKey, json);
  }
}
