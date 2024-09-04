import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DevorumPage.css';
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import axios from 'axios';
import api from '../api';

const DevorumPage = () => {
  const { devorum } = useParams();
  const [forumData, setForumData] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [selectedLikes, setSelectedLikes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Fetch forum details and ideas
    const fetchForumData = async () => {
      try {
        // Fetch forum details by devorum value
        const forumResponse = await api.get(`/forum/devorum/${devorum}`);
        setForumData(forumResponse.data);

        const ideasResponse = await api.get(`/idea/forum/${forumResponse.data.forum_id}`);
        const ideasWithUserDetails = await Promise.all(
          ideasResponse.data.map(async (idea) => {
            const userResponse = await api.get(`/user/${idea.user_id}`);
            return { ...idea, username: userResponse.data.username, avatar: userResponse.data.avatar };
          })
        );
        setIdeas(ideasWithUserDetails);
      } catch (error) {
        console.error("Error fetching forum data:", error);
      }
    };

    fetchForumData();
  }, [devorum]);

  const handleLikesClick = (likes) => {
    setSelectedLikes(likes);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (!forumData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="devorum-page">
      <TopBar />
      <div className="content">
        <SideBar />
        <div className="devorum-container">
          <div className="forum-details">
            <h1>{forumData.name}</h1>
            <p>{forumData.description}</p>
            <p><strong>Rules:</strong> {forumData.rules}</p>
          </div>
          {ideas.map((post, index) => (
            <div key={index} className="devorum-item">
              <div className="devorum-header">
                <img src={post.avatar} alt="Avatar" className="avatar" />
                <div className="post-info">
                  <span className="username">{post.username}</span>
                  <span className="forum">{forumData.name}</span>
                  <span className={`status ${post.status.toLowerCase().replace(/ /g, '-')}`}>{post.status}</span>
                </div>
              </div>
              <div className="post-meta">
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                <span>{new Date(post.created_at).toLocaleTimeString()}</span>
              </div>
              <p className="post-content">{post.body}</p>
              <div className="like-count" onClick={() => handleLikesClick(post.likes)}>
                Likes: {post.likes.length}
              </div>
            </div>
          ))}
        </div>
      </div>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <h2>Liked by:</h2>
            <ul>
              {selectedLikes.map((like, index) => (
                <li key={index}>{like}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevorumPage;
