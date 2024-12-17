import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './FeedPage.css';
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import api from '../api';
import Ideas from '../Ideas/Ideas';

const UserIdeasPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [userId, setUserId] = useState(null);
  const [hasMoreIdeas, setHasMoreIdeas] = useState(true);
  const [page, setPage] = useState(1); 
  const { username } = useParams();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userResponse = await api.post('/user/user_name', { user_name: username });
        const fetchedUserId = userResponse.data[0]?.user_id;
        setUserId(fetchedUserId);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchUserIdeas = async () => {
      try {
        const limit = 20; 
        const userIdeasResponse = await api.get(`/idea/user/${userId}`, {
          params: { limit, page },
        });

        if (userIdeasResponse.data.length < limit) {
          setHasMoreIdeas(false);
        }

        const forumTitleCache = new Map();

        const ideasWithDetails = await Promise.all(
          userIdeasResponse.data.map(async (idea) => {
            const userResponse = await api.get(`/user/${idea.user_id}`);
            const user_name = userResponse.data[0].user_name;
            const profile_photo = userResponse.data[0].profile_photo;

            const interestResponse = await api.get(`/interest/user_id/${userId}`);
            const isInterested = interestResponse.data.some(row => row.ideas_id === idea.idea_id);

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

        setIdeas((prevIdeas) => [...prevIdeas, ...ideasWithDetails]);
      } catch (error) {
        console.error("Error fetching user ideas:", error);
      }
    };

    if (userId) {
      fetchUserIdeas();
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
          <Ideas
            ideas={ideas}
            setIdeas={setIdeas}
            currentUser={username}
            userId={userId}
          />
          {ideas.length > 0 && hasMoreIdeas ? (
            <div className="load-more-container">
              <button onClick={loadMoreIdeas} className="load-more-button">
                Load More
              </button>
            </div>
          ) : (
            <p className="end-message">No more ideas to display!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserIdeasPage;
