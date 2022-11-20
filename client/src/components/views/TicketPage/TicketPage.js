import { Button, Typography, Card } from 'antd-v3';
import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { web3, mintContract, purchaseContract } from '../../../web3Config';
import { purchaseContractAddress } from '../../../smartContractConfig';
import useConcert from '../../../hooks/useConcert';

const { Text } = Typography;
const TicketPage = () => {
  const navigate = useNavigate();
  const { concertId, ticketId } = useParams();
  const concert = useConcert({ concertId });

  const [ticketPrice, setTicketPrice] = useState(0);
  const [seatNum, setSeatNum] = useState(0);
  const [account, setAccount] = useState('');

  const onPurchaseTicket = async () => {
    try {
      if (!account) return;
      if (concert.concertMetadata.concertInfo._id === account[0]) {
        return alert('해당 공연의 등록자는 티켓을 구매할 수 없습니다.');
      }
      await purchaseContract.methods
        .purchaseTicketToken(ticketId)
        .send({ from: account[0], value: ticketPrice })
        .then(() => {
          alert('구매를 완료하였습니다.');
          navigate('/');
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(async () => {
    const price = await mintContract.methods.ticketPrices(ticketId).call();
    const seat = await mintContract.methods.ticketSeatnum(ticketId).call();
    setTicketPrice(web3.utils.fromWei(price, 'wei'));
    setSeatNum(seat);
    window.ethereum.request({ method: 'eth_requestAccounts' }).then((result) => {
      setAccount(result);
    });
  }, [ticketPrice, seatNum]);

  return (
    <>
      {concert.isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <div style={{ width: '60%', margin: 'auto auto' }}>
          <Card title="Ticket Information" size="small">
            <div
              style={{
                display: 'flex',
                margin: '20px',
              }}
            >
              <div style={{ width: '300', height: '240', marginRight: '20px' }}>
                <img
                  src={`https://ipfs.io/ipfs/${concert.concertMetadata.image.imageHash}/ticketImage.jpg`}
                  alt="ticketImage"
                />
                <br />
              </div>
              <div>
                <Card title={`Title : ${concert.concertMetadata.concertInfo.concertTitle}`} size="small">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(concert.concertMetadata.concertInfo._id);
                      alert('주소 복사 완료!');
                    }}
                  >
                    🏷: {concert.concertMetadata.concertInfo._id}
                  </Button>
                  <br />
                  <Text>{`⏱ : ${concert.concertMetadata.concertInfo.reservation.open.date} (${concert.concertMetadata.concertInfo.reservation.open.time}) ~ 
                ${concert.concertMetadata.concertInfo.reservation.close.date} (${concert.concertMetadata.concertInfo.reservation.close.time})`}</Text>
                  <br />
                  <Text>{`🗓 :  ${concert.concertMetadata.concertInfo.concertDate.date} (${concert.concertMetadata.concertInfo.concertDate.time})`}</Text>
                  <br />
                  <Text>{`🏁 : ${concert.concertMetadata.concertInfo.concertAddress}`}</Text>
                  <br />
                  <br />
                </Card>
                <Card title={`Ticket id : ${ticketId}`} size="small">
                  <Text>{`🪑 : ${seatNum}`}</Text>
                  <br />
                  <Text>{`💰 : ${ticketPrice}`}</Text>
                  <br />
                  <Button onClick={onPurchaseTicket}>Buy now</Button>
                  <br />
                </Card>
              </div>
            </div>
          </Card>
          <Card title="📝Description">
            <Text>{concert.concertMetadata.concertInfo.description}</Text>
          </Card>
        </div>
      )}
    </>
  );
};

export default TicketPage;
