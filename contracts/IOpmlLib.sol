// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

interface IOpmlLib {
    function initOpmlRequest(bytes32 aiModelVm, bytes32 _promptHash, bytes32 _opmlFinalState) external returns (uint256);
    function isFinalized(uint256 requestId) external returns (bool);
}