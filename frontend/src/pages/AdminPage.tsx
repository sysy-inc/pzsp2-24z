import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
} from "@mui/material";
import { FaTrash, FaUserPlus, FaUserMinus, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AxiosError } from "axios"; 

interface Platform {
  id: number;
  name: string;
  sensors: Array<any>;
}

interface UserAccess {
  [platformName: string]: string[];
}

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [newPlatform, setNewPlatform] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [userAccess, setUserAccess] = useState<UserAccess>({});
  const [newUser, setNewUser] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch platforms from the backend
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
      if (axios.isAxiosError(err)) {
        console.error("Error response:", err.response?.data);
        alert(
          err.response?.data?.detail || "You do not have permission to perform this action."
        );
      } else {
        console.error("Unexpected error:", err);
        alert("An unexpected error occurred.");
      }
    }
  };
  
  

  const handleDeletePlatform = async (platformId: number) => {
    if (!window.confirm("Are you sure you want to delete this platform?")) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://0.0.0.0:8000/api/platforms/${platformId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlatforms((prev) => prev.filter((platform) => platform.id !== platformId));
    } catch (err) {
      console.error("Error deleting platform:", err);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.trim()) {
      alert("Please provide a valid user email.");
      return;
    }
    if (!selectedPlatform) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `http://0.0.0.0:8000/api/platforms/${selectedPlatform.id}/users/`,
        { email: newUser },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserAccess((prev) => ({
        ...prev,
        [selectedPlatform.name]: [...(prev[selectedPlatform.name] || []), newUser],
      }));
      setNewUser("");
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const handleRemoveUser = async (user: string) => {
    if (!selectedPlatform) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `http://0.0.0.0:8000/api/platforms/${selectedPlatform.id}/users/${user}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserAccess((prev) => ({
        ...prev,
        [selectedPlatform.name]: (prev[selectedPlatform.name] || []).filter((u) => u !== user),
      }));
    } catch (err) {
      console.error("Error removing user:", err);
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
          onChange={(e) => setNewPlatform(e.target.value)} // Update newPlatform state
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
                  <Box>
                    <Button
                      variant="outlined"
                      onClick={() => setSelectedPlatform(platform)}
                      sx={{ mr: 1 }}
                    >
                      Manage
                    </Button>
                    <IconButton onClick={() => handleDeletePlatform(platform.id)}>
                      <FaTrash />
                    </IconButton>
                  </Box>
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
                {(userAccess[selectedPlatform.name] || []).map((user) => (
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
                    <IconButton onClick={() => handleRemoveUser(user)}>
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