import React, { useState, useEffect } from 'react';
import '../Feed/FeedPage.css'; 
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import api from '../api';
import { useLocation } from 'react-router-dom';
import DevorumList from '../DevorumList/DevorumList';

const DevorumResults = () => {
  const [forums, setForums] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query'); // Extract query

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const forumResponse = await api.get(`/forum/search?query=${query}`);
        setForums(forumResponse.data);
      } catch (error) {
        console.error('Error fetching forum search results:', error);
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
          <DevorumList forums={forums} />
        </div>
      </div>
    </div>
  );
};

export default DevorumResults;