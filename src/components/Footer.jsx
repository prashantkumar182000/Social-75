import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 4,
        mt: 8,
        background: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          textAlign: 'center',
          color: theme.palette.text.secondary,
        }}
      >
        © {new Date().getFullYear()} Social 75. Empowering global change.
      </Typography>
    </Box>
  );
};

export default Footer;