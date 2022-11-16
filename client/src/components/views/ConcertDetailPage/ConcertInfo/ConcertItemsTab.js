import Meta from 'antd-v3/lib/card/Meta';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Col } from 'antd-v3';
import { mintContract, purchaseContract, web3 } from '../../../../web3Config';
import ticketStyle from './ConcertItemsTab.module.css';
import useConcert from '../../../../hooks/useConcert';

const TicketCard = ({ concertData }) => {
  return (
    <div style={{ width: '85%', margin: 'auto auto' }}>
      <Col className={ticketStyle.wrapper} lg={6} md={8} xs={24}>
        <div className={ticketStyle.ticketImage}>
          <a href={`/concert/detail/${concertData.concertId}/ticket/${concertData.id}`}>
            <div>
              <img
                style={{ width: '100%' }}
                src={`https://ipfs.io/ipfs/${concertData.img}/ticketImage.jpg`}
                alt="ticketImage"
              />
            </div>
          </a>
          <br />
          <Meta style={{ marginLeft: '1rem' }} title={concertData.title} />
          <br />
          <Meta style={{ marginLeft: '1rem', fontSize: '12px' }} description={`Concert date : ${concertData.date} `} />
          <Meta
            style={{ marginLeft: '1rem', fontSize: '12px' }}
            description={`Seat Number : ${concertData.seatNumber}`}
          />
          <Meta
            style={{ marginLeft: '1rem', fontSize: '12px' }}
            description={`Ticket prices : ${web3.utils.fromWei(concertData.price, 'wei')} `}
          />
          <hr />
          <Meta
            style={{ marginLeft: '1rem', fontSize: '12px' }}
            description={`Reservation close : ${concertData.reservationClose}`}
          />
        </div>
      </Col>
    </div>
  );
};

const ConcertItemsTab = ({ concertId }) => {
  const [onSaleTickets, setOnSaleTickets] = useState([]);
  const concert = useConcert({ concertId });
  const [loading, setLoading] = useState(true);

  const getConcertTickets = async () => {
    try {
      var tickets = [];
      for (let i = 1; i <= concert.concertMetadata.concertInfo.numOfSeat; i++) {
        const ticketId = await mintContract.methods.ticketIdOfConcertSeatnum(concertId, i).call();
        const onSale = await purchaseContract.methods.checkOnSaleTicketTokenArray(ticketId).call();
        if (!onSale) continue;
        const ticketPrice = await mintContract.methods.ticketPrices(ticketId).call();

        const ticketData = {
          id: ticketId,
          concertId: concertId,
          title: concert.concertMetadata.concertInfo.concertTitle,
          date: `${concert.concertMetadata.concertInfo.concertDate.date} (${concert.concertMetadata.concertInfo.concertDate.time})`,
          reservationClose: `${concert.concertMetadata.concertInfo.reservation.close.date} (${concert.concertMetadata.concertInfo.reservation.close.time})`,
          img: concert.concertMetadata.image.imageHash,
          seatNumber: i,
          price: ticketPrice,
        };
        tickets.push(ticketData);
      }
      setOnSaleTickets(tickets);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!concert.isLoading) {
      getConcertTickets();
    }
  }, [concert.isLoading]);

  const listData = onSaleTickets.map((oneTicket, index) => (
    <TicketCard key={index} concertData={oneTicket}></TicketCard>
  ));
  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <div>
            <img
              src={`https://ipfs.io/ipfs/${concert.concertMetadata.image.imageHash}/seatImage.jpg`}
              alt="seatImage"
            />
          </div>
          {listData}
        </>
      )}
    </div>
  );
};

export default ConcertItemsTab;
