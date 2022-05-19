import React, { useEffect, useState } from 'react';
import { Typography, Button, message, Form, Input, Icon } from 'antd-v3';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Title } = Typography;

function ConcertUploadPage(props) {
  /*Register변수 DB에 저장할 때 누가 저장했는지 저장할 변수*/
  /* const [Register, setRegister] = useState("") */
  const account = useParams().userAccount;
  const navigate = useNavigate();
  const [concertTitle, setConcertTitle] = useState('');
  const [description, setDescription] = useState('');
  const [concertAddress, setconcertAddress] = useState('');
  const [numOfSeat, setNumOfSeat] = useState(0);
  /*서버 연결 이후 저장에 필요한 local Storage에 저장될 path */

  const [concertImagePath, setconcertImagePath] = useState('');
  const [seatImagePath, setSeatImagePath] = useState('');
  const [ticketImagePath, setTicketImagePath] = useState('');

  /*-------------------onChange----------------------*/
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
  /*서버 연결 이후 구현*/
  const onDropConcertImage = (files) => {
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]);
    Axios.post('http://localhost:5000/api/upload/concertImage', formData, config).then((response) => {
      if (response.data.success) {
        setconcertImagePath(`image/concertImage/${response.data.fileName}`);
      } else {
        alert('사진 업로드를 실패했습니다.');
        navigate('/');
      }
    });
  };
  const onDropSeatImage = (files) => {
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]);
    Axios.post('http://localhost:5000/api/upload/seatImage', formData, config).then((response) => {
      if (response.data.success) {
        setSeatImagePath(`image/seatImage/${response.data.fileName}`);
      } else {
        alert('사진 업로드를 실패했습니다.');
        navigate('/');
      }
    });
  };
  const onDropTicketImage = (files) => {
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]);
    Axios.post('http://localhost:5000/api/upload/ticketImage', formData, config).then((response) => {
      if (response.data.success) {
        setTicketImagePath(`image/ticketImage/${response.data.fileName}`);
      } else {
        alert('사진 업로드를 실패했습니다.');
        navigate('/');
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      _id: concertTitle + Date.now(),
      concertInfo: {
        _id: account,
        concertTitle: concertTitle,
        description: description,
        numOfSeat: numOfSeat,
        concertAddress: concertAddress,
      },
      image: {
        concertImage: concertImagePath,
        ticketImage: ticketImagePath,
        seatImage: seatImagePath,
      },
    };
    Axios.post('http://localhost:5000/api/upload/uploadConcert', variables).then((response) => {
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
    Axios.get('http://localhost:5000/api/users/userProfile', { params: { _id: account } }).then((response) => {
      console.log(response.data);
      if (response.data.success) {
        if (response.data.userInfo.role === 0) {
          alert('권한이 없습니다.');
          setTimeout(() => {
            navigate('/');
          });
        }
      } else {
        alert('유저 정보를 읽지 못했습니다.');
        setTimeout(() => {
          navigate(`/users/Profile/${account}`);
        });
      }
    });
  }, []);
  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <Form onSubmit={onSubmit}>
        <Title level={2}>-공연 이미지 업로드</Title>
        <div style={{ display: 'center' }}>
          <Dropzone onDrop={onDropConcertImage} multiple={false} maxSize={1000000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{ width: '100%', height: '240px', border: '1px solid lightgray', textAlign: 'center' }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {!concertImagePath ? (
                  <div>
                    <Icon type="plus" style={{ fontSize: '3rem', marginTop: '90px' }} />
                    <br />
                    <h1 style={{ fontSize: '20px' }}> insert your Concert Image</h1>
                  </div>
                ) : (
                  <div>
                    <img src={`http://localhost:5000/${concertImagePath}`} alt="concertImage" />
                  </div>
                )}
              </div>
            )}
          </Dropzone>
        </div>
        <br />
        <br />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Title level={2}>-좌석표 이미지 업로드</Title>
            <Dropzone onDrop={onDropSeatImage} multiple={false} maxSize={1000000000}>
              {({ getRootProps, getInputProps }) => (
                <div
                  style={{ width: '300px', height: '240px', border: '1px solid lightgray', textAlign: 'center' }}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  {!seatImagePath ? (
                    <div>
                      <Icon type="plus" style={{ fontSize: '3rem', marginTop: '90px' }} />
                      <br />
                      <h1 style={{ fontSize: '20px' }}> insert your Seat Image</h1>
                    </div>
                  ) : (
                    <div>
                      <img src={`http://localhost:5000/${seatImagePath}`} alt="seatimage" />
                    </div>
                  )}
                </div>
              )}
            </Dropzone>
          </div>
          <div>
            <Title level={2}>-티켓 이미지 업로드</Title>
            <Dropzone onDrop={onDropTicketImage} multiple={false} maxSize={1000000000}>
              {({ getRootProps, getInputProps }) => (
                <div
                  style={{ width: '300px', height: '240px', border: '1px solid lightgray', textAlign: 'center' }}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  {!ticketImagePath ? (
                    <div>
                      <Icon type="plus" style={{ fontSize: '3rem', marginTop: '90px' }} />
                      <br />
                      <h1 style={{ fontSize: '20px' }}> insert your Ticket Image</h1>
                    </div>
                  ) : (
                    <div>
                      <img src={`http://localhost:5000/${ticketImagePath}`} alt="ticketimage" />
                    </div>
                  )}
                </div>
              )}
            </Dropzone>
          </div>
        </div>
        <br />
        <br />
        <label>Concert Title</label>
        <Input onChange={onTitleChange} value={concertTitle} />
      </Form>
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
      <input type="number" onChange={onNumOfSeatChange} value={numOfSeat} required />
      <br />
      <br />
      <Button type="primary" size="large" onClick={onSubmit}>
        submit
      </Button>
    </div>
  );
}

export default ConcertUploadPage;
