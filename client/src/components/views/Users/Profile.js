import React, {useEffect, useState} from 'react';
import getWeb3 from "../../../getWeb3";

const Profile = () => {
    const [web3, setWeb3] = useState("");
    const [accounts, setAccounts] = useState("");
    const [balance, setBalance] = useState(0);

    const componentDidMount = async () =>{
        try{
            // get network provider and web3 instance
            setWeb3(await getWeb3());

            setAccounts(await web3.eth.getAccounts());
            const eth = await web3.eth.getBalance(accounts[0]);
            setBalance(eth / 10**18);
        }catch(error){
            console.log("failed to load web3"+error);
        }
    }
    useEffect(()=>(componentDidMount),[web3])

    if(!web3){
        return <div>Loading Web3</div>;
    }else{
        return(
            <div>
                <p>My Current Connected Eth Account👇</p>
                <p>{accounts}</p>

                <p>My balance</p>
                <p>{balance}</p>
            </div>
        )
    }
}

export default Profile;