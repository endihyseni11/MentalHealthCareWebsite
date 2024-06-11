import React from 'react';
import Sidebar from '../Sidebar';

const DoctorDashboard = () =>
{
  return (
    <div className="dashboard-container">
      <Sidebar userRole='Doctor' />
    </div>
  );
};

export default DoctorDashboard;