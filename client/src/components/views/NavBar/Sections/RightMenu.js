/* eslint-disable jsx-a11y/anchor-is-valid */
import React,{useEffect, useState} from 'react';
import { Menu } from 'antd';

function RightMenu(props) {
  const [account,setAccount] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
  
	const connectWallet = () => {
		window.ethereum
		.request({ method: "eth_requestAccounts" })
		.then((result) => {
			  setAccount(result[0]);
		})
		.catch((error) => {
		  setErrorMessage(error.message);
      console.log(errorMessage);
		});
	}

  if (!account) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="login">
          <a onClick ={connectWallet}>Login</a>
        </Menu.Item>
      </Menu>
    )
  } else {
    return (
      <Menu mode={props.mode}>
        {console.log(account)}
        <Menu.Item key="create">
          <a href="/">create</a>
        </Menu.Item>
        <Menu.Item key="userData">
          <a href={`/users/Profile/${account}`}>Profile</a>
        </Menu.Item>
      </Menu>
    )
  }
}

export default RightMenu

