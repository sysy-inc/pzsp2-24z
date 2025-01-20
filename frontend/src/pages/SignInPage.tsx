import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

import  backendUrl  from '../App';

const SignInPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${backendUrl}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: username, 
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        navigate('/platform-choice');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    }
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
      <Paper elevation={6} sx={{ p: 4, width: 400, borderRadius: 3 }}>
        <Box display="flex" justifyContent="center" mb={2}>
          <FaLock size={32} color="#6e8efb" />
        </Box>
        <Typography variant="h5" textAlign="center" fontWeight="bold" gutterBottom>
          Sign In
        </Typography>
        {error && (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        )}
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {/* Username Input Field */}
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {/* Password Input Field */}
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* Submit Button */}
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
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#6e8efb' }}>
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignInPage;
