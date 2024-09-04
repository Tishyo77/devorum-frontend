import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Landing from './Landing/Landing';
import SignUp from './SignUp/SignUpPage';
import Login from './Login/LoginPage';
import Profile from './Profile/ProfilePage';
import Feed from './Feed/FeedPage';
import Devorum from './Devorum/DevorumPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="profile/:username" element={<Profile />} />
        <Route path="devorum/:devorum" element={<Devorum />} />
        <Route path="feed" element={<Feed />} />
      </Routes>
    </Router>
  );
};

export default App;