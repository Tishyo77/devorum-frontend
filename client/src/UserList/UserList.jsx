// UserList.jsx
import React, { useState, useEffect } from 'react';
import './UserList.css';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const UserList = ({ users, currentUser }) => {
  const [connectionStatusMap, setConnectionStatusMap] = useState({});
  const [connectionIdMap, setConnectionIdMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    users.forEach(user => {
      checkConnectionStatus(user.user_name);
    });
  }, [users]);

  const checkConnectionStatus = async (profileUsername) => {
    try {
      const senderResponse = await api.post('/user/user_name', { user_name: currentUser });
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
        setConnectionIdMap(prev => ({ ...prev, [profileUsername]: existingConnection.connection_id }));

        if (existingConnection.sender_id === sender_id && !existingConnection.accepted) {
          setConnectionStatusMap(prev => ({ ...prev, [profileUsername]: 'Request Sent' }));
        } else if (existingConnection.sender_id === receiver_id && !existingConnection.accepted) {
          setConnectionStatusMap(prev => ({ ...prev, [profileUsername]: 'Pending' }));
        } else if (existingConnection.accepted) {
          setConnectionStatusMap(prev => ({ ...prev, [profileUsername]: 'Connected' }));
        }
      } else {
        setConnectionStatusMap(prev => ({ ...prev, [profileUsername]: 'Connect' }));
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
    }
  };

  const handleConnect = async (profileUsername) => {
    try {
      const senderResponse = await api.post('/user/user_name', { user_name: currentUser });
      const sender_id = senderResponse.data[0].user_id;
      const receiverResponse = await api.post('/user/user_name', { user_name: profileUsername });
      const receiver_id = receiverResponse.data[0].user_id;

      const response = await api.post('/connection', { sender_id, receiver_id });
      if (response.status === 201) {
        alert('Connection request sent successfully');
        setConnectionStatusMap(prev => ({ ...prev, [profileUsername]: 'Request Sent' }));

        const connectionResponse = await api.get('/connection/');
        const connections = connectionResponse.data;

        const existingConnection = connections.find(
          (conn) =>
            (conn.sender_id === sender_id && conn.receiver_id === receiver_id) ||
            (conn.sender_id === receiver_id && conn.receiver_id === sender_id)
        );

        setConnectionIdMap(prev => ({ ...prev, [profileUsername]: existingConnection.connection_id }));

      } else {
        alert(response.data || 'Error sending connection request');
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('An error occurred while sending the connection request.');
    }
  };

  const handleDeleteConnection = async (profileUsername) => {
    try {
      const connectionId = connectionIdMap[profileUsername];
      await api.delete(`/connection/${connectionId}`);
      alert('Connection deleted successfully');
      setConnectionStatusMap(prev => ({ ...prev, [profileUsername]: 'Connect' }));
      setConnectionIdMap(prev => ({ ...prev, [profileUsername]: null }));
    } catch (error) {
      console.error('Error deleting connection:', error);
      alert('An error occurred while deleting the connection.');
    }
  };

  const handleAcceptConnection = async (profileUsername) => {
    try {
      const connectionId = connectionIdMap[profileUsername];
      await api.put(`/connection/accept/connection/${connectionId}`);
      alert('Connection accepted');
      setConnectionStatusMap(prev => ({ ...prev, [profileUsername]: 'Connected' }));
    } catch (error) {
      console.error('Error accepting connection:', error);
      alert('An error occurred while accepting the connection request.');
    }
  };

  const handleUserClick = (userName) => {
    navigate(`/profile/${userName}`);
  };

  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.user_name} className="user-container">
          <div onClick={() => handleUserClick(user.user_name)} className="user-avatar-details">
            <img 
              src={user.profile_photo || '/default-avatar.png'} 
              alt={user.user_name}
              className="user-avatar"
            />
            <div className="user-info">
              <div className="user-details">
                <p className="user-name">{user.user_name}</p>
                <p className="user-role">{user.roles}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() =>
              connectionStatusMap[user.user_name] === 'Connect'
                ? handleConnect(user.user_name)
                : connectionStatusMap[user.user_name] === 'Pending'
                ? handleAcceptConnection(user.user_name)
                : handleDeleteConnection(user.user_name)
            }
            className="connect-button"
          >
            {connectionStatusMap[user.user_name] || 'Connect'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserList;
