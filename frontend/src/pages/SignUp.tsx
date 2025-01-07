import React from 'react';
import SignUpForm from '../components/auth/SignUpForm';
import PublicLayout from '../components/layout/PublicLayout';

const SignUp: React.FC = () => {
  return (
    <PublicLayout>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <SignUpForm />
      </div>
    </PublicLayout>
  );
};

export default SignUp;
