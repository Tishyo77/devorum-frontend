import React, { useState, useEffect } from 'react';
import '../Feed/FeedPage.css'; 
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import api from '../api';
import { useLocation } from 'react-router-dom';
import UserList from '../UserList/UserList';

const UserResults = () => {
  const [users, setUsers] = useState([]);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [page, setPage] = useState(1); // Pagination state
  const user = localStorage.getItem('user');
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query'); // Extract query

  // Fetch users when `query` or `page` changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const limit = 10; // Number of users per page
        const userResponse = await api.get(`/user/search`, {
          params: { query, limit, page },
        });

        const newUsers = userResponse.data;

        // If fewer results are returned than `limit`, it means no more users to load
        if (newUsers.length < limit) {
          setHasMoreUsers(false);
        }

        // Overwrite users for new query; append users for pagination
        setUsers((prevUsers) => (page === 1 ? newUsers : [...prevUsers, ...newUsers]));
      } catch (error) {
        console.error('Error fetching user search results:', error);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query, page]);

  // Reset state when the query changes
  useEffect(() => {
    setUsers([]); // Clear users on a new query
    setPage(1); // Reset pagination to the first page
    setHasMoreUsers(true); // Reset the load more flag
  }, [query]);

  // Load more users
  const loadMoreUsers = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="feed-page">
      <TopBar />
      <div className="content">
        <SideBar />
        <div className="feed-container">
          {users.length > 0 ? (
            <>
              <UserList users={users} currentUser={user} />
              {hasMoreUsers ? (
                <div className="load-more-container">
                  <button onClick={loadMoreUsers} className="load-more-button">
                    Load More
                  </button>
                </div>
              ) : (
                <p className="end-message">No more users to display!</p>
              )}
            </>
          ) : (
            <p className="no-results-message">No users found. Try a different search!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserResults;
