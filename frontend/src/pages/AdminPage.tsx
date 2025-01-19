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

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [newPlatform, setNewPlatform] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [userAccess, setUserAccess] = useState<{ [key: string]: string[] }>({});
  const [newUser, setNewUser] = useState("");

  // Fetch platforms and user access from the backend on component mount
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await fetch("/api/platforms"); // Replace with your actual endpoint
        if (!response.ok) throw new Error("Failed to fetch platforms.");
        const data = await response.json();
        setPlatforms(data.platforms || []);
        setUserAccess(data.userAccess || {});
      } catch (error) {
        console.error("Error fetching platforms:", error);
      }
    };
    fetchPlatforms();
  }, []);

  const handleAddPlatform = async () => {
    if (newPlatform.trim() && !platforms.includes(newPlatform)) {
      try {
        const response = await fetch("/api/platforms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newPlatform }),
        });
        if (!response.ok) throw new Error("Failed to add platform.");
        setPlatforms([...platforms, newPlatform]);
        setUserAccess({ ...userAccess, [newPlatform]: [] });
        setNewPlatform("");
      } catch (error) {
        console.error("Error adding platform:", error);
      }
    } else {
      alert("Platform name is invalid or already exists.");
    }
  };

  const handleDeletePlatform = async (platform: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete platform "${platform}"?`);
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/platforms/${platform}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete platform.");
        setPlatforms(platforms.filter((p) => p !== platform));
        const updatedAccess = { ...userAccess };
        delete updatedAccess[platform];
        setUserAccess(updatedAccess);
      } catch (error) {
        console.error("Error deleting platform:", error);
      }
    }
  };

  const handleAddUser = async () => {
    if (!newUser.trim()) {
      alert("Please provide a valid user email.");
      return;
    }

    if (selectedPlatform) {
      const currentUsers = userAccess[selectedPlatform] || [];
      if (!currentUsers.includes(newUser)) {
        try {
          const response = await fetch(`/api/platforms/${selectedPlatform}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: newUser }),
          });
          if (!response.ok) throw new Error("Failed to add user.");
          setUserAccess({
            ...userAccess,
            [selectedPlatform]: [...currentUsers, newUser],
          });
          setNewUser("");
        } catch (error) {
          console.error("Error adding user:", error);
        }
      } else {
        alert("User already has access.");
      }
    }
  };

  const handleRemoveUser = async (user: string) => {
    if (selectedPlatform) {
      try {
        const response = await fetch(`/api/platforms/${selectedPlatform}/users/${user}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to remove user.");
        const currentUsers = userAccess[selectedPlatform] || [];
        setUserAccess({
          ...userAccess,
          [selectedPlatform]: currentUsers.filter((u) => u !== user),
        });
      } catch (error) {
        console.error("Error removing user:", error);
      }
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
        height: "100vh",
        background: "linear-gradient(to bottom, #f0f4ff, #e3f2fd)",
        p: 4,
      }}
    >
      {/* Return Button with Icon */}
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
          "&:hover": {
            backgroundColor: "#004c8c",
            color: "#ffffff",
            transform: "scale(1.05)",
            transition: "all 0.3s ease",
          },
          display: "flex",
          alignItems: "center",
          gap: 1,
          padding: "8px 16px",
        }}
      >
        <FaArrowLeft />
        Main Page
      </Button>

      {/* Header */}
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 4,
          color: "#004c8c",
          fontFamily: "Poppins, sans-serif",
          textShadow: "2px 2px 4px rgba(255, 255, 255, 0.7)",
        }}
      >
        Admin Dashboard
      </Typography>

      {/* Platforms and User Management */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "800px",
          mb: 4,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Add Platform */}
        <Paper
          elevation={4}
          sx={{
            p: 3,
            flex: "1 1 300px",
            backgroundColor: "#ffffff",
            borderRadius: 3,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
            Add Platform
          </Typography>
          <TextField
            label="Platform Name"
            variant="outlined"
            fullWidth
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#6e8efb",
              "&:hover": { backgroundColor: "#5b75d9" },
            }}
            onClick={handleAddPlatform}
          >
            Add Platform
          </Button>
        </Paper>

        {/* Platform List */}
        <Paper
          elevation={4}
          sx={{
            p: 3,
            flex: "1 1 300px",
            backgroundColor: "#ffffff",
            borderRadius: 3,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
            Platforms
          </Typography>
          <List>
            {platforms.map((platform) => (
              <ListItem
                key={platform}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "rgba(110, 142, 251, 0.1)",
                  borderRadius: 2,
                  mb: 1,
                }}
              >
                <ListItemText
                  primary={platform}
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    fontFamily: "Poppins, sans-serif",
                  }}
                />
                <Box>
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedPlatform(platform)}
                    sx={{ mr: 1, color: "#6e8efb", borderColor: "#6e8efb" }}
                  >
                    Manage
                  </Button>
                  <IconButton
                    onClick={() => handleDeletePlatform(platform)}
                    sx={{ color: "#e57373" }}
                  >
                    <FaTrash />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* User Management */}
      {selectedPlatform && (
        <Paper
          elevation={4}
          sx={{
            p: 3,
            width: "100%",
            maxWidth: "800px",
            backgroundColor: "#ffffff",
            borderRadius: 3,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
            Manage Users for: {selectedPlatform}
          </Typography>
          <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
            <TextField
              label="User Email"
              variant="outlined"
              fullWidth
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: "#6e8efb", "&:hover": { backgroundColor: "#5b75d9" } }}
              onClick={handleAddUser}
            >
              <FaUserPlus />
            </Button>
          </Box>
          <List>
            {(userAccess[selectedPlatform] || []).map((user) => (
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
                  sx={{ color: "#e57373" }}
                >
                  <FaUserMinus />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default AdminPage;
