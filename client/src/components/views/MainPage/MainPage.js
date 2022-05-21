import Meta from 'antd-v3/lib/card/Meta';
import Axios from 'axios';
import { Col, Typography, Row } from 'antd-v3';
import React, { useEffect, useState } from 'react';
import concertStyle from './MainPage.module.css';
import { Input, Select } from 'antd-v3';

const { Option } = Select;
const { Search } = Input;
const { Title } = Typography;

const sortOption = [
  { value: 0, label: '공연날짜순' },
  { value: 1, label: '최신순' },
  { value: 2, label: '가나다순' },
  { value: 3, label: '예약마감순' },
];

const MainPage = () => {
  const [concerts, setConcerts] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(0);

  const onSearchChange = (e) => {
    setSearch(e.currentTarget.value);
  };

  const onSortChange = (slectSort) => {
    setSort(slectSort);
  };
  useEffect(() => {
    Axios.get('http://localhost:5000/api/concert/getConcerts', { params: { search: search, sort: sort } }).then(
      (response) => {
        if (response.data.success) {
          setConcerts(response.data.concerts);
        } else {
          alert('콘서트 가져오기를 실패 했습니다.');
        }
      }
    );
  }, [search, sort]);
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
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex' }}>
            <Search placeholder="Search..." onChange={onSearchChange} value={search} style={{ width: 200 }} />
          </div>
          <div style={{ display: 'flex' }}>
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
      <hr />

      {concerts.length === 0 ? <div>입력하신 공연이 없습니다.</div> : <Row gutter={[32, 16]}>{renderCards}</Row>}
    </div>
  );
};

export default MainPage;
