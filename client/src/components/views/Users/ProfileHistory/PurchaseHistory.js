import React, { useState } from 'react';
import { Button, Col, Row } from 'antd-v3';
import concertStyle from '../../MainPage/MainPage.module.css';
import Meta from 'antd-v3/lib/card/Meta';
const PurchaseHistory = () => {
  const [tickets, setTickets] = useState([]);
  const renderCards = tickets.map((ticket, index) => {
    return (
      <Col className={concertStyle.wrapper} key={index} lg={6} md={8} xs={24}>
        <div style={{ textAlign: 'left' }} className={concertStyle.concertImage}>
          <div>
            <img
              style={{ width: '100%' }}
              /* src={`http://localhost:5000/${티켓이미지}}`} 티켓이미지 */
              alt="ticketImage"
            />
          </div>
          <br />
          <Meta
            style={{ marginLeft: '1rem' }}
            /* title={공연제목} 공연제목*/
          />
          <br />
          <Meta
            style={{ marginLeft: '1rem', fontSize: '12px' }}
            /* description={`Date : ${공연날짜} `} 공연날짜*/
          />
          <br />
          <Meta
            style={{ marginLeft: '1rem', fontSize: '12px' }}
            /* description={`예매 좌석 : ${좌석 정보}`} 좌석정보*/
          />
          <hr />
          <Button /* onClick={} */>사용하기</Button>
        </div>
      </Col>
    );
  });
  return (
    <div style={{ width: '85%', margin: '2rem auto' }}>
      {tickets.length === 1 ? <div>구매하신 티켓이 없습니다.</div> : <Row gutter={[32, 16]}>{renderCards}</Row>}
    </div>
  );
};

export default PurchaseHistory;
