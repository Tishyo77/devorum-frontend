import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import '../Feed/FeedPage.css';
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import api from '../api';
import Ideas from '../Ideas/Ideas';

const IdeaPage = () => {
  const [idea, setIdea] = useState(null);
  const [userId, setUserId] = useState(null);

  const currentUser = localStorage.getItem("user");
  
  const { idea_id } = useParams(); 

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
    const fetchIdeaData = async () => {
      try {
        const ideaResponse = await api.get(`/idea/id/${idea_id}`);
        const ideaData = ideaResponse.data[0];

        const userResponse = await api.get(`/user/${ideaData.user_id}`);
        const user_name = userResponse.data[0].user_name;
        const profile_photo = userResponse.data[0].profile_photo;

        const interestResponse = await api.get(`/interest/user_id/${userId}`);
        const isInterested = interestResponse.data.some(row => row.ideas_id === idea_id);

        setIdea({ ...ideaData, user_name, profile_photo, isInterested });
      } catch (error) {
        console.error("Error fetching idea data:", error);
      }
    };

    if (userId) {
      fetchIdeaData();
    }
  }, [idea_id, userId]);

  return (
    <div className="feed-page">
      <TopBar />
      <div className="content">
        <SideBar />
        <div className="feed-container">
          {idea ? (
            <Ideas
              ideas={[idea]} 
              setIdeas={setIdea}
              currentUser={currentUser}
              userId={userId}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaPage;
