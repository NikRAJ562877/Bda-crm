import React, { useState, useEffect } from 'react';
import Navbar from '../component/Navbar';
import { Box, Typography, Grid, Card, CardContent, Button, CardActions } from '@mui/material';
import { Dashboard as DashboardIcon, Call as CallIcon, EventNote as EventNoteIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../api/auth';

function Executive3Dashboard() {
  const name = sessionStorage.getItem("name");
  const navigate = useNavigate();
  const location = useLocation();
  const [leads, setLeads] = useState([]);

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, onClick: () => navigate('/bd3/dashboard') },
    { text: 'My Calls & Deals', icon: <CallIcon />, onClick: () => navigate('/executive3/calls') },
    { text: 'My Tasks & Reminders', icon: <EventNoteIcon />, onClick: () => navigate('/executive3/tasks') },
  ];

  useEffect(() => {
    (async () => {
      try {
        const response = await apiClient({ endpoint: '/leads', method: 'GET' });
        setLeads(response);
      } catch (err) {
        console.error('Error fetching leads:', err);
      }
    })();
  }, []);

  return (
    <>
      <Navbar
        title={`Welcome, ${name}`}
        navItems={navItems}
        dashboardPath="/bd3/dashboard"
        showSidebar={true}
      />
      <Box sx={{ marginLeft: { sm: '240px' }, p: 3 }}>
        {location.pathname === '/executive3/calls' ? (
          <Grid container spacing={3}>
            {leads.map(lead => (
              <Grid item key={lead.leadId} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Lead ID: {lead.leadId}</Typography>
                   </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => navigate(`/executive3/discovery/${lead.leadId}`)}
                    >
                      Manage Discovery Call
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h4" align="center" color="text.secondary">
            Welcome to Executive 3 Dashboard
          </Typography>
        )}
      </Box>
    </>
  );
}

export default Executive3Dashboard;
