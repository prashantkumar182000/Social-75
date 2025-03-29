import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Box, TextField, Button, Typography, Chip, CircularProgress, Snackbar, IconButton, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Close, LocationOn, AddLocation, MyLocation } from '@mui/icons-material';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Color-coded marker icons
const markerColors = {
  default: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  environment: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  education: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  social: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  health: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png'
};

const createCustomIcon = (color = 'default') => L.icon({
  iconUrl: markerColors[color],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MotionMarker = motion(Marker);

const InteractiveMap = () => {
  const theme = useTheme();
  const [mapData, setMapData] = useState([]);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [interest, setInterest] = useState('');
  const [category, setCategory] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => setError('Could not retrieve your location')
      );
    }
  }, []);

  // Fetch map data
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await axios.get('https://socio-99.onrender.com/api/map');
        setMapData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load map data');
        setLoading(false);
      }
    };
    fetchMapData();
  }, []);

  const handleAddLocation = async () => {
    if (!interest.trim()) {
      setError('Please enter an interest');
      return;
    }

    try {
      const newUser = { 
        location, 
        interest,
        category,
        timestamp: new Date().toISOString()
      };
      
      const response = await axios.post('https://socio-99.onrender.com/api/map', newUser);
      setMapData([...mapData, response.data.data]);
      setInterest('');
      setSuccess('Location added successfully!');
    } catch (error) {
      setError(`Failed to add location: ${error.response?.data?.message || error.message}`);
      console.error('Add location error:', error);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      environment: '#2196F3',
      education: '#FF9800',
      social: '#F44336',
      health: '#9C27B0',
      default: '#4CAF50'
    };
    return colors[category] || colors.default;
  };

  return (
    <Box sx={{ 
      height: 'calc(100vh - 200px)', 
      width: '100%', 
      position: 'relative',
      borderRadius: 4,
      overflow: 'hidden',
      boxShadow: 6
    }}>
      {/* Control Panel */}
      <Box sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 1000,
        backgroundColor: theme.palette.background.paper,
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 400,
        width: '90%'
      }}>
        <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
          Community Map
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Latitude"
            type="number"
            value={location.lat}
            onChange={(e) => setLocation(prev => ({ ...prev, lat: parseFloat(e.target.value) }))}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
          <TextField
            fullWidth
            label="Longitude"
            type="number"
            value={location.lng}
            onChange={(e) => setLocation(prev => ({ ...prev, lng: parseFloat(e.target.value) }))}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Your Interest"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
          <TextField
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            SelectProps={{ native: true }}
            sx={{ width: 150 }}
          >
            <option value="default">General</option>
            <option value="environment">Environment</option>
            <option value="education">Education</option>
            <option value="social">Social</option>
            <option value="health">Health</option>
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleAddLocation}
            startIcon={<AddLocation />}
            sx={{ 
              borderRadius: 2,
              px: 4,
              bgcolor: theme.palette.primary.main,
              '&:hover': { bgcolor: theme.palette.primary.dark }
            }}
          >
            Add Pin
          </Button>
          <Button
            variant="outlined"
            startIcon={<MyLocation />}
            onClick={() => navigator.geolocation.getCurrentPosition(
              (pos) => setLocation({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
              }),
              (err) => setError('Location access denied')
            )}
            sx={{ borderRadius: 2 }}
          >
            My Location
          </Button>
        </Box>

        {/* Legend */}
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries({
            environment: 'Environment',
            education: 'Education',
            social: 'Social',
            health: 'Health',
            default: 'General'
          }).map(([key, label]) => (
            <Chip
              key={key}
              label={label}
              size="small"
              sx={{ 
                backgroundColor: getCategoryColor(key),
                color: 'white',
                fontWeight: 500
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Map Content */}
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          backgroundColor: theme.palette.background.default
        }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <MapContainer 
          center={[location.lat, location.lng]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <AnimatePresence>
            {mapData.map((user) => (
              <MotionMarker
                key={user._id}
                position={[user.location.lat, user.location.lng]}
                icon={createCustomIcon(user.category)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <Popup>
                  <Box sx={{ 
                    p: 1, 
                    minWidth: 200,
                    borderLeft: `4px solid ${getCategoryColor(user.category)}`
                  }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {user.interest}
                    </Typography>
                    <Chip 
                      label={user.category.toUpperCase()}
                      size="small"
                      sx={{ 
                        mt: 1,
                        backgroundColor: getCategoryColor(user.category),
                        color: 'white'
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                      Added: {new Date(user.timestamp).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Popup>
              </MotionMarker>
            ))}
          </AnimatePresence>
        </MapContainer>
      )}

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError('')}
        message={error}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        action={
          <IconButton color="inherit" onClick={() => setError('')}>
            <Close />
          </IconButton>
        }
        sx={{ bottom: 80 }}
      />

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess('')}
        message={success}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ bottom: 80 }}
      />
    </Box>
  );
};

export default InteractiveMap;