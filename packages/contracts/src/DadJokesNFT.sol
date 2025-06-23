// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DadJokesNFT is ERC721, Ownable {
    address public minter;

    // Base URI for metadata
    string private _baseTokenURI;

    modifier onlyMinter() {
        require(msg.sender == minter, "Not the minter");
        _;
    }

    constructor(address _initialOwner, string memory baseTokenURI_)
        ERC721("DadJokes Achievement Badge", "DJAB")
        Ownable(_initialOwner)
    {
        _baseTokenURI = baseTokenURI_;
    }

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    function setBaseURI(string memory baseTokenURI_) external onlyOwner {
        _baseTokenURI = baseTokenURI_;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function mint(address _recipient, uint256 _tokenId) external onlyMinter {
        _safeMint(_recipient, _tokenId);
    }
}
