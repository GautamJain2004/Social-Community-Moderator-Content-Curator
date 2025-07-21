import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import '../App.css';

function ModerationDashboard() {
 const { user } = useAuth();
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('flagged');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [flaggedRes, pendingRes] = await Promise.all([
          api.get('/api/posts?status=flagged'),
          api.get('/api/posts?status=pending')
        ]);
        setFlaggedPosts(flaggedRes.data);
        setPendingPosts(pendingRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const handleModerate = async (postId, action) => {
    try {
      await api.put(`/api/posts/${postId}/moderate`, { action });
      // Refresh the lists
      const [flaggedRes, pendingRes] = await Promise.all([
        api.get('/api/posts?status=flagged'),
        api.get('/api/posts?status=pending')
      ]);
      setFlaggedPosts(flaggedRes.data);
      setPendingPosts(pendingRes.data);
    } catch (err) {
      console.error('Error moderating post:', err);
    }
  };

  if (loading) return <div className="loading">Loading moderation dashboard...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="moderation-dashboard">
      <h1>Moderation Dashboard</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'flagged' ? 'active' : ''}
          onClick={() => setActiveTab('flagged')}
        >
          Flagged Posts ({flaggedPosts.length})
        </button>
        <button 
          className={activeTab === 'pending' ? 'active' : ''}
          onClick={() => setActiveTab('pending')}
        >
          Pending Posts ({pendingPosts.length})
        </button>
      </div>
      
      <div className="posts-list">
        {activeTab === 'flagged' ? (
          flaggedPosts.length > 0 ? (
            flaggedPosts.map(post => (
              <div key={post._id} className="moderation-post">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <div className="post-meta">
                  <span>Author: {post.author.username}</span>
                  <span>Flags: {post.flags.length}</span>
                </div>
                <div className="moderation-actions">
                  <button 
                    className="btn-approve"
                    onClick={() => handleModerate(post._id, 'approve')}
                  >
                    Approve
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => handleModerate(post._id, 'reject')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-posts">No flagged posts</div>
          )
        ) : (
          pendingPosts.length > 0 ? (
            pendingPosts.map(post => (
              <div key={post._id} className="moderation-post">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <div className="post-meta">
                  <span>Author: {post.author.username}</span>
                  <span>Posted: {new Date(post.createdAt).toLocaleString()}</span>
                </div>
                <div className="moderation-actions">
                  <button 
                    className="btn-approve"
                    onClick={() => handleModerate(post._id, 'approve')}
                  >
                    Approve
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => handleModerate(post._id, 'reject')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-posts">No pending posts</div>
          )
        )}
      </div>
    </div>
  );
}

export default ModerationDashboard;