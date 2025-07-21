import React, { useState, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';
import api from '../api';
import '../App.css';

function PostCard({ post, onFlag, showModeration }) {
const { user } = useAuth();
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [flagType, setFlagType] = useState('spam');
  const [flagReason, setFlagReason] = useState('');
  const [isModerating, setIsModerating] = useState(false);

  const handleFlagSubmit = (e) => {
    e.preventDefault();
    onFlag(post._id, flagType, flagReason);
    setShowFlagForm(false);
    setFlagReason('');
  };

  const handleModerate = async (action) => {
    setIsModerating(true);
    try {
      await api.put(`/api/posts/${post._id}/moderate`, { action });
      // In a real app, you'd update the post in the parent component's state
      window.location.reload(); // Simple refresh for demo
    } catch (err) {
      console.error('Error moderating post:', err);
    } finally {
      setIsModerating(false);
    }
  };

  return (
    <div className={`post-card ${post.status}`}>
      <div className="post-header">
        <div className="post-author">
          <img src={post.author.avatar || '/default-avatar.png'} alt={post.author.username} />
          <span>{post.author.username}</span>
        </div>
        <div className="post-date">{formatDate(post.createdAt)}</div>
      </div>
      
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      
      {post.mediaUrl && post.mediaType === 'image' && (
        <div className="post-media">
          <img src={post.mediaUrl} alt="Post media" />
        </div>
      )}
      
      <div className="post-footer">
        <div className="post-status">
          Status: <span className={`status-badge ${post.status}`}>{post.status}</span>
        </div>
        
        {user && !showModeration && (
          <button 
            className="btn-flag"
            onClick={() => setShowFlagForm(!showFlagForm)}
          >
            Flag Post
          </button>
        )}
        
        {showModeration && (
          <div className="moderation-actions">
            <button 
              className="btn-approve"
              onClick={() => handleModerate('approve')}
              disabled={isModerating}
            >
              Approve
            </button>
            <button 
              className="btn-reject"
              onClick={() => handleModerate('reject')}
              disabled={isModerating}
            >
              Reject
            </button>
          </div>
        )}
      </div>
      
      {showFlagForm && (
        <form className="flag-form" onSubmit={handleFlagSubmit}>
          <select 
            value={flagType} 
            onChange={(e) => setFlagType(e.target.value)}
            required
          >
            <option value="spam">Spam</option>
            <option value="inappropriate">Inappropriate</option>
            <option value="harassment">Harassment</option>
            <option value="other">Other</option>
          </select>
          <textarea
            placeholder="Reason for flagging..."
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">Submit Flag</button>
        </form>
      )}
      
      {post.flags.length > 0 && (
        <div className="post-flags">
          <h4>Flags ({post.flags.length})</h4>
          <ul>
            {post.flags.map((flag, index) => (
              <li key={index}>
                <strong>{flag.type}</strong>: {flag.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PostCard;