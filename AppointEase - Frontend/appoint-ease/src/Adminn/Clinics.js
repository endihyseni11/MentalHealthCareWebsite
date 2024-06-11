import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar';

const Clinics = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await fetch('https://localhost:7207/api/Clinic/GetAllClinics');
        if (response.ok) {
          const data = await response.json();
          setClinics(data);
        } else {
          setError('Failed to fetch clinics');
        }
      } catch (error) {
        setError('Error fetching clinics');
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  // Function to filter clinics based on search term
  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="col-py-9">
      <div className="row-md-1">
        <Sidebar userRole='Admin' />
      </div>
      <div className="row-md-5 d-flex justify-content ml-3">
        <div className="w-100">
          <h2>Clinics List</h2>
          <div className="mb-3">
            <label htmlFor="searchName" className="form-label">Search by Name:</label>
            <input
              type="text"
              id="searchName"
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="table-responsive" style={{ width:'97vw'}}>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Photo</th>
                  <th scope="col">Name</th>
                  <th scope="col">Username</th>
                  <th scope="col">Address</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Email</th>
                  <th scope="col">Created Date</th>
                  <th scope="col">Other Details</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9">Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="9">{error}</td>
                  </tr>
                ) : (
                  filteredClinics.map(clinic => (
                    <tr key={clinic.id}>
                      <td>
                        <img
                          src={`data:image/${clinic.photoFormat};base64,${clinic.photoData}`}
                          alt="Clinic Photo"
                          style={{ width: '40px', height: '40px'}}
                        />
                      </td>
                      <td>{clinic.name}</td>
                      <td>{clinic.userName}</td>
                      <td>{clinic.address}</td>
                      <td>{clinic.phoneNumber}</td>
                      <td>{clinic.email}</td>
                      <td>{clinic.createdDate}</td>
                      <td>{clinic.otherDetails}</td>
                      <td>
                        <Link to={`/clinic-details/${clinic.id}`} className="btn btn-primary ml-2">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clinics;