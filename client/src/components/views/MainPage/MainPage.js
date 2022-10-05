import Meta from 'antd-v3/lib/card/Meta';
import Axios from 'axios';
import { Col, Typography, Row, Button } from 'antd-v3';
import React, { useEffect, useState } from 'react';
import concertStyle from './MainPage.module.css';
import { Input, Select } from 'antd-v3';
import Avatar from 'react-avatar';
import Banner from './Banner/Banner';

const { Option } = Select;
const { Search } = Input;
const { Title } = Typography;

const sortOption = [
  { value: 0, label: '공연날짜순' },
  { value: 1, label: '최신순' },
  { value: 2, label: '가나다순' },
  { value: 3, label: '예약마감순' },
];

const expired = [
  { value: 0, label: 'CLOSED' },
  { value: 1, label: 'OPEN' },
];
const MainPage = () => {
  const [concerts, setConcerts] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(0);
  const [close, setClose] = useState(0);
  /* const [userImage, setUserImage] = useState('');
  const [account, setAccount] = useState(''); */
  const onSearchChange = (e) => {
    setSearch(e.currentTarget.value);
  };

  const onSortChange = (slectSort) => {
    setSort(slectSort);
  };

  const onClose = () => {
    if (close == 0) {
      setClose(1);
    } else {
      setClose(0);
    }
  };
  useEffect(() => {
    Axios.get('http://localhost:5000/api/concert/getConcerts', {
      params: { search: search, close: close, sort: sort },
    }).then((response) => {
      if (response.data.success) {
        setConcerts(response.data.concerts);
      } else {
        alert('콘서트 가져오기를 실패 했습니다.');
      }
    });
  }, [search, sort, close]);
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
          <Meta
            style={{ marginLeft: '1rem', fontSize: '12px' }}
            description={`Date : ${concert.concertInfo.concertDate.date} `}
          />
          <Meta
            style={{ marginLeft: '1rem', fontSize: '12px' }}
            description={`Reservation close : ${concert.concertInfo.reservation.close.date}`}
          />
          <hr />
          &nbsp;&nbsp;
          {concert.image.userImage === '' ? (
            <Avatar facebookId="100008343750912" size="25" round={true} />
          ) : (
            <Avatar src={`http://localhost:5000/${concert.image.userImage}`} size="25" round={true} />
          )}
          <span>
            &nbsp;&nbsp;
            {concert.concertInfo._id.length > 20
              ? `${concert.concertInfo._id.slice(0, 20)}...`
              : concert.concertInfo._id}
          </span>
        </div>
      </Col>
    );
  });
  return (
    <div style={{ width: '85%', margin: '2rem auto' }}>
      <Banner />
      <br />
      <Title level={2}>
        <div>
          <div style={{ display: 'flex', float: 'left' }}>
            <Search placeholder="Search..." onChange={onSearchChange} value={search} style={{ width: 200 }} />
          </div>

          <div style={{ display: 'flex', float: 'right' }}>
            <Button onClick={onClose}>{expired[close].label}</Button>
            <Select defaultValue="공연마감순" style={{ width: 120 }} onChange={onSortChange}>
              {sortOption.map((item, index) => (
                <Option key={index} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </Title>
      <br />
      <hr />

      {concerts.length === 0 ? <div>입력하신 공연이 없습니다.</div> : <Row gutter={[32, 16]}>{renderCards}</Row>}
    </div>
  );
};

export default MainPage;
