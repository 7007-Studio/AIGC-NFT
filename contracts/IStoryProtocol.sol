// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

library Registration {
    /// @notice IPOrg configuration settings.
    struct IPOrgConfig {
        string baseURI;
        string contractURI;
        string[] assetTypes;
    }

    /// @notice Struct used for IP asset registration.
    struct RegisterIPAssetParams {
        address owner;
        uint8 ipOrgAssetType;
        string name;
        bytes32 hash;
        string mediaUrl;
    }
}

interface IStoryProtocol {
  function registerIpOrg(
        address owner_,
        string calldata name_,
        string calldata symbol_,
        string[] calldata ipAssetTypes_
    ) external returns (address ipOrg_);

    function registerIPAsset(
        address ipOrg_,
        Registration.RegisterIPAssetParams calldata params_,
        uint256 licenseId_,
        bytes[] calldata preHooksData_,
        bytes[] calldata postHooksData_
    ) external returns (uint256, uint256);
}