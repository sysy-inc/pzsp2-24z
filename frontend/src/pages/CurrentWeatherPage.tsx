import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import ParticlesBackground from "../components/common/ParticlesBackground";

import Header from "../components/Header";

const CurrentWeatherPage: React.FC = () => {
  const [weatherData, setWeatherData] = useState<{
    temperature: number | null;
    humidity: number | null;
  }>({ temperature: null, humidity: null });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const selectedPlatformId = localStorage.getItem("selectedPlatformId");
  const dateFrom = new Date().toISOString();
  const dateTo = new Date().toISOString();

  useEffect(() => {
    if (!selectedPlatformId) {
      setError("No platform selected. Please choose a platform.");
      setLoading(false);
      return;
    }

    const fetchWeatherData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const temperatureResponse = await axios.get(
          `http://0.0.0.0:8000/api/platforms/${selectedPlatformId}/latest_measurements`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              measurementType: "Temperature",
            },
          }
        );

        const humidityResponse = await axios.get(
          `http://0.0.0.0:8000/api/platforms/${selectedPlatformId}/latest_measurements`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              measurementType: "Humidity",
            },
          }
        );

        const temperature = temperatureResponse.data.value || null;
        const humidity = humidityResponse.data.value || null;

        setWeatherData({ temperature, humidity });
      } catch (err) {
        setError("Failed to fetch weather data. Please try again later.");
        console.error("Error fetching weather data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [selectedPlatformId]);

  const handleBack = () => {
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
            Current Weather
          </Typography>

          {loading && <CircularProgress sx={{ color: "#6e8efb" }} />}

          {error && <Typography color="error">{error}</Typography>}

          {!loading && !error && (
            <Box sx={{ mt: 3 }}>
              {weatherData.temperature !== null ? (
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Temperature: {weatherData.temperature} °C
                </Typography>
              ) : (
                <Typography variant="body1">Temperature data unavailable.</Typography>
              )}
              {weatherData.humidity !== null ? (
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Humidity: {weatherData.humidity} %
                </Typography>
              ) : (
                <Typography variant="body1">Humidity data unavailable.</Typography>
              )}
            </Box>
          )}

          <Box sx={{ mt: 4 }}>
            <button
              onClick={handleBack}
              style={{
                padding: "10px 20px",
                backgroundColor: "#6e8efb",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Back to Platform Choice
            </button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default CurrentWeatherPage;
