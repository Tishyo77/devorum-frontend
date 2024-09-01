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
    content: 'I’ve been working on a complex React project for a while now, and I’m realizing that I could really use some help, particularly with managing state and optimizing performance. If anyone has experience with Redux or Context API, I’d love to collaborate. The project has a lot of potential, and I’m excited to take it to the next level with the right support. Let me know if you’re interested in joining!',
    forum: 'Web Development',
    status: 'Searching',
  },
  {
    username: 'Bob',
    avatar: avatarPaths[1],
    date: '2024-07-02',
    time: '09:45',
    likes: ['Alice', 'Tom'],
    content: 'I’m in the early stages of a game development project and currently looking for a talented pixel artist to help bring the characters and environment to life. The game is going to be a retro-style RPG with a strong emphasis on storytelling and character development. If you have a passion for creating vibrant, nostalgic pixel art and want to be part of a project that’s aiming to revive the charm of classic RPGs, let’s chat!',
    forum: 'Game Development',
    status: 'Looking for More',
  },
  {
    username: 'Charlie',
    avatar: avatarPaths[2],
    date: '2024-07-03',
    time: '18:00',
    likes: ['Anna', 'Chris', 'David'],
    content: 'I’m currently facing some challenges with setting up a scalable infrastructure on AWS, particularly with integrating Docker for containerization. I’m looking for someone who’s well-versed in AWS services like EC2, S3, and Lambda, and has experience with Docker. This is a crucial part of a larger DevOps initiative I’m working on, so any guidance or collaboration would be greatly appreciated. Let’s connect if you’re interested in sharing your expertise!',
    forum: 'DevOps',
    status: 'Searching',
  },
  {
    username: 'Dave',
    avatar: avatarPaths[3],
    date: '2024-07-04',
    time: '11:20',
    likes: ['Emma', 'Sophia', 'Mason'],
    content: 'I’m excited to share that I’m working on an innovative machine learning project that aims to analyze large datasets for predictive insights. The project has already attracted some attention, but I’m looking for more collaborators, especially those with experience in TensorFlow or PyTorch. If you’re passionate about machine learning and want to work on a project that could have a significant impact, let’s discuss how we can work together to make this a success.',
    forum: 'Data Science',
    status: 'Found',
  },
  {
    username: 'Eve',
    avatar: avatarPaths[4],
    date: '2024-07-05',
    time: '15:10',
    likes: ['Olivia', 'Liam'],
    content: 'I’m in the process of developing a mobile app aimed at revolutionizing the way people manage their personal finances. The app is being built using Flutter, and I’m looking for someone with deep expertise in Flutter and Dart to help accelerate the development. This project has the potential to reach a wide audience and make a real difference in people’s lives. If you’re interested in joining a project with big aspirations, I’d love to collaborate!',
    forum: 'Mobile Development',
    status: 'Looking for More',
  },
  {
    username: 'Frank',
    avatar: avatarPaths[5],
    date: '2024-07-06',
    time: '20:30',
    likes: ['James', 'Benjamin'],
    content: 'I’m launching a new project focused on cybersecurity, specifically in the realm of threat detection and mitigation. The project will involve developing advanced tools for identifying and neutralizing cyber threats in real-time. I’m looking for experts in cybersecurity, particularly those with experience in network security and ethical hacking, to collaborate on this project. If you’re passionate about making the digital world a safer place, this is an opportunity to make a meaningful impact.',
    forum: 'Cybersecurity',
    status: 'Searching',
  },
  {
    username: 'Grace',
    avatar: avatarPaths[6],
    date: '2024-07-07',
    time: '08:15',
    likes: ['Isabella', 'Lucas', 'Amelia'],
    content: 'I’m leading the development of a web app and we’re currently at a stage where the user interface and experience need to be polished. I’m searching for a UI/UX designer who can help us create a visually appealing and user-friendly interface. The app has a lot of potential, and a strong design could really set it apart. If you’re a designer who loves working on innovative projects and wants to be part of something that could make a difference, let’s connect!',
    forum: 'Web Development',
    status: 'Looking for More',
  },
  {
    username: 'Hank',
    avatar: avatarPaths[7],
    date: '2024-07-08',
    time: '12:45',
    likes: ['William', 'James'],
    content: 'I’m currently collaborating on a blockchain project that aims to create a decentralized platform for secure, transparent transactions. We’ve made significant progress but are now looking for more developers to join the team, especially those with experience in smart contracts and Ethereum. This project could be a game-changer in the blockchain space, and we’re looking for passionate developers who want to be part of something groundbreaking. Let’s discuss how you can contribute!',
    forum: 'Blockchain',
    status: 'Found',
  },
  {
    username: 'Ivy',
    avatar: avatarPaths[8],
    date: '2024-07-09',
    time: '17:00',
    likes: ['Evelyn', 'Henry'],
    content: 'I’ve got an exciting idea for a new SaaS product that could streamline project management for remote teams. I’m looking for a partner to help bring this idea to life, particularly someone with experience in SaaS development and cloud computing. This is a big opportunity to create something that could have a huge impact in the remote work space. If you’re as excited about SaaS as I am and want to build something that could change the way people work, let’s collaborate!',
    forum: 'SaaS Development',
    status: 'Searching',
  },
  {
    username: 'Jack',
    avatar: avatarPaths[9],
    date: '2024-07-10',
    time: '21:30',
    likes: ['Mia', 'Charlotte', 'Daniel'],
    content: 'I’m in the planning stages of an AI research project that aims to explore new frontiers in natural language processing and machine learning. This project has the potential to push the boundaries of what AI can do, and I’m looking for collaborators who are passionate about AI and want to contribute to cutting-edge research. If you’re interested in AI, machine learning, or NLP, and want to be part of a project that could have far-reaching implications, I’d love to hear from you!',
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
              <p className="post-content">{post.content}</p>
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
