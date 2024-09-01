import React from 'react';
import './SideBar.css'; 
import { useNavigate } from 'react-router-dom';

const SideBar = () => {
  const navigate = useNavigate(); 

  const handleHomeClick = () => {
    navigate('/feed');
  }

  return (
    <div className="side-bar">
      <div className="feeds">
        <button onClick={handleHomeClick} className="side-bar-button">Home</button>
        <button onClick={handleHomeClick} className="side-bar-button">Your Feed</button>
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
