import React from 'react';

interface Platform {
  id: number;
  name: string;
  status: string;
}

const PlatformList: React.FC<{ platforms: Platform[] }> = ({ platforms }) => {
  return (
    <ul className="space-y-4">
      {platforms.map((platform) => (
        <li key={platform.id} className="border p-4 rounded shadow-sm">
          <h3 className="font-bold">{platform.name}</h3>
          <p>Status: {platform.status}</p>
        </li>
      ))}
    </ul>
  );
};

export default PlatformList;
