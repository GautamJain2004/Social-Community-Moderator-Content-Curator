require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
app.use('/api/auth', require('./routes/auth'));

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Dynamically load routes
const routesDir = path.join(__dirname, 'routes');
fs.readdirSync(routesDir).forEach(file => {
  const routeName = file.replace('.js', '');
  try {
    const route = require(`./routes/${routeName}`);
    app.use(`/api/${routeName}`, route);
    console.log(`Loaded route: /api/${routeName}`);
  } catch (err) {
    console.error(`Error loading route ${routeName}:`, err.message);
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Community Moderator Backend is Running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});