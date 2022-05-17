/* eslint-disable jsx-a11y/anchor-is-valid */
import React,{useState} from 'react';
import { Menu } from 'antd-v3';

// import Web3 from 'web3';

//import '~antd-v3/dist/antd-v3.css';

function RightMenu(props) {
  const [account,setAccount] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
  // var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
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

  connectWallet();
  console.log(account);
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
        <Menu.Item key="create">
          <a href="/upload">create</a>
        </Menu.Item>
        <Menu.Item key="userData">
          <a href={`/users/Profile/${account}`}>Profile</a>
        </Menu.Item>
      </Menu>
    )
  }
}

export default RightMenu