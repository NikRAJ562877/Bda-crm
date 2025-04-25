import React from 'react';
import Navbar from '../component/Navbar';
import { Box, Typography } from '@mui/material';

function Executive3Dashboard() {
    const name = sessionStorage.getItem("name");

    return (
      <>
        <Navbar title={`Welcome, ${name} `} dashboardPath="/executive3/dashboard" />
        <Box sx={{ marginLeft: { sm: '240px' }, p: 3 }}>
          <Typography variant="h4">Welcome to Executive 3 Dashboard</Typography>
          {/* Your executive content here */}
        </Box>
      </>
    );
  }
  

export default Executive3Dashboard;
