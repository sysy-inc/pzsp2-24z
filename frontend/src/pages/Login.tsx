import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import PublicLayout from '../components/layout/PublicLayout';

const Login: React.FC = () => {
  return (
    <PublicLayout>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <LoginForm />
      </div>
    </PublicLayout>
  );
};

export default Login;
