import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const SignUpForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log({ name, email, password });
  };

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={handleSubmit} type="submit">Sign Up</Button>
    </form>
  );
};

export default SignUpForm;
