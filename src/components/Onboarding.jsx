import React from 'react';
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LibraryBooks as ContentIcon,
  Map as MapIcon,
  Groups as ActionIcon,
  Forum as ChatIcon,
  EmojiEvents as GamificationIcon
} from '@mui/icons-material';

const onboardingSteps = [
  {
    title: "Discover Powerful Content",
    icon: <ContentIcon sx={{ fontSize: 60 }} />,
    description: "Access curated videos, articles, and resources from world-changing organizations",
    color: "#2196F3"
  },
  {
    title: "Connect Globally",
    icon: <MapIcon sx={{ fontSize: 60 }} />,
    description: "Find like-minded activists and organizations in our interactive world map",
    color: "#4CAF50"
  },
  {
    title: "Take Direct Action",
    icon: <ActionIcon sx={{ fontSize: 60 }} />,
    description: "Support causes through donations, volunteering, and awareness campaigns",
    color: "#FF5722"
  },
  {
    title: "Join the Movement",
    icon: <ChatIcon sx={{ fontSize: 60 }} />,
    description: "Collaborate in real-time with our global community chat",
    color: "#9C27B0"
  },
  {
    title: "Earn Recognition",
    icon: <GamificationIcon sx={{ fontSize: 60 }} />,
    description: "Level up your impact with our achievement and tracking system",
    color: "#FFC107"
  }
];

const Onboarding = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const user = useSelector((state) => state.auth.user);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
      p: 4
    }}>
      {/* Floating Background Elements */}
      <motion.div 
        style={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 400,
          height: 400,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%'
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          x: [0, 200, 0],
          y: [0, 100, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      
      <Box sx={{
        maxWidth: 1200,
        margin: 'auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" sx={{
            fontSize: isMobile ? '2.5rem' : '4rem',
            fontWeight: 900,
            mb: 2,
            background: 'linear-gradient(45deg, #00bcd4, #00acc1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: '"Space Mono", monospace'
          }}>
            Welcome to the Revolution
          </Typography>
          
          <Typography variant="h5" sx={{
            mb: 6,
            fontWeight: 300,
            fontSize: isMobile ? '1.2rem' : '1.5rem'
          }}>
            Let's set up your journey to create meaningful change
          </Typography>
        </motion.div>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 4,
          mb: 8
        }}>
          {onboardingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <Box sx={{
                background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}30 100%)`,
                borderRadius: 4,
                p: 4,
                height: '100%',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  {step.icon}
                </motion.div>
                <Typography variant="h5" sx={{ mt: 2, mb: 2, fontWeight: 700 }}>
                  {step.title}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {step.description}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            component={Link}
            to="/content"
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #00bcd4, #00acc1)',
              color: '#fff',
              fontSize: '1.2rem',
              px: 6,
              py: 2,
              borderRadius: 3,
              fontWeight: 700,
              boxShadow: 6,
              '&:hover': {
                background: 'linear-gradient(45deg, #00acc1, #0097a7)'
              }
            }}
          >
            Launch Your Journey
          </Button>
        </motion.div>

        {/* Conditionally render the login link */}
        {!user && (
          <Typography variant="body2" sx={{ mt: 4, opacity: 0.8 }}>
            Already have an account? 
            <Button 
              component={Link} 
              to="/login" 
              sx={{ 
                color: '#00bcd4', 
                fontWeight: 700,
                '&:hover': {
                  background: 'rgba(0,188,212,0.1)'
                }
              }}
            >
              Skip to Login
            </Button>
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Onboarding;