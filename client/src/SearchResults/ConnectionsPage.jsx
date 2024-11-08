// ConnectionsPage.jsx
import React, { useState, useEffect } from 'react';
import './ConnectionsPage.css'; 
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import api from '../api';
import UserList from '../UserList/UserList';

const ConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [connectionType, setConnectionType] = useState('connected'); // Track selected type
  const user = localStorage.getItem('user');

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        // Step 1: Get current user's ID
        const userResponse = await api.post('/user/user_name', { user_name: user });
        const userId = userResponse.data[0].user_id;

        let connectionData;

        // Step 2: Fetch data based on selected connection type
        if (connectionType === 'connected') {
          const response = await api.get(`/connection/connected/${userId}`);
          connectionData = response.data;
        } else if (connectionType === 'pending') {
          const response = await api.get(`/connection/pending/receiver/${userId}`);
          connectionData = response.data;
        } else if (connectionType === 'sent') {
          const response = await api.get(`/connection/sender/${userId}`);
          connectionData = response.data;
        }

        // Step 3: Retrieve details for each connected user based on connection type
        const connectedUsers = await Promise.all(
          connectionData.map(async (connection) => {
            const userIdToFetch = 
              connectionType === 'connected'
                ? (connection.sender_id === userId ? connection.receiver_id : connection.sender_id)
                : (connectionType === 'pending' ? connection.sender_id : connection.receiver_id);

            const userDetailsResponse = await api.get(`/user/${userIdToFetch}`);
            return userDetailsResponse.data[0]; // Assume data contains user info in the first element
          })
        );

        setConnections(connectedUsers);
      } catch (error) {
        console.error('Error fetching connections:', error);
      }
    };

    fetchConnections();
  }, [user, connectionType]);

  // Handlers to set connection type
  const handleConnectionTypeChange = (type) => setConnectionType(type);

  return (
    <div className="connections-page">
      <TopBar />
      <div className="content">
        <SideBar />
        <div className="connections-container">
          <div className="page-details">
            <h1>Your Connections</h1>
            <div className="connection-buttons">
                <button onClick={() => handleConnectionTypeChange('connected')} className={connectionType === 'connected' ? 'active' : ''}>
                Connected
                </button>
                <button onClick={() => handleConnectionTypeChange('pending')} className={connectionType === 'pending' ? 'active' : ''}>
                Pending
                </button>
                <button onClick={() => handleConnectionTypeChange('sent')} className={connectionType === 'sent' ? 'active' : ''}>
                Sent
                </button>
            </div>
          </div>
          <UserList users={connections} currentUser={user} />
        </div>
      </div>
    </div>
  );
};

export default ConnectionsPage;
