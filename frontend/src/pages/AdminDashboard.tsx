import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import UserTable from '../components/admin/UserTable';
import PlatformList from '../components/admin/PlatformList';
import { useAdmin } from '../hooks/useAdmin';

const AdminDashboard: React.FC = () => {
  const { users, platforms } = useAdmin();

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>
        <UserTable users={users} />
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Platform Management</h2>
        <PlatformList platforms={platforms} />
      </section>
    </AdminLayout>
  );
};

export default AdminDashboard;
