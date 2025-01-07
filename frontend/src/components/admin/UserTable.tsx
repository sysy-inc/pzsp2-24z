import React from 'react';

interface User {
    id: number;
    name?: string; // Mark name as optional
    email: string;
    role: string;
  }

const UserTable: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">Name</th>
          <th className="border border-gray-300 px-4 py-2">Email</th>
          <th className="border border-gray-300 px-4 py-2">Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="border border-gray-300 px-4 py-2">{user.name}</td>
            <td className="border border-gray-300 px-4 py-2">{user.email}</td>
            <td className="border border-gray-300 px-4 py-2">{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
