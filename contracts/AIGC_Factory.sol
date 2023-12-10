// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./AIGC.sol";
import "./AIGT.sol";
import "./IStoryProtocol.sol";

contract AIGC_Factory {
    using Clones for address;

    uint256 public modelIndexCurrent;

    address[] public deployedAIGCs;
    address[] public deployedAIGTs;

    address public aigcContractImpl;

    mapping(uint256 => address) public modelIndexToIpOrgAddr;

    event AIGC_Created(address aigcAddress, address aigtAddress);

    // need to deploy aigc contract first
    constructor(address _aigcContractImpl) {
        aigcContractImpl = _aigcContractImpl;
    }

    function createAIGC(string memory _modelName, string memory _modelSymbol, uint256 _tokenPrice, uint256 _costToken, bytes32 _aiModelVm, uint256 _ownerReservePercent, uint96 _royalty) public returns (uint256) {
        // story protocol register IP
        string[] memory ipAssetTypesShared = new string[](1);
        ipAssetTypesShared[0] = "Image";

        address ipOrgAddr = IStoryProtocol(0x537fcCce413236A4E5f4f385e2edC861aEc622f0).registerIpOrg(
            aigcContractImpl.predictDeterministicAddress(bytes32(modelIndexCurrent)), // owner to be replaced
            _modelName, // IP org name
            _modelSymbol, // IP org symbol
            ipAssetTypesShared // IP asset types
        );
        modelIndexToIpOrgAddr[modelIndexCurrent] = ipOrgAddr;

        // 20
        address newAIGT = address(new AIGT(modelIndexCurrent, _modelName, _modelSymbol, _tokenPrice, msg.sender, 1000, _ownerReservePercent)); // hardcode token maxSupply
        // 721
        address newAIGC = aigcContractImpl.cloneDeterministic(bytes32(modelIndexCurrent));

        uint256[] memory vals = new uint256[](2);
        vals[0] = modelIndexCurrent;
        vals[1] = _costToken;
        string[] memory vals2 = new string[](2);
        vals2[0] = _modelName;
        vals2[1] = _modelSymbol;
        address[] memory vals3 = new address[](3);
        vals3[0] = address(newAIGT);
        vals3[1] = 0xfEBfdE43561Bc74e4F982cdEB40A29966708E035;
        vals3[2] = ipOrgAddr;

        AIGC(newAIGC).initialize(vals, vals2, vals3, _aiModelVm, _royalty);
        deployedAIGCs.push(newAIGC);
        deployedAIGTs.push(newAIGT);

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