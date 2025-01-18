import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import MainPage from './pages/MainPage';
import AdminPage from './pages/AdminPage';
import CurrentWeatherPage from './pages/CurrentWeatherPage';
import HistoricalDataPage from './pages/HistoricalDataPage'; 
import PlatformChoicePage from './pages/PlatformChoicePage'; // Import the new page

const App: React.FC = () => {
  const platforms = ["Platform A", "Platform B", "Platform C"]; // Example platform list

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/platform-choice"
          element={<PlatformChoicePage platforms={platforms} />}
        />
        <Route path="/main" element={<MainPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/current-weather" element={<CurrentWeatherPage />} />
        <Route path="/historical-data" element={<HistoricalDataPage />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
};

export default App;