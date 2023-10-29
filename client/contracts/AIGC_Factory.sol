// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./AIGC.sol";

contract AIGC_Factory {

    address[] public deployedAIGCs;

    function createAIGC(uint256 _modelIndex, string memory _modelName, string memory _modelSymbol) public {
        address newAIGC = address(new AIGC(_modelIndex, _modelName, _modelSymbol));
        deployedAIGCs.push(newAIGC);
    }

    function getDeployedAIGCs() public view returns (address[] memory) {
        return deployedAIGCs;
    }
    
}