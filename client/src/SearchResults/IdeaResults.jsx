import React, { useState, useEffect } from 'react';
import '../Feed/FeedPage.css'; 
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import api from '../api';
import Ideas from '../Ideas/Ideas';
import { useLocation } from 'react-router-dom';

const IdeaResults = () => {
  const [ideas, setIdeas] = useState([]);
  const [userId, setUserId] = useState(null);
  const [hasMoreIdeas, setHasMoreIdeas] = useState(true);
  const [page, setPage] = useState(1); // Pagination state
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query'); // Current search query
  const currentUser = localStorage.getItem("user");

  // Fetch user data
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

  // Fetch ideas when `query` or `page` changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const limit = 20; // Number of ideas per page
        const searchResponse = await api.get(`/idea/search?query=${query}`, {
          params: { limit, page },
        });

        const forumTitleCache = new Map();

        const newIdeas = await Promise.all(
          searchResponse.data.map(async (idea) => {
            const userResponse = await api.get(`/user/${idea.user_id}`);
            const user_name = userResponse.data[0]?.user_name;
            const profile_photo = userResponse.data[0]?.profile_photo;

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

        // If less than `limit`, it means there are no more ideas to load
        if (newIdeas.length < limit) {
          setHasMoreIdeas(false);
        }

        // For new queries, overwrite the ideas; for pagination, append
        setIdeas((prevIdeas) => (page === 1 ? newIdeas : [...prevIdeas, ...newIdeas]));
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    if (userId && query) {
      fetchSearchResults();
    }
  }, [userId, query, page]);

  // Reset state when the query changes
  useEffect(() => {
    setIdeas([]); // Clear ideas on a new query
    setPage(1); // Reset pagination to the first page
    setHasMoreIdeas(true); // Reset the load more flag
  }, [query]);

  // Load more ideas
  const loadMoreIdeas = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="feed-page">
      <TopBar />
      <div className="content">
        <SideBar />
        <div className="feed-container">
          {ideas.length > 0 ? (
            <>
              <Ideas
                ideas={ideas}
                setIdeas={setIdeas}
                currentUser={currentUser}
                userId={userId}
              />
              {hasMoreIdeas ? (
                <div className="load-more-container">
                  <button onClick={loadMoreIdeas} className="load-more-button">
                    Load More
                  </button>
                </div>
              ) : (
                <p className="end-message">You’ve reached the end of the results!</p>
              )}
            </>
          ) : (
            <p className="no-results-message">No ideas found. Try a different search!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaResults;
