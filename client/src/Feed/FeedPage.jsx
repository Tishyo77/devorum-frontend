import React, { useState } from 'react';
import './FeedPage.css';
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import avatarPaths from '../Avatars'; // Assuming this exports an array of avatar paths

const feedData = [
  {
    username: 'Alice',
    avatar: avatarPaths[0],
    date: '2024-07-01',
    time: '14:30',
    likes: ['John', 'Jane', 'Jack'],
    content: 'Looking for someone to help with a React project. Anyone interested?',
    forum: 'Web Development',
    status: 'Searching',
  },
  {
    username: 'Bob',
    avatar: avatarPaths[1],
    date: '2024-07-02',
    time: '09:45',
    likes: ['Alice', 'Tom'],
    content: 'Starting a new game development project. Need a pixel artist!',
    forum: 'Game Development',
    status: 'Looking for More',
  },
  {
    username: 'Charlie',
    avatar: avatarPaths[2],
    date: '2024-07-03',
    time: '18:00',
    likes: ['Anna', 'Chris', 'David'],
    content: 'Anyone with experience in AWS and Docker? Need some guidance.',
    forum: 'DevOps',
    status: 'Searching',
  },
  {
    username: 'Dave',
    avatar: avatarPaths[3],
    date: '2024-07-04',
    time: '11:20',
    likes: ['Emma', 'Sophia', 'Mason'],
    content: 'Working on a machine learning project. Looking for collaborators.',
    forum: 'Data Science',
    status: 'Found',
  },
  {
    username: 'Eve',
    avatar: avatarPaths[4],
    date: '2024-07-05',
    time: '15:10',
    likes: ['Olivia', 'Liam'],
    content: 'Building a mobile app. Need someone experienced with Flutter.',
    forum: 'Mobile Development',
    status: 'Looking for More',
  },
  {
    username: 'Frank',
    avatar: avatarPaths[5],
    date: '2024-07-06',
    time: '20:30',
    likes: ['James', 'Benjamin'],
    content: 'Starting a cybersecurity project. Any experts here?',
    forum: 'Cybersecurity',
    status: 'Searching',
  },
  {
    username: 'Grace',
    avatar: avatarPaths[6],
    date: '2024-07-07',
    time: '08:15',
    likes: ['Isabella', 'Lucas', 'Amelia'],
    content: 'Need a UI/UX designer for a web app project. Anyone available?',
    forum: 'Web Development',
    status: 'Looking for More',
  },
  {
    username: 'Hank',
    avatar: avatarPaths[7],
    date: '2024-07-08',
    time: '12:45',
    likes: ['William', 'James'],
    content: 'Collaborating on a blockchain project. Need more developers.',
    forum: 'Blockchain',
    status: 'Found',
  },
  {
    username: 'Ivy',
    avatar: avatarPaths[8],
    date: '2024-07-09',
    time: '17:00',
    likes: ['Evelyn', 'Henry'],
    content: 'Looking for a partner to develop a new SaaS product.',
    forum: 'SaaS Development',
    status: 'Searching',
  },
  {
    username: 'Jack',
    avatar: avatarPaths[9],
    date: '2024-07-10',
    time: '21:30',
    likes: ['Mia', 'Charlotte', 'Daniel'],
    content: 'Starting an AI research project. Need collaborators.',
    forum: 'AI Research',
    status: 'Looking for More',
  },
];

const FeedPage = () => {
  const [selectedLikes, setSelectedLikes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLikesClick = (likes) => {
    setSelectedLikes(likes);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="feed-page">
      <TopBar />
      <div className="content">
        <SideBar />
        <div className="feed-container">
          {feedData.map((post, index) => (
            <div key={index} className="feed-item">
              <div className="feed-header">
                <img src={post.avatar} alt="Avatar" className="avatar" />
                <div className="post-info">
                  <span className="username">{post.username}</span>
                  <span className="forum">{post.forum}</span>
                  <span className={`status ${post.status.toLowerCase().replace(/ /g, '-')}`}>{post.status}</span>
                </div>
              </div>
              <div className="post-meta">
                <span>{post.date}</span>
                <span>{post.time}</span>
              </div>
              <p className="content">{post.content}</p>
              <div className="like-count" onClick={() => handleLikesClick(post.likes)}>
                Likes: {post.likes.length}
              </div>
            </div>
          ))}
        </div>
      </div>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <h2>Liked by:</h2>
            <ul>
              {selectedLikes.map((like, index) => (
                <li key={index}>{like}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedPage;
