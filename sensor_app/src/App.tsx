import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage />} />
      </Routes>
    </Router>
  );
};

export default App;
