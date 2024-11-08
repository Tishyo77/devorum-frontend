import React, { useState, useEffect } from 'react';
import logo from '../assets/Logo.png';
import newIdeaIcon from '../assets/NewIdea.png'; // Import the New Idea icon
import searchIcon from '../assets/Search.png';  // Import the Search icon
import './TopBar.css';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import NewIdea from './NewIdea';

const TopBar = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('Idea');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false); // Dropdown visibility

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
    setDropdownVisible(!dropdownVisible); 
  };

  // Function to handle the search when Enter key or Search icon is clicked
  const handleSearch = () => {
    if (!searchQuery) return;

    if (searchType === 'Idea') {
      navigate(`/idea/search?query=${searchQuery}`);
    } else if (searchType === 'User' && searchQuery.startsWith('@')) {
      const username = searchQuery.slice(1); 
      navigate(`/user/search?query=${username}`);
    } else if (searchType === 'Forum' && searchQuery.startsWith('d/')) {
      const forumQuery = searchQuery.slice(2).toLowerCase(); 
      navigate(`/forums/${forumQuery}`);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchTypeChange = (e) => {
    const type = e.target.value;
    setSearchType(type);

    if (type === 'User') {
      setSearchQuery('@'); // Prefill with '@' for user search
    } else if (type === 'Forum') {
      setSearchQuery('d/'); // Prefill with 'd/' for forum search
    } else {
      setSearchQuery(''); // Clear for ideas
    }
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

  const handleOptionClick = (option) => {
    setDropdownVisible(false);
    if (option === 'Profile') {
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
    } else if (option === 'Connections') {
      navigate('/connected'); 
    } else if (option === 'Interested Ideas') {
      navigate('/interested-ideas'); 
    } else if (option === 'Log Out') {
      localStorage.clear();
      navigate('/'); 
    }
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
        <div className="search-input-container">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyPress}  // Trigger search on Enter key press
          />
          <img 
            src={searchIcon} 
            alt="Search Icon" 
            className="search-icon" 
            onClick={handleSearch}  // Trigger search on Search icon click
          />
        </div>
      </div>
      <div className="actions">
        <button className="new-idea-button" onClick={handleNewIdeaClick}>
          <img src={newIdeaIcon} alt="New Idea" className="new-idea-icon" />
          New Idea
        </button>
        <div className="profile-button" onClick={handleProfileClick}>
          <img src={profilePhoto} alt="User Profile" className="profile-photo" />
        </div>
        {dropdownVisible && (
          <div className="profile-dropdown">
            <ul>
              <li onClick={() => handleOptionClick('Profile')}>Profile</li>
              <li onClick={() => handleOptionClick('Connections')}>Connections</li>
              <li onClick={() => handleOptionClick('Interested Ideas')}>Interested Ideas</li>
              <li onClick={() => handleOptionClick('Log Out')}>Log Out</li>
            </ul>
          </div>
        )}
      </div>

      {showModal && <NewIdea onClose={handleModalClose} onSubmit={handleIdeaSubmit} />}
    </div>
  );
};

export default TopBar;
