import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { MdAddCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
  accessGranted: boolean;
}

interface Platform {
  name: string;
  users: User[];
}

const AdminPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [platformName, setPlatformName] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const navigate = useNavigate();

  const handleAddPlatform = () => {
    const newPlatform: Platform = { name: platformName, users: [] };
    setPlatforms([...platforms, newPlatform]);
    setPlatformName('');
    setOpenDialog(false);
  };

  const handleAddUserToPlatform = (platformName: string) => {
    const userEmail = prompt('Enter user email:');
    if (userEmail) {
      setPlatforms(platforms.map(platform =>
        platform.name === platformName
          ? { ...platform, users: [...platform.users, { name: 'New User', email: userEmail, accessGranted: false }] }
          : platform
      ));
    }
  };

  const handleGrantAccess = (platformName: string, email: string) => {
    setPlatforms(platforms.map(platform => 
      platform.name === platformName 
        ? { ...platform, users: platform.users.map(user => 
            user.email === email ? { ...user, accessGranted: true } : user
          )}
        : platform
    ));
  };

  const handleRevokeAccess = (platformName: string, email: string) => {
    setPlatforms(platforms.map(platform => 
      platform.name === platformName 
        ? { ...platform, users: platform.users.map(user => 
            user.email === email ? { ...user, accessGranted: false } : user
          )}
        : platform
    ));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', background: 'linear-gradient(to bottom, #cce7ff, #e3f2fd)', color: '#004c8c', paddingTop: 10 }}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: 'rgba(255, 255, 255, 0.6)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: 'Poppins, sans-serif', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}>
            CloudPulse Admin
          </Typography>
        </Box>

       
        <Button
          onClick={() => navigate('/main')} 
          variant="contained"
          color="primary"
          sx={{ backgroundColor: '#6e8efb', '&:hover': { backgroundColor: '#5b75d9' } }}
        >
          Return to Main Page
        </Button>
      </Box>

  
      <Box sx={{ width: '80%', maxWidth: '1200px', textAlign: 'center', mt: 6 }}>

        <Typography variant="h4" fontWeight="bold" sx={{ color: '#004c8c', mb: 4 }}>
          Platform Management
        </Typography>

    
        {platforms.map((platform, index) => (
          <Box key={index} sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#004c8c', mb: 2 }}>
              {platform.name}
            </Typography>

            <Button
              variant="contained"
              color="success"
              onClick={() => handleAddUserToPlatform(platform.name)}
              sx={{ fontSize: 16, backgroundColor: '#6e8efb', '&:hover': { backgroundColor: '#5b75d9' } }}
            >
              <MdAddCircle size={28} /> Add User
            </Button>

            <TableContainer component={Paper} sx={{ mt: 3 }}>
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
                  {platform.users.map((user, userIndex) => (
                    <TableRow key={userIndex}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.accessGranted ? 'Granted' : 'Pending'}</TableCell>
                      <TableCell>
                        {!user.accessGranted ? (
                          <Button
                            variant="contained"
                            sx={{ backgroundColor: '#6e8efb', '&:hover': { backgroundColor: '#5b75d9' } }}
                            onClick={() => handleGrantAccess(platform.name, user.email)}
                          >
                            Grant Access
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            sx={{ backgroundColor: '#f44336', '&:hover': { backgroundColor: '#e53935' } }}
                            onClick={() => handleRevokeAccess(platform.name, user.email)}
                          >
                            Revoke Access
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}

        <Button
          onClick={() => setOpenDialog(true)}
          variant="contained"
          color="success"
          sx={{ fontSize: 20, backgroundColor: '#6e8efb', '&:hover': { backgroundColor: '#5b75d9' } }}
        >
          <MdAddCircle size={28} /> Add Platform
        </Button>

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
