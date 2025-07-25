import React, { useEffect, useState } from 'react';
import Navbar from '../component/Navbar';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CardActions
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MarkEmailRead as MarkEmailReadIcon,
  EventNote as EventNoteIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../api/auth'; // Adjust path if needed

function Executive2Dashboard() {
  const name = sessionStorage.getItem("name");
  const navigate = useNavigate();
  const location = useLocation();

  const [leads, setLeads] = useState([]);

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, onClick: () => navigate('/bd2/dashboard') },
    { text: 'My Outreach', icon: <MarkEmailReadIcon />, onClick: () => navigate('/executive2/outreach') },
    { text: 'My Tasks & Reminders', icon: <EventNoteIcon />, onClick: () => navigate('/executive2/tasks') },
  ];

  useEffect(() => {
    // Fetch leads only when on My Outreach section
    if (location.pathname === '/executive2/outreach') {
      apiClient({ endpoint: '/leads', method: 'GET' }) // adjust endpoint if needed
        .then(data => setLeads(data))
        .catch(console.error);
    }
  }, [location.pathname]);

  const renderOutreachCards = () => (
    <Box>
      <Typography variant="h5" gutterBottom>My Outreach Leads</Typography>
      <Grid container spacing={2}>
        {leads.map((lead) => (
         <Grid item xs={12} sm={6} md={4} key={lead.leadId}>
         <Card>
           <CardContent>
             <Typography variant="h6">Lead #{lead.leadId}</Typography>
              
           </CardContent>
           <CardActions>
             <Button onClick={() => navigate(`/executive2/outreach/${lead.leadId}`)} size="small" variant="contained">
               Manage Outreach
             </Button>
           </CardActions>
         </Card>
       </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <>
      <Navbar title={`Welcome, ${name}`} navItems={navItems} dashboardPath="/bd2/dashboard" showSidebar={true} />
      <Box sx={{ marginLeft: { sm: '240px' }, p: 3 }}>
        {location.pathname === '/executive2/outreach' ? (
          renderOutreachCards()
        ) : (
          <Typography variant="h4">Welcome to Executive 2 Dashboard</Typography>
        )}
      </Box>
    </>
  );
}

export default Executive2Dashboard;
