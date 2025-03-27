import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Badge, 
  Avatar, 
  useTheme, 
  CircularProgress,
  Card,
  CardContent,
  Grid,
  IconButton,
  Snackbar,
  LinearProgress
} from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import { CheckCircle, Star, EmojiEvents, Bolt, Close, LocalFireDepartment, Whatshot } from '@mui/icons-material';

const Gamification = () => {
  const theme = useTheme();
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [streak, setStreak] = useState(0); // User's daily login streak
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '' });
  const [showReward, setShowReward] = useState(false); // Reward popup
  const controls = useAnimation();

  // Fetch user data and leaderboard
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);

        // Real-time updates for points, badges, and streak
        const unsubscribe = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setPoints(doc.data().points || 0);
            setBadges(doc.data().badges || []);
            setStreak(doc.data().streak || 0);
          }
        });

        return () => unsubscribe();
      }
    };

    const fetchLeaderboard = async () => {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('points', 'desc'), limit(10));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const topUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setLeaderboard(topUsers);
      });

      return () => unsubscribe();
    };

    const fetchDailyChallenges = async () => {
      // Simulate fetching daily challenges
      const challenges = [
        { id: 1, title: 'Watch 3 TED Talks', points: 50, completed: false },
        { id: 2, title: 'Join a Chat Room', points: 30, completed: false },
        { id: 3, title: 'Add a Location to the Map', points: 20, completed: false },
      ];
      setDailyChallenges(challenges);
      setLoading(false);
    };

    fetchUserData();
    fetchLeaderboard();
    fetchDailyChallenges();
  }, []);

  // Add points to the user's profile
  const addPoints = async (amount) => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        points: points + amount,
      });
      setToast({ open: true, message: `You earned ${amount} points!` });
      setShowReward(true); // Show reward popup
      setTimeout(() => setShowReward(false), 3000); // Hide reward popup after 3 seconds
    }
  };

  // Complete a daily challenge
  const completeChallenge = async (challengeId) => {
    const updatedChallenges = dailyChallenges.map((challenge) =>
      challenge.id === challengeId ? { ...challenge, completed: true } : challenge
    );
    setDailyChallenges(updatedChallenges);
    await addPoints(updatedChallenges.find((c) => c.id === challengeId).points);
  };

  // Calculate progress towards the next tier
  const nextTierPoints = 1000; // Points required for the next tier
  const progress = (points / nextTierPoints) * 100;

  return (
    <Box sx={{ padding: 4, bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      {/* Header Section */}
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, color: theme.palette.primary.main }}>
        Gamification Hub
      </Typography>

      {/* Points and Progress Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Your Progress
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Star sx={{ color: theme.palette.warning.main }} /> Points
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  {points} Points
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 10, borderRadius: 2, mt: 2 }}
                />
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'right' }}>
                  {nextTierPoints - points} points to next tier
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => addPoints(10)}
                  sx={{ mt: 2, borderRadius: 2, px: 4, py: 1.5 }}
                >
                  Earn 10 Points
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalFireDepartment sx={{ color: theme.palette.error.main }} /> Streak
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                  {streak} Days
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Log in daily to keep your streak alive!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Daily Challenges Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Daily Challenges
        </Typography>
        <Grid container spacing={4}>
          {dailyChallenges.map((challenge) => (
            <Grid item xs={12} md={4} key={challenge.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Bolt sx={{ color: theme.palette.success.main }} /> {challenge.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Earn {challenge.points} points
                    </Typography>
                    <Button
                      variant="contained"
                      disabled={challenge.completed}
                      onClick={() => completeChallenge(challenge.id)}
                      sx={{ borderRadius: 2, px: 4, py: 1.5 }}
                    >
                      {challenge.completed ? 'Completed' : 'Complete Challenge'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Leaderboard Section */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Leaderboard
        </Typography>
        <Grid container spacing={4}>
          {leaderboard.map((user, index) => (
            <Grid item xs={12} key={user.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.photoURL} sx={{ width: 40, height: 40 }} />
                    <Typography variant="body1" sx={{ flex: 1 }}>
                      {user.displayName || user.email}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user.points} Points
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Reward Popup */}
      {showReward && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1300,
            textAlign: 'center',
          }}
        >
          <Box sx={{ bgcolor: theme.palette.background.paper, p: 4, borderRadius: 2, boxShadow: 6 }}>
            <Whatshot sx={{ fontSize: 60, color: theme.palette.warning.main }} />
            <Typography variant="h5" sx={{ mt: 2 }}>
              You earned 10 points!
            </Typography>
          </Box>
        </motion.div>
      )}

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ open: false, message: '' })}
        message={toast.message}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setToast({ open: false, message: '' })}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default Gamification;