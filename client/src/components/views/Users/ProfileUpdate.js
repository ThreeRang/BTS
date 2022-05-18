import React, { useState } from 'react';
import { Button, message, Input } from 'antd-v3';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

import profileUpdateStyle from './ProfileUpdate.module.css';

const ProfileUpdate = () => {
  const account = useParams().userAccount;
  const [updateName, setupdateName] = useState('');
  const [updateEmail, setupdateEmail] = useState('');
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
  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      _id: account,
      name: updateName,
      email: updateEmail,
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
      <div className={profileUpdateStyle.header}>
        <h1>profile update</h1>
      </div>
      <div>
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
  );
};

export default ProfileUpdate;
