// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// import ERC20
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AIGT is ERC20, Ownable {
      
      uint256 public modelIndex;
      uint256 public tokenPrice;
      uint256 public maxSupply;
      
      constructor(uint256 _modelIndex, string memory _modelName, string memory _modelSymbol, uint256 _tokenPrice, address _owner, uint256 _maxSupply, uint256 _ownerReservePercent) ERC20(_modelName, _modelSymbol) Ownable(_owner){
          modelIndex = _modelIndex;
          tokenPrice = _tokenPrice;
          maxSupply = _maxSupply;

          // mint owner reserve 
          _mint(_owner, _maxSupply * _ownerReservePercent / 100);
      }
      
      function getModelIndex() public view returns (uint256) {
          return modelIndex;
      }

      function mint(uint256 _amount) public payable {
          require(msg.value == _amount * tokenPrice, "Not enough eth to mint token");
          _mint(msg.sender, _amount);
      }

      // TODO: need a calculation to know how much one can claim by token holdings percentage
      function withdraw() external onlyOwner {
          payable(owner()).transfer(address(this).balance);
      }

      function getShare() external view returns (uint256){
        // calculate the token share of the token holder
        return balanceOf(msg.sender) * 100 / totalSupply();
      }
}