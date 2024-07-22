import React from 'react';
import './SideBar.css'; 

const SideBar = () => {
  return (
    <div className="side-bar">
      <button className="side-bar-button">Home</button>
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
