// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// import ERC721URIStorage from openzeppelin
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import IERC20
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./OpmlLib.sol";

contract AIGC is ERC721URIStorage {
      
      uint256 public modelIndex;
      uint256 public tokenId;
      uint256 public costToken;
      IERC20 public token;
      bytes32 public aiModelVm;
      OpmlLib public opmlLib;

      mapping(uint256 => uint256) tokenIdToRequestId;
 
      constructor(uint256 _modelIndex, string memory _modelName, string memory _modelSymbol, address _token, uint256 _costToken, bytes32 _aiModelVm, address _opmlLib) ERC721(_modelName, _modelSymbol){
          token = IERC20(_token);
          modelIndex = _modelIndex;
          costToken = _costToken;
          aiModelVm = _aiModelVm;
          opmlLib = OpmlLib(_opmlLib);
      }
      
      function getModelIndex() public view returns (uint256) {
          return modelIndex;
      }

      function mint(string memory _tokenURI, bytes32 _promptHash, bytes32 _opmlFinalState) public {
          // require cost AIGT
          token.transferFrom(msg.sender, address(this), costToken);

          _safeMint(msg.sender, tokenId);
          _setTokenURI(tokenId, _tokenURI);

          tokenIdToRequestId[tokenId] = opmlLib.initOpmlRequest(aiModelVm, _promptHash, _opmlFinalState);

          tokenId++;
      }

      // validate
      function verify(uint256 _tokenId) public returns (bool) {
        return opmlLib.isFinalized(tokenIdToRequestId[_tokenId]);
      }
}