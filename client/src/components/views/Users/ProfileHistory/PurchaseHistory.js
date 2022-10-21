import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'antd-v3';
import concertStyle from '../../MainPage/MainPage.module.css';
import Meta from 'antd-v3/lib/card/Meta';
import { mintContract } from '../../../../web3Config';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PurchaseHistory = ({ account }) => {
  const navigate = useNavigate();
  const [usedTickets, setUsedTickets] = useState([]);
  const [unUsedTickets, setUnUsedTickets] = useState([]);
  const [balances, setBalances] = useState(0);

  const onUseTicket = async (ticketId) => {
    await mintContract.methods.useTicket(ticketId).send({ from: account });
    await mintContract.methods
      .ticketUsed(ticketId)
      .call()
      .then(() => {
        alert('티켓이 사용되었습니다.');
        navigate('/');
      });
  };

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
      var usedTicketList = [];
      var notUsedTicketList = [];
      for (let i = 0; i < count; i++) {
        const ticketId = await mintContract.methods.tokenOfOwnerByIndex(account, i).call();
        const concertId = await mintContract.methods.ticketConcert(ticketId).call();
        const ticketPrice = await mintContract.methods.ticketPrices(ticketId).call();
        const seatNum = await mintContract.methods.ticketSeatnum(ticketId).call();
        const ticketUsed = await mintContract.methods.ticketUsed(ticketId).call();
        await Axios.get('http://localhost:5000/api/concert/getConcertInfo', { params: { _id: concertId } }).then(
          (response) => {
            if (response.data.success) {
              if (response.data.concert.concertInfo._id !== account) {
                const concertTitle = response.data.concert.concertInfo.concertTitle;
                const concertDate =
                  response.data.concert.concertInfo.concertDate.date +
                  '/' +
                  response.data.concert.concertInfo.concertDate.time;
                const ticketImg = response.data.concert.image.imageHash;
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
                if (ticketUsed) {
                  usedTicketList.push(purchaseTicketData);
                } else {
                  notUsedTicketList.push(purchaseTicketData);
                }
              }
            } else {
              alert('콘서트 가져오기를 실패 했습니다.');
            }
          }
        );
      }
      return [usedTicketList, notUsedTicketList];
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBalances().then((resurt) => {
      getTokenIds(resurt).then((ticketLists) => {
        setUsedTickets(ticketLists[0]);
        setUnUsedTickets(ticketLists[1]);
      });
    });
  }, [account]);

  const renderUseCards = usedTickets.map((ticket, index) => {
    return (
      <Col className={concertStyle.wrapper} key={index} lg={6} md={8} xs={24}>
        <div style={{ textAlign: 'left' }} className={concertStyle.concertImage}>
          <div>
            <img
              style={{ width: '100%' }}
              src={`https://ipfs.io/ipfs/${ticket.img}/ticketImage.jpg`}
              alt="ticketImage"
            />
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
          <Button disabled="disabled">사용됨</Button>
        </div>
      </Col>
    );
  });

  const renderNotUseCards = unUsedTickets.map((ticket, index) => {
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
          <Button
            onClick={() => {
              onUseTicket(ticket.id);
            }}
          >
            사용하기
          </Button>
        </div>
      </Col>
    );
  });

  return (
    <div style={{ width: '85%', margin: '2rem auto' }}>
      {usedTickets.length + unUsedTickets.length === 0 ? (
        <div>구매하신 티켓이 없습니다.</div>
      ) : (
        <div>
          <div>총 {usedTickets.length + unUsedTickets.length}장</div>
          {(function () {
            if (unUsedTickets.length !== 0) return <Row gutter={[32, 16]}>{renderNotUseCards}</Row>;
          })()}
          {(function () {
            if (usedTickets.length !== 0) return <Row gutter={[32, 16]}>{renderUseCards}</Row>;
          })()}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
