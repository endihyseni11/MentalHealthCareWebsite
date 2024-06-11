import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar';

const DoctorList = ({ userId }) =>
{
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);

  useEffect(() =>
  {
    const fetchData = async () =>
    {
      try
      {
        // Fetch doctors
        const doctorsResponse = await fetch('https://localhost:7207/api/Doctor/GetAllDoctors');
        if (doctorsResponse.ok)
        {
          const doctorsData = await doctorsResponse.json();

          // Filter doctors based on ClinicId matching userId
          const filteredDoctors = doctorsData.filter((doctor) => doctor.clinicId === userId);

          setDoctors(filteredDoctors);
        } else
        {
          console.error('Failed to fetch doctors:', doctorsResponse.statusText);
        }

        // Fetch clinics
        const clinicsResponse = await fetch('https://localhost:7207/api/Clinic/GetAllClinics');
        if (clinicsResponse.ok)
        {
          const clinicsData = await clinicsResponse.json();
          setClinics(clinicsData);
        } else
        {
          console.error('Failed to fetch clinics:', clinicsResponse.statusText);
        }
      } catch (error)
      {
        console.error('Error during fetch:', error);
      }
    };

    fetchData();
  }, [userId]);

  const getClinicName = (clinicId) =>
  {
    const clinic = clinics.find((c) => c.id === clinicId);
    return clinic ? clinic.name : 'Unknown Clinic';
  };

  const handleDelete = async (id) =>
  {
    try
    {
      const response = await fetch(`https://localhost:7207/api/Doctor/DeleteDoctor?doctorId=${id}`, {
        method: 'DELETE',
      });

      if (response.ok)
      {
        setDoctors(doctors.filter((doctor) => doctor.id !== id));
      } else
      {
        console.error('Failed to delete doctor:', response.statusText);
      }
    } catch (error)
    {
      console.error('Error during delete:', error);
    }
  };

  const handleEdit = (id) =>
  {
    // Use navigate function to navigate to the EditDoctor page and pass the doctor's ID as state
    // Adjust the route according to your application structure
    window.location.href = `/edit-doctor/${id}`;
  };

  return (
    <div className="col-py-9">
        <div className="row-md-1">
            <Sidebar userRole='Clinic' />
        </div>
        <div className="row-md-5 d-flex justify-content ml-3">
            <div className="w-75">
                <h2>Doctors List</h2>
                <Link to="/create-doctor" className="btn btn-primary mb-3">
                    Create Doctor
                </Link>
                <div className="table-responsive" style={{ width:'97vw'}}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Surname</th>
                                <th scope="col">Specialisation</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone Number</th>
                                <th scope="col">Date of Birth</th>
                                <th scope="col">Gender</th>
                                <th scope="col">Address</th>
                                <th scope="col">Description</th>
                                <th scope="col">Clinic Name</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doctor) => (
                                <tr key={doctor.id}>
                                    <td>{doctor.name}</td>
                                    <td>{doctor.surname}</td>
                                    <td>{doctor.specialisation}</td>
                                    <td>{doctor.email}</td>
                                    <td>{doctor.phoneNumber}</td>
                                    <td>{doctor.dateOfBirth}</td>
                                    <td>{doctor.gender}</td>
                                    <td>{doctor.address}</td>
                                    <td>{doctor.description}</td>
                                    <td>{getClinicName(doctor.clinicId)}</td>
                                    <td>
                                        <Link to={`/edit-doctor/${doctor.id}`} className="btn btn-primary ml-2">
                                            Edit
                                        </Link>
                                        <button className="btn btn-danger" onClick={() => handleDelete(doctor.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);
};

export default DoctorList;