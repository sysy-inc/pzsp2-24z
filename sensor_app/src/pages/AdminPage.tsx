import React, { useState } from 'react';
import { Box, Typography, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FaUserShield } from 'react-icons/fa';
import { MdAddCircle, MdAdminPanelSettings } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [platformName, setPlatformName] = useState('');
  const [userList, setUserList] = useState([
    { name: 'John Doe', email: 'john@example.com', accessGranted: true },
    { name: 'Jane Smith', email: 'jane@example.com', accessGranted: false },
  ]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const navigate = useNavigate();

  const handleAddPlatform = () => {
    // Logic for adding a platform to the system (e.g., API call)
    console.log('New platform added:', platformName);
    setPlatformName('');
    setOpenDialog(false);
  };

  const handleGrantAccess = (email: string) => {
    setUserList(userList.map(user =>
      user.email === email ? { ...user, accessGranted: true } : user
    ));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom, #cce7ff, #e3f2fd)', // Light blue gradient
        color: '#004c8c',
        paddingTop: 10,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Header */}
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
          backgroundColor: 'rgba(255, 255, 255, 0.6)', // Semi-transparent header
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Logo & Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FaUserShield size={36} style={{ color: '#004c8c' }} />
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
            }}
          >
            CloudPulse Admin
          </Typography>
        </Box>

        {/* Return to Main Page Button */}
        <Button
  onClick={() => navigate('/main')} // Navigate to Main Page directly
  variant="contained"
  color="primary"
  sx={{
    backgroundColor: '#6e8efb',
    '&:hover': { backgroundColor: '#5b75d9' },
  }}
>
  Return to Main Page
</Button>
      </Box>

      {/* Admin Page Content */}
      <Box sx={{ width: '80%', maxWidth: '1200px', textAlign: 'center', mt: 6 }}>

        {/* Section Title */}
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#004c8c', mb: 4 }}>
          User Access Management
        </Typography>

        {/* User Access Table */}
        <TableContainer component={Paper} sx={{ mb: 6 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Access Status</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.accessGranted ? 'Granted' : 'Pending'}</TableCell>
                  <TableCell>
                    {!user.accessGranted && (
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#6e8efb',
                          '&:hover': { backgroundColor: '#5b75d9' },
                        }}
                        onClick={() => handleGrantAccess(user.email)}
                      >
                        Grant Access
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add New Platform Section */}
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#004c8c', mb: 4 }}>
          Add New Platform
        </Typography>
        <Button
          onClick={() => setOpenDialog(true)}
          variant="contained"
          color="success"
          sx={{
            fontSize: 20,
            backgroundColor: '#6e8efb',
            '&:hover': { backgroundColor: '#5b75d9' },
          }}
        >
          <MdAddCircle size={28} /> Add Platform
        </Button>

        {/* Add Platform Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Add a New Platform</DialogTitle>
          <DialogContent>
            <TextField
              label="Platform Name"
              fullWidth
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddPlatform} color="primary">
              Add Platform
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminPage;
