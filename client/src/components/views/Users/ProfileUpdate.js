import React, { useState } from 'react';
import { Button, message, Input, Icon } from 'antd-v3';
import { useParams } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

import profileUpdateStyle from './ProfileUpdate.module.css';

const ProfileUpdate = () => {
  const account = useParams().userAccount;
  const [updateName, setupdateName] = useState('');
  const [updateEmail, setupdateEmail] = useState('');
  const [userImagePath, setUserImagePath] = useState('');
  const navigate = useNavigate();

  const onChangeName = (e) => {
    if (!e.target.value) {
      setupdateName('none');
    } else {
      setupdateName(e.target.value);
    }
  };
  const onChangeEmail = (e) => {
    if (!e.target.value) {
      setupdateEmail('none');
    } else {
      setupdateEmail(e.target.value);
    }
  };

  const onDropUserImage = (files) => {
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]);
    Axios.post('http://localhost:5000/api/users/userImage', formData, config).then((response) => {
      if (response.data.success) {
        setUserImagePath(`image/userImage/${response.data.fileName}`);
      } else {
        alert('사진 업로드를 실패했습니다.');
        navigate('/');
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      _id: account,
      name: updateName,
      email: updateEmail,
      image: userImagePath,
    };
    if (window.confirm('수정하시겠습니까?')) {
      Axios.patch('http://localhost:5000/api/users/update', variables).then((response) => {
        if (response.data.success) {
          message.success('성공적으로 수정하였습니다.');
        } else {
          alert('수정에 실패 했습니다.');
        }
      });
      setTimeout(() => {
        navigate(`/users/Profile/${account}`);
      }, 3000);
    }
  };

  return (
    <div className={profileUpdateStyle.wrapper}>
      <div className={profileUpdateStyle.imageBox}>
        <h1>Profile update</h1>
        <Dropzone onDrop={onDropUserImage} multiple={false} maxSize={1000000000}>
          {({ getRootProps, getInputProps }) => (
            <div className={profileUpdateStyle.smallBox} {...getRootProps()}>
              <input {...getInputProps()} />
              {!userImagePath ? (
                <div>
                  <Icon type="plus" className={profileUpdateStyle.boxIcon} />
                  <br />
                  <h1 style={{ fontSize: '20px' }}> Insert your User Image</h1>
                </div>
              ) : (
                <div>
                  <img src={`http://localhost:5000/${userImagePath}`} alt="UserImage" />
                </div>
              )}
            </div>
          )}
        </Dropzone>

        <br />
        <div className={profileUpdateStyle.textBox}>
          <label>Name</label>
          <Input alt="이름을 입력하세요" onChange={onChangeName} />
          <br />
          <br />
          <label>E-mail</label>
          <Input alt="이메일을 입력해주세요" onChange={onChangeEmail} />
          <br />
          <br />

          <Button size="large" onClick={onSubmit}>
            수정
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
