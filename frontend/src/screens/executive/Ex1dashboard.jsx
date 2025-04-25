import React from 'react';
import Navbar from '../component/Navbar'; // Adjust the path if needed
import { Box, Typography } from '@mui/material';

function Executive1Dashboard() {
  const name = sessionStorage.getItem("name"); // Get the user's name

  return (
    <>
      {/* Pass dynamic title to Navbar */}
      <Navbar title={`Welcome, ${name} `} dashboardPath="/executive1/dashboard" />
      
      <Box sx={{ marginLeft: { sm: '240px' }, p: 3 }}>
        <Typography variant="h4">Welcome to Executive 1 Dashboard</Typography>
        {/* Additional content for Executive 1 */}
      </Box>
    </>
  );
}

export default Executive1Dashboard;
