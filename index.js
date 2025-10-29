const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Models and routes
const Student = require('./models/Student');
const studentRoutes = require('./routes/studentRoutes');
app.use('/students', studentRoutes);

// Fallback to index.html for SPA (if needed)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>{
    console.log('Connected to MongoDB');
    app.listen(PORT, ()=> console.log('Server listening on port', PORT));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });
