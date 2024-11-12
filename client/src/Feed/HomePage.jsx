import React, { useState, useEffect } from 'react';
import './FeedPage.css';
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import api from '../api';
import Ideas from '../Ideas/Ideas';

const HomePage = () => {
  const [ideas, setIdeas] = useState([]);
  const [userId, setUserId] = useState(null);
  const [hasMoreIdeas, setHasMoreIdeas] = useState(true);
  const [page, setPage] = useState(1); // Page for pagination

  const currentUser = localStorage.getItem("user");

  useEffect(() => {
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
  }, [currentUser]);

  useEffect(() => {
    const fetchForumData = async () => {
      try {
        const limit = 20; // Set the number of ideas per page
        const ideasResponse = await api.get(`/idea/recent/`, {
          params: { limit, page },
        });
  
        // Check if there are more ideas to load
        if (ideasResponse.data.length < limit) {
          setHasMoreIdeas(false);
        }
  
        // Cache to store forum titles by forum_id
        const forumTitleCache = new Map();
  
        const ideasWithUserDetails = await Promise.all(
          ideasResponse.data.map(async (idea) => {
            const userResponse = await api.get(`/user/${idea.user_id}`);
            const user_name = userResponse.data[0].user_name;
            const profile_photo = userResponse.data[0].profile_photo;
  
            const interestResponse = await api.get(`/interest/user_id/${userId}`);
            const isInterested = interestResponse.data.some(row => row.ideas_id === idea.idea_id);
  
            // Retrieve forum title only if not cached
            let forum_title;
            if (forumTitleCache.has(idea.forum_id)) {
              forum_title = forumTitleCache.get(idea.forum_id);
            } else {
              const forumResponse = await api.get(`/forum/${idea.forum_id}`);
              forum_title = "d/" + forumResponse.data[0].devorum;
              forumTitleCache.set(idea.forum_id, forum_title);
            }
  
            return { ...idea, user_name, profile_photo, isInterested, forum_title };
          })
        );
  
        // Append new ideas to the existing list
        setIdeas((prevIdeas) => [...prevIdeas, ...ideasWithUserDetails]);
      } catch (error) {
        console.error("Error fetching forum data:", error);
      }
    };
  
    if (userId) {
      fetchForumData();
    }
  }, [userId, page]);
  

  const loadMoreIdeas = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="feed-page">
      <TopBar />
      <div className="content">
        <SideBar />
        <div className="feed-container">
          <Ideas ideas={ideas} setIdeas={setIdeas} currentUser={currentUser} userId={userId} />
          
          {ideas.length > 0 && hasMoreIdeas ? (
            <div className="load-more-container">
              <button onClick={loadMoreIdeas} className="load-more-button">
                Load More
              </button>
            </div>
          ) : (
            <p className="end-message">You did it! You reached the end!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
