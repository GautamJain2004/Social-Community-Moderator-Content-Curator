const express = require('express');
const router = express.Router();
const ModerationLog = require('../models/ModerationLog');

// GET all moderation logs
router.get('/', async (req, res) => {
  try {
    const logs = await ModerationLog.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;