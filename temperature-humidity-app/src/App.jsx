import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure axios is installed: npm install axios
import "./App.css";

function App() {
  const [data, setData] = useState({ temperature: 0, humidity: 0 }); // State for data
  const [loading, setLoading] = useState(true); // State for loading

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/data");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Temperature and Humidity</h1>
        <p>Temperature: {data.temperature} °C</p>
        <p>Humidity: {data.humidity} %</p>
      </header>
    </div>
  );
}

export default App;
