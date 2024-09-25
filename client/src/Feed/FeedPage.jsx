import React, { useState, useEffect } from 'react';
import './FeedPage.css';
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import api from '../api';
import Ideas from '../Ideas/Ideas';

const FeedPage = () => {
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
    const fetchIdeasFromJoinedForums = async () => {
      try {
        const forumsResponse = await api.get(`/forum-joined/user/${userId}`);
        const forumIds = forumsResponse.data.map(forum => forum.forums_id);
        console.log(forumIds);
        const ideasResponses = await Promise.all(
          forumIds.map(forumId =>
            api.get(`/idea/forum/${forumId}`)
          )
        );

        const allIdeas = ideasResponses.flatMap(response => response.data);

        const ideasWithUserDetails = await Promise.all(
          allIdeas.map(async (idea) => {
            const userResponse = await api.get(`/user/${idea.user_id}`);
            const user_name = userResponse.data[0].user_name;
            const profile_photo = userResponse.data[0].profile_photo;

            const interestResponse = await api.get(`/interest/user_id/${userId}`);
            const isInterested = interestResponse.data.some(row => row.ideas_id === idea.idea_id);

            return { ...idea, user_name, profile_photo, isInterested };
          })
        );

        const sortedIdeas = ideasWithUserDetails.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setIdeas(sortedIdeas);
      } catch (error) {
        console.error("Error fetching ideas from joined forums:", error);
      }
    };

    if (userId) {
      fetchIdeasFromJoinedForums();
    }
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

export default FeedPage;
