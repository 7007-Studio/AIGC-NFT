// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./AIGC.sol";
import "./AIGT.sol";
import "./IStoryProtocol.sol";

contract AIGC_Factory {

    uint256 public modelIndexCurrent;

    address[] public deployedAIGCs;
    address[] public deployedAIGTs;

    event AIGC_Created(address aigcAddress, address aigtAddress);

    mapping(uint256 => address) public modelIndexToIpOrgAddr;

    function createAIGC(string memory _modelName, string memory _modelSymbol, uint256 _tokenPrice, uint256 _costToken, bytes32 _aiModelVm, uint256 _ownerReservePercent, uint96 _royalty) public returns (uint256) {
        // 20
        address newAIGT = address(new AIGT(modelIndexCurrent, _modelName, _modelSymbol, _tokenPrice, msg.sender, 1000, _ownerReservePercent));
        // 721
        address newAIGC = address(new AIGC(modelIndexCurrent, _modelName, _modelSymbol, newAIGT, _costToken, _aiModelVm, 0xfEBfdE43561Bc74e4F982cdEB40A29966708E035, _royalty));
        deployedAIGCs.push(newAIGC);
        deployedAIGTs.push(newAIGT);

        // story protocol 
        string[] memory ipAssetTypesShared = new string[](1);
        ipAssetTypesShared[0] = "Image";

        address ipOrgAddr = IStoryProtocol(0x537fcCce413236A4E5f4f385e2edC861aEc622f0).registerIpOrg(
            msg.sender,
            _modelName, // IP org name
            _modelSymbol, // IP org symbol
            ipAssetTypesShared // IP asset types
        );
        modelIndexToIpOrgAddr[modelIndexCurrent] = ipOrgAddr;

        // emit event
        emit AIGC_Created(newAIGC, newAIGT);

        return modelIndexCurrent;
    }

    function getAIGC(uint256 _modelIndex) public view returns (address) {
        return deployedAIGCs[_modelIndex];
    }
    function getAIGT(uint256 _modelIndex) public view returns (address) {
        return deployedAIGTs[_modelIndex];
    }
    
}