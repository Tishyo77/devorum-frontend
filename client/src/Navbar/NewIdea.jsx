import React, { useState, useEffect } from 'react';
import './NewIdea.css';
import api from '../api';

const NewIdea = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [idea, setIdea] = useState('');
  const [status, setStatus] = useState('Searching');
  const [forumName, setForumName] = useState('');
  const [forumSuggestions, setForumSuggestions] = useState([]);
  const [forums, setForums] = useState([]);
  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await api.get('/forum/');
        setForums(response.data); 
      } catch (error) {
        console.error('Error fetching forums:', error);
      }
    };

    fetchForums();

    const fetchUserId = async () => {
      const userName = localStorage.getItem('user'); 
      if (userName) {
        try {
          const response = await api.post('/user/user_name', { user_name: userName });
          if (response.data.length > 0) {
            setUserId(response.data[0].user_id); 
          }
        } catch (error) {
          console.error('Error fetching user ID:', error);
        }
      }
    };

    fetchUserId();
  }, []);

  const handleForumChange = (e) => {
    const query = e.target.value;
    setForumName(query);
  
    if (query.length > 0) {
      const suggestions = forums.filter(forum =>
        forum.title.toLowerCase().includes(query.toLowerCase())
      );
      setForumSuggestions(suggestions);
    } else {
      setForumSuggestions([]);
    }
  };

  const handleForumSelect = (forum) => {
    setForumName("d/" + forum.devorum); 
    setForumSuggestions([]); 
  };

  const handleTitleChange = (e) => {
    const words = e.target.value.trim().split(/\s+/);
    if (words.length <= 20) {
      setTitle(e.target.value);
    }
  };

  const handleIdeaChange = (e) => {
    const words = e.target.value.trim().split(/\s+/);
    if (words.length <= 50) {
      setIdea(e.target.value);
    }
  };

  const handleShare = async () => {
    const selectedForum = forums.find(forum => `d/${forum.devorum}` === forumName);

    if (!selectedForum) {
      alert('Please select a valid forum.');
      return;
    }

    if (!userId) {
      alert('User not found. Please ensure you are logged in.');
      return;
    }

    const newIdea = {
      title,
      body: idea,
      user_id: userId,
      forum_id: selectedForum.forum_id,
      status: status,
    };

    try {
      const response = await api.post('/idea/', newIdea);
      onSubmit(response.data); 
    } catch (error) {
      console.error('Error sharing idea:', error);
      alert('There was an error sharing your idea.');
    }
  };

  return (
    <div className="new-idea-modal">
      <div className="modal-content">
        <h2>Share a New Idea</h2>
        <label>
          Title (20 Words Max):
          <input 
            type="text" 
            value={title} 
            onChange={handleTitleChange} 
          />
        </label>
        <label>
          Idea (50 Words Max):
          <textarea 
            value={idea} 
            onChange={handleIdeaChange} 
          />
        </label>
        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Searching">Searching</option>
            <option value="Found">Found</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
            <option value="Abandoned">Abandoned</option>
          </select>
        </label>
        <label>
          Forum Name:
          <input 
            type="text" 
            value={forumName} 
            onChange={handleForumChange} 
          />
          {forumSuggestions.length > 0 && (
            <ul className="forum-suggestions">
              {forumSuggestions.map((forum, index) => (
                <li 
                  key={index} 
                  onClick={() => handleForumSelect(forum)}
                  className="suggestion-item"
                >
                  d/{forum.devorum}
                </li>
              ))}
            </ul>
          )}
        </label>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleShare}>Share</button>
        </div>
      </div>
    </div>
  );
};

export default NewIdea;
