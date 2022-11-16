import React, { useEffect, useState } from 'react';
import Axios from 'axios';

const useConcert = ({ concertId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [concertMetadata, setConcertMetadata] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Axios.get('http://localhost:5000/api/concert/getConcertInfo', { params: { _id: concertId } })
          .then((response) => {
            if (response.data.success) {
              setConcertMetadata(response.data.concert);
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
  return { concertMetadata, isLoading };
};

export default useConcert;
