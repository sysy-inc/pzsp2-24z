import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaHistory } from "react-icons/fa";
import { MdOutlineCloudQueue } from "react-icons/md";

import Header from "../components/Header";
import  backendUrl  from '../App';


const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const platform = localStorage.getItem("selectedPlatform");


  // Add use effect to display navigate to platform choice if no platform is selected
  useEffect(() => {
    if (!platform) {
      navigate("/platform-choice");
    }
  });

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
      <Header />

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
