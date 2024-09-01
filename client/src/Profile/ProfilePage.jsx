import React, { useEffect, useState } from 'react';
import './ProfilePage.css';
import { useParams } from 'react-router-dom';
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import api from '../api';

const ProfilePage = () => {
  const { username } = useParams();
  const [localUserName, setLocalUserName] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userQual, setUserQual] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [userBio, setUserBio] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [userCerts, setUserCerts] = useState([]);

  useEffect(() => {
    // Retrieve stored user data from local storage
    const storedUser = localStorage.getItem('user');
    
    // Determine if the stored data is a string or a JSON object
    let parsedUser = null;

    try {
      parsedUser = JSON.parse(storedUser);
    } catch (e) {
      console.log('Stored user data is a simple string, treating it as a username.');
      parsedUser = storedUser; // Assume it's the username directly
    }

    if (parsedUser && typeof parsedUser === 'string') {
      setLocalUserName(parsedUser); // Set the local username if it's a string
    } else if (parsedUser && parsedUser.user_name) {
      setLocalUserName(parsedUser.user_name); // Set the local username from the parsed object
    } else {
      console.log('No valid user data found in local storage.');
    }

    if (username) {
      fetchUserData(username);
    } else {
      console.log('No username found in the URL.');
    }
  }, [username]);

  const fetchUserData = async (user_name) => {
    try {
      const response = await api.post('/user/user_name', { user_name });
      if (response.data && response.data.length > 0) {
        setUserData(response.data);
        setUserRole(response.data[0].roles);
        setUserQual(response.data[0].qualification);
        setUserAvatar(response.data[0].profile_photo);
        setUserBio(response.data[0].bio);

        const skillsArray = response.data[0].skills_temp.split(',').map(skill => skill.trim());
        setUserSkills(skillsArray);

        const certificationsArray = response.data[0].certifications.split(',').map(certification => certification.trim());
        setUserCerts(certificationsArray);
      } else {
        throw new Error('No user data found');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching user data:', error);
    }
  };

  const handleConnect = () => {
    console.log('Connect button clicked!');
    // Add your connection logic here
  };

  return (
    <div className="profile-page">
      <TopBar />
      <div className="content">
        <SideBar />
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-picture">
              <img src={userAvatar} alt="Profile" />
            </div>
            <div className="profile-info">
              <h2>{username}</h2>
              <p>Role: {userRole}</p>
              <p>Qualification: {userQual}</p>
            </div>
            <div className="profile-bio">
              <p>{userBio}</p>
            </div>
            {username !== localUserName && (
              <div className="connect-button-container">
                <button onClick={handleConnect} className="connect-button">Connect</button>
              </div>
            )}
          </div>
          <div className="skills-container">
            <div className="skills">
              <h3>Skills:</h3>
              <div className="skills-list">
                {userSkills.map((skill, index) => (
                  <span key={index} className="skill">{skill}</span>
                ))}
              </div>
            </div>
            <div className="certifications">
              <h3>Certifications:</h3>
              <div className="certifications-list">
                {userCerts.map((cert, index) => (
                  <div key={index} className="certification">
                    <span className="certification-name">{cert}</span>
                    <a href="https://www.google.com" className="verify-button">Verify</a>
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
