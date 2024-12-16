import React from 'react';
import './EditAvatarModal.css';
import avatarPaths from '../Avatars';

const EditAvatarModal = ({ isOpen, onClose, onSave }) => {
  const handleAvatarClick = (avatar) => {
    onSave(avatar);
  };

  if (!isOpen) return null;

  return (
    <div className="edit-avatar-modal">
      <div className="modal-content">
        <h2>Select Your Avatar</h2>
        <div className="avatars-grid">
          {avatarPaths.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className="avatar-option"
              onClick={() => handleAvatarClick(avatar)}
            />
          ))}
        </div>
        <button className="close-modal-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default EditAvatarModal;
