import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const PlatformIntegrationForm: React.FC = () => {
  const [platformName, setPlatformName] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleIntegration = () => {
    console.log({ platformName, apiKey });
  };

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <Input type="text" placeholder="Platform Name" value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
      <Input type="text" placeholder="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
      <Button onClick={handleIntegration} type="submit">Integrate Platform</Button>
    </form>
  );
};

export default PlatformIntegrationForm;
