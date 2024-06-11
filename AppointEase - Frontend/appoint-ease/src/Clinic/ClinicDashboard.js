import React from 'react';

import Sidebar from '../Sidebar';

const ClinicDashboard = () =>
{
  return (
    <div className="dashboard-container">
      <Sidebar userRole='Clinic' />
    </div>
  );
};

export default ClinicDashboard;
