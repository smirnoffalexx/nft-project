// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Collection is ERC721URIStorage {
    constructor(
        string memory name_,
        string memory symbol_
    ) ERC721(name_, symbol_) {}

    function mint(address to, uint256 tokenId, string memory uri) external {
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
}
