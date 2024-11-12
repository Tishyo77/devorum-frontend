import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DevorumPage.css';
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import api from '../api';
import Ideas from '../Ideas/Ideas';

const DevorumPage = () => {
  const { devorum } = useParams();
  const [forumData, setForumData] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isJoined, setIsJoined] = useState(false); // Track if user has joined the forum
  const [hasMoreIdeas, setHasMoreIdeas] = useState(true); // Track if there are more ideas to load
  const [page, setPage] = useState(1); // Track the page for pagination

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
        const forumResponse = await api.get(`/forum/devorum/${devorum}`);
        setForumData(forumResponse.data);

        const joinedForumsResponse = await api.get(`/forum-joined/user/${userId}`);
        const joinedForums = joinedForumsResponse.data;
        const isForumJoined = joinedForums.some(forum => forum.forums_id === forumResponse.data.forum_id);
        setIsJoined(isForumJoined);

        const ideasResponse = await api.get(`/idea/forum/${forumResponse.data.forum_id}/recent`, {
          params: { limit: 20, page }
        });

        if (ideasResponse.data.length < 20) {
          setHasMoreIdeas(false);
        }

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

        setIdeas((prevIdeas) => [...prevIdeas, ...ideasWithUserDetails]);
      } catch (error) {
        console.error("Error fetching forum data:", error);
      }
    };

    if (userId) {
      fetchForumData();
    }
  }, [devorum, userId, page]);

  const loadMoreIdeas = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleJoinToggle = async () => {
    try {
      if (isJoined) {
        await api.delete('/forum-joined', { data: { user_id: userId, forum_id: forumData.forum_id } });
        setIsJoined(false);
      } else {
        await api.post('/forum-joined', { user_id: userId, forum_id: forumData.forum_id });
        setIsJoined(true);
      }
    } catch (error) {
      console.error("Error toggling forum join status:", error);
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
            <h1>
              {forumData.title}
              <button onClick={handleJoinToggle} className="join-btn">
                {isJoined ? 'Joined' : 'Join'}
              </button>
            </h1>
            <p>{forumData.details}</p>
          </div>
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
            <p className="end-message">You did it! You reached the end!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevorumPage;
