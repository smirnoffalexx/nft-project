// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Collection.sol";

contract CollectionFactory {
    Collection[] public collections;

    event CollectionCreated(address collection, string name, string symbol);
    event TokenMinted(
        address collection,
        address recipient,
        uint256 tokenId,
        string tokenUri
    );

    constructor() {}

    function createCollection(
        string memory name,
        string memory symbol
    ) external {
        Collection collection = new Collection(name, symbol);
        collections.push(collection);

        emit CollectionCreated(address(collection), name, symbol);
    }

    function mintNFT(
        address collection,
        address to,
        uint256 tokenId,
        string memory uri
    ) external {
        Collection(collection).mint(to, tokenId, uri);

        emit TokenMinted(collection, to, tokenId, uri);
    }
}
