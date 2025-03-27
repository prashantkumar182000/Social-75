// src/components/Settings.jsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Avatar } from '@mui/material';
import { auth } from '../firebase';
import { updateProfile, updatePassword, updateEmail } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/authSlice';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [newPassword, setNewPassword] = useState('');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      // Upload file to Cloudinary (replace with your Cloudinary credentials)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default'); // Use your Cloudinary preset
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        );

      const data = await response.json();
      const imageUrl = data.secure_url;

      // Update the user's profile with the new photoURL
      await updateProfile(auth.currentUser, { photoURL: imageUrl });
      dispatch(setUser({ ...user, photoURL: imageUrl })); // Update Redux store
      setPhotoURL(imageUrl);
      setSuccess('Profile picture updated successfully!');
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.trim() === '') {
      setError('Please enter a new password.');
      return;
    }
    try {
      await updatePassword(auth.currentUser, newPassword);
      setSuccess('Password updated successfully!');
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL,
      });
      dispatch(setUser({ ...user, displayName, photoURL })); // Update Redux store
      setSuccess('Profile updated successfully!');
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  const handleUpdateEmail = async () => {
    try {
      await updateEmail(auth.currentUser, newEmail);
      dispatch(setUser({ ...user, email: newEmail })); // Update Redux store
      setSuccess('Email updated successfully!');
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', marginTop: 4, padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Account
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6">Profile Picture</Typography>
        <Avatar src={photoURL} sx={{ width: 100, height: 100, marginBottom: 2 }} />
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-photo"
          type="file"
          onChange={(e) => handleFileUpload(e.target.files[0])}
        />
        <label htmlFor="upload-photo">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload from Device'}
          </Button>
        </label>
      </Box>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6">Display Name</Typography>
        <TextField
          fullWidth
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" onClick={handleUpdateProfile}>
          Update Display Name
        </Button>
      </Box>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6">Change Password</Typography>
        <TextField
          fullWidth
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" onClick={handleUpdatePassword}>
          Update Password
        </Button>
      </Box>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6">Change Email</Typography>
        <TextField
          fullWidth
          label="New Email"
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" onClick={handleUpdateEmail}>
          Update Email
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;