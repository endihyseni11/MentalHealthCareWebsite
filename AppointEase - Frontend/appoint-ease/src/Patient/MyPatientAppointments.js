import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import MyPendingAppointments from './MyPendingAppointments';

function MyPatientAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [appointmentSlots, setAppointmentSlots] = useState({});
    const [doctorData, setDoctorData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [patientData, setPatientData] = useState({}); // State to store patient data
    const [searchDate, setSearchDate] = useState('');

    const fetchData = async () => {
        try {
            const response = await fetch('https://localhost:7207/api/Appointment', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const appointmentData = await response.json();
                setAppointments(appointmentData);
                setFilteredAppointments(appointmentData);
                console.log("Data", appointmentData);
            } else {
                setErrorMessage('Failed to fetch appointment data');
            }
        } catch (error) {
            console.error('Error during fetching appointment data:', error);
            setErrorMessage('An error occurred while fetching appointment data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const cancelAppointment = async (id) => {
        try {
            const response = await fetch(`https://localhost:7207/api/Appointment/PatientCancelAppointment?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.succeeded === true) {
                    console.log('Operation succeeded: true');
                    setErrorMessage(null);
                    console.log(responseData);
                    fetchData();
                } else {
                    console.log('Operation succeeded: false');
                    setErrorMessage(responseData);
                    console.log(responseData);
                }
            } else {
                const errorData = await response.json();
                console.error('Failed to cancel appointment:', errorData.message);
            }
        } catch (error) {
            console.error('Error canceling appointment:', error);
        }
    };

    const userId = localStorage.getItem('userId');

    const fetchDoctor = async (doctorId) => {
        if (!doctorData[doctorId]) {
            try {
                const response = await fetch(`https://localhost:7207/api/Doctor/GetDoctorById?doctorId=${doctorId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const doctor = await response.json();
                    setDoctorData(prevData => ({ ...prevData, [doctorId]: doctor }));
                } else {
                    console.error('Failed to fetch doctor data');
                    setDoctorData(prevData => ({ ...prevData, [doctorId]: { name: 'Unknown', surname: 'Unknown', personalNumber: 'Unknown' } }));
                }
            } catch (error) {
                console.error('Error fetching doctor data:', error);
                setDoctorData(prevData => ({ ...prevData, [doctorId]: { name: 'Unknown', surname: 'Unknown', personalNumber: 'Unknown' } }));
            }
        }
    };

    useEffect(() => {
        appointments.forEach(appointment => {
            const doctorId = appointment.appointmentSlot.doctorId;
            fetchDoctor(doctorId);
        });
    }, [appointments]);

    useEffect(() => {
        setFilteredAppointments(
            appointments.filter(
                appointment => 
                    appointment.bookAppointment.patientId === userId &&
                    appointment.appointmentSlot.date.includes(searchDate)
            )
        );
    }, [userId, searchDate, appointments]);

    const handleSearchChange = (event) => {
        setSearchDate(event.target.value);
    };

    const isFutureDate = (date) => {
        const today = new Date();
        const appointmentDate = new Date(date);
        return appointmentDate > today;
    };    
    
    return (
        <div className="col-py-9">
            <div className="row-md-1">
                <Sidebar userRole='Patient' />
            </div>
            <MyPendingAppointments/>
            <div className="row-md-5 d-flex justify-content-center">
                <div className="w-100" >
                    <div className="my-5">
                        <h3>My Appointments</h3>
                        <input type="date" className="form-control" placeholder="Search by Date" value={searchDate} onChange={handleSearchChange} />
                    </div>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Start Time - End Time</th>
                                    <th scope="col">DoctorId</th>
                                    <th scope="col">Meeting Reason</th>
                                    <th scope="col">Meeting Request Description</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.map((appointment, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{appointment.appointmentSlot.date}</td>
                                        <td>{appointment.appointmentSlot.startTime} - {appointment.appointmentSlot.endTime}</td>
                                        <td>{doctorData[appointment.appointmentSlot.doctorId] ?
                                            `${doctorData[appointment.appointmentSlot.doctorId].name} ${doctorData[appointment.appointmentSlot.doctorId].surname} (${doctorData[appointment.appointmentSlot.doctorId].personalNumber})` : 'Unknown'}
                                        </td>
                                        <td>{appointment.bookAppointment.meetingReason}</td>
                                        <td>{appointment.bookAppointment.meetingRequestDescription}</td>
                                        <td>{appointment.status}</td>
                                        {appointment.status === "Accepted" && isFutureDate(appointment.appointmentSlot.date) && (
                                            <td>
                                                <button className="btn btn-danger btn-sm" onClick={() => cancelAppointment(appointment.appointmentId)}>Cancel Appointment</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyPatientAppointments;