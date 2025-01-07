import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-full fixed">
      <ul className="space-y-4 p-6">
        <li><a href="/admin" className="hover:underline">Dashboard</a></li>
        <li><a href="/admin/users" className="hover:underline">User Management</a></li>
        <li><a href="/admin/platforms" className="hover:underline">Platform Management</a></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
