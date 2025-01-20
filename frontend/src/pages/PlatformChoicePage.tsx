import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import ParticlesBackground from "../components/common/ParticlesBackground";
import axios from "axios";

import Header from "../components/Header";

const PlatformChoicePage: React.FC = () => {
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await axios.get("http://0.0.0.0:8000/api/platforms/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlatforms(response.data);
        console.log(response.data);
      } catch (error) {
        setError("Failed to load platforms.");
      } finally {
        setLoading(false);
      }
    };


    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://0.0.0.0:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsAdmin(response.data.is_admin);
      } catch (error) {
        setError("Failed to load user data.");
      }
    };

    fetchUserData()
    fetchPlatforms();
  }, []);

  const handleChoice = (platformId: number, platformName: string) => {
    localStorage.setItem("selectedPlatformId", platformId.toString());
    localStorage.setItem("selectedPlatform", platformName);

    navigate("/main");
  };

  const navigateToAdmin = () => {
    navigate("/admin");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(to bottom, #87CEEB, #f8f9fa)",
      }}
    >

      <ParticlesBackground />
      <Header />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: 400,
            borderRadius: 3,
            zIndex: 1,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              mb: 4,
              color: "#004c8c",
              fontFamily: "Poppins, sans-serif",
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
            }}
          >
            Choose a Platform
          </Typography>

          {loading && <CircularProgress sx={{ color: "#6e8efb" }} />}

          {error && <Typography color="error">{error}</Typography>}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#6e8efb",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    py: 1.5,
                    "&:hover": { backgroundColor: "#5b75d9" },
                  }}
                  onClick={() => handleChoice(platform.id, platform.name)}
                >
                  {platform.name}
                </Button>
              </motion.div>
            ))}

            {/* Conditional Admin Button */}
            {isAdmin && (
              <Button
                variant="outlined"
                sx={{
                  mt: 4,
                  backgroundColor: "#fff",
                  fontWeight: "bold",
                  border: "2px solid #6e8efb",
                  "&:hover": { backgroundColor: "#6e8efb", color: "#fff" },
                }}
                onClick={navigateToAdmin}
              >
                Go to Admin Page
              </Button>
            )}

          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default PlatformChoicePage;