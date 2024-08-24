import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';
import avatarPaths from '../Avatars'; 
import api from '../api';

const SignUpPart3 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    gender: '',
    location: '',
    bio: '',
  });
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setShowAvatarSelection(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'username') {
      checkUsernameAvailability(value);
    }
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await api.get('/user');
      const users = response.data;

      const exists = users.some(user => user.user_name === username);
      setUsernameExists(exists);
    } catch (error) {
      console.error('Error checking username availability:', error);
      setUsernameExists(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (usernameExists) {
      alert('Username already exists. Please choose another one.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const storedEmail = localStorage.getItem('signUpEmail');
      await api.put('/user', {
        email: storedEmail, 
        update: {
          user_name: formData.username,
          gender: formData.gender,
          bio: formData.bio,
          profile_photo: selectedAvatar,
          address: formData.location,
        },
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/login');
    } catch (error) {
      console.error('An error occurred during the final step of sign-up:', error);
    }
  };

  return (
    <div className="signup-part">
      <p>Let them know who you are!</p>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>Profile Picture:</label>
          <div className="profile-avatar">
            <img src={selectedAvatar} alt="Selected Avatar" className="selected-avatar" />
          </div>
          <button type="button" className="choose-avatar-button" onClick={() => setShowAvatarSelection(true)}>
            Choose Avatar
          </button>
        </div>
        {showAvatarSelection && (
          <div className="avatar-selection-window">
            <div className="avatar-selection">
              {avatarPaths.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className="avatar"
                  onClick={() => handleAvatarSelect(avatar)}
                />
              ))}
            </div>
          </div>
        )}
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          {usernameExists && <span className="error-message">Username already exists.</span>}
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Bio:</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPart3;
