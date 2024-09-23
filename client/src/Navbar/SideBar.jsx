import React, { useState, useEffect } from 'react';
import './SideBar.css'; 
import { useNavigate } from 'react-router-dom';
import HomeIcon from '../assets/Home.png'; 
import FeedIcon from '../assets/Feed.png';
import api from '../api'; // Assuming you have Axios or another HTTP client setup here

const SideBar = () => {
  const navigate = useNavigate(); 
  const [forumIds, setForumIds] = useState([]); // State to store forum IDs the user has joined
  const [forums, setForums] = useState([]); // State to store forum names
  const user_name = localStorage.getItem('user'); // Retrieve user_name from localStorage

  // Function to fetch forums joined by the user
  const fetchUserForums = async () => {
    try {
      // Fetch user ID using user_name
      const userResponse = await api.post('/user/user_name', { user_name });
      const userId = userResponse.data[0]?.user_id;
      
      if (userId) {
        // Fetch forum IDs joined by the user
        const forumsResponse = await api.get(`/forum-joined/user/${userId}`);
        const forumIds = forumsResponse.data.map(forum => forum.forums_id);
        setForumIds(forumIds);
      }
    } catch (error) {
      console.error('Error fetching user forums:', error);
    }
  };

  // Fetch the forum names based on forum IDs
  const fetchForumNames = async () => {
    try {
      const forumDetailsPromises = forumIds.map(async (forumId) => {
        const forumResponse = await api.get(`/forum/${forumId}`);
        return forumResponse.data[0]?.devorum; // Assuming forum_name is a field in the response
      });
      const forumNames = await Promise.all(forumDetailsPromises);
      setForums(forumNames);
    } catch (error) {
      console.error('Error fetching forum names:', error);
    }
  };

  // Fetch forums on component mount
  useEffect(() => {
    if (user_name) {
      fetchUserForums();
    }
  }, [user_name]);

  // Fetch forum names whenever forumIds change
  useEffect(() => {
    if (forumIds.length > 0) {
      fetchForumNames();
    }
  }, [forumIds]);

  const handleHomeClick = () => {
    navigate('/feed');
  };

  const handleForumClick = (forumName) => {
    console.log(forumName);
    navigate(`/devorum/${forumName}`); 
  };

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
        {forums.length > 0 ? (
          forums.map((forumName, index) => (
            <button 
              key={forumIds[index]} 
              onClick={() => handleForumClick(forumName)} 
              className="side-bar-button"
            >
              d/{forumName}
            </button>
          ))
        ) : (
          <p className="no-forum">No devorums joined</p> 
        )}
      </div>
    </div>
  );
};

export default SideBar;
