import React, { useState, useEffect } from 'react';
import '../Feed/FeedPage.css'; 
import TopBar from '../Navbar/TopBar';
import SideBar from '../Navbar/SideBar';
import api from '../api';
import { useLocation } from 'react-router-dom';
import DevorumList from '../DevorumList/DevorumList';

const DevorumResults = () => {
  const [forums, setForums] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreForums, setHasMoreForums] = useState(true);
  const [currentQuery, setCurrentQuery] = useState("");
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    // Reset forums when query changes
    if (query !== currentQuery) {
      setForums([]);
      setPage(1);
      setHasMoreForums(true);
      setCurrentQuery(query);
    }
  }, [query, currentQuery]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const limit = 20;

        // Fetch forums for the current query and page
        const forumResponse = await api.get(`/forum/search`, {
          params: { query: currentQuery, limit, page },
        });

        if (forumResponse.data.length < limit) {
          setHasMoreForums(false);
        }

        // Append unique forums
        setForums((prevForums) => {
          const uniqueForums = [
            ...new Map(
              [...prevForums, ...forumResponse.data].map((forum) => [forum.forum_id, forum])
            ).values(),
          ];
          return uniqueForums;
        });
      } catch (error) {
        console.error('Error fetching forum search results:', error);
      }
    };

    if (currentQuery) {
      fetchSearchResults();
    }
  }, [currentQuery, page]);

  const loadMoreForums = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="feed-page">
      <TopBar />
      <div className="content">
        <SideBar />
        <div className="feed-container">
          <DevorumList forums={forums} />
          {forums.length > 0 && hasMoreForums ? (
            <div className="load-more-container">
              <button onClick={loadMoreForums} className="load-more-button">
                Load More
              </button>
            </div>
          ) : forums.length > 0 ? (
            <p className="end-message">You’ve reached the end of the results!</p>
          ) : (
            <p className="no-results-message">No forums found. Try another search!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevorumResults;
