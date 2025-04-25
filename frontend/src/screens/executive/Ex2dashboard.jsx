import React from 'react';
import Navbar from '../component/Navbar';
import { Box, Typography } from '@mui/material' ;

function Executive2Dashboard() {
    const name = sessionStorage.getItem("name"); // Get the user's name

    return (
      <>
        <Navbar title={`Welcome, ${name} `} dashboardPath="/executive2/dashboard" />
        <Box sx={{ marginLeft: { sm: '240px' }, p: 3 }}>
          <Typography variant="h4">Welcome to Executive 2 Dashboard</Typography>
          {/* Your executive content here */}
        </Box>
      </>
    );
  }
export default Executive2Dashboard;
