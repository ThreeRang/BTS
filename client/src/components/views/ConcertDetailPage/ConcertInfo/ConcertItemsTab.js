import Meta from 'antd-v3/lib/card/Meta';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Col, Typography, Row, Input, Select } from 'antd-v3';
import Avatar from 'react-avatar';
import { useParams } from 'react-router-dom';
import { mintContract } from '../../../../web3Config';

const TicketCard = ({ concertData }) => {
  return (
    <>
      {console.log(concertData)}
      <Col lg={6} md={8} xs={24}>
        <div>
          <div>
            <img style={{ width: '100%' }} src={`http://localhost:5000/${concertData.img}`} alt="ticketImage" />
          </div>
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
            description={`Ticket prices : ${concertData.price} `}
          />
          <hr />
          <Meta
            style={{ marginLeft: '1rem', fontSize: '12px' }}
            description={`Reservation close : ${concertData.reservationClose}`}
          />
        </div>
      </Col>
    </>
  );
};

const ConcertItemsTab = ({ concertId }) => {
  const [onSaleTickets, setOnSaleTickets] = useState([]);
  const [numOfSeat, setNumOfSeat] = useState(0);
  const [concertTitle, setConcertTitle] = useState('');
  const [concertDate, setConcertDate] = useState('');
  const [reservationClose, setReservationClose] = useState('');
  const [ticketImg, setTicketImg] = useState('');

  const getConcertTickets = async () => {
    try {
      var tickets = [];
      for (let i = 1; i <= numOfSeat; i++) {
        const ticketId = await mintContract.methods.ticketIdOfConcertSeatnum(concertId, i).call();
        const ticketPrice = await mintContract.methods.ticketPrices(ticketId).call();

        const ticketData = {
          id: ticketId,
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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
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
        console.log('set sale tickets');
      } else {
        alert('콘서트 가져오기를 실패 했습니다.');
      }
    });
  }, [concertId]);

  console.log(onSaleTickets);

  const listData = onSaleTickets.map((oneTicket, index) => (
    <TicketCard key={index} concertData={oneTicket}></TicketCard>
  ));
  return <div>{listData}</div>;
};

export default ConcertItemsTab;
