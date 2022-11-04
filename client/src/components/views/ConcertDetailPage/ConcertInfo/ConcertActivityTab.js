import React, { useEffect, useState } from 'react';
import { Card } from 'antd-v3';
import './ConcertActivityTab.css';
import { web3, purchaseContract } from '../../../../web3Config';
const ConcertActivityTab = ({ concertId }) => {
  const [transactions, setTransaction] = useState([]);

  useEffect(async () => {
    const concertIdHashValue = web3.utils.keccak256(concertId);
    await purchaseContract
      .getPastEvents('purchase', {
        fromBlock: 0,
        toBlock: 'latest',
      })
      .then((events) => {
        events.map((event) => {
          if (event.returnValues.concertId === concertIdHashValue) {
            setTransaction((preState) => [
              ...preState,
              {
                from: event.returnValues.from,
                to: event.returnValues.to,
                price: event.returnValues.price,
                transactionHash: event.transactionHash,
              },
            ]);
          }
        });
      });
  }, []);

  return (
    <div className="wrapper">
      <Card title={`concertId : ${concertId}`} size="small">
        <table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Transaction Hash</th>
              <th>From </th>
              <th></th>
              <th>To </th>
              <th>Price </th>
            </tr>
          </thead>

          <tbody>
            {console.log(transactions)}
            {transactions.map((transaction, index) => {
              return (
                <tr key={index}>
                  <td>{index}</td>
                  <td>
                    {transaction.transactionHash.length > 20 ? (
                      <div title={transaction.transactionHash}>{`${transaction.transactionHash.slice(0, 20)}...`}</div>
                    ) : (
                      transaction.transactionHash
                    )}
                  </td>
                  <td>
                    {transaction.from.length > 20 ? (
                      <div title={transaction.from}>{`${transaction.from.slice(0, 20)}...`}</div>
                    ) : (
                      transaction.from
                    )}
                  </td>
                  <td>👉</td>
                  <td>
                    {transaction.to.length > 20 ? (
                      <div title={transaction.to}>{`${transaction.to.slice(0, 20)}...`}</div>
                    ) : (
                      transaction.to
                    )}
                  </td>
                  <td>{transaction.price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <br />
      </Card>
    </div>
  );
};

export default ConcertActivityTab;
