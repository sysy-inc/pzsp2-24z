import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { FaLock } from 'react-icons/fa';
import ParticlesBackground from '../components/common/ParticlesBackground';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    console.log('Email:', email, 'Password:', password);
    // Add sign-in logic here
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Particle Background */}
      <ParticlesBackground />

      {/* Sign-In Card */}
      <Paper elevation={6} sx={{ p: 4, width: 400, borderRadius: 3, zIndex: 1 }}>
        <Box display="flex" justifyContent="center" mb={2}>
          <FaLock size={32} color="#6e8efb" />
        </Box>
        <Typography variant="h5" textAlign="center" fontWeight="bold" gutterBottom>
          Sign In
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#6e8efb',
              '&:hover': { backgroundColor: '#5b75d9' },
            }}
          >
            Sign In
          </Button>
        </Box>
        <Typography variant="body2" textAlign="center" mt={2}>
          Don’t have an account? <a href="/signup" style={{ color: '#6e8efb' }}>Sign Up</a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignInPage;
