import React, { useState } from 'react';
import './SignUpPage.css';
import avatarPaths from '../Avatars'; // Import avatar paths

const SignUpPart3 = () => {
  const [selectedAvatar, setSelectedAvatar] = useState(avatarPaths[0]);
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setShowAvatarSelection(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
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
          <input type="text" name="username" required />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select name="gender" required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input type="text" name="location" required />
        </div>
        <div className="form-group">
          <label>Bio:</label>
          <textarea name="bio"></textarea>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPart3;
