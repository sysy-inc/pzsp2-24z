import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { SelectChangeEvent } from '@mui/material/Select';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
  }[];
}

const HistoricalDataPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRange, setSelectedRange] = useState<string>('hour');
  const [selectedMeasurement, setSelectedMeasurement] = useState<string>('Temperature');
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [noData, setNoData] = useState<boolean>(false);

  const updateChartData = (responseData: { date: string; value: number }[]) => {
    if (responseData.length === 0) {
      setNoData(true);
      return;
    }
    setNoData(false);

    const sortedData = responseData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const labels = sortedData.map((entry) => new Date(entry.date).toLocaleString());
    const data = sortedData.map((entry) => entry.value);

    setChartData({
      labels,
      datasets: [
        {
          label: `${selectedMeasurement.charAt(0).toUpperCase() + selectedMeasurement.slice(1)} Over Time`,
          data,
          borderColor: 'rgb(75, 192, 192)',
          fill: false,
        },
      ],
    });
  };

  const fetchWeatherData = async () => {
    const platformId = localStorage.getItem('selectedPlatformId');
    if (!platformId) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Authorization token missing. Please log in again.');
        return;
      }

      const dateTo = new Date();
      const dateFrom = new Date();
      if (selectedRange === 'hour') {
        dateFrom.setHours(dateFrom.getHours() - 1);
      } else if (selectedRange === 'day') {
        dateFrom.setDate(dateFrom.getDate() - 1);
      } else if (selectedRange === 'week') {
        dateFrom.setDate(dateFrom.getDate() - 7);
      } else if (selectedRange === 'month') {
        dateFrom.setMonth(dateFrom.getMonth() - 1);
      }

      const response = await axios.get(
        `http://0.0.0.0:8000/api/platforms/${platformId}/measurements/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            measurementType: selectedMeasurement,
            dateFrom: dateFrom.toISOString(),
            dateTo: dateTo.toISOString(),
          },
        }
      );

      updateChartData(response.data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again later.');
      console.error('Error fetching weather data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate('/main');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #cce7ff, #e3f2fd)',
        color: '#004c8c',
        padding: 4,
      }}
    >



      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.6)',
          padding: 2,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'Poppins, sans-serif',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
          }}
        >
          Historical Data Viewer
        </Typography>
        <Button
          onClick={handleBack}
          startIcon={<FaArrowLeft />}
          variant="contained"
          sx={{
            backgroundColor: '#6e8efb',
            padding: '6px 14px',
            ':hover': { backgroundColor: '#5b75d9' },
          }}
        >
          Main Page
        </Button>
      </Box>

      <Box sx={{ width: '80%', mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          View Platform Data Over Time
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, marginBottom: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={selectedRange}
              onChange={(e: SelectChangeEvent<string>) => setSelectedRange(e.target.value)}
            >
              <MenuItem value="hour">Last Hour</MenuItem>
              <MenuItem value="day">Last Day</MenuItem>
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Measurement Type</InputLabel>
            <Select
              value={selectedMeasurement}
              onChange={(e: SelectChangeEvent<string>) => setSelectedMeasurement(e.target.value)}
            >
              <MenuItem value="Temperature">Temperature</MenuItem>
              <MenuItem value="Humidity">Humidity</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={fetchWeatherData}
            sx={{
              backgroundColor: '#4caf50',
              color: '#fff',
              ':hover': { backgroundColor: '#45a049' },
            }}
          >
            Fetch Data
          </Button>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : noData ? (
          <Alert severity="info">No data available for the selected range and measurement.</Alert>
        ) : (
          <Box sx={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
            <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HistoricalDataPage;
