import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('https://localhost:7207/api/Doctor/GetAllDoctors');
        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
        } else {
          setError('Failed to fetch doctors');
        }
      } catch (error) {
        setError('Error fetching doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Function to fetch clinic name by clinic ID
  const fetchClinicName = async (clinicId) => {
    try {
      const response = await fetch(`https://localhost:7207/api/Clinic/GetClinicById?clinicId=${clinicId}`);
      if (response.ok) {
        const data = await response.json();
        return data.name;
      } else {
        return 'Error fetching clinic name';
      }
    } catch (error) {
      return 'Error fetching clinic name';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const doctorData = [];
      for (const doctor of doctors) {
        const clinicName = await fetchClinicName(doctor.clinicId);
        doctorData.push({ ...doctor, clinicName });
      }
      setDoctors(doctorData);
    };

    if (doctors.length > 0) {
      fetchData();
    }
  }, [doctors]);

  // Function to filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="col-py-9">
      <div className="row-md-1">
        <Sidebar userRole='Admin' />
      </div>
      <div className="row-md-5 d-flex justify-content ml-3">
        <div className="w-100">
          <h2>Doctors List</h2>
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
                  <th scope="col">Surname</th>
                  <th scope="col">Username</th>
                  <th scope="col">Specialisation</th>
                  <th scope="col">Personal Number</th>
                  <th scope="col">Address</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Email</th>
                  <th scope="col">Date of Birth</th>
                  <th scope="col">Clinic</th>
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
                  filteredDoctors.map(doctor => (
                    <tr key={doctor.id}>
                      <td>
                        <img
                          src={`data:image/${doctor.photoFormat};base64,${doctor.photoData}`}
                          alt="Doctor Photo"
                          style={{ width: '40px', height: '40px'}}
                        />
                      </td>
                      <td>{doctor.name}</td>
                      <td>{doctor.surname}</td>
                      <td>{doctor.userName}</td>
                      <td>{doctor.specialisation}</td>
                      <td>{doctor.personalNumber}</td>
                      <td>{doctor.address}</td>
                      <td>{doctor.phoneNumber}</td>
                      <td>{doctor.email}</td>
                      <td>{doctor.dateOfBirth}</td>
                      <td>{doctor.clinicName}</td>
                      <td>
                        <Link className="btn btn-primary ml-2">
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

export default Doctors;