import React, { useEffect, useState } from 'react';

import { Typography, Button } from 'antd-v3';
import detailTabStyle from './ConcertDetailTab.module.css';
import useConcert from '../../../../hooks/useConcert';

const { Title } = Typography;
const ConcertDetailTab = ({ concertId }) => {
  const [userAccount, setUserAccount] = useState('');
  const concert = useConcert({ concertId });

  const onInit = async () => {
    await window.ethereum.enable();
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setUserAccount(accounts[0]);
  };

  useEffect(() => {
    onInit();
  }, [userAccount]);

  return (
    <>
      {concert.isLoading ? (
        <h1>"Loading..."</h1>
      ) : (
        <div className={detailTabStyle.wrapper}>
          <div className={detailTabStyle.concertTextBox}>
            <div style={{ display: 'block' }}>
              <Title level={1}>{concert.concertInfo.concertTitle}</Title>
              <div style={{ float: 'right' }}>
                {concert.concertInfo._id === userAccount ? (
                  <div>
                    <a href={`/concert/detail/${concertId}/update`}>✏</a>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(concert.concertInfo._id);
                  alert('주소 복사 완료!');
                }}
              >
                {concert.concertInfo._id.length > 15
                  ? '✍ ' + concert.concertInfo._id.substring(0, 15) + '...'
                  : '✍ ' + concert.concertInfo._id}
              </Button>
            </div>
          </div>
          <br />
          <div className={detailTabStyle.concertTextInfo}>
            <div className={detailTabStyle.concertTextInfoUp}>
              <p>Address : {concert.concertInfo.concertAddress}</p>
              <p>
                {`Reservation : ${concert.concertInfo.reservation.open.date} (${concert.concertInfo.reservation.open.time}) ~ 
                ${concert.concertInfo.reservation.close.date} (${concert.concertInfo.reservation.close.time})
                `}
              </p>

              <hr />
              <p>{concert.concertInfo.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConcertDetailTab;
