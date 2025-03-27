import React, { useRef } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';

const FeatureShowcase = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-100%']);

  const features = [
    {
      title: 'Content Library',
      description: 'Explore curated videos, articles, and TED Talks to fuel your passion.',
      color: theme.palette.primary.main,
    },
    {
      title: 'Interactive Map',
      description: 'Connect with like-minded individuals globally and locally.',
      color: theme.palette.secondary.main,
    },
    {
      title: 'Action Hub',
      description: 'Find NGOs, funding, and resources to turn your passion into action.',
      color: theme.palette.success.main,
    },
    {
      title: 'Community Chat',
      description: 'Discuss, collaborate, and share ideas in real-time.',
      color: theme.palette.warning.main,
    },
    {
      title: 'Gamification',
      description: 'Earn points, unlock badges, and climb the leaderboard.',
      color: theme.palette.error.main,
    },
  ];

  return (
    <Box
      ref={ref}
      sx={{
        height: '500vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: feature.color,
            y,
          }}
        >
          <Box
            sx={{
              textAlign: 'center',
              color: '#fff',
              px: isMobile ? 2 : 4,
              maxWidth: '800px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: isMobile ? '2.5rem' : '4rem',
                  fontWeight: 800,
                  mb: 3,
                }}
              >
                {feature.title}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 400,
                  mb: 4,
                }}
              >
                {feature.description}
              </Typography>
            </motion.div>
          </Box>
        </motion.div>
      ))}
    </Box>
  );
};

export default FeatureShowcase;