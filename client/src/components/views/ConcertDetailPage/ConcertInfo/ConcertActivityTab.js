import React, { useEffect, useState } from 'react';
import { Card } from 'antd-v3';
import './ConcertActivityTab.css';
import { web3, mintContract, purchaseContract } from '../../../../web3Config';
const ConcertActivityTab = ({ concertId }) => {
  const [transaction, setTransaction] = useState([]);

  useEffect(async () => {
    /**  */
    // await mintContract.events.Approval().then(function (eventss) {
    //   console.log(eventss); // same results as the optional callback above
    // });
    const hash = web3.utils.keccak256('test1241667547152818');
    console.log(hash);
    await purchaseContract
      .getPastEvents('purchase', {
        fromBlock: 0,
        toBlock: 'latest',
      })
      .then(function (events) {
        console.log(events);
        console.log(events[0].returnValues.concertId); // same results as the optional callback above
        console.log(events[0].returnValues.concertId == hash);
        console.log(events[1].returnValues.concertId == hash);
      });

    //이걸로 tr hash가져오고 owner가져올 수 있다
    // web3.eth.getTransaction('0x2f390257ef4ae528d8efe706f27ec455a9eeaba37169042dec03ab6e37e07bfb').then(function (tr) {
    //   console.log(tr);
    // });
    //얘로 새로운 owner가져올 수 있다
  }, []);

  return (
    <div class="wrapper">
      <Card title={`concertId : ${concertId}`} size="small">
        <table>
          <thead>
            <tr>
              <th>from </th>
              <th>to </th>
              <th>price </th>
              <th>date </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>안녕</td>
              <td>안녕하세요</td>
              <td>hihi</td>
              <td>봉쥬르</td>
            </tr>
            <tr>
              <td>안녕</td>
              <td>안녕하세요</td>
              <td>hihi</td>
              <td>봉쥬르</td>
            </tr>
            <tr>
              <td>안녕</td>
              <td>안녕하세요</td>
              <td>hihi</td>
              <td>봉쥬르</td>
            </tr>
          </tbody>
        </table>

        <br />
      </Card>
    </div>
  );
};

export default ConcertActivityTab;
