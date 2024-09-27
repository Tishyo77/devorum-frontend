import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Interested from '../assets/Interested.png';
import Options from '../assets/Options.png';
import ShareIcon from '../assets/Share.png';
import api from '../api';
import './Ideas.css';
 
const Ideas = ({ ideas, setIdeas, currentUser, userId }) => {
  const [selectedLikes, setSelectedLikes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null); 
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [message, setMessage] = useState('');
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleEdit = (ideaId, userId) => {
    navigate(`/edit-idea/${ideaId}`, { state: { ideaId, userId } });
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/idea/id/${postId}`);
      setIdeas(prevIdeas => prevIdeas.filter(idea => idea.idea_id !== postId)); 
      console.log('Idea deleted successfully');
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };

  const calculateTimeAgo = (created_at) => {
    const postDate = new Date(created_at);
    const now = new Date();
    const diffInSeconds = (now - postDate) / 1000;

    if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h`;
    } else if (diffInSeconds < 2592000) {
      return `${Math.floor(diffInSeconds / 86400)}d`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months}m`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      const months = Math.floor((diffInSeconds % 31536000) / 2592000);
      return `${years}y${months ? ` and ${months}m` : ''}`;
    }
  }

  // Fetch interested users for an idea
  const fetchInterestedUsers = async (postId) => {
    try {
      // Fetch the list of user IDs interested in the idea
      const interestResponse = await api.get(`/interest/idea_id/${postId}`);
      const interestedUserIds = interestResponse.data.map((row) => row.user_id);
      
      // Fetch details for each interested user using their user_id
      const userDetails = await Promise.all(
        interestedUserIds.map(async (user_id) => {
          const userResponse = await api.get(`/user/${user_id}`);
          return userResponse.data[0]; // Assuming user data is the first object in the array
        })
      );

      setInterestedUsers(userDetails); // Set the fetched users
      setModalOpen(true); // Open the modal to show the list
    } catch (error) {
      console.error("Error fetching interested users:", error);
    }
  };

  const handleLikesClick = async (likes, postId, owner) => {
    if (currentUser === owner) {
      // If current user is the owner, show the modal
      setSelectedLikes(likes);
      setModalOpen(true);
      await fetchInterestedUsers(postId);
    } else {
      try {
        // Check if the current user has already expressed interest in this idea
        const interestResponse = await api.get(`/interest/user_id/${userId}`);
        const isAlreadyInterested = interestResponse.data.some(row => row.ideas_id === postId);

        if (isAlreadyInterested) {
          // Remove interest from the backend
          await api.delete(`/interest/`, {
            data: { user_id: userId, idea_id: postId }
          });

          // Update the state locally to reflect the interest removal
          setIdeas((prevIdeas) =>
            prevIdeas.map(idea =>
              idea.idea_id === postId ? { ...idea, isInterested: false } : idea
            )
          );
        } else {
          // Create a new interest if not already interested
          const newInterest = { user_id: userId, idea_id: postId };
          await api.post("/interest/", newInterest);

          // Update the state locally to reflect the interest addition
          setIdeas((prevIdeas) =>
            prevIdeas.map(idea =>
              idea.idea_id === postId ? { ...idea, isInterested: true } : idea
            )
          );
        }
      } catch (error) {
        console.error("Error updating interest:", error);
      }
    }
  };

  const handleShareClick = (ideaId) => {
    const link = `http://localhost:5173/ideas/${ideaId}`;
    navigator.clipboard.writeText(link).then(() => {
      setMessage('Idea link copied to clipboard');
      setTimeout(() => setMessage(''), 3000); 
    });
  };

  // Toggle the options menu visibility for each post
  const toggleMenu = (postId) => {
    setMenuOpen(menuOpen === postId ? null : postId);
  };

  // Detect clicks outside the menu to close it
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const closeModal = () => {
    setModalOpen(false);
  };

  const sortedIdeas = ideas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="ideas-list">
      {sortedIdeas.map((post, index) => (
        <div key={index} className="devorum-item">
          <div className="devorum-header">
            <img src={post.profile_photo} alt="Avatar" className="avatar" />
            <div className="post-info">
              <a href={`/profile/${post.user_name}`} className="username">
                <span className="username">{post.user_name}</span>
              </a>
              <span className="forum">{post.forum_name}</span>
              <span className={`status ${post.status.toLowerCase().replace(/ /g, '-')}`}>{post.status}</span>
              <div className="post-meta">
                <span>{calculateTimeAgo(post.created_at)}</span>
              </div>  
            </div>
            <button className="options-button" onClick={() => toggleMenu(post.idea_id)}>
              <img src={Options} alt="Options" />
            </button>
            {menuOpen === post.idea_id && (
              <div className="options-menu" ref={menuRef}>
                {currentUser === post.user_name ? (
                  <>
                    <button className="menu-item" onClick={() => handleEdit(post.idea_id, userId)}>Edit</button>
                    <button className="menu-item" onClick={() => handleDelete(post.idea_id)}>
                      Delete
                    </button>
                  </>
                ) : (
                  <button className="menu-item">Report</button>
                )}
              </div>
            )}
          </div>
          <h3 className="post-title">{post.title}</h3>
          <p className="post-content">{post.body}</p>
          <div className="action-buttons">
            <button
              className={`interested-button ${post.isInterested ? 'clicked' : 'not-owner'}`}
              onClick={() => handleLikesClick(post.likes || [], post.idea_id, post.user_name)}
            >
              <img src={Interested} alt="Interested Icon" className="interested-icon" />
              Interested
            </button>
            <button
              className="share-button"
              onClick={() => handleShareClick(post.idea_id)}
            >
              <img src={ShareIcon} alt="Share Icon" className="share-icon" />
            </button>
          </div>
        </div>
      ))}

      {/* Modal for showing interested users */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Interested Users</h2>
            {interestedUsers.length > 0 ? (
              <ul>
                {interestedUsers.map((user, index) => (
                  <li key={index} className="interested-user">
                    <img src={user.profile_photo} alt={user.user_name} className="user-avatar" />
                    <a href={`/profile/${user.user_name}`} className="user-name">
                      {user.user_name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users have shown interest yet.</p>
            )}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {message && <div className="copy-message">{message}</div>}
    </div>
  );
};

export default Ideas;
