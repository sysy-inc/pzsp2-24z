import React from 'react';
import { Snackbar, SnackbarContent, IconButton, Box, Typography } from '@mui/material';
import { FaTimesCircle } from 'react-icons/fa';

interface AlertSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
  severity: 'success' | 'error' | 'info' | 'warning';
}

const AlertSnackbar: React.FC<AlertSnackbarProps> = ({ open, message, onClose, severity }) => {
  let backgroundColor: string;

  switch (severity) {
    case 'success':
      backgroundColor = '#4caf50'; 
      break;
    case 'error':
      backgroundColor = '#f44336'; 
      break;
    case 'info':
      backgroundColor = '#2196f3'; 
      break;
    case 'warning':
      backgroundColor = '#ff9800'; 
      break;
    default:
      backgroundColor = '#2196f3'; 
      break;
  }

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <SnackbarContent
        sx={{
          backgroundColor,
          borderRadius: 2,
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          maxWidth: '600px',
          width: '100%',
        }}
        message={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', marginRight: 2 }}>
              {message}
            </Typography>
          </Box>
        }
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
            sx={{ marginLeft: 1 }}
          >
            <FaTimesCircle size={20} />
          </IconButton>
        }
      />
    </Snackbar>
  );
};

export default AlertSnackbar;
