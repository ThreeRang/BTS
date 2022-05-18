import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import Avatar from 'react-avatar';
import { Button } from 'antd-v3';

const Profile = () => {
  const account = useParams().userAccount;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(0);
  const [img, setImg] = useState('');
  console.log(account);
  useEffect(() => {
    Axios.get('http://localhost:5000/api/users/userProfile', { params: { _id: account } }).then((response) => {
      if (response.data.success) {
        setName(response.data.userInfo.name);
        setEmail(response.data.userInfo.email);
        setRole(response.data.userInfo.role);
        setImg(response.data.userInfo.img);
      } else {
        alert('유저 정보를 읽는데 실패하였습니다.');
      }
    });
  });
  return (
    <div>
      <div>
        <Avatar facebookId="100008343750912" size="150" round={true} />
      </div>
      <div>
        <Button onClick={() => navigator.clipboard.writeText(account)}>
          {account.length > 15 ? account.substring(0, 15) + '...' : account}
        </Button>
        <div>
          {name === 'none' ? <></> : <strong>name : {name}</strong>}
          {email === 'none' ? <></> : <strong>email : {email}</strong>}
          {role === 0 ? <strong>일반 사용자</strong> : <strong>매니저</strong>}
        </div>
      </div>
    </div>
  );
};
export default Profile;
