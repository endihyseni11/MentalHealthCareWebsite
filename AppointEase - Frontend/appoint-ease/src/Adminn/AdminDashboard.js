import React from 'react';
import Sidebar from '../Sidebar';

const AdminDashboard = () =>
{
  return (
    <div className="dashboard-container">
      <Sidebar userRole='Admin' />
    </div>
  );
};

export default AdminDashboard;
