import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, Button } from '@mui/material';
import { FaCloud, FaArrowLeft } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import AlertSnackbar from '../components/AlertSnackbar'; 
const CurrentWeatherPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [previousWeatherData, setPreviousWeatherData] = useState<any>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const newWeatherData = {
        temperature: 22 + Math.floor(Math.random() * 5),
        humidity: 65 + Math.floor(Math.random() * 5),
      };

      if (previousWeatherData) {
        const tempDifference = Math.abs(newWeatherData.temperature - previousWeatherData.temperature);
        const humidityDifference = Math.abs(newWeatherData.humidity - previousWeatherData.humidity);

        if (tempDifference > 2 || humidityDifference > 10) {
          setAlertMessage(
            `Rapid change detected: Temperature ${tempDifference > 2 ? tempDifference + "°C" : ''} and Humidity ${humidityDifference > 10 ? humidityDifference + "%" : ''}`
          );
          setAlertSeverity('warning');
          setAlertOpen(true);
        }
      }

      setPreviousWeatherData(newWeatherData);
      setWeatherData(newWeatherData);
      setLoading(false);
    }, 2000);
  }, [previousWeatherData]);

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

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

        {/* Back Button with Icon */}
        <Button
          onClick={() => navigate('/main')}
          variant="contained"
          color="primary"
          startIcon={<FaArrowLeft />}
          sx={{
            backgroundColor: '#6e8efb',
            '&:hover': { backgroundColor: '#5b75d9' },
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '16px',
            textTransform: 'none',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
            ':hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          Main Page
        </Button>
      </Box>

      {/* Loading and Weather Data */}
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

      {/* Custom Snackbar for Alerts */}
      <AlertSnackbar open={alertOpen} message={alertMessage} onClose={handleCloseAlert} severity={alertSeverity} />
    </Box>
  );
};

export default CurrentWeatherPage;
