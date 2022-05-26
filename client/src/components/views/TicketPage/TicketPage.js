import { Button, Typography, Card } from 'antd-v3';
import React from 'react';

import ticketPageStyle from './TicketPage.module.css';

const { Title, Text } = Typography;
const TicketPage = () => {
  // const account = useParams().ticketAddress;
  // const [title, setTitle] = useState('');
  // const [ipfsHash, setIpfsHash] = useState('');
  // const [price, setPrice] = useState(0);
  // const [seatNum, setSeatNum] = useState('');

  return (
    <div style={{ width: '60%', margin: 'auto auto' }}>
      <Card title="Ticket Information" size="small">
        <div
          style={{
            display: 'flex',
            margin: '20px',
          }}
        >
          <div style={{ width: '300', height: '240', marginRight: '20px' }}>
            <img src={'http://localhost:5000/image/ticketImage/_resize_1653192259623_714847_426867_3336.jpeg'} />
            <br />
          </div>
          <div>
            <Text italic>Owned by 누구누구</Text>

            <Card title="reservation date" size="small">
              <p>Current Price</p>
              <p>Price</p>
              <Button>Buy now</Button>
            </Card>
          </div>
        </div>
        <Card title="descripsion" size="small">
          <p>Concert title</p>
          <p>Concert description</p>
        </Card>
      </Card>
    </div>
  );
};

export default TicketPage;
