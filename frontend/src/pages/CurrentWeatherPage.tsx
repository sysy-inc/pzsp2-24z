import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import ParticlesBackground from "../components/common/ParticlesBackground"; // Optional background component

const CurrentWeatherPage: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  
  const selectedPlatformId = localStorage.getItem("selectedPlatformId");

  useEffect(() => {
    if (!selectedPlatformId) {
      setError("No platform selected. Please choose a platform.");
      setLoading(false);
      return;
    }

    const fetchWeatherData = async () => {
      try {
    
        const response = await axios.get(
          `http://0.0.0.0:8000/platforms/${selectedPlatformId}/latest-measurements`
        );

    
        const filteredData = response.data.filter((measurement: any) =>
          ["temperature", "humidity"].includes(measurement.measurement_type.physical_parameter)
        );

        setWeatherData(filteredData);
      } catch (error) {
        setError("Failed to fetch weather data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [selectedPlatformId]); 

  const handleBack = () => {
    navigate("/"); 
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
      <ParticlesBackground /> {/* Optional background particles */}

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
            Current Weather
          </Typography>

          {/* Loading state */}
          {loading && <CircularProgress sx={{ color: "#6e8efb" }} />}

          {/* Error state */}
          {error && (
            <Typography color="error">{error}</Typography>
          )}

          {/* Weather data display */}
          {weatherData && !loading && !error && weatherData.length > 0 ? (
            <Box sx={{ mt: 3 }}>
              {weatherData.map((m: any) => {
                if (m.measurement_type.physical_parameter === "temperature") {
                  return (
                    <Typography variant="h6" key={m.id} sx={{ fontWeight: "bold" }}>
                      Temperature: {m.value} °C
                    </Typography>
                  );
                }
                if (m.measurement_type.physical_parameter === "humidity") {
                  return (
                    <Typography variant="body1" key={m.id}>
                      Humidity: {m.value} %
                    </Typography>
                  );
                }
                return null;
              })}
            </Box>
          ) : (
            <Typography variant="body1">No weather data available.</Typography>
          )}

          <Box sx={{ mt: 4 }}>
            <button onClick={handleBack} style={{ padding: "10px 20px", backgroundColor: "#6e8efb", color: "white", border: "none", borderRadius: "5px" }}>
              Back to Platform Choice
            </button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default CurrentWeatherPage;
