// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import { ShortStrings, ShortString } from "@openzeppelin/contracts/utils/ShortStrings.sol";


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

library Licensing {
  using ShortStrings for *;
  
  /// @notice Corresponds to a value for parameter (licensing term) of a licensing framework.
    struct ParamValue {
        /// The parameter id, used to identify the parameter in the license agreement text.
        ShortString tag;
        /// Encoded according to paramType, might be empty.
        bytes value;
    }

  /// @notice Parameters to mint a license
    struct LicenseCreation {
        /// Array of (tag, value) pairs for the parameters, corresponding to the tags in the
        /// licensing framework.
        ParamValue[] params;
        /// Parent license id, if any. 0 otherwise.
        uint256 parentLicenseId;
        /// Linked IPA id, if any. 0 otherwise.
        uint256 ipaId;
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

    function createLicense(
        address ipOrg_,
        Licensing.LicenseCreation calldata params_,
        bytes[] calldata preHooksData_,
        bytes[] calldata postHooksData_
    ) external returns (uint256);
}