import Meta from 'antd-v3/lib/card/Meta';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Col } from 'antd-v3';
import { mintContract, web3 } from '../../../../web3Config';
import ticketStyle from './ConcertItemsTab.module.css';
const TicketCard = ({ concertData }) => {
  return (
    <div style={{ width: '85%', margin: 'auto auto' }}>
      <Col className={ticketStyle.wrapper} lg={6} md={8} xs={24}>
        <div className={ticketStyle.ticketImage}>
          <a href={`/concert/detail/${concertData.concertId}/ticket/${concertData.id}`}>
            <div>
              <img style={{ width: '100%' }} src={`http://localhost:5000/${concertData.img}`} alt="ticketImage" />
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
  const [numOfSeat, setNumOfSeat] = useState(0);
  const [concertTitle, setConcertTitle] = useState('');
  const [concertDate, setConcertDate] = useState('');
  const [reservationClose, setReservationClose] = useState('');
  const [ticketImg, setTicketImg] = useState('');
  const [loading, setLoading] = useState(true);

  const getConcertTickets = async () => {
    try {
      var tickets = [];
      for (let i = 1; i <= numOfSeat; i++) {
        const ticketId = await mintContract.methods.ticketIdOfConcertSeatnum(concertId, i).call();
        const ticketPrice = await mintContract.methods.ticketPrices(ticketId).call();

        const ticketData = {
          id: ticketId,
          concertId: concertId,
          title: concertTitle,
          date: concertDate,
          reservationClose: reservationClose,
          img: ticketImg,
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
    if (numOfSeat !== 0 && concertTitle !== '' && concertDate !== '' && reservationClose !== '' && ticketImg !== '')
      getConcertTickets();
  }, [numOfSeat, concertTitle, concertDate, reservationClose, ticketImg]);

  useEffect(() => {
    Axios.get('http://localhost:5000/api/concert/getConcertInfo', { params: { _id: concertId } }).then((response) => {
      if (response.data.success) {
        setNumOfSeat(response.data.concert.concertInfo.numOfSeat);
        setConcertTitle(response.data.concert.concertInfo.concertTitle);
        setConcertDate(
          response.data.concert.concertInfo.concertDate.date + '/' + response.data.concert.concertInfo.concertDate.time
        );
        setReservationClose(
          response.data.concert.concertInfo.reservation.close.date +
            '/' +
            response.data.concert.concertInfo.reservation.close.time
        );
        setTicketImg(response.data.concert.image.ticketImage);
      } else {
        alert('????????? ??????????????? ?????? ????????????.');
      }
    });
  }, [concertId]);

  const listData = onSaleTickets.map((oneTicket, index) => (
    <TicketCard key={index} concertData={oneTicket}></TicketCard>
  ));
  return <div>{loading ? <h1>Loading...</h1> : listData}</div>;
};

export default ConcertItemsTab;
