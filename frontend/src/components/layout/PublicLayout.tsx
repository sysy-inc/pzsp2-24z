import React from 'react';
import Header from './Header';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="p-6">{children}</main>
    </>
  );
};

export default PublicLayout;
