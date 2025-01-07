import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Paper } from '@mui/material';
import { FaCloud, FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CurrentWeatherPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null); // Replace with appropriate data type
  const navigate = useNavigate();

  // Simulating weather data fetching
  useEffect(() => {
    setTimeout(() => {
      setWeatherData({
        temperature: 22, // example temperature in Celsius
        humidity: 65,    // example humidity percentage
      });
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', background: 'linear-gradient(to bottom, #cce7ff, #e3f2fd)', color: '#004c8c', paddingTop: 10 }}>
      {/* Header */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: 'rgba(255, 255, 255, 0.6)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FaCloud size={36} style={{ color: '#004c8c' }} />
          <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: 'Poppins, sans-serif', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}>
            CloudPulse
          </Typography>
        </Box>

        {/* Return to Main Page Button */}
        <Button onClick={() => navigate('/main')} variant="contained" color="primary" sx={{ backgroundColor: '#6e8efb', '&:hover': { backgroundColor: '#5b75d9' } }}>
          <FaChevronLeft size={20} /> Back to Main Page
        </Button>
      </Box>

      {/* Weather Content */}
      <Box sx={{ width: '80%', maxWidth: '800px', textAlign: 'center', mt: 10 }}>
        {loading ? (
          <CircularProgress size={60} sx={{ color: '#004c8c' }} />
        ) : (
          <Paper sx={{ padding: 4, borderRadius: 3, boxShadow: 3 }}>
            <FaCloud size={120} style={{ color: '#6e8efb' }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#004c8c', mt: 3 }}>
              Current Weather
            </Typography>
            <Typography variant="h5" sx={{ color: '#004c8c', mt: 2 }}>
              Temperature: {weatherData.temperature}°C
            </Typography>
            <Typography variant="h5" sx={{ color: '#004c8c', mt: 2 }}>
              Humidity: {weatherData.humidity}%
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default CurrentWeatherPage;
