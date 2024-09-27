import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar'
import SaveIcon from '../assets/Save.png';
import './Edit.css';
import api from '../api';

const EditIdea = () => {
  const [idea, setIdea] = useState({
    title: '',
    body: '',
    status: '',
    user_name: '',
    profile_photo: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { state } = useLocation(); 
  const { ideaId, userId } = state; 

  useEffect(() => {
    const fetchIdeaData = async () => {
      try {
        const ideaResponse = await api.get(`/idea/id/${ideaId}`);
        const ideaData = ideaResponse.data[0];

        const userResponse = await api.get(`/user/${ideaData.user_id}`);
        const user_name = userResponse.data[0].user_name;
        const profile_photo = userResponse.data[0].profile_photo;

        setIdea({
          ...ideaData,
          user_name,
          profile_photo,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching idea data:", error);
        setIsLoading(false);
      }
    };

    fetchIdeaData();
  }, [ideaId]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIdea(prevIdea => ({
      ...prevIdea,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedIdea = {
        title: idea.title,
        body: idea.body,
        status: idea.status
      };
  
      // Send a PUT request to the backend to update the idea
      const response = await api.put(`/idea/id/${ideaId}`, updatedIdea);
      
      if (response.status === 201) {
        console.log('Idea updated successfully:', response.data);
        // Redirect or show success message after updating
        navigate(`/ideas/${ideaId}`); // Redirect back to the idea page or another appropriate page
      } else {
        console.error('Failed to update the idea:', response.data.message);
      }
    } catch (error) {
      console.error("Error updating idea:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-page">
        <TopBar />
        <div className="content">
            <SideBar />
            <div className="edit-container">
                <div className="devorum-item">
                    <div className="devorum-header">
                        <img src={idea.profile_photo} alt="Avatar" className="avatar" />
                        <div className="post-info">
                            <a href={`/profile/${idea.user_name}`} className="username">
                                <span className="username">{idea.user_name}</span>
                            </a>
                            <div className="input-group">
                                <select
                                    id="status"
                                    name="status"
                                    className="status"
                                    value={idea.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="Abandoned">Abandoned</option>
                                    <option value="Completed">Completed</option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="Searching">Searching</option>
                                    <option value="Found">Found</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="edit-idea-form">
                        <div className="input-group">
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="post-title"
                                value={idea.title}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="input-group">
                            <textarea
                                id="body"
                                name="body"
                                className="post-content"
                                value={idea.body}
                                onChange={handleInputChange}
                                rows="5"
                            />
                        </div>

                        <button className="save-button" onClick={handleSave}>
                            <img src={SaveIcon} alt="Save Icon" className="save-icon" />
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default EditIdea;
