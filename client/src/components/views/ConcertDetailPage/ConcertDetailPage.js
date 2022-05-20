import React from 'react';
import { useParams } from 'react-router-dom';
const ConcertDetailPage = () => {
  const { concertId } = useParams();

  return <div>디테일 페이지 : {concertId}</div>;
};

export default ConcertDetailPage;
