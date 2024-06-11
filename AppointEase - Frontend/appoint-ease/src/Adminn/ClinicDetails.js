import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';

const ClinicDetails = () => {
  const { clinicId } = useParams();
  const [clinicDetails, setClinicDetails] = useState({});
  const [clinicDoctors, setClinicDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClinicDetails = async () => {
      try {
        const response = await fetch(`https://localhost:7207/api/Clinic/GetClinicById?clinicId=${clinicId}`);
        if (response.ok) {
          const data = await response.json();
          setClinicDetails(data);
        } else {
          setError('Failed to fetch clinic details');
        }
      } catch (error) {
        setError('Error fetching clinic details');
      } finally {
        setLoading(false);
      }
    };

    const fetchClinicDoctors = async () => {
      try {
        const response = await fetch(`https://localhost:7207/api/Doctor/clinic/${clinicId}`);
        if (response.ok) {
          const data = await response.json();
          setClinicDoctors(data);
          setFilteredDoctors(data); // Initialize filteredDoctors with all doctors
        } else {
          setError('Failed to fetch clinic doctors');
        }
      } catch (error) {
        setError('Error fetching clinic doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchClinicDetails();
    fetchClinicDoctors();
  }, [clinicId]);

  // Function to handle search
  useEffect(() => {
    const filtered = clinicDoctors.filter(doctor =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.personalNumber && doctor.personalNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, clinicDoctors]);

  return (
    <div className="col-py-9">
      <div className="row-md-1">
        <Sidebar userRole='Admin' />
      </div>
      <div className="row-md-5 d-flex justify-content-center ml-3">
        <div className="w-100">
          <h2>Clinic Details</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Image</th>
                  <th scope="col">Name</th>
                  <th scope="col">Username</th>
                  <th scope="col">Address</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Email</th>
                  <th scope="col">Created Date</th>
                  <th scope="col">Other Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <img
                      src={`data:image/${clinicDetails.photoFormat};base64,${clinicDetails.photoData}`}
                      alt="Clinic Photo"
                      style={{ width: '40px', height: '40px'}}
                    />
                  </td>
                  <td>{clinicDetails.name}</td>
                  <td>{clinicDetails.userName}</td>
                  <td>{clinicDetails.address}</td>
                  <td>{clinicDetails.phoneNumber}</td>
                  <td>{clinicDetails.email}</td>
                  <td>{clinicDetails.createdDate}</td>
                  <td>{clinicDetails.otherDetails}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="row-md-5 d-flex justify-content-center ml-3">
        <div className="w-100">
          <h2>Clinic Doctors</h2>
          <div className="mb-3">
            <label htmlFor="searchDoctor" className="form-label">Search Doctor by Name or Personal Number:</label>
            <input
              type="text"
              id="searchDoctor"
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Image</th>
                  <th scope="col">Name</th>
                  <th scope="col">Surname</th>
                  <th scope="col">Username</th>
                  <th scope="col">Personal Number</th>
                  <th scope="col">Date Of Birth</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Email</th>
                  <th scope="col">Specialisation</th>
                  <th scope="col">Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map(doctor => (
                  <tr key={doctor.id}>
                    <td>
                      <img
                        src={`data:image/${doctor.photoFormat};base64,${doctor.photoData}`}
                        alt="Clinic Photo"
                        style={{ width: '40px', height: '40px'}}
                      />
                    </td>
                    <td>{doctor.name}</td>
                    <td>{doctor.surname}</td>
                    <td>{doctor.userName}</td>
                    <td>{doctor.personalNumber}</td>
                    <td>{doctor.dateOfBirth}</td>
                    <td>{doctor.phoneNumber}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.specialisation}</td>
                    <td>{doctor.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div> 
      </div>
    </div>
  ); 
};

export default ClinicDetails;
