import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { FaUserPlus, FaUserMinus, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IconButton } from "@mui/material";

interface Platform {
  id: number;
  name: string;
  sensors: Array<any>;
  users: string[]; // Added users to the platform
}

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [newPlatform, setNewPlatform] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [newUser, setNewUser] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://0.0.0.0:8000/api/platforms/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlatforms(response.data);
      } catch (err) {
        setError("Failed to load platforms.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlatforms();
  }, []);

  const handleAddPlatform = async () => {
    if (!newPlatform.trim()) {
      alert("Platform name cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Authentication token is missing. Please log in again.");
        return;
      }

      const response = await axios.post(
        "http://0.0.0.0:8000/api/platforms/",
        { name: newPlatform },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Platform created:", response.data);
      setPlatforms((prev) => [...prev, response.data]);
      setNewPlatform("");
    } catch (err) {
      console.error("Error adding platform:", err);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.trim()) {
      alert("Please provide a valid user email.");
      console.error("No user email provided.");
      return;
    }
  
    if (!selectedPlatform) {
      alert("No platform selected.");
      console.error("No platform selected for adding the user.");
      return;
    }
  
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Authentication token is missing. Please log in again.");
        console.error("No authentication token found in localStorage.");
        return;
      }
  
      console.log("Adding user to platform:", {
        platformId: selectedPlatform.id,
        userEmail: newUser,
      });
  
      const response = await axios.post(
        `http://0.0.0.0:8000/api/platforms/${selectedPlatform.id}/users/`, 
        { email: newUser },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("User added successfully:", response.data);
  
      // Update the state with the newly added user
      setSelectedPlatform((prev) => ({
        ...prev!,
        users: [...prev!.users, newUser],
      }));
      setNewUser("");
  
      alert("User added successfully!");
    } catch (err: any) {
      console.error("Error adding user:", err);
  
      if (err.response) {
        console.error("Error Response:", err.response);
        alert(`Failed to add user. Server responded with: ${err.response.data.detail || err.response.statusText}`);
      } else if (err.request) {
        console.error("Error Request:", err.request);
        alert("Failed to add user. No response received from the server.");
      } else {
        console.error("Unexpected Error:", err.message);
        alert(`An unexpected error occurred: ${err.message}`);
      }
    }
  };

  const handleRemoveUser = async (userEmail: string) => {
    if (!selectedPlatform) return;

    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.delete(
        `http://0.0.0.0:8000/api/platforms/${selectedPlatform.id}/users/${userEmail}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("User removed successfully:", response.data);
      // Remove the user from the state
      setSelectedPlatform((prev) => ({
        ...prev!,
        users: prev!.users.filter((user) => user !== userEmail),
      }));

      alert("User removed successfully!");
    } catch (err) {
      console.error("Error removing user:", err);
      alert("Failed to remove user. Please try again.");
    }
  };

  const handleReturnToMain = () => {
    navigate("/main");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 4,
        background: "linear-gradient(to bottom, #f0f4ff, #e3f2fd)",
      }}
    >
      <Button
        variant="outlined"
        onClick={handleReturnToMain}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          backgroundColor: "#ffffff",
          color: "#004c8c",
          borderColor: "#004c8c",
          "&:hover": { backgroundColor: "#004c8c", color: "#ffffff" },
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <FaArrowLeft />
        Main Page
      </Button>

      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "#004c8c" }}>
        Admin Dashboard
      </Typography>

      {loading ? (
        <Typography>Loading platforms...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", maxWidth: "800px" }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5">Add Platform</Typography>
            <TextField
              label="Platform Name"
              variant="outlined"
              fullWidth
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />
            <Button variant="contained" onClick={handleAddPlatform}>
              Add Platform
            </Button>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5">Platforms</Typography>
            <List>
              {platforms.map((platform) => (
                <ListItem
                  key={platform.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "rgba(110, 142, 251, 0.1)",
                    borderRadius: 2,
                    mb: 1,
                  }}
                >
                  <ListItemText primary={platform.name} />
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedPlatform(platform)}
                    sx={{ mr: 1 }}
                  >
                    Manage
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>

          {selectedPlatform && (
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h5">Manage Users for: {selectedPlatform.name}</Typography>
              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <TextField
                  label="User Email"
                  variant="outlined"
                  fullWidth
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                />
                <Button variant="contained" onClick={handleAddUser}>
                  <FaUserPlus />
                </Button>
              </Box>
              <List sx={{ mt: 2 }}>
                {(selectedPlatform.users || []).map((user) => (
                  <ListItem
                    key={user}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      backgroundColor: "rgba(110, 142, 251, 0.1)",
                      borderRadius: 2,
                      mb: 1,
                    }}
                  >
                    <ListItemText primary={user} />
                    <IconButton
                      onClick={() => handleRemoveUser(user)}
                      sx={{
                        color: "#f44336",
                        "&:hover": { backgroundColor: "#fdecea" },
                      }}
                      title="Remove User"
                    >
                      <FaUserMinus />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AdminPage;
