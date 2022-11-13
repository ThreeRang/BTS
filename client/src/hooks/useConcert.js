import React, { useEffect, useState } from 'react';
import Axios from 'axios';

const useConcert = ({ concertId }) => {
  console.log('useConcert안이야 ' + concertId);
  const [isLoading, setIsLoading] = useState(true);
  const [concertInfo, setConcertInfo] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Axios.get('http://localhost:5000/api/concert/getConcertInfo', { params: { _id: concertId } })
          .then((response) => {
            if (response.data.success) {
              console.log('axios안이야 ');
              console.log(response.data.concert.concertInfo);
              setConcertInfo(response.data.concert.concertInfo);
            } else {
              alert('공연 정보를 읽는데 실패하였습니다.');
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      } catch (err) {
        alert(err);
      }
    };
    if (isLoading) {
      fetchData();
    }
  }, [concertId]);
  return { concertInfo, isLoading };
};

export default useConcert;
