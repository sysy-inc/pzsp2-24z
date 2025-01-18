import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";
import ParticlesBackground from "../components/common/ParticlesBackground";

interface PlatformChoicePageProps {
  platforms: string[]; // Platforms the user has access to
}

const PlatformChoicePage: React.FC<PlatformChoicePageProps> = ({ platforms }) => {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const handleChoice = (platform: string) => {
    setSelectedPlatform(platform);
    // Store selected platform and navigate to the main page
    localStorage.setItem("selectedPlatform", platform);
    navigate("/main");
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
        background: "linear-gradient(to bottom, #87CEEB, #f8f9fa)", // Match other pages
      }}
    >
      <ParticlesBackground />
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {platforms.map((platform) => (
            <Button
              key={platform}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#6e8efb",
                fontSize: "1.1rem",
                fontWeight: "bold",
                py: 1.5,
                "&:hover": { backgroundColor: "#5b75d9" },
              }}
              onClick={() => handleChoice(platform)}
            >
              {platform}
            </Button>
          ))}
        </Box>
        {selectedPlatform && (
          <Typography
            variant="body1"
            sx={{
              mt: 3,
              color: "#6e8efb",
              fontFamily: "Poppins, sans-serif",
              fontStyle: "italic",
            }}
          >
            Selected: {selectedPlatform}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default PlatformChoicePage;
