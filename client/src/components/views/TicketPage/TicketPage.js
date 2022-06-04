import { Button, Typography, Card } from 'antd-v3';
import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { web3, mintContract, purchaseContract } from '../../../web3Config';
import { purchaseContractAddress } from '../../../smartContractConfig';
/* import ticketPageStyle from './TicketPage.module.css'; */

const { Text } = Typography;
const TicketPage = () => {
  const navigate = useNavigate();
  const { concertId, ticketId } = useParams();
  const [concertTitle, setConcertTitle] = useState('');
  const [description, setDescription] = useState('');
  const [concertDate, setConcertDate] = useState('');
  const [concertAddress, setConcertAddress] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [writerAccount, setWriterAccount] = useState('');
  const [ticketImage, setTicketImage] = useState('');
  const [ticketPrice, setTicketPrice] = useState(0);
  const [seatNum, setSeatNum] = useState(0);
  const [account, setAccount] = useState('');

  const onPurchaseTicket = async () => {
    try {
      if (!account) return;
      if (writerAccount === account[0]) {
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
  const oncheck = async () => {
    try {
      const owner = await mintContract.methods.ownerOf(ticketId).call();
      const approvalNow = await mintContract.methods.isApprovedForAll(account[0], purchaseContractAddress).call();
      console.log(account);
      console.log(writerAccount);
      console.log(owner);
      console.log(approvalNow);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    Axios.get('http://localhost:5000/api/concert/getConcertInfo', { params: { _id: concertId } }).then((response) => {
      if (response.data.success) {
        setTicketImage(response.data.concert.image.ticketImage);
        setWriterAccount(response.data.concert.concertInfo._id);
        setConcertTitle(response.data.concert.concertInfo.concertTitle);

        setDescription(response.data.concert.concertInfo.description);
        setConcertDate(
          response.data.concert.concertInfo.concertDate.date + '/' + response.data.concert.concertInfo.concertDate.time
        );
        setConcertAddress(response.data.concert.concertInfo.concertAddress);
        setReservationDate(
          response.data.concert.concertInfo.reservation.open.date +
            '/' +
            response.data.concert.concertInfo.reservation.open.time +
            '~' +
            response.data.concert.concertInfo.reservation.close.date +
            '/' +
            response.data.concert.concertInfo.reservation.close.time
        );
      } else {
        alert('티켓 정보를 읽는데 실패하였습니다.');
      }
    });
  }, [concertId]);

  return (
    <div style={{ width: '60%', margin: 'auto auto' }}>
      <Card title="Ticket Information" size="small">
        <div
          style={{
            display: 'flex',
            margin: '20px',
          }}
        >
          <div style={{ width: '300', height: '240', marginRight: '20px' }}>
            <img src={`http://localhost:5000/${ticketImage}`} alt="ticketImage" />
            <br />
          </div>
          <div>
            <Card title={`Title : ${concertTitle}`} size="small">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(writerAccount);
                  alert('주소 복사 완료!');
                }}
              >
                🏷: {writerAccount}
              </Button>
              <br />
              <Text>{`⏱ : ${reservationDate}`}</Text>
              <br />
              <Text>{`🗓 : ${concertDate}`}</Text>
              <br />
              <Text>{`🏁 : ${concertAddress}`}</Text>
              <br />
              <br />
            </Card>
            <Card title={`Ticket id : ${ticketId}`} size="small">
              <Text>{`🪑 : ${seatNum}`}</Text>
              <br />
              <Text>{`💰 : ${ticketPrice}`}</Text>
              <br />
              {/*  <p>{ticketPrice}</p> */}
              <Button onClick={onPurchaseTicket}>Buy now</Button>
              <Button onClick={oncheck}>check</Button>
              <br />
            </Card>
          </div>
        </div>
      </Card>
      <Card title="📝Description">
        <Text>{description}</Text>
      </Card>
    </div>
  );
};

export default TicketPage;
