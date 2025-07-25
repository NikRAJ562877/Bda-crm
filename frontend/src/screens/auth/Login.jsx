import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import '../../css/Login.css';  // Import the CSS file
import { useNavigate } from 'react-router-dom'; // For redirection
import apiClient from '../../api/auth';  // Import the apiClient utility

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Hook for redirecting the user

  // Check if the user is already logged in
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      // Redirect to the appropriate dashboard based on the role
      const role = sessionStorage.getItem("role");
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'executive1') {
        navigate('/bd1/dashboard');
      } else if (role === 'executive2') {
        navigate('/bd2/dashboard');
      } else if (role === 'executive3') {
        navigate('/bd3/dashboard');
      }
    }
  }, [navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!form.username || !form.password) {
      setMessage("Please enter both username and password.");
      return;
    }
  
    try {
      const res = await apiClient({
        endpoint: "/admin/login",
        method: "POST",
        body: form,
      });
      
      if (res && res.token && res.role) {
        const { token, role, name, empID } = res;
  
        // Save the token and role to sessionStorage
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("name", name);
        sessionStorage.setItem("empID", empID);
      
        // Redirect based on role
        switch (role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'executive1':
            navigate('/bd1/dashboard');
            break;
          case 'executive2':
            navigate('/bd2/dashboard');
            break;
          case 'executive3':
            navigate('/bd3/dashboard');
            break;
          default:
            setMessage("Unknown role assigned.");
        }
      } else {
        setMessage("Invalid response data: Missing token or role.");
        console.error("Missing token or role in the response");
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.error || "An error occurred. Please try again.";
      setMessage(errorMessage);
      console.error('Error during login:', err);
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-box">
        {/* Logo Section */}
        <div className="logo-container">
          <img src="/logo.avif" alt="Logo" />
        </div>

        {/* Login Form Section */}
        <div className="login-form-container">
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                label="Username"
                name="username"
                variant="outlined"
                fullWidth
                value={form.username}
                onChange={handleChange}
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                value={form.password}
                onChange={handleChange}
                required
              />
            </Box>
            <Box mb={2} className="login-button">
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
              </Button>
            </Box>
          </form>

          {/* Error Message */}
          {message && (
            <Typography color="error" align="center">{message}</Typography>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
