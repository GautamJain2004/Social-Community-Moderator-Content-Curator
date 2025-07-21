import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import api from '../api';
import '../App.css';

function CommunityPage() {
  const { id } = useParams();
const { user } = useAuth();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const [communityRes, postsRes] = await Promise.all([
          api.get(`/api/communities/${id}`),
          api.get(`/api/posts/community/${id}?status=${filter === 'all' ? '' : filter}`)
        ]);
        setCommunity(communityRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCommunity();
  }, [id, filter]);

  const handleFlagPost = async (postId, type, reason) => {
    try {
      await api.post(`/api/posts/${postId}/flag`, { type, reason });
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, flags: [...post.flags, { type, reason }] } : post
      ));
    } catch (err) {
      console.error('Error flagging post:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="community-page">
      <div className="community-header">
        <h1>{community.name}</h1>
        <p>{community.description}</p>
        {user && (
          <div className="community-actions">
            <button className="btn-primary">Join Community</button>
          </div>
        )}
      </div>
      
      <div className="filter-controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Posts</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>
      
      <div className="posts-grid">
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard 
              key={post._id} 
              post={post} 
              onFlag={handleFlagPost}
              showModeration={user.roles.includes('moderator')}
            />
          ))
        ) : (
          <div className="no-posts">No posts found</div>
        )}
      </div>
    </div>
  );
}

export default CommunityPage;