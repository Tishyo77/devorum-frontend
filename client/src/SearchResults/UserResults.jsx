import React, { useState, useEffect } from 'react';
import '../Feed/FeedPage.css'; 
import './UserResults.css';
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import api from '../api';
import { useLocation, useNavigate } from 'react-router-dom';

const UserResults = () => {
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query'); // Extract query
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const userResponse = await api.get(`/user/search?query=${query}`);
        setUsers(userResponse.data);
      } catch (error) {
        console.error('Error fetching user search results:', error);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const handleUserClick = (userName) => {
    // Navigate to the user's profile page using their userId
    navigate(`/profile/${userName}`);
  };

  return (
    <div className="feed-page">
      <TopBar />
      <div className="content">
        <SideBar />
        <div className="feed-container">
          <div className="user-results">
            {users.map(user => (
              <div className="user-container" onClick={() => handleUserClick(user.user_name)}>
              <img 
                src={user.profile_photo || '/default-avatar.png'} 
                alt={user.user_name}
                className="user-avatar"
              />
              <div className="user-info">
                <div className="user-details">
                  <p className="user-name">{user.user_name}</p>
                  <p className="user-role">{user.roles}</p>
                </div>
              </div>
              <button className="connect-button">Connect</button>
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserResults;
