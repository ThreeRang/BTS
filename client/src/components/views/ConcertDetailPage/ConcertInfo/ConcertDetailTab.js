import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Typography, Button } from 'antd-v3';
import detailTabStyle from './ConcertDetailTab.module.css';

const { Title } = Typography;
const ConcertDetailTab = ({ concertId }) => {
  const [writerAccount, setWriterAccount] = useState('');
  const [userAccount, setUserAccount] = useState('');
  const [concertTitle, setConcertTitle] = useState('');
  const [description, setDescription] = useState('');
  const [concertDate, setConcertDate] = useState('');
  const [numOfSeat, setNumOfSeat] = useState(0);
  const [concertAddress, setConcertAddress] = useState('');
  const [reservationOpen, setReservationOpen] = useState('');
  const [reservationClose, setReservationClose] = useState('');

  const onInit = async () => {
    await window.ethereum.enable();
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setUserAccount(accounts[0]);
  };

  useEffect(() => {
    onInit();
  }, [userAccount]);

  useEffect(() => {
    Axios.get('http://localhost:5000/api/concert/getConcertInfo', { params: { _id: concertId } }).then((response) => {
      if (response.data.success) {
        setWriterAccount(response.data.concert.concertInfo._id);
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
    <div className={detailTabStyle.wrapper}>
      <div className={detailTabStyle.concertTextBox}>
        <div style={{ display: 'block' }}>
          <Title level={1}>{concertTitle}</Title>
          <div style={{ float: 'right' }}>
            {writerAccount === userAccount ? (
              <div>
                <a href="">✏</a>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(writerAccount);
              alert('주소 복사 완료!');
            }}
          >
            {writerAccount.length > 15 ? '✍ ' + writerAccount.substring(0, 15) + '...' : '✍ ' + writerAccount}
          </Button>
        </div>
      </div>
      <br />
      <div className={detailTabStyle.concertTextInfo}>
        <div className={detailTabStyle.concertTextInfoUp}>
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
