// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//https://docs.openzeppelin.com/contracts/4.x/api/utils#Counters
contract MintTicketToken is ERC721URIStorage, ERC721Enumerable, Ownable{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    //공연좌석에 따른 티켓Id
    mapping(string => mapping(uint256 => uint256)) private ticketIdOfConcertSeatnum;
    //event정의
    event info(string name, address own, uint256 id, string URI); 

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    constructor() ERC721("BTSTicket","BTS"){
        //_setBaseURI("ipfs://");
        //_setBaseURI("https://ipfs.io/ipfs/");
    }

    function setTicketIdOfConcertSeatnum(string memory concertId, uint256 seetnum, uint256 tokenId) 
        internal
        virtual
    {
        require(_exists(tokenId), "MIntTicketToken: URI set of nonexistent token");
        ticketIdOfConcertSeatnum[concertId][seetnum] = tokenId;
    }

    function _ticketIdOfConcertSeatnum(string memory concertId, uint256 seetnum) 
        public 
        view 
        returns(uint256)
    {
        return ticketIdOfConcertSeatnum[concertId][seetnum];
    }

    function mintTicketToken(address owner, string memory metadataURI, string memory concertId, uint256 seetnum)
        public
        returns(uint256)
    {
        _tokenIds.increment();
        
        uint256 id = _tokenIds.current();
        _safeMint(owner, id);
        _setTokenURI(id, metadataURI);
        setTicketIdOfConcertSeatnum(concertId, seetnum, id);

        emit info("In sol : success minting!", owner, id, metadataURI); 

        return id;
    }
}