import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'antd-v3';
import concertStyle from '../../MainPage/MainPage.module.css';
import Meta from 'antd-v3/lib/card/Meta';
import { mintContract, web3 } from '../../../../web3Config';
import Axios from 'axios';

const PurchaseHistory = ({ account }) => {
  const [tickets, setTickets] = useState([]);
  const [balances, setBalances] = useState(0);

  const getBalances = async () => {
    try {
      const balance = await mintContract.methods.balanceOf(account).call();
      setBalances(balance);
      return balance;
    } catch (error) {
      console.error(error);
    }
  };

  const getTokenIds = async (count) => {
    try {
      var ticketList = [];
      for (let i = 0; i < count; i++) {
        const ticketId = await mintContract.methods.tokenOfOwnerByIndex(account, i).call();
        const concertId = await mintContract.methods.ticketConcert(ticketId).call();
        const ticketPrice = await mintContract.methods.ticketPrices(ticketId).call();
        const seatNum = await mintContract.methods.ticketSeatnum(ticketId).call();
        const ticketUsed = await mintContract.methods.ticketUsed(ticketId).call();
        await Axios.get('http://localhost:5000/api/concert/getConcertInfo', { params: { _id: concertId } }).then(
          (response) => {
            if (response.data.success) {
              const concertTitle = response.data.concert.concertInfo.concertTitle;
              const concertDate =
                response.data.concert.concertInfo.concertDate.date +
                '/' +
                response.data.concert.concertInfo.concertDate.time;
              const ticketImg = response.data.concert.image.ticketImage;
              const purchaseTicketData = {
                id: ticketId,
                concertId: concertId,
                title: concertTitle,
                date: concertDate,
                img: ticketImg,
                seatNumber: seatNum,
                price: ticketPrice,
                used: ticketUsed,
              };
              ticketList.push(purchaseTicketData);
            } else {
              alert('콘서트 가져오기를 실패 했습니다.');
            }
          }
        );
      }
      return ticketList;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBalances().then((resurt) => {
      getTokenIds(resurt).then((ticketList) => {
        setTickets(ticketList);
      });
    });
  }, [account]);

  const renderCards = tickets.map((ticket, index) => {
    return (
      <Col className={concertStyle.wrapper} key={index} lg={6} md={8} xs={24}>
        <div style={{ textAlign: 'left' }} className={concertStyle.concertImage}>
          <div>
            <img style={{ width: '100%' }} src={`http://localhost:5000/${ticket.img}`} alt="ticketImage" />
          </div>
          <br />
          <Meta style={{ marginLeft: '1rem' }} title={ticket.title} />
          <br />
          <Meta style={{ marginLeft: '1rem', fontSize: '12px' }} description={`Date : ${ticket.date} `} />
          <br />
          <Meta style={{ marginLeft: '1rem', fontSize: '12px' }} description={`Seat Number : ${ticket.seatNumber}`} />
          <br />
          <Meta style={{ marginLeft: '1rem', fontSize: '12px' }} description={`Already Used : ${ticket.used}`} />
          <hr />
          <Button /* onClick={} */>사용하기</Button>
        </div>
      </Col>
    );
  });

  return (
    <div style={{ width: '85%', margin: '2rem auto' }}>
      {tickets.length === 0 ? (
        <div>구매하신 티켓이 없습니다.</div>
      ) : (
        <div>
          <div>총 {tickets.length}장</div>
          <Row gutter={[32, 16]}>{renderCards}</Row>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
