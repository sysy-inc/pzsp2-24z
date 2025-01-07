import React, { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { SelectChangeEvent } from '@mui/material/Select';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Define the types for the chart data
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

  // Correctly type the chart data state
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

  const handleRangeChange = (event: SelectChangeEvent<string>) => {
    const range = event.target.value;
    setSelectedRange(range);
    fetchDataForRange(range);
  };

  const fetchDataForRange = (range: string) => {
    // Simulate API call for historical data based on time range (hour, day, week, month)
    let labels: string[] = [];
    let tempData: number[] = [];
    let humidityData: number[] = [];

    if (range === 'hour') {
      labels = ['0:00', '1:00', '2:00', '3:00', '4:00'];
      tempData = [22, 23, 21, 20, 19];
      humidityData = [60, 62, 61, 64, 66];
    } else if (range === 'day') {
      labels = ['6 AM', '12 PM', '6 PM', '12 AM'];
      tempData = [22, 25, 21, 19];
      humidityData = [60, 55, 58, 65];
    } else if (range === 'week') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      tempData = [20, 22, 24, 23, 21, 22, 19];
      humidityData = [65, 63, 60, 62, 64, 66, 67];
    } else if (range === 'month') {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      tempData = [21, 22, 20, 19];
      humidityData = [62, 64, 61, 60];
    }

    setChartData({
      labels: labels,
      datasets: [
        { ...chartData.datasets[0], data: tempData },
        { ...chartData.datasets[1], data: humidityData },
      ],
    });
  };

  React.useEffect(() => {
    fetchDataForRange(selectedRange); // Fetch data on initial load
  }, []);

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
      {/* Header */}
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

        {/* Return to Main Page Button */}
        <Button
          onClick={() => navigate('/main')}
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: '#6e8efb',
            '&:hover': { backgroundColor: '#5b75d9' },
          }}
        >
          Return to Main Page
        </Button>
      </Box>

      {/* Page Content */}
      <Box sx={{ width: '80%', maxWidth: '1200px', textAlign: 'center', mt: 6 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#004c8c', mb: 4 }}>
          Weather Data Over Time
        </Typography>

        {/* Time Range Selector */}
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

        {/* Chart */}
        <Box sx={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </Box>
      </Box>
    </Box>
  );
};

export default HistoricalDataPage;
