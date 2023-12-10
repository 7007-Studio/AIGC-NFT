// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// import ERC721URIStorage from openzeppelin
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721RoyaltyUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IOpmlLib.sol";
import "./IStoryProtocol.sol";

contract AIGC is Initializable, ERC721Upgradeable, ERC721URIStorageUpgradeable, ERC721RoyaltyUpgradeable {
      
      uint256 public modelIndex;
      uint256 public tokenId;
      uint256 public costToken;
      IERC20 public token;
      bytes32 public aiModelVm;
      IOpmlLib public opmlLib;
      address public ipOrgAddr;
      string public modelName;

      mapping(uint256 => uint256) tokenIdToRequestId;
      mapping(uint256 => uint256) tokenIdToIpAssetId;


        /// @custom:oz-upgrades-unsafe-allow constructor
        constructor() {
            _disableInitializers();
        }
 
    
      function initialize(uint256[] memory vals, string[] memory vals2, address[] memory vals3, bytes32 _aiModelVm, uint96 _royalty) public initializer {

            uint256 _modelIndex = vals[0];
            uint256 _costToken = vals[1];
            string memory _modelName = vals2[0];
            string memory _modelSymbol = vals2[1];
            address _token = vals3[0];
            address _opmlLib = vals3[1];
            address _ipOrgAddr = vals3[2];

            __ERC721_init(_modelName, _modelSymbol);
            __ERC721Royalty_init();
            __ERC721URIStorage_init();
            token = IERC20(_token);
            modelIndex = _modelIndex;
            costToken = _costToken;
            aiModelVm = _aiModelVm;
            opmlLib = IOpmlLib(_opmlLib);
            ipOrgAddr = _ipOrgAddr;
            modelName = _modelName;

            _setDefaultRoyalty(_token, _royalty); // 10000 = 100%
        }
      
      function getModelIndex() public view returns (uint256) {
          return modelIndex;
      }

      function mint(string memory _tokenURI, bytes32 _promptHash, bytes32 _opmlFinalState, string memory _ipAssetMediaUrl) public {
          // require cost AIGT
          token.transferFrom(msg.sender, address(this), costToken);

          _safeMint(msg.sender, tokenId);
          _setTokenURI(tokenId, _tokenURI);

          tokenIdToRequestId[tokenId] = opmlLib.initOpmlRequest(aiModelVm, _promptHash, _opmlFinalState);

          // story protocol register IP asset
          Registration.RegisterIPAssetParams memory ipAssetData = Registration.RegisterIPAssetParams({
                owner: address(this),
                ipOrgAssetType: 0,
                name: modelName,
                hash: 0x0, // TODO: not sure what is this hash about
                mediaUrl: _ipAssetMediaUrl
            });
          (uint256 ipAssetId, uint256 ipOrg_AssetId) = IStoryProtocol(0x537fcCce413236A4E5f4f385e2edC861aEc622f0).registerIPAsset(
                ipOrgAddr,
                ipAssetData,
                0, // no license
                new bytes[](0), // no pre-hook
                new bytes[](0) // no post-hook
          );
          tokenIdToIpAssetId[tokenId] = ipAssetId;

          tokenId++;
      }

      // validate
      function verify(uint256 _tokenId) public returns (bool) {
        return opmlLib.isFinalized(tokenIdToRequestId[_tokenId]);
      }

     function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721RoyaltyUpgradeable, ERC721URIStorageUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    function tokenURI(uint256 _tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(_tokenId);
    }
}