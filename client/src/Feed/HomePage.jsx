import React, { useState, useEffect } from 'react';
import './FeedPage.css';
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import api from '../api';
import Ideas from '../Ideas/Ideas';

const HomePage = () => {
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
    const fetchForumData = async () => {
      try {
        const ideasResponse = await api.get(`/idea/`);
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

export default HomePage;
