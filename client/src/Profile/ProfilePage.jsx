import React, { useEffect, useState } from 'react';
import './ProfilePage.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import EditProfileModal from './EditProfileModal';
import EditAvatarModal from './EditAvatarModal'; 
import EditIcon from '../assets/Edit.png';
import api from '../api';

const ProfilePage = () => {
  const navigate = useNavigate(); 
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
  const [userEmail, setUserEmail] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [connectionId, setConnectionId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false); 
  const [isEditAvatarOpen, setEditAvatarOpen] = useState(false);
  const user = localStorage.getItem('user');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    let parsedUser;

    try {
      // Try parsing storedUser as JSON
      parsedUser = JSON.parse(storedUser);
    } catch (e) {
      // If parsing fails, assign storedUser directly
      parsedUser = storedUser;
    }

    // Check if parsedUser is a string or an object with user_name
    if (parsedUser && typeof parsedUser === 'string') {
      setLocalUserName(parsedUser);
    } else if (parsedUser && parsedUser.user_name) {
      setLocalUserName(parsedUser.user_name);
    } else {
      console.log('No valid user data found in local storage.');
    }

    if (username) {
      fetchUserData(username);
      checkConnectionStatus(username);
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
        setUserEmail(response.data[0].email)

        const skillsArray = response.data[0].skills.split(',').map(skill => skill.trim());
        setUserSkills(skillsArray);

        try {
          const certificationsResponse = await api.get(`/certification/${response.data[0].user_id}`);
          const certificationsArray = certificationsResponse.data;
          setUserCerts(certificationsArray);
        } catch (error) {
          console.error('Error fetching certifications:', error.message);
        }
      } else {
        throw new Error('No user data found');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching user data:', error);
    }
  };

  const checkConnectionStatus = async (profileUsername) => {
    try {
      const senderResponse = await api.post('/user/user_name', { user_name: user });
      const sender_id = senderResponse.data[0].user_id;
      const receiverResponse = await api.post('/user/user_name', { user_name: profileUsername });
      const receiver_id = receiverResponse.data[0].user_id;

      const response = await api.get('/connection/');
      const connections = response.data;

      const existingConnection = connections.find(
        (conn) =>
          (conn.sender_id === sender_id && conn.receiver_id === receiver_id) ||
          (conn.sender_id === receiver_id && conn.receiver_id === sender_id)
      );

      if (existingConnection) {
        setConnectionId(existingConnection.connection_id);

        if (existingConnection.sender_id === sender_id && !existingConnection.accepted) {
          setConnectionStatus('Request Sent');
        } else if (existingConnection.sender_id === receiver_id && !existingConnection.accepted)
        {
          setConnectionStatus('Pending');
        } else if (existingConnection.accepted) {
          setConnectionStatus('Connected');
        }
      } else {
        setConnectionStatus('Connect');
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
    }
  };

  const handleConnect = async () => {
    try {
      const senderResponse = await api.post('/user/user_name', { user_name: localUserName });
      const sender_id = senderResponse.data[0].user_id;

      const receiverResponse = await api.post('/user/user_name', { user_name: username });
      const receiver_id = receiverResponse.data[0].user_id;

      const response = await api.post('/connection', {
        sender_id,
        receiver_id
      });

      if (response.status === 201) {
        alert('Connection request sent successfully');
        setConnectionStatus('Request Sent');
        const response = await api.get('/connection/');
        const connections = response.data;

        const existingConnection = connections.find(
          (conn) =>
            (conn.sender_id === sender_id && conn.receiver_id === receiver_id) ||
            (conn.sender_id === receiver_id && conn.receiver_id === sender_id)
        );

        setConnectionId(existingConnection.connection_id);
      } else {
        alert(response.data || 'Error sending connection request');
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('An error occurred while sending the connection request.');
    }
  };

  const handleDeleteConnection = async () => {
    try {
      console.log(connectionId);
      await api.delete(`/connection/${connectionId}`);
      alert('Connection deleted successfully');
      setConnectionStatus('Connect');
      setConnectionId(null);
    } catch (error) {
      console.error('Error deleting connection:', error);
      alert('An error occurred while deleting the connection.');
    }
  };

  const handleAcceptConnection = async () => {
    try {
      await api.put(`/connection/accept/connection/${connectionId}`);
      alert('Connection accepted');
      setConnectionStatus('Connected');
    } catch (error) {
      console.error('Error accepting connection:', error);
      alert('An error occurred while accepting the connection request.');
    }
  };

  const handleEdit = () => {
    setModalOpen(true); // Open the modal
  };

  const handleSaveAvatar = async (newAvatar) => {
    try {
      const email = userData[0].email;
      await api.put('/user/', {
        email,
        update: { profile_photo: newAvatar },
      });

      setUserAvatar(newAvatar);
      setEditAvatarOpen(false);
      alert('Avatar updated successfully');
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Failed to update avatar. Please try again.');
    }
  };

  return (
    <div className="profile-page">
      <TopBar />
      <div className="content">
        <SideBar />
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-picture">
              <img src={userAvatar} alt="Profile" className="profile"/>
              {username === localUserName && (
                <button
                  className="edit-icon-button"
                  onClick={() => setEditAvatarOpen(true)}
                >
                  <img src={EditIcon} alt="Edit" className="edit-icon" />
                </button>
              )}
            </div>
            <div className="profile-details">
              <div className="profile-info">
                <h2>{username}</h2>
                <p>Role: {userRole}</p>
                <p>Qualification: {userQual}</p>
                {connectionStatus === 'Connected' && <p>Email: {userEmail}</p>}
              </div>
              <div className="profile-bio">
                <p>{userBio}</p>
              </div>
            </div>
            <div className="profile-actions">
            <button
              className="action-button ideas-button"
              onClick={() => navigate(`/ideas/${username}`)}
            >
              Ideas
            </button>
              {username === localUserName ? (
                <button className="action-button edit-button" onClick={handleEdit}>
                  Edit
                </button>
              ) : (
                <button
                  onClick={
                    connectionStatus === 'Connect'
                      ? handleConnect
                      : connectionStatus === 'Pending'
                      ? handleAcceptConnection
                      : handleDeleteConnection
                  }
                  className="action-button connect-button"
                >
                  {connectionStatus}
                </button>
              )}
            </div>
          </div>
          <div className="skills-container">
            <div className="skills">
              <h3>Skills:</h3>
              <div className="skills-list">
                {userSkills.length > 0 && userSkills != "" ? (
                  userSkills.map((skill, index) => (
                    <span key={index} className="skill">{skill}</span>
                  ))
                ) : (
                  <div className="no-skills">
                    Looks like {username} has a serious case of skill issue!
                  </div>
                )}
              </div>
            </div>
            <div className="certifications">
              <h3>Certifications:</h3>
              <div className="certifications-list">
                {userCerts.length > 0 ? (
                  userCerts.map((cert, index) => (
                    <div key={index} className="certification">
                      <span className="certification-name">{cert.title}</span>
                      <a
                        href={
                          cert.link.startsWith('http://') || cert.link.startsWith('https://')
                            ? cert.link
                            : `https://${cert.link}`
                        }
                        className="verify-button"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Verify
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="no-certificates">
                    It would appear {username} has no certifications!
                  </div>
                )}
              </div>
            </div>
          </div>
          <EditProfileModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onSave={() => {
              fetchUserData(username); 
              setModalOpen(false); 
            }}
            userData={userData}
            userCerts={userCerts}
          />
          <EditAvatarModal
            isOpen={isEditAvatarOpen}
            onClose={() => setEditAvatarOpen(false)}
            onSave={handleSaveAvatar}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;