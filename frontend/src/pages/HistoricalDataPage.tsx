import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { SelectChangeEvent } from '@mui/material/Select';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

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
  const { platformId } = useParams();
  const [selectedRange, setSelectedRange] = useState<string>('hour');
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        fill: false,
      },
      {
        label: 'Humidity (%)',
        data: [],
        borderColor: 'rgb(255, 159, 64)',
        fill: false,
      },
    ],
  });

  useEffect(() => {
    if (platformId) {
      fetchDataForRange(selectedRange, platformId);
    }
  }, [selectedRange, platformId]);

  const handleRangeChange = (event: SelectChangeEvent<string>) => {
    const range = event.target.value;
    setSelectedRange(range);
    if (platformId) {
      fetchDataForRange(range, platformId);
    }
  };

  const fetchDataForRange = async (range: string, platformId: string) => {
    try {
      const dateFrom = new Date();
      let startDate = dateFrom; 
      let endDate = new Date(); 

      
      if (range === 'hour') {
        startDate.setHours(startDate.getHours() - 1);
      } else if (range === 'day') {
        startDate.setDate(startDate.getDate() - 1);
      } else if (range === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (range === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      }

      
      const response = await axios.get(`/api/platforms/${platformId}/measurements/`, {
        params: {
          dateFrom: startDate.toISOString(),
          dateTo: endDate.toISOString(),
          measurementType: 'temperature',
        },
      });

      const humidityResponse = await axios.get(`/api/platforms/${platformId}/measurements/`, {
        params: {
          dateFrom: startDate.toISOString(),
          dateTo: endDate.toISOString(),
          measurementType: 'humidity',
        },
      });

      const labels = response.data.map((entry: any) => entry.date);
      const tempData = response.data.map((entry: any) => entry.value);
      const humidityData = humidityResponse.data.map((entry: any) => entry.value);

      setChartData({
        labels: labels,
        datasets: [
          {
            ...chartData.datasets[0],
            data: tempData,
          },
          {
            ...chartData.datasets[1],
            data: humidityData,
          },
        ],
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom, #cce7ff, #e3f2fd)',
        color: '#004c8c',
        paddingTop: 10,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
            }}
          >
            CloudPulse Historical Data
          </Typography>
        </Box>

        <Button
          onClick={() => navigate('/main')}
          variant="contained"
          color="primary"
          startIcon={<FaArrowLeft />}
          sx={{
            backgroundColor: '#6e8efb',
            '&:hover': { backgroundColor: '#5b75d9' },
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '16px',
            textTransform: 'none',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
            ':hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          Main Page
        </Button>
      </Box>

      <Box sx={{ width: '80%', maxWidth: '1200px', textAlign: 'center', mt: 6 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#004c8c', mb: 4 }}>
          Weather Data Over Time
        </Typography>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel id="select-time-range-label">Select Time Range</InputLabel>
          <Select
            labelId="select-time-range-label"
            value={selectedRange}
            onChange={handleRangeChange}
            label="Time Range"
          >
            <MenuItem value="hour">Last Hour</MenuItem>
            <MenuItem value="day">Last Day</MenuItem>
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </Box>
      </Box>
    </Box>
  );
};

export default HistoricalDataPage;
