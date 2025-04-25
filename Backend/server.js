const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/admin/adminRoutes');

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend on port 3000
}));

// Routes
app.use('/api/admin', adminRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.log('Error connecting to MongoDB:', err);
});

// Start the server
const PORT = process.env.port || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
