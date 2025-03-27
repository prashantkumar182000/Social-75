import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Avatar, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { auth } from '../firebase';
import SettingsIcon from '@mui/icons-material/Settings';
import { motion } from 'framer-motion';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const location = useLocation();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(logout());
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  // Navbar links
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Content', path: '/content' },
    { label: 'Map', path: '/map' },
    { label: 'Action Hub', path: '/action', protected: true },
    { label: 'Chat', path: '/chat', protected: true },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        background: theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            textDecoration: 'none',
            color: theme.palette.text.primary,
            '&:hover': {
              color: theme.palette.primary.main,
            },
          }}
        >
          SOCIAL75
        </Typography>

        {/* Navigation Links */}
        {navLinks.map((link) => {
          if (link.protected && !user) return null; // Hide protected links if not logged in
          return (
            <Button
              key={link.path}
              color="inherit"
              component={Link}
              to={link.path}
              sx={{
                mx: 1,
                fontWeight: 600,
                color: location.pathname === link.path ? theme.palette.primary.main : theme.palette.text.primary,
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {link.label}
            </Button>
          );
        })}

        {/* User Menu */}
        {user ? (
          <>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{
                ml: 2,
                '&:hover': {
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <SettingsIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                '& .MuiPaper-root': {
                  background: theme.palette.mode === 'dark' ? '#1E1E1E' : '#ffffff',
                  boxShadow: theme.shadows[4],
                  borderRadius: '12px',
                },
              }}
            >
              <MenuItem
                component={Link}
                to="/settings"
                onClick={handleMenuClose}
                sx={{
                  '&:hover': {
                    background: theme.palette.action.hover,
                  },
                }}
              >
                My Account
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    background: theme.palette.action.hover,
                  },
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            color="inherit"
            component={Link}
            to="/login"
            sx={{
              ml: 2,
              fontWeight: 600,
              color: theme.palette.text.primary,
              '&:hover': {
                color: theme.palette.primary.main,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;