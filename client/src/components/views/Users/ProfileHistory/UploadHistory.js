import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd-v3';

import Meta from 'antd-v3/lib/card/Meta';
import Axios from 'axios';
import concertStyle from '../../MainPage/MainPage.module.css';

const UploadHistory = ({ account }) => {
  const [concerts, setConcerts] = useState([]);
  const renderCards = concerts.map((concert, index) => {
    return (
      <Col className={concertStyle.wrapper} key={index} lg={6} md={8} xs={24}>
        <div style={{ textAlign: 'left' }} className={concertStyle.concertImage}>
          <a href={`/concert/detail/${concert._id}`}>
            <div>
              <img
                style={{ width: '100%' }}
                src={`https://ipfs.io/ipfs/${concert.image.imageHash}/concertImage.jpg`}
                alt="concertImage"
              />
            </div>
          </a>
          <br />
          <Meta
            style={{ marginLeft: '1rem' }}
            title={concert.concertInfo.concertTitle}
            description={
              concert.concertInfo.description.length > 30
                ? `${concert.concertInfo.description.slice(0, 30)} ...`
                : concert.concertInfo.description
            }
          />
          <br />
          <Meta
            style={{ marginLeft: '1rem', fontSize: '12px' }}
            description={`Date : ${concert.concertInfo.concertDate.date} `}
          />

          <Meta
            style={{ marginLeft: '1rem', fontSize: '12px' }}
            description={`Reservation close : ${concert.concertInfo.reservation.close.date}`}
          />
          <hr />
          <p>
            &nbsp;&nbsp;from :&nbsp;
            {concert.concertInfo._id.length > 25
              ? `${concert.concertInfo._id.slice(0, 25)}...`
              : concert.concertInfo._id}
          </p>
        </div>
      </Col>
    );
  });
  useEffect(() => {
    Axios.get('http://localhost:5000/api/concert/getUserConcerts', { params: { _id: account } }).then((response) => {
      if (response.data.success) {
        setConcerts(response.data.concerts);
      } else {
        alert('콘서트 가져오기를 실패 했습니다.');
      }
    });
  }, [account]);
  return (
    <div style={{ width: '85%', margin: '2rem auto' }}>
      {concerts.length === 0 ? <div>등록하신 공연이 없습니다.</div> : <Row gutter={[32, 16]}>{renderCards}</Row>}
    </div>
  );
};

export default UploadHistory;
