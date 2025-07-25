import React from 'react';
import Navbar from '../component/Navbar'; // 👈 fixed relative path if needed
import { Box, Typography } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  EventNote as EventNoteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Executive1Dashboard() {
  const navigate = useNavigate();
  const name = sessionStorage.getItem("name");

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, onClick: () => navigate('/bd1/dashboard') },
    { text: 'My Leads', icon: <AssignmentTurnedInIcon />, onClick: () => navigate('/executive1/lead-prospecting') },
    { text: 'My Tasks & Reminders', icon: <EventNoteIcon />, onClick: () => navigate('/executive1/tasks') },
  ];

  return (
    <>
      <Navbar
        title={`Welcome, ${name}`}
        navItems={navItems}
        dashboardPath="/bd1/dashboard"
        showSidebar={true} // 👈 Show sidebar on dashboard
      />
      <Box sx={{ marginLeft: { sm: '240px' }, p: 3 }}>
        <Typography variant="h4">Welcome to Executive 1 Dashboard</Typography>
      </Box>
    </>
  );
}

export default Executive1Dashboard;
