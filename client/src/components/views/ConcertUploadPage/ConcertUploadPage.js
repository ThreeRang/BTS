import React, { useState } from 'react';
import { Typography, Button, Form, message, Input} from 'antd'
import Icon from '@ant-design/icons'
import Dropzone from 'react-dropzone'
//import Axios from 'axios';
//import { useSelector } from 'react-redux';

//import uploadBox from './VideoUploadPage.module.css'

const { TextArea } = Input;
const { Title } = Typography

function ConcertUploadPage(props) {
  /*Register변수 DB에 저장할 때 누가 저장했는지 저장할 변수*/
  const [Register, setRegister] = useState("")
  const [ConcertTitle, setConcertTitle] = useState("")
  const [Description, setDescription] = useState("")
  const [ConcertAddress, setConcertAddress] = useState("")

  /*서버 연결 이후 저장에 필요한 local Storage에 저장될 path */
  const [ConcertUploadPath, setConcertUploadPath] = useState("")
  const [SeatImgPath, setSeatImgPath] = useState("")
  const [TicketImgPath, setTicketImgPath] = useState("")

  /*-------------------onChange----------------------*/
  const onTitleChange = (e) =>{
    setConcertTitle(e.currentTarget.value)
  }

  const onDescriptionChange = (e) =>{
    setDescription(e.currentTarget.value)
  }

  const onConcertAddressChange = (e) =>{
    setConcertAddress(e.currentTarget.value)
  }

  /*서버 연결 이후 구현*/
  const onDropConcertImg = (files) =>{

  }
  const onDropSeatImg = (files) =>{

  }
  const onDropTicketImg = (files) =>{

  }

  const onSubmit = (e) =>{
    e.preventDefault();
  }

  return (
      <div style = {{ maxWidth: '700px', margin : '2rem auto'}}>
        <Form onSubmit ={onSubmit}>
        <Title level = {2} >-공연 이미지 업로드</Title>
          <div style = {{display : 'center'}}>
            <Dropzone 
                onDrop = {onDropConcertImg}
                multiple = {false}
                maxSize = {1000000000}
                >
                {({ getRootProps, getInputProps}) => (
                    <div style = {{ width : '100%', height : '240px', border : '1px solid lightgray', textAlign : 'center'}}{...getRootProps()}>
                    <input {...getInputProps()} />
                    <div>
                        <Icon type = "plus" style={{ fontSize:'3rem', marginTop : '90px'}} />
                        <br/>
                        <h1 style = {{ fontSize : '20px'}}> insert your Concert Image</h1>
                    </div> 
                    </div>
                )}
            </Dropzone>
          </div>
          <br />
          <br />  
          <div style = {{display : 'flex', justifyContent: 'space-between'}}> 
            <div>
                <Title level = {2} >-좌석표 이미지 업로드</Title>
                <Dropzone 
                onDrop = {onDropSeatImg}
                multiple = {false}
                maxSize = {1000000000}
                >
                {({ getRootProps, getInputProps}) => (
                    <div style = {{ width : '300px', height : '240px', border : '1px solid lightgray', textAlign : 'center'}}{...getRootProps()}>
                    <input {...getInputProps()} />
                    <div>
                        <Icon type = "plus" style={{ fontSize:'3rem', marginTop : '90px'}} />
                        <br/>
                        <h1 style = {{ fontSize : '20px'}}> insert your Seat Image</h1>
                    </div> 
                    </div>
                )}
                </Dropzone>
            </div>
            <div>
                <Title level = {2} >-티켓 이미지 업로드</Title>
                <Dropzone 
                onDrop = {onDropTicketImg}
                multiple = {false}
                maxSize = {1000000000}
                >
                {({ getRootProps, getInputProps}) => (
                    <div style = {{ width : '300px', height : '240px', border : '1px solid lightgray', textAlign : 'center'}}{...getRootProps()}>
                    <input {...getInputProps()} />
                    
                        <div>
                        <Icon type = "plus" style={{ fontSize:'3rem', marginTop : '90px'}} />
                        <br/>
                        <h1 style = {{ fontSize : '20px'}}> insert your Ticket Image</h1>    
                        </div>
                    </div>
                )}
                </Dropzone>
            </div>
          </div>
        <br />
        <br />
        <label>Concert Title</label>
        <Input 
          onChange = {onTitleChange}
          value ={ConcertTitle}
        />
        </Form>
        <br />
        <br />
        <label>Concert Description</label>
        <TextArea
          onChange = {onDescriptionChange}
          value = {Description}
          required
        />
        <br/>
        <br/>
        <label>Concert Address</label>
        <TextArea
          onChange = {onConcertAddressChange}
          value = {ConcertAddress}
          required
        />
        <br/>
        <br/>
        <Button type="primary" size = "large" onClick = {onSubmit}>
          submit
        </Button>
      </div>
  );
}

export default ConcertUploadPage;

