// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract MockOpmlLib {
    function initOpmlRequest(bytes32 aiModelVm, bytes32 _promptHash, bytes32 _opmlFinalState) external pure returns (uint256){
        return 0;
    }
    function isFinalized(uint256 requestId) external pure returns (bool){
        return true;
    }
}