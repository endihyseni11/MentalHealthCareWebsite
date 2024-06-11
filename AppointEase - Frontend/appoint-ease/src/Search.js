import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FaSyncAlt } from 'react-icons/fa';
import { Navigate,Link } from 'react-router-dom';

const SearchFilter = ({ onSearch,onRefresh  }) => {
    const [clinicType, setClinicType] = useState('');
    const [location, setLocation] = useState('');
    const [clinicName, setClinicName] = useState('');
  
    const handleClinicTypeChange = (e) => {
      setClinicType(e.target.value);
    };
  
    const handleLocationChange = (e) => {
      setLocation(e.target.value);
    };
  
    const handleClinicNameChange = (e) => {
      setClinicName(e.target.value);
    };
  
    const handleSearchClick = () => {
      if (!clinicType && !location && !clinicName) {
           return; 
      }
      onSearch(clinicType, location, clinicName);
    };
  
    const handleRefreshClick = () => {
      setClinicType('');
      setLocation('');
      setClinicName('');
      onRefresh();
    };
  
    return (
      <div className="card search-filter">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Search</h5>
          <button type="button" className="btn btn-secondary btn-refresh" onClick={handleRefreshClick}><FaSyncAlt /></button>
        </div>
        <div className="card-body">
          <div className="filter-widget">
            <input type="text" className="form-control mb-3" placeholder="Search..." value={clinicName} onChange={handleClinicNameChange} />
          </div>
          <div className="filter-widget">
            <input type="text" className="form-control mb-3" placeholder="Location" value={location} onChange={handleLocationChange} />
          </div>
          <div className="filter-widget">
            <select className="form-control mb-3" value={clinicType} onChange={handleClinicTypeChange}>
            <option value="">Select Clinic Type</option>
            <option value="hospital">Hospital</option>
            <option value="clinic">Clinic</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="therapy">Therapy Center</option>
            <option value="diagnostic">Diagnostic Center</option>
            <option value="diagnostic">Diagnostic Center</option>
            <option value="dental">Dental Clinic</option>
            <option value="eye">Eye Clinic</option>
            <option value="dermatology">Dermatology Clinic</option>
            <option value="oncology">Oncology Clinic</option>
              {/* Shtoni opsione të tjera të klinikës këtu */}
            </select>
          </div>
          <div className="btn-search">
            <button type="button" className="btn btn-block btn-primary" onClick={handleSearchClick}>Search</button>
          </div>
        </div>
      </div>
    );
  };
  
const ProfileClick = (id)=>{
};
  
const DoctorWidget = ({ doctor }) => {
  return (

<div className="card mb-3 mr-3" style={{ width: '100%',height:'300px' }}>
      <div className="row no-gutters">
      <div className="col-md-4 d-flex align-items-center justify-content-center">
          <img 
            src={`data:image/${doctor.pictureFormat};base64,${doctor.doctorPhoto}`} 
            className="img-fluid img-thumbnail mt-4 mb-2" 
            alt="Doctor's Photo" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
            }} 
          />
      </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{doctor.doctorName} </h5>
        {/* <h6 className="card-title">{doctor.clinicName}</h6> */}
            <p className="card-text">{doctor.specialisation}</p>
            <p className="card-text">{doctor.job}</p>
            <p className="card-text">
              <span role="img" aria-label="Location">📍</span> {doctor.clinicLocation}
            </p>
          </div>
        </div>
        <div className="col-md-4 w-100">
          <div className="card-body d-flex flex-rows ">
            <Link to={`/profile-card/${doctor.doctorId}`} className="btn btn-primary mr-3 mb-2 w-50" onClick={() => ProfileClick(doctor.doctorId)}>View Profile</Link>
            <Link to={`/book-appointment/${doctor.doctorId}`} className="btn btn-secondary mb-2 w-50">Book Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (clinicType, location, clinicName) => {
    try {
      setLoading(true);
      const response = await fetch(`https://localhost:7207/api/Search/SearchAppointment?SearchTerm=${clinicName}&Location=${location}&Category=${clinicType}&SearchType=Doctor`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setDoctors(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchDoctors();
}, []);

const fetchDoctors = async () => {
    try {
      setLoading(true);
        const response = await fetch('https://localhost:7207/api/Search/FetchAllDoctors'); 
        if (!response.ok) {
            throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data); 
      setLoading(false);
    } catch (error) {
      setLoading(false);
        console.error('Error fetching doctors:', error);
    }
};


  return (
    <div className="container-fluid">
      <div className="row">
      <div className="row-md-1">
                <Sidebar userRole='Patient' />
            </div>
            <div className="col-md-12 col-lg-4 col-xl-3" style={{ position: 'sticky', top: 40, height: 'calc(100vh - 80px)', overflowY: 'auto' }}>
            {/* Pjesa e filtrave të kërkimit */}
            <SearchFilter onSearch={handleSearch} onRefresh={fetchDoctors} />
            </div>
        <div className="col-md-12 col-lg-8 col-xl-9 d-flex flex-wrap " style={{ minHeight: '200px' }}>
          {/* Lista e mjekëve */}
          {loading ? (
            <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
          ) : doctors.length === 0 ? (
            <div className=" alert-warning container-fluid d-flex justify-content-center bg-white text-center" role="alert">
              No doctors found with this criteria.
            </div>
          ) : (
            doctors.map(doctor => (
              <DoctorWidget key={doctor.doctorId} doctor={doctor} />
            ))
          )}
         
          {/* Butoni për të ngarkuar më shumë mjekë */}
          
        </div>
      </div>
    </div>
  );
};

export default SearchList;
