import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { FaLock } from 'react-icons/fa';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const particlesInit = async (engine: any) => {
    await loadFull(engine); // Ensures all features are loaded
  };

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
        background: 'linear-gradient(to bottom, #87CEEB, #f8f9fa)', // Sky blue gradient
      }}
    >
      {/* Particle Weather Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: { value: '#87CEEB' },
          },
          particles: {
            number: {
              value: 50,
            },
            color: {
              value: ['#ffffff', '#00A9FF'],
            },
            shape: {
              type: 'circle',
            },
            opacity: {
              value: 0.7,
            },
            size: {
              value: 8,
              random: true,
            },
            move: {
              enable: true,
              speed: 2,
              direction: 'top',
              outModes: 'out',
            },
          },
        }}
        style={{ position: 'absolute', zIndex: 0 }}
      />

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
