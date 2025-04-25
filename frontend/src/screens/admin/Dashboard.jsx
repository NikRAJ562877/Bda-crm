import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Drawer, IconButton, List, ListSubheader, ListItemButton, ListItemIcon, ListItemText, Divider, Collapse, Grid, useMediaQuery, styled } from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon, PersonAdd as PersonAddIcon, BarChart as BarChartIcon, Description as DescriptionIcon, Layers as LayersIcon, ExpandLess, ExpandMore, Logout as LogoutIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import apiClient from '../../api/auth'; // Adjust path to where your apiClient is located

const drawerWidth = 240;

const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  marginBottom: theme.spacing(1),
}));

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [reportsOpen, setReportsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    (async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      try {
        const res = await apiClient({
          endpoint: '/admin/dashboard',
          method: 'GET',
          token: token,
        });
  
        // Check if message exists in the response
        if (res && res.message) {
          setMessage(res.message);
        } else {
          setMessage('No message in response');
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        setMessage('Error accessing dashboard');
      }
    })();
  }, [navigate]);
  

  const handleReportsClick = () => setReportsOpen((open) => !open);
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, onClick: () => navigate('/admin/dashboard') },
    { text: 'Users', icon: <PersonAddIcon />, onClick: () => navigate('/admin/Create-Executive') },
    { divider: true },
    { text: 'Sales', icon: <BarChartIcon />, onClick: () => navigate('/admin/reports/sales') },
    { text: 'Traffic', icon: <DescriptionIcon />, onClick: () => navigate('/admin/reports/traffic') },
    { text: 'Integrations', icon: <LayersIcon />, onClick: () => navigate('/admin/integrations') },
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List component="nav" subheader={<li />}>
          <ListSubheader>Main items</ListSubheader>
          {navItems.slice(0, 2).map((item) => (
            <ListItemButton key={item.text} onClick={item.onClick}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListSubheader>Analytics</ListSubheader>
          <ListItemButton onClick={handleReportsClick}>
            <ListItemIcon><BarChartIcon /></ListItemIcon>
            <ListItemText primary="Reports" />
            {reportsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {navItems.slice(3, 5).map((item) => (
                <ListItemButton key={item.text} sx={{ pl: 4 }} onClick={item.onClick}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
          <ListItemButton onClick={navItems[5].onClick}>
            <ListItemIcon><LayersIcon /></ListItemIcon>
            <ListItemText primary="Integrations" />
          </ListItemButton>
        </List>
      </Box>
      <Box sx={{ mt: 'auto' }}>
        <Divider />
        <List>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'lightblue',
          color: '#ffffff',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box
            component="img"
            src="/Glory.webp"
            alt="Glory Media Logo"
            sx={{ height: 70, width: 75, marginRight: 2, marginBottom: -1 }}
          />
          <Typography variant="h5" noWrap>
            Glory Media
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Responsive Drawer */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          {message || 'Welcome to Admin Dashboard'}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}><Skeleton height={14} /></Grid>
          <Grid item xs={12}><Skeleton height={14} /></Grid>
          <Grid item xs={12} sm={4}><Skeleton height={100} /></Grid>
          <Grid item xs={12} sm={8}><Skeleton height={100} /></Grid>
          <Grid item xs={12}><Skeleton height={150} /></Grid>
          <Grid item xs={12}><Skeleton height={14} /></Grid>
          <Grid item xs={6} sm={3}><Skeleton height={100} /></Grid>
          <Grid item xs={6} sm={3}><Skeleton height={100} /></Grid>
          <Grid item xs={6} sm={3}><Skeleton height={100} /></Grid>
          <Grid item xs={6} sm={3}><Skeleton height={100} /></Grid>
        </Grid>
      </Box>
    </Box>
  );
}
