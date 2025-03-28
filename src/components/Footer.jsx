import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, IconButton, useTheme, useMediaQuery,
  Divider, Tooltip, Slide, Fade
} from '@mui/material';
import { 
  RocketLaunch, Stars, Public, Terminal, 
  SmartToy, ConnectWithoutContact, ExpandLess 
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const ParticleBackground = () => (
  <Box sx={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 0,
    opacity: 0.6
  }}>
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          background: 'rgba(255,255,255,0.8)',
          borderRadius: '50%',
          width: `${Math.random() * 4 + 1}px`,
          height: `${Math.random() * 4 + 1}px`
        }}
        initial={{
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`
        }}
        animate={{
          y: `${Math.random() * 100}%`,
          x: `${Math.random() * 100}%`,
          transition: {
            duration: Math.random() * 30 + 20,
            repeat: Infinity,
            repeatType: 'reverse'
          }
        }}
      />
    ))}
  </Box>
);

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expanded, setExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const footerItems = [
    {
      icon: <RocketLaunch fontSize="medium" />,
      label: "Launchpad",
      description: "Explore new campaigns",
      action: () => console.log("Launchpad clicked")
    },
    {
      icon: <SmartToy fontSize="medium" />,
      label: "AI Assistant",
      description: "Get instant help",
      action: () => console.log("AI clicked")
    },
    {
      icon: <Terminal fontSize="medium" />,
      label: "Dev Tools",
      description: "API & integrations",
      action: () => console.log("Dev clicked")
    },
    {
      icon: <ConnectWithoutContact fontSize="medium" />,
      label: "Live Connect",
      description: "Join real-time collaboration",
      action: () => console.log("Connect clicked")
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
          : 'linear-gradient(135deg, #e0f7fa 0%, #80deea 50%, #4fc3f7 100%)',
        color: theme.palette.mode === 'dark' ? '#fff' : '#212121',
        pt: expanded ? 4 : 0,
        pb: expanded ? 6 : 2,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <ParticleBackground />
      
      {/* Main Footer Content */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 1,
        maxWidth: 1200,
        mx: 'auto',
        px: isMobile ? 2 : 4
      }}>
        {/* Expand/Collapse Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mb: expanded ? 2 : 0
        }}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.1)' 
                  : 'rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(255,255,255,0.2)' 
                    : 'rgba(0,0,0,0.2)',
                }
              }}
            >
              <ExpandLess sx={{ 
                transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.3s ease'
              }} />
            </IconButton>
          </motion.div>
        </Box>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
                gap: 4,
                mb: 4
              }}>
                {footerItems.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    onHoverStart={() => setHoveredItem(index)}
                    onHoverEnd={() => setHoveredItem(null)}
                  >
                    <Box
                      onClick={item.action}
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        background: theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.05)' 
                          : 'rgba(255,255,255,0.3)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.1)' 
                          : 'rgba(0,0,0,0.1)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: theme.shadows[6],
                          background: theme.palette.mode === 'dark' 
                            ? 'rgba(255,255,255,0.1)' 
                            : 'rgba(255,255,255,0.5)',
                        }
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mb: 1.5
                      }}>
                        <Box sx={{
                          mr: 2,
                          background: theme.palette.primary.main,
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff'
                        }}>
                          {item.icon}
                        </Box>
                        <Typography variant="h6" fontWeight={600}>
                          {item.label}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {item.description}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>

              <Divider sx={{ 
                my: 4, 
                borderColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.1)' 
                  : 'rgba(0,0,0,0.1)' 
              }} />

              <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2
              }}>
                <Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 800,
                    mb: 1,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(90deg, #fff, #aaa)'
                      : 'linear-gradient(90deg, #1976d2, #4fc3f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    SOCIAL75
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    The future of social activism
                  </Typography>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 2,
                  mt: isMobile ? 3 : 0
                }}>
                  {['About', 'Careers', 'API', 'Terms'].map((item) => (
                    <Link 
                      key={item}
                      href="#" 
                      underline="none"
                      sx={{
                        color: theme.palette.text.primary,
                        opacity: 0.7,
                        '&:hover': {
                          opacity: 1,
                          color: theme.palette.primary.main
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {item}
                    </Link>
                  ))}
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mini Footer (Collapsed State) */}
        {!expanded && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} SOCIAL75
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {footerItems.slice(0, isMobile ? 2 : 4).map((item, index) => (
                <Tooltip key={index} title={item.label} arrow>
                  <IconButton
                    onClick={item.action}
                    size="small"
                    sx={{
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(255,255,255,0.1)' 
                        : 'rgba(0,0,0,0.1)',
                      '&:hover': {
                        background: theme.palette.primary.main,
                        color: '#fff'
                      }
                    }}
                  >
                    {item.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Interactive Background Elements */}
      <AnimatePresence>
        {hoveredItem !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, ${theme.palette.primary.main} 0%, transparent 70%)`,
              zIndex: 0,
              pointerEvents: 'none'
            }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Footer;