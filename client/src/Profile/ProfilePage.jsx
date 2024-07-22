import React from 'react';
import './ProfilePage.css';
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import avatarPaths from '../Avatars'; // Import default export

// Array of 20 skills (replace with actual skills)
const skillsList = [
  'JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'Python', 'Java', 'C++',
  'SQL', 'NoSQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'Agile', 'Scrum',
  'DevOps', 'Machine Learning', 'Data Science', 'UI/UX Design'
];

// Array of certification objects
const certificationsList = [
  { name: 'Certification 1', link: 'https://example.com/cert1' },
  { name: 'Certification 2', link: 'https://example.com/cert2' },
  { name: 'Certification 3', link: 'https://example.com/cert3' },
  { name: 'Certification 4', link: 'https://example.com/cert4' },
  { name: 'Certification 5', link: 'https://example.com/cert5' }
];

const ProfilePage = () => {
  // Selecting a random avatar from the avatars array (example)
  const selectedAvatar = avatarPaths[Math.floor(Math.random() * avatarPaths.length)];

  return (
    <div className="profile-page">
      <TopBar />
      <div className="content">
        <SideBar />
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-picture">
              <img src={selectedAvatar} alt="Profile" />
            </div>
            <div className="profile-info">
              <h2>Username</h2>
              <p>Role: Role</p>
              <p>Qualification: Qualification</p>
            </div>
          </div>
          <div className="skills-container">
            <div className="skills">
              <h3>Skills:</h3>
              <div className="skills-list">
                {skillsList.map((skill, index) => (
                  <span key={index} className="skill">{skill}</span>
                ))}
              </div>
            </div>
            <div className="certifications">
              <h3>Certifications:</h3>
              <div className="certifications-list">
                {certificationsList.map((cert, index) => (
                  <div key={index} className="certification">
                    <span className="certification-name">{cert.name}</span>
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="verify-button">Verify</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
