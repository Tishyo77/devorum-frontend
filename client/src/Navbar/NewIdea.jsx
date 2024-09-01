import React, { useState } from 'react';
import './NewIdea.css';

const forums = [
  'Web Development',
  'Game Development',
  'AI & Machine Learning',
  'Mobile Apps',
  'Data Science',
  // Add more forum names as needed
];

const NewIdea = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [idea, setIdea] = useState('');
  const [status, setStatus] = useState('Abandoned');
  const [forumName, setForumName] = useState('');
  const [forumSuggestions, setForumSuggestions] = useState([]);

  const handleForumChange = (e) => {
    const query = e.target.value;
    setForumName(query);

    if (query.length > 0) {
      const suggestions = forums.filter(forum => 
        forum.toLowerCase().includes(query.toLowerCase())
      );
      setForumSuggestions(suggestions);
    } else {
      setForumSuggestions([]);
    }
  };

  const handleShare = () => {
    const newIdea = {
      title,
      idea,
      status,
      forumName,
    };
    onSubmit(newIdea);
  };

  return (
    <div className="new-idea-modal">
      <div className="modal-content">
        <h2>Share a New Idea</h2>
        <label>
          Title (20 words max):
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            maxLength={20} 
          />
        </label>
        <label>
          Idea (50 words max):
          <textarea 
            value={idea} 
            onChange={(e) => setIdea(e.target.value)} 
            maxLength={50} 
          />
        </label>
        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Abandoned">Abandoned</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
            <option value="Searching">Searching</option>
            <option value="Found">Found</option>
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
                  onClick={() => setForumName(forum)}
                >
                  {forum}
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
