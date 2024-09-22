import React from 'react';
import './SideBar.css'; 
import { useNavigate } from 'react-router-dom';
import HomeIcon from '../assets/Home.png'; 
import FeedIcon from '../assets/Feed.png';

const SideBar = () => {
  const navigate = useNavigate(); 

  const handleHomeClick = () => {
    navigate('/feed');
  }

  return (
    <div className="side-bar">
      <div className="feeds">
        <button onClick={handleHomeClick} className="side-bar-button">
          <img src={HomeIcon} alt="Home" className="icon" />
          Home
        </button>
        <button onClick={handleHomeClick} className="side-bar-button">
          <img src={FeedIcon} alt="Your Feed" className="icon" />
          Your Feed
        </button>
      </div>
      <div className="forums">
        <button className="side-bar-button">Forum 1</button>
        <button className="side-bar-button">Forum 2</button>
        <button className="side-bar-button">Forum 3</button>
        <button className="side-bar-button">Forum 4</button>
      </div>
    </div>
  );
};

export default SideBar;
