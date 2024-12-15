import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// Define types for API response and state
interface SensorData {
  sensor_id: number;
  value: number;
}

interface DataState {
  temperature: number;
  humidity: number;
}

const App: React.FC = () => {
  const [data, setData] = useState<DataState>({ temperature: 0, humidity: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ data: SensorData[] }>(
          "http://127.0.0.1:8000/api/test_db"
        );

        const sensorData = response.data.data;

        const temperature =
          sensorData.find((item) => item.sensor_id === 1)?.value || 0;
        const humidity =
          sensorData.find((item) => item.sensor_id === 2)?.value || 0;

        setData({ temperature, humidity });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Sensors App</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="text-center">
        <h1 className="mb-4">Live Sensor Data</h1>

        {loading ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <div className="row">
            {/* Temperature Card */}
            <div className="col-md-6 mb-3">
              <div className="card border-primary">
                <div className="card-body">
                  <h5 className="card-title">Temperature</h5>
                  <p className="card-text">
                    <strong>{data.temperature.toFixed(1)} °C</strong>
                  </p>
                </div>
              </div>
            </div>
            {/* Humidity Card */}
            <div className="col-md-6 mb-3">
              <div className="card border-success">
                <div className="card-body">
                  <h5 className="card-title">Humidity</h5>
                  <p className="card-text">
                    <strong>{data.humidity.toFixed(1)} %</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center mt-4">
        <p>Sensors App</p>
      </footer>
    </div>
  );
};

export default App;
