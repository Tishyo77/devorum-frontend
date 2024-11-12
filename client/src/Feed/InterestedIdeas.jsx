import React, { useState, useEffect } from 'react';
import './FeedPage.css';
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import api from '../api';
import Ideas from '../Ideas/Ideas';

const InterestedIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [userId, setUserId] = useState(null);
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
    const fetchInterestedIdeas = async () => {
      try {
        if (!userId) return; 

        const interestResponse = await api.get(`/interest/user_id/${userId}`);
        const interestedIdeaIds = interestResponse.data.map(row => row.ideas_id); // Array of interested idea_ids

        // Cache for forum titles
        const forumTitleCache = new Map();

        const ideasWithDetails = await Promise.all(
          interestedIdeaIds.map(async (idea_id) => {
            const ideaResponse = await api.get(`/idea/id/${idea_id}`);
            const idea = ideaResponse.data[0]; 

            const userResponse = await api.get(`/user/${idea.user_id}`);
            const user_name = userResponse.data[0].user_name;
            const profile_photo = userResponse.data[0].profile_photo;

            // Retrieve forum title, checking the cache first
            let forum_title;
            if (forumTitleCache.has(idea.forum_id)) {
              forum_title = forumTitleCache.get(idea.forum_id);
            } else {
              const forumResponse = await api.get(`/forum/${idea.forum_id}`);
              forum_title = "d/" + forumResponse.data[0].devorum;
              forumTitleCache.set(idea.forum_id, forum_title);
            }

            return { ...idea, user_name, profile_photo, isInterested: true, forum_title };
          })
        );

        setIdeas(ideasWithDetails);
      } catch (error) {
        console.error('Error fetching interested ideas:', error);
      }
    };

    fetchInterestedIdeas();
  }, [userId]);

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
        </div>
      </div>
    </div>
  );
};

export default InterestedIdeas;
