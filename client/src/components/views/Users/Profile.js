import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import Avatar from 'react-avatar';
import { Button } from 'antd-v3';
import { Nav } from 'react-bootstrap';

import PurchaseHistory from './ProfileHistory/PurchaseHistory';
import UploadHistory from './ProfileHistory/UploadHistory';
import profileStyle from './Profile.module.css';
const Profile = () => {
  const account = useParams().userAccount;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(0);
  const [img, setImg] = useState('');
  const [tab, setTab] = useState(0);

  const variables = {
    _id: account,
  };
  const onChangeRole = () => {
    if (role === 1) {
      alert('이미 권한있는 계정입니다.');
    } else {
      Axios.patch('http://localhost:5000/api/users/userRoleChange', variables).then((response) => {
        if (response.data.success) {
          alert('권한이 부여되었습니다.');
        } else {
          alert('권한 부여를 실패하였습니다.');
        }
      });
    }
  };
  const onChangeTab = (tabNum) => {
    setTab(tabNum);
  };
  const TabContent = (props) => {
    if (props.tab === 0) {
      return <PurchaseHistory account={account} />;
    } else if (props.tab === 1) {
      return <UploadHistory account={account} />;
    }
  };
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
  }, []);
  return (
    <div className={profileStyle.wrapper}>
      <div className={profileStyle.profileBackground}></div>
      <div className={profileStyle.profileInfo}>
        <div className={profileStyle.profileImg}>
          <Avatar facebookId="100008343750912" size="150" round={true} />
        </div>
        <br />
        <Button
          onClick={() => {
            navigator.clipboard.writeText(account);
            alert('주소 복사 완료!');
          }}
        >
          {account.length > 15 ? '✍ ' + account.substring(0, 15) + '...' : '✍ ' + account}
        </Button>
        <div>
          {name === 'none' ? <></> : <strong>name : {name}</strong>}
          <br />
          {email === 'none' ? <></> : <strong>email : {email}</strong>}
          <br />

          {role === 0 ? <strong>권한 : 일반 사용자</strong> : <strong>권한 : 매니저</strong>}
          <div className={profileStyle.updateButton}>
            <Button onClick={onChangeRole}>등록권한 신청</Button>
            <Button>
              <a href={`/users/Profile/Update/${account}`}>수정</a>
            </Button>
          </div>
          <hr />

          <Nav
            style={{ display: 'flex', justifyContent: 'center' }}
            className="mt-5 mb-3"
            variant="tabs"
            defaultActiveKey="link-0"
          >
            <div style={{ margin: '5px' }}>
              <Nav.Item>
                <Nav.Link
                  eventKey="link-0"
                  onClick={() => {
                    onChangeTab(0);
                  }}
                >
                  <Button>구매내역</Button>
                </Nav.Link>
              </Nav.Item>
            </div>
            <div style={{ margin: '5px' }}>
              <Nav.Item>
                <Nav.Link
                  eventKey="link-1"
                  onClick={() => {
                    onChangeTab(1);
                  }}
                >
                  <Button>등록내역</Button>
                </Nav.Link>
              </Nav.Item>
            </div>
          </Nav>
          <TabContent tab={tab} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
