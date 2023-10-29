// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// import ERC721URIStorage from openzeppelin
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract AIGC is ERC721URIStorage {
      
      uint256 public modelIndex;
      uint256 public _tokenId;
      
      constructor(uint256 _modelIndex, string memory _modelName, string memory _modelSymbol) ERC721(_modelName, _modelSymbol){
          modelIndex = _modelIndex;
      }
      
      function getModelIndex() public view returns (uint256) {
          return modelIndex;
      }

      function mint(string memory _tokenURI) public {
          _safeMint(msg.sender, _tokenId);
          _setTokenURI(_tokenId, _tokenURI);
          _tokenId++;
      }
}