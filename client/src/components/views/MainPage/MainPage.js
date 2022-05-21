import Meta from 'antd-v3/lib/card/Meta';
import Axios from 'axios';
import { Col, Typography, Row } from 'antd-v3';
import React, { useEffect, useState } from 'react';
import concertStyle from './MainPage.module.css';
const { Title } = Typography;

const MainPage = () => {
  const [concerts, setConcerts] = useState([]);
  const [search, setSearch] = useState('');

  const onSearchChange = (e) => {
    setSearch(e.currentTarget.value);
  };
  useEffect(() => {
    Axios.get('http://localhost:5000/api/concert/getConcerts', { params: { search: search } }).then((response) => {
      if (response.data.success) {
        setConcerts(response.data.concerts);
      } else {
        alert('콘서트 가져오기를 실패 했습니다.');
      }
    });
  }, [search]);
  const renderCards = concerts.map((concert, index) => {
    return (
      <Col className={concertStyle.wrapper} key={index} lg={6} md={8} xs={24}>
        <div className={concertStyle.concertImage}>
          <a href={`/concert/detail/${concert._id}`}>
            <div>
              <img
                style={{ width: '100%' }}
                src={`http://localhost:5000/${concert.image.concertImage}`}
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
          <Meta style={{ marginLeft: '1rem' }} description={`공연 날짜 : ${concert.concertInfo.concertDate.date} `} />

          <Meta
            style={{ marginLeft: '1rem' }}
            description={`예약 마감 : ${concert.concertInfo.reservation.close.date}`}
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
  return (
    <div style={{ width: '85%', margin: '2rem auto' }}>
      <Title level={2}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <input
            type="search"
            style={{ width: '250px', height: '30px', fontSize: '25px' }}
            placeholder="Search..."
            onChange={onSearchChange}
          />
        </div>
      </Title>
      <hr />
      {concerts.length === 0 ? <div>입력하신 공연 없다.</div> : <Row gutter={[32, 16]}>{renderCards}</Row>}
    </div>
  );
};

export default MainPage;
