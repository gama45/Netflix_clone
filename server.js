const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/novastream', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middleware to check login status for protected routes
app.use((req, res, next) => {
  if (req.path === '/' && !req.cookies.loggedIn) {
    return res.redirect('/login');
  }
  next();
});

// API endpoint for index page content
app.get('/api/home-data', (req, res) => {
  res.json({
    featuredContent: [
      { title: "Popular Show 1", image: "show1.jpg" },
      { title: "New Release", image: "show2.jpg" }
    ],
    userPreferences: {} // Would come from DB in real implementation
  });
});

// Serve index.html as main entry point
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login route still available but not primary focus
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) return res.status(404).json({ error: 'User not found' });
      if (!await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'Wrong password' });
      }
      
      res.json({ success: true, redirect: '/' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // Simple auth check (temporary)
  app.get('/api/check-auth', (req, res) => {
    res.json({ loggedIn: true }); // Change this later
  });

  
  


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});