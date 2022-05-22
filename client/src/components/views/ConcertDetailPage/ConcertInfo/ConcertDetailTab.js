import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Typography, Button } from 'antd-v3';
const { Title } = Typography;
const ConcertDetailTab = ({ concertId }) => {
  const [account, setAccount] = useState('');
  const [concertTitle, setConcertTitle] = useState('');
  const [description, setDescription] = useState('');
  const [concertDate, setConcertDate] = useState('');
  const [numOfSeat, setNumOfSeat] = useState(0);
  const [concertAddress, setConcertAddress] = useState('');
  const [reservationOpen, setReservationOpen] = useState('');
  const [reservationClose, setReservationClose] = useState('');

  useEffect(() => {
    Axios.get('http://localhost:5000/api/concert/getConcertInfo', { params: { _id: concertId } }).then((response) => {
      if (response.data.success) {
        setAccount(response.data.concert.concertInfo._id);
        setConcertTitle(response.data.concert.concertInfo.concertTitle);
        setDescription(response.data.concert.concertInfo.description);
        setConcertDate(
          response.data.concert.concertInfo.concertDate.date + '/' + response.data.concert.concertInfo.concertDate.time
        );
        setNumOfSeat(response.data.concert.concertInfo.numOfSeat);
        setConcertAddress(response.data.concert.concertInfo.concertAddress);
        setReservationOpen(
          response.data.concert.concertInfo.reservation.open.date +
            '/' +
            response.data.concert.concertInfo.reservation.open.time
        );
        setReservationClose(
          response.data.concert.concertInfo.reservation.close.date +
            '/' +
            response.data.concert.concertInfo.reservation.close.time
        );
      } else {
        alert('공연 정보를 읽는데 실패하였습니다.');
      }
    });
  }, [concertId]);
  return (
    <div style={{ width: '50%', textAlign: 'left', margin: 'auto auto' }}>
      <div style={{ textAlign: 'center' }}>
        <Title level={1}>{concertTitle}</Title>
        <div>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(account);
              alert('주소 복사 완료!');
            }}
          >
            {account.length > 15 ? '✍ ' + account.substring(0, 15) + '...' : '✍ ' + account}
          </Button>
        </div>
      </div>
      <br />
      <div style={{ border: '1px solid black', borderRadius: '10px' }}>
        <div style={{ margin: '10px' }}>
          <p>Date : {concertDate}</p>
          <p>Address : {concertAddress}</p>
          <p>
            reservation : {reservationOpen} ~ {reservationClose}
          </p>
          <hr />
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ConcertDetailTab;
