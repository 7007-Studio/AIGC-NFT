// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// import ERC20
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AIGT is ERC20, Ownable {
      
      uint256 public modelIndex;
      uint256 public tokenPrice;
      
      constructor(uint256 _modelIndex, string memory _modelName, string memory _modelSymbol, uint256 _tokenPrice, address _owner) ERC20(_modelName, _modelSymbol) Ownable(_owner){
          modelIndex = _modelIndex;
          tokenPrice = _tokenPrice;
      }
      
      function getModelIndex() public view returns (uint256) {
          return modelIndex;
      }

      function mint(uint256 _amount) public payable {
          require(msg.value == _amount * tokenPrice, "Not enough eth to mint token");
          _mint(msg.sender, _amount);
      }

      function withdraw() external onlyOwner {
        // withdraw eth by token holding percentage
      }
}