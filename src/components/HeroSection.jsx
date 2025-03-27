import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, useTheme, useMediaQuery, IconButton, Menu, MenuItem } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { auth } from '../firebase';

const features = [
  {
    title: 'Content Library',
    description: 'Dive into a world of curated videos, articles, and TED Talks. Learn, grow, and discover your passions.',
    buttonText: 'Explore Content',
    link: '/content',
  },
  {
    title: 'Interactive Map',
    description: 'Connect with like-minded individuals globally. Find events, groups, and communities near you.',
    buttonText: 'View Map',
    link: '/map',
  },
  {
    title: 'Action Hub',
    description: 'Take action with NGOs, funding opportunities, and educational resources. Turn your passion into impact.',
    buttonText: 'Get Involved',
    link: '/action',
  },
  {
    title: 'Community Chat',
    description: 'Engage in real-time discussions, share ideas, and collaborate with a global community.',
    buttonText: 'Join the Chat',
    link: '/chat',
  },
  {
    title: 'Gamification',
    description: 'Earn points, unlock badges, and climb the leaderboard. Make every action rewarding.',
    buttonText: 'Start Earning',
    link: '/gamification',
  },
];

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeFeature, setActiveFeature] = useState(0);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState(null);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const featureHeight = window.innerHeight;
      const newFeature = Math.floor(scrollPosition / featureHeight);
      setActiveFeature(newFeature);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      sx={{
        minHeight: `${features.length + 1}00vh`, // Dynamic height based on features
        position: 'relative',
        background: theme.palette.background.default,
        scrollSnapType: 'y mandatory',
        overflowY: 'scroll',
      }}
    >
      {/* Fixed Buttons at the Top */}
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 24, // Added margin from the rightmost corner
          zIndex: 1200, // Ensure buttons are on top
          display: 'flex',
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          component={Link}
          to="/"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            borderRadius: 3, // Rounded corners
            px: 3, // Horizontal padding
            py: 1, // Vertical padding
            fontSize: '1rem', // Font size
            fontWeight: 600, // Bold text
          }}
        >
          Home
        </Button>
        {user ? (
          <>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: '#fff',
                '&:hover': {
                  backgroundColor: theme.palette.secondary.dark,
                },
                borderRadius: '50%', // Circular button
                width: 48, // Fixed width
                height: 48, // Fixed height
              }}
            >
              <SettingsIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                mt: 1, // Margin from the top
              }}
            >
              <MenuItem component={Link} to="/settings" onClick={handleMenuClose}>
                My Account
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            variant="contained"
            component={Link}
            to="/login"
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: '#fff',
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
              },
              borderRadius: 3, // Rounded corners
              px: 3, // Horizontal padding
              py: 1, // Vertical padding
              fontSize: '1rem', // Font size
              fontWeight: 600, // Bold text
            }}
          >
            Login
          </Button>
        )}
      </Box>

      {/* Parallax Background */}
      {/* Parallax Background */}
<motion.div
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0, // Ensure the background is behind everything
  }}
