// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MintConcertTicket is ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Ticket", "BTS") {
        //_setBaseURI("ipfs://");
    }

    /*
    @owner : 토큰 발행하는 사용자의 주소
    @metadataURI : 티켓의 metadata가 담긴 IPFS URI
    */
    function mintToken(address owner, string memory metadataURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 id = _tokenIds.current();
        _safeMint(owner, id);
        //_setTokenURI(id, metadataURI);

        return id;
    }

}