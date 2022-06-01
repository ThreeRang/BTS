// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PurchaseTicketToken.sol";
//https://docs.openzeppelin.com/contracts/4.x/api/utils#Counters
contract MintTicketToken is ERC721URIStorage, ERC721Enumerable, Ownable{
    PurchaseTicketToken public purchaseTicketToken;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    //공연좌석에 따른 티켓Id
    mapping(string => mapping(uint256 => uint256)) private _ticketIdOfConcertSeatnum;
    //티켓Id에 따른 가격
    mapping(uint256 => uint256) private _ticketPrices;
    //티켓Id에 따른 좌석번호
    mapping(uint256 => uint256) private _ticketSeatnum;
    //티켓Id에 따른 사용여부
    mapping(uint256 => bool) private _ticketUsed;
    //event정의
    event info(string name, address own, uint256 id, string URI, uint256 seatNum, uint256 price); 

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

    function _setTicketIdOfConcertSeatnum(string memory concertId, uint256 seatnum, uint256 tokenId) 
        internal
        virtual
    {
        require(_exists(tokenId), "MIntTicketToken: URI set of nonexistent token");
        _ticketIdOfConcertSeatnum[concertId][seatnum] = tokenId;
    }

    function _setTicketPrices(uint256 tokenId, uint256 price) internal virtual{
        require(_exists(tokenId), "MIntTicketToken: URI set of nonexistent token");
        _ticketPrices[tokenId] = price;
    }

    function _setTicketSeatnum(uint256 tokenId, uint256 seatnum) internal virtual{
        require(_exists(tokenId), "MIntTicketToken: URI set of nonexistent token");
        _ticketSeatnum[tokenId] = seatnum;
    }

    function _setTicketUsed(uint256 tokenId, bool used) internal virtual{
        require(_exists(tokenId), "MIntTicketToken: URI set of nonexistent token");
        _ticketUsed[tokenId] = used;
    }

    function ticketIdOfConcertSeatnum(string memory concertId, uint256 seetnum) 
        public 
        view 
        returns(uint256)
    {
        return _ticketIdOfConcertSeatnum[concertId][seetnum];
    }

    function ticketPrices(uint256 tokenId) 
        public 
        view 
        returns(uint256)
    {
        return _ticketPrices[tokenId];
    }

    function ticketSeatnum(uint256 tokenId) 
        public 
        view 
        returns(uint256)
    {
        return _ticketSeatnum[tokenId];
    }

    function ticketUsed(uint256 tokenId) 
        public 
        view 
        returns(bool)
    {
        return _ticketUsed[tokenId];
    }

    function useTicket(uint256 tokenId) 
        public 
        returns(bool)
    {
        _setTicketUsed(tokenId, true);
        return _ticketUsed[tokenId];
    }

    function mintTicketToken(address owner, string memory metadataURI, string memory concertId, uint256 seatnum, uint256 price)
        public
        returns(uint256)
    {
        _tokenIds.increment();
        
        uint256 id = _tokenIds.current();

        _safeMint(owner, id);
        _setTokenURI(id, metadataURI);
        _setTicketIdOfConcertSeatnum(concertId, seatnum, id);
        _setTicketPrices(id, price);
        _setTicketSeatnum(id, seatnum);
        _setTicketUsed(id, false);
        purchaseTicketToken.setForSaleTicketToken(id, price);
        
        emit info("In sol : success minting!", owner, id, metadataURI, seatnum, price); 

        return id;
    }

    function setPurchaseTicketToken(address _purchaseTicketToken) public{
        purchaseTicketToken = PurchaseTicketToken(_purchaseTicketToken);
    }
}