>
  {/* Floating Particles */}
  {Array.from({ length: 30 }).map((_, index) => (
    <motion.div
      key={index}
      style={{
        position: 'absolute',
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: 10,
        height: 10,
        background: `rgba(255, 255, 255, ${Math.random() * 0.5})`,
        borderRadius: '50%',
      }}
      animate={{
        y: [0, 100, 0],
        x: [0, 50, 0],
        scale: [1, 1.5, 1],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: Math.random() * 5 + 5,
        repeat: Infinity,
        ease: 'linear',
        delay: Math.random() * 2,
      }}
    />
  ))}

  {/* Gradient Blobs */}
  <motion.div
    style={{
      position: 'absolute',
      top: '20%',
      left: '10%',
      width: '300px',
      height: '300px',
      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      borderRadius: '50%',
      filter: 'blur(80px)',
      opacity: 0.3,
    }}
    animate={{
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      x: [0, 100, 0],
      y: [0, 50, 0],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
  <motion.div
    style={{
      position: 'absolute',
      top: '60%',
      left: '70%',
      width: '400px',
      height: '400px',
      background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
      borderRadius: '50%',
      filter: 'blur(100px)',
      opacity: 0.3,
    }}
    animate={{
      scale: [1, 1.5, 1],
      rotate: [0, -180, 360],
      x: [0, -100, 0],
      y: [0, -50, 0],
    }}
    transition={{
      duration: 25,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
</motion.div>

      {/* Branding Section */}
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2, // Ensure the content is above the parallax background
          scrollSnapAlign: 'start',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center' }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: isMobile ? '4rem' : '6rem', // Larger font size
              lineHeight: 1.1,
              mb: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: '"Poppins", sans-serif', // Modern font
              fontWeight: 800, // Extra bold
              letterSpacing: '-0.05em', // Tight letter spacing
              textShadow: '4px 4px 10px rgba(0, 0, 0, 0.2)', // Subtle shadow
            }}
          >
            Social 75
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 400,
              mb: 4,
              color: theme.palette.text.secondary,
              maxWidth: '800px',
              mx: 'auto',
              fontSize: isMobile ? '1.5rem' : '2rem',
              fontFamily: '"Inter", sans-serif', // Clean font
              lineHeight: 1.6, // Improved readability
            }}
          >
            Where Passion Meets Action
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mb: 6,
              maxWidth: '600px',
              mx: 'auto',
              fontSize: isMobile ? '1rem' : '1.2rem',
              fontFamily: '"Inter", sans-serif', // Clean font
              lineHeight: 1.8, // Improved readability
            }}
          >
            Join a global movement to educate, connect, and empower. Together, we can create meaningful change.
          </Typography>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              to="/onboarding"  // Changed from "/content"
              sx={{
                fontSize: '1.2rem',
                px: 6,
                py: 2,
                boxShadow: 4,
              }}
            >
              Get Started
            </Button>
          </motion.div>

          {/* Scroll Animation */}
          {activeFeature < features.length && (
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              style={{ 
                marginTop: '40px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: isMobile ? '1rem' : '1.2rem',
                  fontFamily: '"Inter", sans-serif', // Clean font
                }}
              >
                Scroll to explore
                <span style={{ fontSize: '1.5rem' }}>↓</span>
              </Typography>
            </motion.div>
          )}
        </motion.div>
      </Box>

      {/* Feature Sections */}
      {features.map((feature, index) => (
        <Box
          key={index}
          sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2, // Ensure the content is above the parallax background
            scrollSnapAlign: 'start',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: activeFeature === index + 1 ? 1 : 0,
              y: activeFeature === index + 1 ? 0 : 50,
            }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center' }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: isMobile ? '3rem' : '4.5rem', // Larger font size
                lineHeight: 1.1,
                mb: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: '"Poppins", sans-serif', // Modern font
                fontWeight: 800, // Extra bold
                letterSpacing: '-0.05em', // Tight letter spacing
                textShadow: '4px 4px 10px rgba(0, 0, 0, 0.2)', // Subtle shadow
              }}
            >
              {feature.title}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                mb: 4,
                color: theme.palette.text.secondary,
                maxWidth: '800px',
                mx: 'auto',
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                fontFamily: '"Inter", sans-serif', // Clean font
                lineHeight: 1.6, // Improved readability
              }}
            >
              {feature.description}
            </Typography>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={Link}
                to={feature.link}
                sx={{
                  fontSize: '1.2rem',
                  px: 6,
                  py: 2,
                  boxShadow: 4,
                  borderRadius: 3, // Rounded corners
                  fontWeight: 600, // Bold text
                }}
              >
                {feature.buttonText}
              </Button>
            </motion.div>

            {/* Scroll Animation */}
            {index < features.length - 1 && (
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                style={{ 
                  marginTop: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: isMobile ? '1rem' : '1.2rem',
                    fontFamily: '"Inter", sans-serif', // Clean font
                  }}
                >
                  Scroll to explore
                  <span style={{ fontSize: '1.5rem' }}>↓</span>
                </Typography>
              </motion.div>
            )}
          </motion.div>
        </Box>
      ))}
    </Box>
  );
};

export default HeroSection;