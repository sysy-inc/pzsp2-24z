import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import ParticlesBackground from '../components/common/ParticlesBackground';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = () => {
    console.log('Email:', email, 'Password:', password);

    // Simulate authentication and navigate to Platform Choice Page
    navigate('/platform-choice');
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
        background: 'linear-gradient(to bottom, #87CEEB, #f8f9fa)',
      }}
    >
      <ParticlesBackground />
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
          Don’t have an account?{' '}
          <Link to="/signup" style={{ color: '#6e8efb' }}>
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignInPage;
