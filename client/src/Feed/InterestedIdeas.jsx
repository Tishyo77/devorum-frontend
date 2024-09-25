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

  // Fetch the user_id by the current username
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await api.post('/user/user_name', { user_name: currentUser });
        const userId = userResponse.data[0]?.user_id; // Assuming user data has user_id
        setUserId(userId);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Fetch interested ideas by the user's user_id
  useEffect(() => {
    const fetchInterestedIdeas = async () => {
      try {
        if (!userId) return; // Wait until userId is set

        // Fetch the user's interested ideas
        const interestResponse = await api.get(`/interest/user_id/${userId}`);
        const interestedIdeaIds = interestResponse.data.map(row => row.ideas_id); // Array of interested idea_ids

        // Fetch details of all interested ideas by their idea_id
        const ideasWithDetails = await Promise.all(
          interestedIdeaIds.map(async (idea_id) => {
            const ideaResponse = await api.get(`/idea/id/${idea_id}`);
            const idea = ideaResponse.data[0]; // Assuming you get an array with one object

            // Fetch the user who posted the idea
            const userResponse = await api.get(`/user/${idea.user_id}`);
            const user_name = userResponse.data[0].user_name;
            const profile_photo = userResponse.data[0].profile_photo;

            // Return the idea with additional user info
            return { ...idea, user_name, profile_photo, isInterested: true };
          })
        );

        // Update the state with the interested ideas
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
