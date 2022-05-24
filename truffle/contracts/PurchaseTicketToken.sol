// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./MintTicketToken.sol";

contract PurchaseTicketToken{
    MintTicketToken public mintTicketTokenAddress;

    constructor (address _mintTicketTokenAddress){
        mintTicketTokenAddress = MintTicketToken(_mintTicketTokenAddress);
    }

    //(key, value) => (_tokenId, _ticketPrice)
    mapping(uint256 => uint256) public ticketTokenPrices;
    uint256[] public onSaleTicketTokenArray;

    function setForSaleTicketToken(uint256 _tokenId, uint256 _ticketPrice) public{
        address ticketOwner = mintTicketTokenAddress.ownerOf(_tokenId);

        require(_ticketPrice > 0, "Price is zero or lower");
        
        ticketTokenPrices[_tokenId] = _ticketPrice;
        onSaleTicketTokenArray.push(_tokenId);
    }

    function purchaseTicketToken(uint256 _tokenId) public payable{
        uint256 ticketPrice = ticketTokenPrices[_tokenId];
        address ticketOwner = mintTicketTokenAddress.ownerOf(_tokenId);
        require(ticketPrice > 0 , "Ticket Token not sale.");
        require(msg.value >= ticketPrice, "Caller sent lower than price");

        //msg.value : price보다 크거나 같은 값이 들어와야 된다.
        //이부분 살짝 이해 안됨
        payable(ticketOwner).transfer(msg.value);
        mintTicketTokenAddress.safeTransferFrom(ticketOwner, msg.sender, _tokenId);

        ticketTokenPrices[_tokenId] = 0;

        for(uint256 i = 0; i < onSaleTicketTokenArray.length ; i++){
            //위에서 토큰 가격을 0원으로 설정했으므로 그것 제거
            if(ticketTokenPrices[onSaleTicketTokenArray[i]] == 0){
                onSaleTicketTokenArray[i] = onSaleTicketTokenArray[onSaleTicketTokenArray.length - 1];
                onSaleTicketTokenArray.pop();
            }
        }
    }

    function getOnSaleTicketTokenArrayLenth() view public returns (uint256){
        return onSaleTicketTokenArray.length;
    }
}