import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('https://localhost:7207/api/Appointment');
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          setError('Failed to fetch appointments');
        }
      } catch (error) {
        setError('Error fetching appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Function to fetch patient's details by patient ID
  const fetchPatientDetails = async (patientId) => {
    try {
      const response = await fetch(`https://localhost:7207/api/Patient/GetPatientById?patientId=${patientId}`);
      if (response.ok) {
        const data = await response.json();
        return `${data.name} ${data.surname} (${data.personalNumber})`;
      } else {
        return 'Error fetching patient details';
      }
    } catch (error) {
      return 'Error fetching patient details';
    }
  };

  // Function to fetch doctor's details by doctor ID
  const fetchDoctorDetails = async (doctorId) => {
    try {
        const response = await fetch(`https://localhost:7207/api/Doctor/GetDoctorById?doctorId=${doctorId}`);
        if (response.ok) {
          const data = await response.json();
          return `${data.name} ${data.surname} (${data.personalNumber})`;
        } else {
          return 'Error fetching Doctors details';
        }
      } catch (error) {
        return 'Error fetching Doctors details';
      }
  };

  // Function to fetch clinic's details by clinic ID
  const fetchClinicDetails = async (clinicId) => {
    try {
        const response = await fetch(`https://localhost:7207/api/Clinic/GetClinicById?clinicId=${clinicId}`);
        if (response.ok) {
          const data = await response.json();
          return `${data.name}`;
        } else {
          return 'Error fetching Clinic details';
        }
      } catch (error) {
        return 'Error fetching Clinic details';
      }
  };

  useEffect(() => {
    const fetchData = async () => {
      const dataWithDetails = await Promise.all(appointments.map(async (appointment) => {
        const patient = await fetchPatientDetails(appointment.bookAppointment.patientId);
        const doctor = await fetchDoctorDetails(appointment.appointmentSlot.doctorId);
        const clinic = await fetchClinicDetails(appointment.appointmentSlot.clinicId);
        return {
          ...appointment,
          patient,
          doctor,
          clinic,
        };
      }));
      setAppointments(dataWithDetails);
    };

    if (appointments.length > 0) {
      fetchData();
    }
  }, [appointments]);

  return (
    <div className="col-py-9">
      <div className="row-md-1">
        <Sidebar userRole='Admin' />
      </div>
      <div className="row-md-5 d-flex justify-content ml-3">
        <div className="w-100">
          <h2>Appointments List</h2>
          <div className="table-responsive" style={{ width:'97vw'}}>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Start Time</th>
                  <th scope="col">End Time</th>
                  <th scope="col">Status</th>
                  <th scope="col">Patient</th>
                  <th scope="col">Meeting Reason</th>
                  <th scope="col">Meeting Request Description</th>
                  <th scope="col">Doctor</th>
                  <th scope="col">Clinic</th> 
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
                  appointments.map(appointment => (
                    <tr key={appointment.appointmentId}>
                      <td>{appointment.appointmentSlot.date}</td>
                      <td>{appointment.appointmentSlot.startTime}</td>
                      <td>{appointment.appointmentSlot.endTime}</td>
                      <td>{appointment.status}</td>
                      <td>{appointment.patient}</td>
                      <td>{appointment.bookAppointment.meetingReason}</td>
                      <td>{appointment.bookAppointment.meetingRequestDescription}</td>
                      <td>{appointment.doctor}</td>
                      <td>{appointment.clinic}</td>
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

export default Appointments;
