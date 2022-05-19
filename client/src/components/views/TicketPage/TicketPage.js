import { Button } from 'antd-v3';
import React from 'react';

import ticketPageStyle from './TicketPage.module.css';
const TicketPage = () => {
  // const account = useParams().ticketAddress;
  // const [title, setTitle] = useState('');
  // const [ipfsHash, setIpfsHash] = useState('');
  // const [price, setPrice] = useState(0);
  // const [seatNum, setSeatNum] = useState('');

  return (
    <div>
      <div className={ticketPageStyle.detail_box_top}>
        <div className={ticketPageStyle.titleBox}>titleBox</div>
        <div className={ticketPageStyle.mainBox}>
          <div className={ticketPageStyle.left}>
            <div className={ticketPageStyle.ticketImage}>
              ticketImage<image></image>
            </div>
            <div className={ticketPageStyle.parchaseButtonArea}>
              <Button className={ticketPageStyle.parchaseButton}>구매하기</Button>
            </div>
          </div>
          <div className={ticketPageStyle.tickeData}>ticketdata</div>
        </div>
      </div>
      <div className={ticketPageStyle.detail_box_bottom}>underBox</div>
    </div>
  );
};

export default TicketPage;
