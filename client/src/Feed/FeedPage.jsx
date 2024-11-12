import React, { useState, useEffect } from 'react';
import './FeedPage.css';
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import api from '../api';
import Ideas from '../Ideas/Ideas';

const FeedPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [userId, setUserId] = useState(null);
  const [page, setPage] = useState(1); // Start at page 1
  const [loading, setLoading] = useState(false); // Track loading state
  const [hasMore, setHasMore] = useState(true); // Track if there are more ideas to load
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
    const fetchUserFeed = async () => {
      if (!userId || loading) return;
  
      try {
        setLoading(true);
        const limit = 20; // Desired limit of ideas per page
        const feedResponse = await api.get(`idea/user/${userId}/feed`, {
          params: { limit, page }
        });
  
        // If there are no ideas in the response, we've reached the end
        if (feedResponse.data.length === 0) {
          setHasMore(false);
        } else {
          // Cache to store forum titles based on forum_id
          const forumTitleCache = new Map();
  
          const ideasWithUserDetails = await Promise.all(
            feedResponse.data.map(async (idea) => {
              const userResponse = await api.get(`/user/${idea.user_id}`);
              const user_name = userResponse.data[0].user_name;
              const profile_photo = userResponse.data[0].profile_photo;
  
              const interestResponse = await api.get(`/interest/user_id/${userId}`);
              const isInterested = interestResponse.data.some(row => row.ideas_id === idea.idea_id);
  
              // Retrieve forum title only if not already in cache
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
          setIdeas(prevIdeas => [...prevIdeas, ...ideasWithUserDetails]);
        }
      } catch (error) {
        console.error("Error fetching user feed:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserFeed();
  }, [userId, page]);
  

  // Handler for loading more ideas
  const loadMoreIdeas = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="feed-page">
      <TopBar />
      <div className="content">
        <SideBar />
        <div className="feed-container">
          <Ideas
            ideas={ideas}
            setIdeas={setIdeas}
            currentUser={currentUser}
            userId={userId}
          />
          {/* Load More Button or End Message */}
          {hasMore ? (
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

export default FeedPage;
