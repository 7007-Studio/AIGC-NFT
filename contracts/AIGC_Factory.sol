// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./AIGC.sol";
import "./AIGT.sol";

contract AIGC_Factory {

    address[] public deployedAIGCs;
    address[] public deployedAIGTs;

    function createAIGC(uint256 _modelIndex, string memory _modelName, string memory _modelSymbol, uint256 _tokenPrice, uint256 _costToken, bytes32 _aiModelVm, address _opmlLib) public {
        // 20
        address newAIGT = address(new AIGT(_modelIndex, _modelName, _modelSymbol, _tokenPrice, msg.sender));
        // 721
        address newAIGC = address(new AIGC(_modelIndex, _modelName, _modelSymbol, newAIGT, _costToken, _aiModelVm, _opmlLib));
        deployedAIGCs.push(newAIGC);
        deployedAIGTs.push(newAIGT);
    }

    function getDeployedAIGCs() public view returns (address[] memory) {
        return deployedAIGCs;
    }
    
}