import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DevorumPage.css';
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import Interested from '../assets/Interested.png';
import api from '../api';

const DevorumPage = () => {
  const { devorum } = useParams();
  const [forumData, setForumData] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [selectedLikes, setSelectedLikes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [clickedPostIds, setClickedPostIds] = useState([]);
  const [userId, setUserId] = useState(null); // Store the current user's ID
  const [interestedPosts, setInterestedPosts] = useState([]); // Store the interested posts for the user

  const currentUser = localStorage.getItem("user");

  useEffect(() => {
    // Fetch current user data to get user_id
    const fetchUserData = async () => {
      try {
        const userResponse = await api.post('/user/user_name', { user_name: currentUser });
        const userId = userResponse.data[0]?.user_id;
        setUserId(userId);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchForumData = async () => {
      try {
        const forumResponse = await api.get(`/forum/devorum/${devorum}`);
        setForumData(forumResponse.data);

        const ideasResponse = await api.get(`/idea/forum/${forumResponse.data.forum_id}`);
        const ideasWithUserDetails = await Promise.all(
          ideasResponse.data.map(async (idea) => {
            const userResponse = await api.get(`/user/${idea.user_id}`);
            const user_name = userResponse.data[0].user_name;
            const profile_photo = userResponse.data[0].profile_photo;
            
            const interestResponse = await api.get(`/interest/user_id/${userId}`);
            const isInterested = interestResponse.data.some(row => row.ideas_id === idea.idea_id);

            return { ...idea, user_name, profile_photo, isInterested };
          })
        );
        setIdeas(ideasWithUserDetails);
      } catch (error) {
        console.error("Error fetching forum data:", error);
      }
    };

    if (userId) {
      fetchForumData();
    }
  }, [devorum, userId]);

  const handleLikesClick = async (likes, postId, owner) => {
    if (currentUser === owner) {
      // If current user is the owner, show the modal
      setSelectedLikes(likes);
      setModalOpen(true);
    } else {
      try {
        // Fetch the user_id using the /user_name route
        const userResponse = await api.post("/user/user_name", { user_name: currentUser });
        const userId = userResponse.data[0]?.user_id;
  
        if (userId) {
          // Check if the current user has already expressed interest in this idea
          const interestResponse = await api.get(`/interest/id/${userId}`);
          const isAlreadyInterested = interestResponse.data.some(row => row.ideas_id === postId);
  
          if (isAlreadyInterested) {
            // If already interested, don't add a new entry but remove the interest
            setClickedPostIds((prevState) =>
              prevState.includes(postId)
                ? prevState.filter((id) => id !== postId)
                : [...prevState, postId]
            );
          } else {
            // Create a new interest if not already interested
            const newInterest = { user_id: userId, idea_id: postId };
            const interestResponse = await api.post("/interest/", newInterest);
  
            if (interestResponse.status === 201) {
              // Toggle interested state if interest was successfully added
              setIdeas((prevIdeas) =>
                prevIdeas.map((idea) =>
                  idea.idea_id === postId ? { ...idea, isInterested: true } : idea
                )
              );
              setClickedPostIds((prevState) =>
                prevState.includes(postId)
                  ? prevState.filter((id) => id !== postId)
                  : [...prevState, postId]
              );
            } else if (interestResponse.status === 409) {
              console.log("Cannot interest an idea twice.");
            }
          }
        } else {
          console.error("User not found.");
        }
      } catch (error) {
        console.error("Error creating interest:", error);
      }
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
            <h1>{forumData.title}</h1>
            <p>{forumData.details}</p>
            <p><strong>Rules:</strong> {forumData.rules}</p>
          </div>
          {ideas.map((post, index) => (
            <div key={index} className="devorum-item">
              <div className="devorum-header">
                <img src={post.profile_photo} alt="Avatar" className="avatar" />
                <div className="post-info">
                  <span className="username">{post.user_name}</span>
                  <span className="forum">{forumData.name}</span>
                  <span className={`status ${post.status.toLowerCase().replace(/ /g, '-')}`}>{post.status}</span>
                </div>
              </div>
              <div className="post-meta">
                <span>{calculateTimeAgo(post.created_at)}</span>
              </div>
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
        </div>
      </div>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setModalOpen(false)}>&times;</span>
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
