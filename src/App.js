import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CommunityPage from './pages/CommunityPage';
import ModerationDashboard from './pages/ModerationDashboard';
import UserProfile from './pages/UserProfile';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <div className="content-container">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
              <Route path="/community/:id" element={<PrivateRoute><CommunityPage /></PrivateRoute>} />
              <Route path="/post/:id" element={<PrivateRoute><PostDetail /></PrivateRoute>} />
              <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
              <Route path="/moderation" element={<PrivateRoute roles={['moderator', 'admin']}><ModerationDashboard /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;