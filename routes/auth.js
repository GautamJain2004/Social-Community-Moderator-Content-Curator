const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/check', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ user: null });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    res.json({ user });
  } catch (err) {
    res.status(401).json({ user: null });
  }
});

module.exports = router;