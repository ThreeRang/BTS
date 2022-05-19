/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Menu } from 'antd-v3';
import Axios from 'axios';
// import Web3 from 'web3';

//import '~antd-v3/dist/antd-v3.css';

function RightMenu(props) {
  const [account, setAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  // var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  const connectWallet = () => {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((result) => {
        setAccount(result[0]);
        if (account) {
          Axios.get('http://localhost:5000/api/users/findUser', {
            params: { _id: account },
          }).then((response) => {
            if (response.data.ess) {
              console.log('이미 존재함!!');
            } else {
              console.log('회원 가입 실행');
              Axios.post('http://localhost:5000/api/users/signUp', {
                _id: account,
              }).then((response) => {
                if (response.data.success) {
                  console.log('회원가입 성공!!');
                } else {
                  console.log('회원 가입 실패');
                }
              });
            }
          });
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
        console.log(errorMessage);
      });
  };

  connectWallet();
  console.log(account);
  if (!account) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="login">
          <a onClick={connectWallet}>Login</a>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="create">
          <a href={`/upload/${account}`}>create</a>
        </Menu.Item>
        <Menu.Item key="userData">
          <a href={`/users/Profile/${account}`}>Profile</a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default RightMenu;
