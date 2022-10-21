import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { Tabs } from 'antd-v3';
import ConcertDetailTab from './ConcertInfo/ConcertDetailTab';
import ConcertItemsTab from './ConcertInfo/ConcertItemsTab';
import ConcertActivityTab from './ConcertInfo/ConcertActivityTab';

import detailPageStyle from './ConcertDetailPage.module.css';
const { TabPane } = Tabs;
const ConcertDetailPage = () => {
  const { concertId } = useParams();
  const [imageHash, setImageHash] = useState('');
  useEffect(() => {
    Axios.get('http://localhost:5000/api/concert/getConcertInfo', { params: { _id: concertId } }).then((response) => {
      if (response.data.success) {
        setImageHash(response.data.concert.image.imageHash);
      } else {
        alert('공연 정보를 읽는데 실패하였습니다.');
      }
    });
  }, [concertId]);
  return (
    <div className={detailPageStyle.wrapper}>
      <div className={detailPageStyle.profileImage}>
        <img src={`https://ipfs.io/ipfs/${imageHash}/concertImage.jpg`} alt="concertimage" />
      </div>
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Detail" key="1">
            <ConcertDetailTab concertId={concertId} />
          </TabPane>
          <TabPane tab="Items" key="2">
            <ConcertItemsTab concertId={concertId} />
          </TabPane>
          <TabPane tab="Activity" key="3">
            <ConcertActivityTab concertId={concertId} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ConcertDetailPage;
