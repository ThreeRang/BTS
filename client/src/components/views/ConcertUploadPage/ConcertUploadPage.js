import React, { useEffect, useState } from 'react';
import { Typography, Button, message, Form, Input, Icon } from 'antd-v3';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import uploadStyle from './ConcertUploadPage.module.css';
import { mintContract, purchaseContract, web3 } from '../../../web3Config';
import { privateKey, mintContractAddress, purchaseContractAddress } from '../../../smartContractConfig';
// import MintTicketTokenJSON from './MintTicketToken.json';
// import MintTicketToken from '../../../abi/MintTicketToken.json';
// import { create } from 'ipfs-http-client';

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
  const [reservationOpenDate, setReservationOpenDate] = useState('');
  const [reservationCloseDate, setReservationCloseDate] = useState('');
  const [reservationOpenTime, setReservationOpenTime] = useState('');
  const [reservationCloseTime, setReservationCloseTime] = useState('');
  const [concertDate, setConcertDate] = useState('');
  const [concertTime, setConcertTime] = useState('');
  const [ticketPrice, setTicketPrice] = useState(0);

  const [concertImagePath, setconcertImagePath] = useState('');
  const [seatImagePath, setSeatImagePath] = useState('');
  const [ticketImagePath, setTicketImagePath] = useState('');
  const [userImagePath, setUserImagePath] = useState('');

  const [metadataURI, setMetadataURI] = useState('');
  const [imageHash, setImageHash] = useState('');

  const onSetting = async () => {
    const setOne = await mintContract.methods.setPurchaseTicketToken(purchaseContractAddress).send({ from: account });
    const setTwo = await mintContract.methods.setApprovalForAll(purchaseContractAddress, true).send({ from: account });
  };

  const onSubmitNft = async (concert) => {
    var tokensId = [];
    Axios.post('http://localhost:5000/api/upload/uploadIPFS', {
      concertImagePath: concertImagePath,
      seatImagePath: seatImagePath,
      ticketImagePath: ticketImagePath,
    }).then((response) => {
      console.log(response);
      setImageHash(response.data.imageHash);
    });
    for (var i = 1; i <= numOfSeat; i++) {
      const nonce = await web3.eth.getTransactionCount(account, 'latest');
      const tx = {
        from: account,
        to: mintContractAddress,
        nonce: nonce,
        gas: 500000,
        data: mintContract.methods.mintTicketToken(account, metadataURI, concert._id, i, ticketPrice).encodeABI(),
      };
      //tx작성, tx와 private key필요
      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      //영수증 발행
      const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
      const tokenId = await mintContract.methods.ticketIdOfConcertSeatnum(concert._id, i).call();

      tokensId.push({ tokenId: tokenId, price: ticketPrice });
    }
    return tokensId;
  };

  // const onSetSale = async (tokensId) => {
  //   for (var token of tokensId) {
  //     const setSeat = await purchaseContract.methods
  //       .setForSaleTicketToken(token.tokenId, web3.utils.toWei(token.price, 'wei'))
  //       .send({ from: account });
  //   }
  // };

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

  const onTicketPriceChange = (e) => {
    setTicketPrice(e.currentTarget.value);
  };
  /*
    예약 오픈 마감 일정 
  */
  const onOpenDateChange = (e) => {
    setReservationOpenDate(e.currentTarget.value);
  };

  const onOpenTimeChange = (e) => {
    setReservationOpenTime(e.currentTarget.value);
  };

  const onCloseDateChange = (e) => {
    setReservationCloseDate(e.currentTarget.value);
  };
  const onCloseTimeChange = (e) => {
    setReservationCloseTime(e.currentTarget.value);
  };

  /*
    콘서트 일정
  */
  const onConcertDateChange = (e) => {
    setConcertDate(e.currentTarget.value);
  };

  const onConcertTimeChange = (e) => {
    setConcertTime(e.currentTarget.value);
  };

  const onDropConcertImage = (files) => {
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]);
    Axios.post('http://localhost:5000/api/upload/concertImage', formData, config).then((response) => {
      if (response.data.success) {
        setconcertImagePath(`metadata_image/concertImage/${response.data.fileName}`);
        console.log(response.data.fileName);
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
        setSeatImagePath(`metadata_image/seatImage/${response.data.fileName}`);
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
        setTicketImagePath(`metadata_image/ticketImage/${response.data.fileName}`);
      } else {
        alert('사진 업로드를 실패했습니다.');
        navigate('/');
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!concertTitle || !description || !concertAddress || !numOfSeat) {
      alert('공연정보를 입력해주세요.');
      return;
    }
    if (!concertImagePath || !seatImagePath || !ticketImagePath) {
      alert('이미지란이 비었습니다. 이미지를 넣어주세요.');
      return;
    }
    if (
      !reservationOpenDate ||
      !reservationCloseDate ||
      !reservationOpenTime ||
      !reservationCloseTime ||
      !concertDate ||
      !concertTime
    ) {
      alert('날짜와 시간을 선택해주세요.');
      return;
    }
    const variables = {
      _id: concertTitle + Date.now(),
      concertInfo: {
        _id: account,
        concertTitle: concertTitle,
        description: description,
        concertDate: {
          date: concertDate,
          time: concertTime,
        },
        numOfSeat: numOfSeat,
        concertAddress: concertAddress,
        reservation: {
          open: {
            date: reservationOpenDate,
            time: reservationOpenTime,
          },
          close: {
            date: reservationCloseDate,
            time: reservationCloseTime,
          },
        },
      },
      image: {
        concertImage: concertImagePath,
        ticketImage: ticketImagePath,
        seatImage: seatImagePath,
        userImage: userImagePath,
      },
    };
    Axios.post('http://localhost:5000/api/upload/uploadConcert', variables).then((response) => {
      if (response.data.success) {
        message.success('업로드 중입니다...');
        onSetting().then(() => {
          onSubmitNft(response.data.concert).then((resurt) => {
            message.success('성공적으로 업로드 하였습니다.');
            setTimeout(() => {
              navigate('/');
            }, 3000);
          });
          // onSetSale(resurt).then(() => {
          // });
        });
      } else {
        alert('콘서트 업로드에 실패 하였습니다.');
      }
    });
  };

  useEffect(() => {
    Axios.get('http://localhost:5000/api/users/userProfile', { params: { _id: account } }).then((response) => {
      if (response.data.success) {
        if (response.data.userInfo.image !== undefined) {
          setUserImagePath(response.data.userInfo.image);
        }
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
  }, [account, navigate]);
  return (
    <div className={uploadStyle.wrapper}>
      <Form onSubmit={onSubmit}>
        <Title level={3}>공연 이미지 업로드</Title>
        <div>
          <Dropzone onDrop={onDropConcertImage} multiple={false} maxSize={1000000000}>
            {({ getRootProps, getInputProps }) => (
              <div className={uploadStyle.bigBox} {...getRootProps()}>
                <input {...getInputProps()} />
                {!concertImagePath ? (
                  <div>
                    <Icon type="plus" className={uploadStyle.boxIcon} />
                    <br />
                    <h1 style={{ fontSize: '20px' }}> Insert your Concert Image</h1>
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
        <div className={uploadStyle.smallWrapper}>
          <div>
            <Title level={3}>좌석표 이미지 업로드</Title>
            <Dropzone onDrop={onDropSeatImage} multiple={false} maxSize={1000000000}>
              {({ getRootProps, getInputProps }) => (
                <div className={uploadStyle.smallBox} {...getRootProps()}>
                  <input {...getInputProps()} />
                  {!seatImagePath ? (
                    <div>
                      <Icon type="plus" className={uploadStyle.boxIcon} />
                      <br />
                      <h1 style={{ fontSize: '20px' }}> Insert your Seat Image</h1>
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
            <Title level={3}>티켓 이미지 업로드</Title>
            <Dropzone onDrop={onDropTicketImage} multiple={false} maxSize={1000000000}>
              {({ getRootProps, getInputProps }) => (
                <div className={uploadStyle.smallBox} {...getRootProps()}>
                  <input {...getInputProps()} />
                  {!ticketImagePath ? (
                    <div>
                      <Icon type="plus" className={uploadStyle.boxIcon} />
                      <br />
                      <h1 style={{ fontSize: '20px' }}> Insert your Ticket Image</h1>
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
        <div style={{ textAlign: 'left' }}>
          <label>Concert Title</label>
          <Input onChange={onTitleChange} value={concertTitle} />
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
          <div style={{ display: 'flex' }}>
            <div>
              <label>Seat Number </label>
              <br />
              <input type="number" onChange={onNumOfSeatChange} value={numOfSeat} required />
            </div>
            <div>
              <label>Ticket Price</label>
              <br />
              <input type="number" onChange={onTicketPriceChange} value={ticketPrice} />
            </div>
          </div>
          <br />
          <br />
          <div style={{ display: 'flex' }}>
            <div>
              <label>Reservation open</label>
              <br />
              <input type="date" onChange={onOpenDateChange} value={reservationOpenDate} />
              <input type="time" onChange={onOpenTimeChange} value={reservationOpenTime} />
            </div>
            <div>
              <label>Reservation close</label>
              <br />
              <input type="date" onChange={onCloseDateChange} value={reservationCloseDate} />
              <input type="time" onChange={onCloseTimeChange} value={reservationCloseTime} />
            </div>
          </div>
          <br />
          <div>
            <label>Concert Date</label>
            <br />
            <input type="date" onChange={onConcertDateChange} value={concertDate} />
            <input type="time" onChange={onConcertTimeChange} value={concertTime} />
          </div>
          <br />
          <br />
          <Button type="primary" size="large" onClick={onSubmit}>
            submit
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ConcertUploadPage;
