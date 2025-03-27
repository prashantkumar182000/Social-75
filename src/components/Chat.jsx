import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText,
  CircularProgress,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Pusher from 'pusher-js';
import { auth } from '../firebase';
import { motion, useAnimation } from 'framer-motion';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const controls = useAnimation();

  // Fetch messages and set up Pusher
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('https://social-75-39je.onrender.com/api/messages');
        const data = await response.json();
        setMessages(data);
        controls.start({ opacity: 1, y: 0 });
      } catch (err) {
        setError('Failed to load chat history');
      } finally {
        setLoading(false);
      }
    };

    const pusher = new Pusher('b499431d9b73ef39d7a6', {
      cluster: 'ap2',
      forceTLS: true,
    });

    const channel = pusher.subscribe('chat');
    channel.bind('message', (message) => {
      setMessages(prev => {
        // Prevent duplicate messages from Pusher
        const isDuplicate = prev.some(msg => 
          msg.user === message.user &&
          msg.text === message.text &&
          msg.timestamp === message.timestamp
        );
        return isDuplicate ? prev : [...prev, message];
      });
    });

    fetchMessages();

    return () => {
      pusher.unsubscribe('chat');
    };
  }, [controls]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message with optimistic UI update
  const sendMessage = async (e) => {
    if (e) e.preventDefault(); // Prevent default form submission
    if (!newMessage.trim() || !auth.currentUser) return;

    const tempId = Date.now().toString(); // Unique ID for optimistic update
    const message = {
      text: newMessage,
      user: auth.currentUser.displayName || auth.currentUser.email,
      photoURL: auth.currentUser.photoURL || '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tempId, // Temporary ID for tracking
    };

    try {
      // Optimistic update
      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Send to backend
      await fetch('https://social-75-39je.onrender.com/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
    } catch (err) {
      setError('Failed to send message');
      // Remove failed message
      setMessages(prev => prev.filter(msg => msg.tempId !== tempId));
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline in text field
      sendMessage();
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: 'auto',
        marginTop: 4,
        padding: 3,
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.paper,
        borderRadius: 4,
        boxShadow: 6,
      }}
    >
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 700,
          textAlign: 'center',
          mb: 2,
          textShadow: `2px 2px 4px ${theme.palette.primary.light}33`,
        }}
      >
        Community Hub
      </Typography>

      {/* Error Message */}
      {error && (
        <Typography
          color="error"
          sx={{
            textAlign: 'center',
            mb: 2,
            backgroundColor: theme.palette.error.light + '22',
            padding: 1,
            borderRadius: 2,
            border: `1px solid ${theme.palette.error.main}`
          }}
        >
          ⚠️ {error}
        </Typography>
      )}

      {/* Chat Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          mb: 2,
          borderRadius: 3,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1a1a1a, #2a2a2a)' 
            : 'linear-gradient(145deg, #f8f9fa, #ffffff)',
          boxShadow: theme.shadows[2],
          padding: 2,
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={40} thickness={4} />
          </Box>
        ) : messages.length === 0 ? (
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: theme.palette.text.secondary,
              fontStyle: 'italic',
            }}
          >
            Start the conversation 🌟
          </Typography>
        ) : (
          <List>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.tempId || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ListItem sx={{ alignItems: 'flex-start', py: 1.5 }}>
                  <ListItemAvatar>
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Avatar
                        src={msg.photoURL}
                        sx={{
                          width: 44,
                          height: 44,
                          boxShadow: 2,
                          border: `2px solid ${theme.palette.primary.main}`
                        }}
                      />
                    </motion.div>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 700,
                            color: theme.palette.primary.main,
                          }}
                        >
                          {msg.user}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: theme.palette.text.secondary,
                            fontSize: '0.75rem',
                          }}
                        >
                          {msg.timestamp}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            backgroundColor: theme.palette.action.selected,
                            padding: 1.5,
                            borderRadius: 3,
                            wordBreak: 'break-word',
                            position: 'relative',
                            '&:before': {
                              content: '""',
                              position: 'absolute',
                              left: -8,
                              top: 12,
                              width: 0,
                              height: 0,
                              borderTop: '8px solid transparent',
                              borderBottom: '8px solid transparent',
                              borderRight: `8px solid ${theme.palette.action.selected}`,
                            }
                          }}
                        >
                          {msg.text}
                        </Typography>
                      </motion.div>
                    }
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                </ListItem>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </List>
        )}
      </Box>

      {/* Message Input */}
      <form onSubmit={sendMessage}>
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center',
          background: theme.palette.background.paper,
          borderRadius: 3,
          padding: 1,
          boxShadow: theme.shadows[2],
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Share your thoughts..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            multiline
            maxRows={4}
            InputProps={{
              sx: {
                borderRadius: 2,
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' },
              }
            }}
            onKeyPress={handleKeyPress} // Handle Enter key press
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              type="submit"
              sx={{
                background: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  background: theme.palette.primary.dark,
                },
                borderRadius: 2,
                p: 1.5,
              }}
            >
              <SendIcon fontSize="medium" />
            </IconButton>
          </motion.div>
        </Box>
      </form>
    </Box>
  );
};

export default Chat;