import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import WeatherBackground from '../components/WeatherBackground';
import cloudLogo from '../assets/cloud_logo.png'; // Ensure this path matches your project structure

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCurrentWeather = () => {
    alert('Navigating to Current Weather page (to be implemented)');
    // navigate('/weather'); // Uncomment when CurrentWeatherPage is ready
  };

  const handleHistoricalData = () => {
    alert('Navigating to Historical Data page (to be implemented)');
    // navigate('/historical'); // Uncomment when HistoricalDataPage is ready
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <WeatherBackground />
      {/* Header Section */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          zIndex: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img src={cloudLogo} alt="CloudPulse Logo" style={{ width: 40, height: 40 }} />
          <Typography variant="h6" fontWeight="bold">
            CloudPulse
          </Typography>
        </Box>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', flexGrow: 1 }}>
          Track the Climate, Feel the Changes
        </Typography>
        <Button
          onClick={() => alert('Navigating to Admin Page (to be implemented)')}
          startIcon={<FaUserCircle />}
          sx={{ color: '#fff' }}
        >
          Admin
        </Button>
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          mt: 10,
          zIndex: 1,
        }}
      >
        <Button
          onClick={handleCurrentWeather}
          variant="contained"
          sx={{
            backgroundColor: '#6e8efb',
            '&:hover': { backgroundColor: '#5b75d9' },
            width: 200,
            height: 50,
          }}
        >
          Current Weather
        </Button>
        <Button
          onClick={handleHistoricalData}
          variant="contained"
          sx={{
            backgroundColor: '#6e8efb',
            '&:hover': { backgroundColor: '#5b75d9' },
            width: 200,
            height: 50,
          }}
        >
          Historical Data
        </Button>
      </Box>
    </Box>
  );
};

export default MainPage;
