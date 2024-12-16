import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Landing from './Landing/Landing';
import SignUp from './SignUp/SignUpPage';
import Login from './Login/LoginPage';
import Profile from './Profile/ProfilePage';
import Feed from './Feed/FeedPage';
import Devorum from './Devorum/DevorumPage';
import Home from './Feed/HomePage';
import InterestedIdeas from './Feed/InterestedIdeas';
import IdeaPage from './Feed/IdeaPage';
import EditIdea from './Edit/EditIdea';
import IdeaResults from './SearchResults/IdeaResults';
import UserResults from './SearchResults/UserResults';
import DevorumResults from './SearchResults/DevorumResults';
import ConnectionsPage from './SearchResults/ConnectionsPage';

// Higher-order component to protect routes
const ProtectedRoute = ({ element: Component }) => {
  const token = localStorage.getItem('token'); // Check for token in local storage
  return token ? Component : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="profile/:username" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="devorum/:devorum" element={<ProtectedRoute element={<Devorum />} />} />
        <Route path="feed" element={<ProtectedRoute element={<Feed />} />} />
        <Route path="home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="interested-ideas" element={<ProtectedRoute element={<InterestedIdeas />} />} />
        <Route path="ideas/:idea_id" element={<ProtectedRoute element={<IdeaPage />} />} />
        <Route path="edit-idea/:idea_id" element={<ProtectedRoute element={<EditIdea />} />} />
        <Route path="/idea/search" element={<ProtectedRoute element={<IdeaResults />} />} />
        <Route path="/user/search" element={<ProtectedRoute element={<UserResults />} />} />
        <Route path="/devorum/search" element={<ProtectedRoute element={<DevorumResults />} />} />
        <Route path="connected" element={<ProtectedRoute element={<ConnectionsPage />} />} />
      </Routes>
    </Router>
  );
};
 
export default App;
