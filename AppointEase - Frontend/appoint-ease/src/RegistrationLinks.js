// RegistrationLinks.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Css/RegistrationLinks.css'; // Import the CSS file

const RegistrationLinks = () => {
  const location = useLocation();

  return (
    <div className="row mb-3 registration-links">
      <div className="col-md-6">
        <Link to="/register-patient" className={`registration-link ${location.pathname === '/register-patient' ? 'active' : ''}`}>
          Register as Patient
        </Link>
      </div>
      <div className="col-md-6">
        <Link to="/register-clinic" className={`registration-link ${location.pathname === '/register-clinic' ? 'active' : ''}`}>
          Register as Clinic
        </Link>
      </div>
    </div>
  );
};

export default RegistrationLinks;
