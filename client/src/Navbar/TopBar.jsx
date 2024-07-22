import React from 'react';
import logo from '../assets/Logo.png'; // Update with the path to your logo
import './TopBar.css'; // CSS for TopBar

const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="logo">
        <img src={logo} alt="Devorum Logo" />
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="actions">
        <button className="new-idea-button">New Idea</button>
        <button className="profile-button">Profile</button>
      </div>
    </div>
  );
};

export default TopBar;
