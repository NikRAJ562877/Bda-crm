import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  InputAdornment,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Person, Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import apiClient from '../../api/auth'; // Adjust the path based on your folder structure

function CreateExecutive() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      // Removed unused 'res' variable
      await apiClient({
        endpoint: '/admin/create-executive',
        method: 'POST',
        body: form,
        token: token,
      });
      setMessage('Executive created successfully!');
      setForm({ username: '', email: '', password: '', role: '' });
    } catch (err) {
      setMessage(err?.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="sticky" sx={{ bgcolor: 'lightblue', color: '#ffffff' }}>
        <Toolbar>
          <Typography variant="h5" noWrap>
            Create Executive
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          flex: 1,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {/* Logo Section - visible on both mobile and desktop */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: 200, md: 'auto' },
            backgroundColor: { xs: '#fff', md: '#f4f4f4' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/user.png"
            alt="Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '1rem',
              maxHeight: '100%',
            }}
          />
        </Box>

        {/* Form Section */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            backgroundColor: { xs: 'inherit', md: 'lightblue' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Create Executive
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <TextField
                  label="Username"
                  name="username"
                  fullWidth
                  value={form.username}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  value={form.email}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={form.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Role"
                  name="role"
                  select
                  fullWidth
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="executive1">BD1</MenuItem>
                  <MenuItem value="executive2">BD2</MenuItem>
                  <MenuItem value="executive3">BD3</MenuItem>
                </TextField>
              </Box>
              <Box mb={2}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Create Executive
                </Button>
              </Box>
            </form>
            {message && (
              <Typography mt={2} color="success.main" align="center">
                {message}
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </div>
  );
}

export default CreateExecutive;
