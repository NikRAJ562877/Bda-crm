import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;
const collapsedWidth = 60;

const Navbar = ({
  title = "Executive Dashboard",
  navItems = [],
  dashboardPath = "/executive1/dashboard",
  showSidebar = true // <- New
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: hovered ? drawerWidth : collapsedWidth,
        transition: 'width 0.3s ease-in-out',
        overflowX: 'hidden',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Toolbar />
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItemButton key={item.text} onClick={item.onClick} sx={{ px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                transition: 'opacity 0.3s ease-in-out, max-width 0.3s ease-in-out',
                opacity: hovered ? 1 : 0,
                maxWidth: hovered ? '200px' : '0',
                pl: 2
              }}
            />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: 'auto' }}>
        <Divider />
        <List>
          <ListItemButton onClick={handleLogout} sx={{ px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                transition: 'opacity 0.3s ease-in-out, max-width 0.3s ease-in-out',
                opacity: hovered ? 1 : 0,
                maxWidth: hovered ? '200px' : '0',
                pl: 2
              }}
            />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      {/* App Bar always visible */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'lightblue',
          color: '#fff',
        }}
      >
        <Toolbar>
          {isMobile && showSidebar && (
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
            sx={{ height: 70, width: 80, marginRight: 2 }}
          />
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Only show Sidebar if allowed */}
      {showSidebar && (
        <Box component="nav" sx={{ width: { sm: hovered ? drawerWidth : collapsedWidth }, flexShrink: { sm: 0 } }}>
          <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={isMobile ? mobileOpen : true}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                width: hovered ? drawerWidth : collapsedWidth,
                overflowX: 'hidden',
                boxSizing: 'border-box',
                transition: 'width 0.3s ease-in-out',
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
      )}

      {/* Padding offset */}
      <Toolbar />
    </>
  );
};

export default Navbar;
