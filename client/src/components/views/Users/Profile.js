import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import Avatar from 'react-avatar';
import { Button } from 'antd-v3';
import profileStyle from './Profile.module.css';
import { Nav } from 'react-bootstrap';
import PurchaseDetail from './PurchaseDetail';
import RegisterDetail from './RegisterDetail';

const Profile = () => {
  const account = useParams().userAccount;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(0);
  const [img, setImg] = useState('');
  const [tab, setTab] = useState('');

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
            <Button>등록권한 신청</Button>
            <Button>
              <a href={`/users/Profile/Update/${account}`}>수정</a>
            </Button>
          </div>
          <div className="contents">
            <Nav>
              <Nav.Item>
                <Nav.Link onClick={() => setTab("purchase")}>
                  구매 내역
                </Nav.Link>
                &nbsp;
                <Nav.Link onClick={() => setTab("register")}>
                  등록 내역
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <hr />
          <TabContent tab={tab} />
        </div>
      </div>
    </div>
  );

  function TabContent(props) {
    if (props.tab === 'purchase')
      return (
        <div>
          <PurchaseDetail />
        </div>
      );

    else if (props.tab === "register")
      return (
        <div>
          <RegisterDetail />
        </div>
      );

    else return (<div></div>);
  };
};

export default Profile;
