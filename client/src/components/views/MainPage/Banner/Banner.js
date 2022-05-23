import React from 'react';
import { Carousel } from 'antd-v3';
const Banner = () => {
  const contentStyle = {
    width: '99.9%',
    height: '350px',
    color: '#fff',
    lineHeight: '240px',
    textAlign: 'center',

    margin: 'auto auto',
  };
  const contentStyle2 = {
    height: '350px',
    color: '#fff',
    lineHeight: '240px',
    textAlign: 'center',

    margin: 'auto auto',
  };
  return (
    <div style={{ diaplay: 'flex', backgroundColor: 'lightgrey', width: '100%', height: '350px' }}>
      <Carousel autoplay>
        <div style={{ width: '100%' }}>
          <img
            src={`http://localhost:5000/image/logoImage/twitter_header_photo_2.png`}
            alt="logo"
            style={contentStyle}
          />
        </div>
        <div>
          <img src={`http://localhost:5000/image/logoImage/logowhite.png`} alt="logo" style={contentStyle2} />
        </div>
      </Carousel>
    </div>
  );
};
export default Banner;
