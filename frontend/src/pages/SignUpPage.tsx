import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import  backendUrl  from '../App';


const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

  
    if (password !== repeatPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, email, password }),
      });

      if (response.ok) {
        setSuccess('Registration successful! Please log in.');
        setTimeout(() => navigate('/signin'), 2000);
      } else {
        const data = await response.json();
        setError(data.detail || 'Registration failed');
      }
    } catch (error) {
      console.log(error);
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
        background: 'linear-gradient(to bottom, #f8f9fa, #87CEEB)',
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: 400, borderRadius: 3 }}>
        <Box display="flex" justifyContent="center" mb={2}>
          <FaUserPlus size={32} color="#6e8efb" />
        </Box>
        <Typography variant="h5" textAlign="center" fontWeight="bold" gutterBottom>
          Sign Up
        </Typography>
        {error && (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success" textAlign="center">
            {success}
          </Typography>
        )}
        <Box
          component="form"
          onSubmit={handleRegister}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Surname"
            variant="outlined"
            fullWidth
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
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
          <TextField
            label="Repeat Password"
            type="password"
            variant="outlined"
            fullWidth
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
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
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignUpPage;
