import React, { useEffect, useState } from 'react';
import { Card } from 'antd-v3';
import './ConcertActivityTab.css';

const ConcertActivityTab = ({ concertId }) => {
  const [transaction, setTransaction] = useState([]);

  useEffect(() => {
    /**  */
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
