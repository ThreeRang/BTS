import React, { useEffect, useState } from 'react';
import { Button, Input, message } from 'antd-v3';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
const { TextArea } = Input;
const ConcertDetailUpdate = () => {
  const { concertId } = useParams();
  const navigate = useNavigate();
  const [concertTitle, setConcertTitle] = useState('');
  const [description, setDescription] = useState('');
  const [concertAddress, setconcertAddress] = useState('');
  const [numOfSeat, setNumOfSeat] = useState(0);
  const onTitleChange = (e) => {
    setConcertTitle(e.currentTarget.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  };

  const onConcertAddressChange = (e) => {
    setconcertAddress(e.currentTarget.value);
  };

  const onNumOfSeatChange = (e) => {
    setNumOfSeat(e.currentTarget.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      _id: concertId,
      update_id: concertTitle + Date.now(),
      concertInfo: {
        concertTitle: concertTitle,
        description: description,
        numOfSeat: numOfSeat,
        concertAddress: concertAddress,
      },
    };
    Axios.patch('http://localhost:5000/api/concert/updateConcert', variables).then((response) => {
      if (response.data.success) {
        message.success('성공적으로 업로드 하였습니다.');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        alert('콘서트 업로드에 실패 하였습니다.');
      }
    });
  };
  useEffect(() => {
    Axios.get('http://localhost:5000/api/concert/getConcertInfo', { params: { _id: concertId } }).then((response) => {
      if (response.data.success) {
        setConcertTitle(response.data.concert.concertInfo.concertTitle);
        setDescription(response.data.concert.concertInfo.description);
        setNumOfSeat(response.data.concert.concertInfo.numOfSeat);
        setconcertAddress(response.data.concert.concertInfo.concertAddress);
      } else {
        alert('공연 정보를 읽는데 실패하였습니다.');
      }
    });
  }, [concertId]);

  return (
    <div style={{ margin: ' auto auto', width: '60%' }}>
      <div style={{ textAlign: 'left', margin: '10px' }}>
        <label>Concert Title</label>
        <Input onChange={onTitleChange} value={concertTitle} placeholder={concertTitle} />
        <br />
        <br />
        <label>Concert Description</label>
        <TextArea onChange={onDescriptionChange} value={description} required />
        <br />
        <br />
        <label>Concert Address</label>
        <TextArea onChange={onConcertAddressChange} value={concertAddress} required />
        <br />
        <br />
        <label>Seat Number </label>
        <br />
        <input type="number" onChange={onNumOfSeatChange} value={numOfSeat} required />
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>
          submit
        </Button>
      </div>
    </div>
  );
};

export default ConcertDetailUpdate;
