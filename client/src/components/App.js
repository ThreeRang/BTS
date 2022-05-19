import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './views/NavBar/NavBar.js';
import Profile from './views/Users/Profile.js';
import ProfileUpdate from './views/Users/ProfileUpdate.js';
import MainPage from './views/MainPage/MainPage.js';
import ConcertUploadPage from './views/ConcertUploadPage/ConcertUploadPage.js';
import TicketPage from './views/TicketPage/TicketPage.js';

//import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path={'/'} element={<MainPage />}></Route>
          <Route path={'/upload/:userAccount'} element={<ConcertUploadPage />}></Route>
          <Route path={'/users/Profile/:userAccount'} element={<Profile />}></Route>
          <Route path={'/users/Profile/Update/:userAccount'} element={<ProfileUpdate />}></Route>
          <Route path={'/concert/Ticket'} element={<TicketPage />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};
export default App;
