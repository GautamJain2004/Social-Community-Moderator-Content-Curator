const express = require('express');
const router = express.Router();
const Community = require('../models/Community');

// GET all communities
router.get('/', async (req, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;