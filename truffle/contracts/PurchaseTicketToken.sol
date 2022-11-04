// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./MintTicketToken.sol";

contract PurchaseTicketToken {
    // create MintTicketToken instance
    MintTicketToken public mintTicketTokenAddress;

    // 생성자
    constructor(address _mintTicketTokenAddress) {
        mintTicketTokenAddress = MintTicketToken(_mintTicketTokenAddress);
    }

    /**
     * variables
     * ticketTokenPrices : price of ticket
     * onSaleTicketTokenArray : a list of ticket on sale
     */
    mapping(uint256 => uint256) public _ticketTokenPrices;
    uint256[] public _onSaleTicketTokenArray;

    /**
     * event
     * message
     * owner : publisher account of this contract
     * id : tokenId
     * metadataURI : url(IPFS) of metadata(json) about token
     * seatNum : seat number of ticket
     * price : price of token
     */
    event purchase(
        address from,
        address to,
        string indexed concertId,
        uint256 tokenId,
        uint256 price
    );

    /**
     * set price of ticket and status on sale
     */
    function setForSaleTicketToken(uint256 tokenId, uint256 ticketPrice)
        public
    {
        require(
            ticketPrice > 0,
            "PurchaseTicketToken : Price is zero or lower."
        );

        _ticketTokenPrices[tokenId] = ticketPrice;
        _onSaleTicketTokenArray.push(tokenId);
    }

    /**
     * purchase ticket
     */
    function purchaseTicketToken(uint256 tokenId) public payable {
        uint256 ticketPrice = _ticketTokenPrices[tokenId];
        address ticketOwner = mintTicketTokenAddress.ownerOf(tokenId);
        string memory concertId = mintTicketTokenAddress.ticketConcert(tokenId);

        require(ticketPrice > 0, "Ticket is not on sale.");
        require(msg.value >= ticketPrice, "Caller pay lower value than price");

        payable(ticketOwner).transfer(msg.value);
        mintTicketTokenAddress.safeTransferFrom(
            ticketOwner,
            msg.sender,
            tokenId
        );

        _ticketTokenPrices[tokenId] = 0;

        for (uint256 i = 0; i < _onSaleTicketTokenArray.length; i++) {
            if (_ticketTokenPrices[_onSaleTicketTokenArray[i]] == 0) {
                _onSaleTicketTokenArray[i] = _onSaleTicketTokenArray[
                    _onSaleTicketTokenArray.length - 1
                ];
                _onSaleTicketTokenArray.pop();
            }
        }

        emit purchase(ticketOwner, msg.sender, concertId, tokenId, ticketPrice);
    }

    /**
     * return number of ticket on sale
     */
    function getOnSaleTicketTokenArrayLenth() public view returns (uint256) {
        return _onSaleTicketTokenArray.length;
    }

    /**
     * check ticket token on sale
     */
    function checkOnSaleTicketTokenArray(uint256 tokenId)
        public
        view
        returns (bool)
    {
        for (uint256 i = 0; i < _onSaleTicketTokenArray.length; i++) {
            if (_onSaleTicketTokenArray[i] == tokenId) {
                return true;
            }
        }
        return false;
    }
}
