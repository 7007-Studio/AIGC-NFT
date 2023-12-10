// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./AIGC.sol";
import "./AIGT.sol";

contract AIGC_Factory {

    uint256 public modelIndexCurrent;

    address[] public deployedAIGCs;
    address[] public deployedAIGTs;

    event AIGC_Created(address aigcAddress, address aigtAddress);

    function createAIGC(string memory _modelName, string memory _modelSymbol, uint256 _tokenPrice, uint256 _costToken, bytes32 _aiModelVm, address _opmlLib, uint256 _tokenMaxSupply, uint256 _ownerReservePercent, uint96 _royalty) public returns (uint256) {
        // 20
        address newAIGT = address(new AIGT(modelIndexCurrent, _modelName, _modelSymbol, _tokenPrice, msg.sender, _tokenMaxSupply, _ownerReservePercent));
        // 721
        address newAIGC = address(new AIGC(modelIndexCurrent, _modelName, _modelSymbol, newAIGT, _costToken, _aiModelVm, _opmlLib, _royalty));
        deployedAIGCs.push(newAIGC);
        deployedAIGTs.push(newAIGT);

        // emit event
        emit AIGC_Created(newAIGC, newAIGT);

        return modelIndexCurrent;
    }

    function getDeployedAIGCs() public view returns (address[] memory) {
        return deployedAIGCs;
    }
    
}