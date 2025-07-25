const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const router = express.Router();
const authenticateAdmin = require('../../middleware/authenticateAdmin');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received login data:', req.body);

  try {
    const user = await User.findOne({ username });
    console.log('User found:', user);

    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Send token, role, and name (username)
    res.json({
      token,
      role: user.role,
      name: user.username,
      empID: user.EmpID,  // This will be saved in sessionStorage on frontend
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Error logging in', details: err.message });
  }
});


 
// Admin Dashboard Route (only accessible by Admin)
router.get('/dashboard', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Fetch some admin data (for now, just return a success message)
    res.json({ message: 'Welcome to Admin Dashboard', username: decoded.username });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
});
 
 // Route for creating an executive
router.post('/create-executive', authenticateAdmin, async (req, res) => {
  const { username, EmpID, email, password, role } = req.body;  // <-- added EmpID
  console.log('Received data:', req.body);  // Debug log

  try {
    // Validate all fields
    if (!username || !EmpID || !email || !password || !role) {  // <-- Validate EmpID also
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check for existing username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check for existing EmpID
    const existingEmpID = await User.findOne({ EmpID });  // <-- Check if EmpID is already used
    if (existingEmpID) {
      return res.status(400).json({ error: 'EmpID already in use' });
    }

    // Check for existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Create and save new user
    const newUser = new User({ username, EmpID, email, password, role }); // <-- Include EmpID
    await newUser.save();

    res.status(201).json({ message: 'Executive created successfully' });
  } catch (error) {
    console.error('Error creating executive:', error);
    res.status(500).json({ error: 'Error creating executive: ' + error.message });
  }
});



module.exports = router;
