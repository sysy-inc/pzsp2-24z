import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Sensor App</h1>
      <nav>
        <a href="/login" className="px-4">Login</a>
        <a href="/signup" className="px-4">Sign Up</a>
      </nav>
    </header>
  );
};

export default Header;
