import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DevorumList.css';
import api from '../api';

const DevorumList = ({ forums }) => {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("user");
  const [joinedForums, setJoinedForums] = useState([]);

  useEffect(() => {
    const fetchJoinedForums = async () => {
      try {
        const userResponse = await api.post('/user/user_name', { user_name: currentUser });
        const userId = userResponse.data[0]?.user_id;

        if (userId) {
          const joinedResponse = await api.get(`/forum-joined/user/${userId}`);
          setJoinedForums(joinedResponse.data.map(forum => forum.forums_id));
        }
      } catch (error) {
        console.error('Error fetching joined forums:', error);
      }
    };

    fetchJoinedForums();
  }, [currentUser]);

  const handleJoinToggle = async (forumId) => {
    try {
      const userResponse = await api.post('/user/user_name', { user_name: currentUser });
      const userId = userResponse.data[0]?.user_id;

      if (!userId) {
        console.error("User not logged in or not found.");
        return;
      }

      if (joinedForums.includes(forumId)) {
        // Leave forum
        await api.delete('/forum-joined', { data: { user_id: userId, forum_id: forumId } });
        setJoinedForums((prev) => prev.filter(id => id !== forumId));
      } else {
        // Join forum
        await api.post('/forum-joined', { user_id: userId, forum_id: forumId });
        setJoinedForums((prev) => [...prev, forumId]);
      }
    } catch (error) {
      console.error("Error toggling forum join status:", error);
    }
  };

  const handleForumClick = (devorum) => {
    navigate(`/devorum/${devorum}`);
  };

  return (
    <div className="search-list">
      {forums.map(forum => (
        <div key={forum.forum_id} className="search-container">
          <div className="search-details">
            <h1 className="search-title">
              <div onClick={() => handleForumClick(forum.devorum)}>
                {forum.title}
              </div>
                <button
                    onClick={() => handleJoinToggle(forum.forum_id)}
                    className="join-btn"
                >
                    {joinedForums.includes(forum.forum_id) ? 'Joined' : 'Join'}
                </button>
            </h1>
            <p className="details-para">{forum.details}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DevorumList;
