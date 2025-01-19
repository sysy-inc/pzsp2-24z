import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaCloud, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { MdAdminPanelSettings, MdOutlineCloudQueue } from "react-icons/md";

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const platform = localStorage.getItem("selectedPlatform") || "Default Platform";

  const handleLogout = () => {
    
    localStorage.clear();
    navigate("/login"); 
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        position: "relative",
        background: "linear-gradient(to bottom, #cce7ff, #e3f2fd)", 
        overflow: "hidden",
        color: "#004c8c", 
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FaCloud size={36} style={{ color: "#004c8c" }} />
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontFamily: "Poppins, sans-serif",
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
            }}
          >
            CloudPulse
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => navigate("/admin")}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.7)" },
              marginRight: 2, 
            }}
          >
            <MdAdminPanelSettings size={28} color="#004c8c" />
          </IconButton>

          {/* Log Out IconButton */}
          <IconButton
            onClick={handleLogout}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              color: "#004c8c",
              "&:hover": { backgroundColor: "#f44336", color: "#ffffff" },
              borderRadius: "50%",
              p: 1.5,
            }}
          >
            <FaSignOutAlt size={24} />
          </IconButton>
        </Box>
      </Box>

      {/* Welcome Section */}
      <Typography
        variant="h3"
        sx={{
          fontFamily: "Poppins, sans-serif",
          textAlign: "center",
          mt: 10,
          color: "#004c8c",
          textShadow: "2px 2px 4px rgba(255, 255, 255, 0.7)",
          fontWeight: "bold",
        }}
      >
        Welcome to CloudPulse
      </Typography>

      {/* Platform Name Section */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Poppins, sans-serif",
          textAlign: "center",
          mt: 2,
          color: "#6e8efb",
          fontStyle: "italic",
        }}
      >
        Viewing Data for: {platform}
      </Typography>

      {/* Navigation Options */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          mt: 8,
          width: "100%",
        }}
      >
        {/* Current Weather Option */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            cursor: "pointer",
            textAlign: "center",
          }}
          onClick={() => navigate("/current-weather")}
        >
          <MdOutlineCloudQueue size={120} style={{ color: "#6e8efb" }} />
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "bold",
              color: "#004c8c",
            }}
          >
            Current Weather
          </Typography>
        </Box>

        {/* Historical Data Option */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            cursor: "pointer",
            textAlign: "center",
          }}
          onClick={() => navigate("/historical-data")}
        >
          <FaHistory size={120} style={{ color: "#4CAF50" }} />
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "bold",
              color: "#004c8c",
            }}
          >
            Historical Data
          </Typography>
        </Box>
      </Box>

      {/* Choose Platform Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/platform-choice")}
        sx={{
          position: "absolute",
          bottom: "50px", 
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#6e8efb",
          padding: "12px 24px",
          fontSize: "16px",
          fontWeight: "bold",
          textTransform: "none",
          boxShadow: "0 4px 12px rgba(0, 76, 140, 0.2)",
          "&:hover": {
            backgroundColor: "#5b75d9",
            boxShadow: "0 4px 16px rgba(0, 76, 140, 0.3)",
          },
        }}
      >
        Choose Platform
      </Button>
    </Box>
  );
};

export default MainPage;
