// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PurchaseTicketToken.sol";

contract MintTicketToken is ERC721URIStorage, ERC721Enumerable, Ownable {
    // create PurchaseTicketToken instance
    PurchaseTicketToken public purchaseTicketToken;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /**
     * variables
     * 공연Id : concertTitle + Date.now()
     * 티켓Id : tokenId
     * _ticketIdOfConcertSeatnum : 공연Id(string)좌석번호(int)에 따른 티켓Id(int)
     * _ticketPrices : 티켓Id(int)에 따른 티켓가격(int)
     * _ticketConcert : 티켓Id(int)에 따른 공연Id(string)
     * _ticketSeatnum : 티켓Id(int)에 따른 좌석번호(int)
     * _ticketUsed : 티켓Id(int)에 따른 사용여부(bool)
     */
    mapping(string => mapping(uint256 => uint256))
        private _ticketIdOfConcertSeatnum;
    mapping(uint256 => uint256) private _ticketPrices;
    mapping(uint256 => string) private _ticketConcert;
    mapping(uint256 => uint256) private _ticketSeatnum;
    mapping(uint256 => bool) private _ticketUsed;

    /**
     * event
     * message
     * owner : publisher account of this contract
     * id : tokenId
     * metadataURI : url(IPFS) of metadata(json) about token
     * seatNum : seat number of ticket
     * price : price of token
     */
    event info(
        string message,
        address owner,
        uint256 id,
        string metadataURI,
        uint256 seatNum,
        uint256 price
    );

    // 상속
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // 상속
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    // 상속
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // 상속
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // 생성자
    constructor() ERC721("BTSTicket", "BTS") {}

    /**
     * set tokenId to ticketId
     */
    function _setTicketIdOfConcertSeatnum(
        string memory concertId,
        uint256 seatnum,
        uint256 tokenId
    ) internal virtual {
        require(_exists(tokenId), "MIntTicketToken: tokenId is unvalid");
        _ticketIdOfConcertSeatnum[concertId][seatnum] = tokenId;
    }

    /**
     * set price of ticket
     */
    function _setTicketPrices(uint256 tokenId, uint256 price) internal virtual {
        require(_exists(tokenId), "MIntTicketToken: tokenId is unvalid");
        _ticketPrices[tokenId] = price;
    }

    /**
     * set seat number of ticket
     */
    function _setTicketSeatnum(uint256 tokenId, uint256 seatnum)
        internal
        virtual
    {
        require(_exists(tokenId), "MIntTicketToken: tokenId is unvalid");
        _ticketSeatnum[tokenId] = seatnum;
    }

    /**
     * set usage status of ticket
     */
    function _setTicketUsed(uint256 tokenId, bool used) internal virtual {
        require(_exists(tokenId), "MIntTicketToken: tokenId is unvalid");
        _ticketUsed[tokenId] = used;
    }

    /**
     * set concertId to tokenId
     */
    function _setTicketConcert(uint256 tokenId, string memory concertId)
        internal
        virtual
    {
        require(_exists(tokenId), "MIntTicketToken: tokenId is unvalid");
        _ticketConcert[tokenId] = concertId;
    }

    /**
     * return tokenId
     */
    function ticketIdOfConcertSeatnum(string memory concertId, uint256 seatnum)
        public
        view
        returns (uint256)
    {
        return _ticketIdOfConcertSeatnum[concertId][seatnum];
    }

    /**
     * return price of ticket
     */
    function ticketPrices(uint256 tokenId) public view returns (uint256) {
        return _ticketPrices[tokenId];
    }

    /**
     * return concertId
     */
    function ticketConcert(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        return _ticketConcert[tokenId];
    }

    /**
     * return seat number of ticket
     */
    function ticketSeatnum(uint256 tokenId) public view returns (uint256) {
        return _ticketSeatnum[tokenId];
    }

    /**
     * return usage status of Ticket
     */
    function ticketUsed(uint256 tokenId) public view returns (bool) {
        return _ticketUsed[tokenId];
    }

    /**
     * use ticket
     */
    function useTicket(uint256 tokenId) public returns (bool) {
        _setTicketUsed(tokenId, true);
        return _ticketUsed[tokenId];
    }

    /**
     * mint ticket token
     * param
     * owner : publisher account
     * metadataURI : url(IPFS) of metadata(json) about token
     * concertId
     * seatnum
     * price
     * @return tokenId
     */
    function mintTicketToken(
        address owner,
        string memory metadataURI,
        string memory concertId,
        uint256 seatnum,
        uint256 price
    ) public returns (uint256) {
        _tokenIds.increment();

        uint256 id = _tokenIds.current();

        _safeMint(owner, id);
        _setTokenURI(id, metadataURI);
        _setTicketIdOfConcertSeatnum(concertId, seatnum, id);
        _setTicketConcert(id, concertId);
        _setTicketPrices(id, price);
        _setTicketSeatnum(id, seatnum);
        _setTicketUsed(id, false);
        purchaseTicketToken.setForSaleTicketToken(id, price);

        emit info(
            "In sol : success minting!",
            owner,
            id,
            metadataURI,
            seatnum,
            price
        );

        return id;
    }

    /**
     * use external contract
     */
    function setPurchaseTicketToken(address _purchaseTicketToken) public {
        purchaseTicketToken = PurchaseTicketToken(_purchaseTicketToken);
    }
}
