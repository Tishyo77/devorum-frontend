// UserResults.jsx
import React, { useState, useEffect } from 'react';
import '../Feed/FeedPage.css'; 
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import api from '../api';
import { useLocation } from 'react-router-dom';
import UserList from '../UserList/UserList';

const UserResults = () => {
  const [users, setUsers] = useState([]);
  const user = localStorage.getItem('user');
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query'); // Extract query

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

  return (
    <div className="feed-page">
      <TopBar />
      <div className="content">
        <SideBar />
        <div className="feed-container">
          <UserList users={users} currentUser={user} />
        </div>
      </div>
    </div>
  );
};

export default UserResults;
