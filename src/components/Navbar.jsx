import React, { useState, useEffect, useRef } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, IconButton, Menu, 
  MenuItem, Avatar, useTheme, useMediaQuery, Box, CssBaseline
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { auth } from '../firebase';
import { Menu as MenuIcon, Close, Settings } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector(state => state.auth.user);
  const location = useLocation();
  const appBarRef = useRef(null);
  const dispatch = useDispatch();

  // Calculate navbar height dynamically
  const [navbarHeight, setNavbarHeight] = useState(64);
  
  useEffect(() => {
    if (appBarRef.current) {
      setNavbarHeight(appBarRef.current.offsetHeight);
      // Add CSS custom property for other components
      document.documentElement.style.setProperty('--navbar-height', `${appBarRef.current.offsetHeight}px`);
    }
  }, [isMobile, scrolled]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Explore', path: '/', icon: '🌎' },
    { label: 'Content', path: '/content', icon: '🎬' },
    { label: 'Map', path: '/map', icon: '📍' },
    { label: 'Action', path: '/action', protected: true, icon: '⚡' },
    { label: 'Community', path: '/chat', protected: true, icon: '💬' },
  ];

  const handleMobileToggle = () => setMobileOpen(!mobileOpen);
  const handleUserMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(logout());
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      <CssBaseline />
      {/* Hidden spacer for content positioning */}
      <Box sx={{ 
        height: { xs: mobileOpen ? 0 : `${navbarHeight}px`, md: `${navbarHeight}px` },
        transition: 'height 0.3s ease',
      }} />
      
      <AppBar 
        ref={appBarRef}
        position="fixed"
        elevation={0}
        sx={{
          backdropFilter: 'blur(12px)',
          backgroundColor: scrolled 
            ? theme.palette.mode === 'dark' 
              ? 'rgba(10, 10, 10, 0.95)' 
              : 'rgba(255, 255, 255, 0.98)'
            : 'transparent',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          borderBottom: scrolled 
            ? `1px solid ${theme.palette.divider}`
            : 'none',
        }}
      >
        <Toolbar sx={{ 
          px: { xs: 2, md: 6 },
          py: 1,
          justifyContent: 'space-between',
          minHeight: { xs: '56px !important', md: '64px !important' }
        }}>
          {/* Logo */}
          <Typography
            component={Link}
            to="/"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 800,
              textDecoration: 'none',
              background: 'linear-gradient(90deg, #7C4DFF, #2196F3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box component="span" sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%',
              background: theme.palette.primary.main,
              display: 'inline-block'
            }}/>
            SOCIAL75
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              ml: 4,
              alignItems: 'center'
            }}>
              {navLinks.map((link) => (
                (link.protected && !user) ? null : (
                  <Button
                    key={link.path}
                    component={Link}
                    to={link.path}
                    startIcon={<Box sx={{ fontSize: '1.1rem' }}>{link.icon}</Box>}
                    sx={{
                      fontWeight: 600,
                      color: location.pathname === link.path 
                        ? theme.palette.primary.main 
                        : theme.palette.text.primary,
                      minWidth: 'auto',
                      px: 2,
                      py: 1,
                      borderRadius: 3,
                      '&:hover': {
                        background: theme.palette.action.hover,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {link.label}
                  </Button>
                )
              ))}
            </Box>
          )}

          {/* User/Auth Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
            ml: 2
          }}>
            {!isMobile ? (
              user ? (
                <>
                  <IconButton
                    onClick={handleUserMenu}
                    sx={{
                      p: 0,
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Avatar 
                        src={user.photoURL} 
                        sx={{ 
                          width: 36, 
                          height: 36,
                          border: `2px solid ${theme.palette.primary.main}`,
                        }}
                      />
                    </motion.div>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    sx={{
                      '& .MuiPaper-root': {
                        minWidth: 200,
                        borderRadius: 3,
                        boxShadow: theme.shadows[4],
                        mt: 1.5,
                      },
                    }}
                  >
                    <MenuItem 
                      component={Link} 
                      to="/settings"
                      onClick={handleCloseMenu}
                      sx={{
                        fontWeight: 500,
                        py: 1.5,
                        '&:hover': {
                          background: theme.palette.action.hover,
                        },
                      }}
                    >
                      Account Settings
                    </MenuItem>
                    <MenuItem 
                      onClick={handleLogout}
                      sx={{
                        color: theme.palette.error.main,
                        fontWeight: 500,
                        py: 1.5,
                        '&:hover': {
                          background: theme.palette.error.hover,
                        },
                      }}
                    >
                      Sign Out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  component={Link}
                  to="/login"
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    background: 'linear-gradient(90deg, #7C4DFF, #2196F3)',
                    boxShadow: '0 4px 15px rgba(124, 77, 255, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(124, 77, 255, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Join Now
                </Button>
              )
            ) : (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleMobileToggle}
                sx={{ ml: 1 }}
              >
                {mobileOpen ? <Close /> : <MenuIcon />}
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Menu */}
        <Box
          sx={{
            position: 'fixed',
            top: `${navbarHeight}px`,
            left: 0,
            width: '100%',
            height: `calc(100vh - ${navbarHeight}px)`,
            zIndex: 1100,
            background: theme.palette.background.default,
            transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease',
            overflowY: 'auto',
            pt: 2,
            px: 3
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              mb: 3,
              color: theme.palette.text.secondary
            }}>
              Navigation
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {navLinks.map((link) => (
                (link.protected && !user) ? null : (
                  <Button
                    key={link.path}
                    component={Link}
                    to={link.path}
                    fullWidth
                    startIcon={<Box sx={{ fontSize: '1.2rem' }}>{link.icon}</Box>}
                    sx={{
                      justifyContent: 'flex-start',
                      px: 3,
                      py: 2,
                      borderRadius: 2,
                      background: location.pathname === link.path 
                        ? theme.palette.action.selected 
                        : 'transparent',
                      color: theme.palette.text.primary,
                      '&:hover': {
                        background: theme.palette.action.hover,
                      },
                    }}
                    onClick={handleMobileToggle}
                  >
                    {link.label}
                  </Button>
                )
              ))}
            </Box>
          </Box>

          {user ? (
            <Box sx={{ mt: 4 }}>
              <Button
                fullWidth
                variant="contained"
                component={Link}
                to="/settings"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  mb: 2,
                  background: 'linear-gradient(90deg, #7C4DFF, #2196F3)',
                }}
                onClick={handleMobileToggle}
              >
                My Account
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Sign Out
              </Button>
            </Box>
          ) : (
            <Button
              fullWidth
              variant="contained"
              component={Link}
              to="/login"
              sx={{
                py: 1.5,
                borderRadius: 2,
                mt: 2,
                background: 'linear-gradient(90deg, #7C4DFF, #2196F3)',
                boxShadow: '0 4px 15px rgba(124, 77, 255, 0.3)',
              }}
              onClick={handleMobileToggle}
            >
              Sign In
            </Button>
          )}
        </Box>
      </AppBar>
    </>
  );
};

export default Navbar;