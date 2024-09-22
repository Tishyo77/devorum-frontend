import React, { useState } from 'react';
import Interested from './assets/Interested.png';
import api from './api';

const Ideas = ({ ideas, setIdeas, currentUser, userId }) => {
  const [selectedLikes, setSelectedLikes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleLikesClick = async (likes, postId, owner) => {
    if (currentUser === owner) {
      // If current user is the owner, show the modal
      setSelectedLikes(likes);
      setModalOpen(true);
    } else {
      try {
        // Check if the current user has already expressed interest in this idea
        const interestResponse = await api.get(`/interest/user_id/${userId}`);
        const isAlreadyInterested = interestResponse.data.some(row => row.ideas_id === postId);
        console.log(isAlreadyInterested);

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
              <span className="username">{post.user_name}</span>
              <span className="forum">{post.forum_name}</span>
              <span className={`status ${post.status.toLowerCase().replace(/ /g, '-')}`}>{post.status}</span>
              <div className="post-meta">
                <span>{calculateTimeAgo(post.created_at)}</span>
              </div>
            </div>
          </div>
          <h3 className="post-title">{post.title}</h3>
          <p className="post-content">{post.body}</p>
          <button
            className={`interested-button ${post.isInterested ? 'clicked' : 'not-owner'}`}
            onClick={() => handleLikesClick(post.likes || [], post.idea_id, post.user_name)}
          >
            <img src={Interested} alt="Interested Icon" className="interested-icon" />
            Interested
          </button>
        </div>
      ))}

      {/* Modal for showing likes */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Interested Users</h2>
            {selectedLikes.length > 0 ? (
              <ul>
                {selectedLikes.map((like, index) => (
                  <li key={index}>{like}</li>
                ))}
              </ul>
            ) : (
              <p>No likes yet.</p>
            )}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ideas;
