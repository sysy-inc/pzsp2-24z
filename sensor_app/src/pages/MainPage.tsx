import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaCloud, FaHistory } from 'react-icons/fa';
import { MdAdminPanelSettings, MdOutlineCloudQueue } from 'react-icons/md';

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        position: 'relative',
        background: 'linear-gradient(to bottom, #cce7ff, #e3f2fd)', 
        overflow: 'hidden',
        color: '#004c8c', 
      }}
    >
     
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.6)', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
    
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FaCloud size={36} style={{ color: '#004c8c' }} />
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
            }}
          >
            CloudPulse
          </Typography>
        </Box>

       
        <IconButton
          onClick={() => navigate('/admin')}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.7)' },
          }}
        >
          <MdAdminPanelSettings size={28} color="#004c8c" />
        </IconButton>
      </Box>

     
      <Typography
        variant="h3"
        sx={{
          fontFamily: 'Poppins, sans-serif',
          textAlign: 'center',
          mt: 10, 
          color: '#004c8c',
          textShadow: '2px 2px 4px rgba(255, 255, 255, 0.7)',
          fontWeight: 'bold',
        }}
      >
        Track the Climate, Feel the Changes
      </Typography>

      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          mt: 8,
          width: '100%',
        }}
      >
      
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            cursor: 'pointer',
            textAlign: 'center',
          }}
          onClick={() => navigate('/current-weather')}
        >
          <MdOutlineCloudQueue size={120} style={{ color: '#6e8efb' }} />
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 'bold',
              color: '#004c8c',
            }}
          >
            Current Weather
          </Typography>
        </Box>

        
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            cursor: 'pointer',
            textAlign: 'center',
          }}
          onClick={() => navigate('/historical-data')}
        >
          <FaHistory size={120} style={{ color: '#4CAF50' }} />
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 'bold',
              color: '#004c8c',
            }}
          >
            Historical Data
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MainPage;
