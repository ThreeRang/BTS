// SPDX-License-Identifier : MIT

pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

//https://docs.openzeppelin.com/contracts/4.x/api/utils#Counters
contract MintingTicketToken is ERC721Enumerable{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    
    constructor() ERC721("BTSTicket","BTS"){
        //_setBaseURI("ipfs://");
    }
    
    function mintTicketToken(address owner, string memory metadataURI) public returns(uint256){
        _tokenIds.increment();
        
        uint256 id = _tokenIds.current();
        _safeMint(owner, id);
        //_setTokenURI(id, metadataURI);
    }
}