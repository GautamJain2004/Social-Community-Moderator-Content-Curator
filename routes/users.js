// Add to your existing users.js routes
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // 2. Verify password (in real app, use bcrypt.compare)
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Create token (simplified example)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { 
      expiresIn: '1h' 
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});