const mongoose = require('mongoose');

const moderationLogSchema = new mongoose.Schema({
  action: { 
    type: String, 
    required: true,
    enum: ['approve', 'reject', 'flag', 'delete'] 
  },
  post: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  },
  moderator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  reason: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('ModerationLog', moderationLogSchema);