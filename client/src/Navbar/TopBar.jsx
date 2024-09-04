import React, { useState, useEffect } from 'react';
import logo from '../assets/Logo.png';
import newIdeaIcon from '../assets/NewIdea.png';  // Import the New Idea icon
import './TopBar.css';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import NewIdea from './NewIdea';

const TopBar = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('Idea');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('');

  useEffect(() => {
    const fetchUserProfilePhoto = async () => {
      const username = localStorage.getItem('user');
      if (username) {
        try {
          const response = await api.post('/user/user_name', { user_name: username });
          if (response.data && response.data.length > 0) {
            setProfilePhoto(response.data[0].profile_photo);
          }
        } catch (error) {
          console.error('Error fetching profile photo from backend:', error);
        }
      }
    };

    fetchUserProfilePhoto();
  }, []);

  const handleProfileClick = () => {
    const userData = localStorage.getItem('user');
    let username;

    try {
      const user = JSON.parse(userData);
      username = user.user_name;
    } catch (error) {
      username = userData;
    }

    if (username) {
      navigate(`/profile/${username}`);
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchType === 'User' && query.startsWith('@')) {
      try {
        const username = query.slice(1);
        const response = await api.post('/user/user_name', { user_name: username });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    } else if (searchType === 'Forum' && query.startsWith('d/')) {
      try {
        const forumQuery = query.slice(2).toLowerCase();
        const response = await api.get('/forum/'); // Fetch the list of forums
        const filteredForums = response.data.filter(forum =>
          forum.devorum.toLowerCase().includes(forumQuery)
        );
        setSuggestions(filteredForums);
      } catch (error) {
        console.error('Error fetching forums:', error);
      }
    }
  };

  const handleSearchTypeChange = (e) => {
    const type = e.target.value;
    setSearchType(type);

    if (type === 'User') {
      setSearchQuery('@');
    } else if (type === 'Forum') {
      setSearchQuery('d/');
    } else {
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (username) => {
    navigate(`/profile/${username}`);
  };

  const handleNewIdeaClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleIdeaSubmit = (newIdea) => {
    console.log('New Idea:', newIdea);
    setShowModal(false);
  };

  return (
    <div className="top-bar">
      <div className="logo">
        <img src={logo} alt="Devorum Logo" />
      </div>
      <div className="search-bar">
        <select 
          className="search-type-dropdown" 
          value={searchType} 
          onChange={handleSearchTypeChange}
        >
          <option value="Idea">Idea</option>
          <option value="Forum">Forum</option>
          <option value="User">User</option>
        </select>
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchQuery} 
          onChange={handleSearchChange}
        />
        {suggestions.length > 0 && searchType === 'Forum' && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li 
                key={index} 
                className="suggestion-item" 
                onClick={() => navigate(`/forums/${suggestion.id}`)}
              >
                <span>{suggestion.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="actions">
        <button className="new-idea-button" onClick={handleNewIdeaClick}>
          <img src={newIdeaIcon} alt="New Idea" className="new-idea-icon" /> 
          New Idea
        </button>
        <div className="profile-button" onClick={handleProfileClick}>
          <img src={profilePhoto} alt="User Profile" className="profile-photo" />
        </div>
      </div>

      {showModal && <NewIdea onClose={handleModalClose} onSubmit={handleIdeaSubmit} />}
    </div>
  );
};

export default TopBar;
