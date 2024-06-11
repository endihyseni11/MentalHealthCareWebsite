import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import MessageComponent from '../Messages/MessageComponent';

function BookAppointmentRequests() {
    const [appointments, setAppointments] = useState([]);
    const [appointmentSlots, setAppointmentSlots] = useState({});
    const [patientData, setPatientData] = useState({});
    const [errors, setErrors] = useState(null);
    const [userId, setUserId] = useState('');
    const [searchDate, setSearchDate] = useState('');

    useEffect(() => {
        // Fetch user id (assuming it's stored somewhere)
        const userId = localStorage.getItem('userId');
        setUserId(userId);

        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:7207/api/BookAppointment', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const appointmentData = await response.json();
                    setAppointments(appointmentData);
                } else {
                    setErrors('Failed to fetch appointment data');
                }
            } catch (error) {
                console.error('Error during fetching appointment data:', error);
                setErrors('An error occurred while fetching appointment data');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchAppointmentSlots = async () => {
            try {
                const response = await fetch('https://localhost:7207/api/AppointmentSlot/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const slotData = await response.json();
                    const slots = {};
                    slotData.forEach(slot => {
                        slots[slot.appointmentSlotId] = {
                            ...slot,
                            doctorId: slot.doctorId // Store DoctorId alongside slot data
                        };
                    });
                    setAppointmentSlots(slots);
                } else {
                    setErrors('Failed to fetch appointment slots');
                }
            } catch (error) {
                console.error('Error during fetching appointment slots:', error);
                setErrors('An error occurred while fetching appointment slots');
            }
        };
        fetchAppointmentSlots();
    }, []);

    useEffect(() => {
        const fetchPatientData = async (patientId) => {
            try {
                const response = await fetch(`https://localhost:7207/api/Patient/GetPatientById?patientId=${patientId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const patient = await response.json();
                    setPatientData((prevData) => ({
                        ...prevData,
                        [patientId]: patient,
                    }));
                } else {
                    setErrors('Failed to fetch patient data');
                }
            } catch (error) {
                console.error('Error during fetching patient data:', error);
                setErrors('An error occurred while fetching patient data');
            }
        };

        appointments.forEach((appointment) => {
            if (!patientData[appointment.patientId]) {
                fetchPatientData(appointment.patientId);
            }
        });
    }, [appointments]);

    const handleAccept = async (bookAppointmentId) => {
        try {
            const response = await fetch(`https://localhost:7207/api/Appointment/AcceptAppointment?id=${bookAppointmentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Appointment accepted successfully');
                setAppointments((prevAppointments) =>
                    prevAppointments.filter((appointment) => appointment.bookAppointmentId !== bookAppointmentId)
                );
            } else {
                console.error('Failed to accept appointment:', response.statusText);
            }
        } catch (error) {
            console.error('Error during accepting appointment:', error);
        }
    };

    const handleDecline = async (bookAppointmentId) => {
        try {
            const response = await fetch(`https://localhost:7207/api/Appointment/DeclineAppointment?id=${bookAppointmentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                setAppointments((prevAppointments) =>
                    prevAppointments.filter((appointment) => appointment.bookAppointmentId !== bookAppointmentId)
                );
                console.log('Appointment deleted successfully');
            } else {
                console.error('Failed to delete appointment:', response.statusText);
            }
        } catch (error) {
            console.error('Error during deleting appointment:', error);
        }
    };

    // Filter appointments where doctorId matches the logged-in userId
    const doctorAppointments = appointments.filter(appointment =>
        appointmentSlots[appointment.appointmentSlotId] &&
        appointmentSlots[appointment.appointmentSlotId].doctorId === userId &&
        appointment.bookAppointmentStatus === "Pending" &&
        appointmentSlots[appointment.appointmentSlotId].date.includes(searchDate)
    );

    const isFutureDate = (dateString) => {
        const appointmentDate = new Date(dateString);
        const today = new Date();
        return appointmentDate > today;
    };
    
    return (
        <div className="col-py-9">
            <div className="row-md-1">
                <Sidebar userRole='Doctor' />
            </div>
            <div className="row-md-5 d-flex justify-content-center">
                <div className="w-75" >
                    <div className="my-5">
                        <h3>Pending Appointment Requests</h3>    
                    </div>
                    <div className="mb-3">
                        <label htmlFor="searchDate" className="form-label">Search by Date:</label>
                        <input
                            type="date"
                            id="searchDate"
                            className="form-control"
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                        />
                    </div>
                    {errors && <div className="alert alert-danger">{errors}</div>}
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Start Time - End Time</th>
                                    <th scope="col">Patient</th>
                                    <th scope="col">Meeting Reason</th>
                                    <th scope="col">Meeting Request Desc.</th>
                                    <th scope="col">Status</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctorAppointments.map((appointment, index) => (
                                    <tr key={appointment.bookAppointmentId}>
                                        <th scope="row">{index + 1}</th>
                                        <td>
                                            {appointmentSlots[appointment.appointmentSlotId] ? 
                                                appointmentSlots[appointment.appointmentSlotId].date : 
                                                'Fetching...'
                                            }
                                        </td>
                                        <td>
                                            {appointmentSlots[appointment.appointmentSlotId] ? 
                                                `${appointmentSlots[appointment.appointmentSlotId].startTime} - ${appointmentSlots[appointment.appointmentSlotId].endTime}` : 
                                                'Fetching...'
                                            }
                                        </td>
                                        <td>
                                            {patientData[appointment.patientId] ? 
                                                `${patientData[appointment.patientId].name} ${patientData[appointment.patientId].surname}` : 
                                                'Fetching...'
                                            }
                                        </td>
                                        <td>{appointment.meetingReason}</td>
                                        <td>{appointment.meetingRequestDescription}</td>
                                        <td>{appointment.bookAppointmentStatus}</td>
                                        {isFutureDate(appointmentSlots[appointment.appointmentSlotId].date) && (
                                            <td>
                                                <button className="btn btn-success" onClick={() => handleAccept(appointment.bookAppointmentId)}>Accept</button>
                                                <button className="btn btn-danger ml-2" onClick={() => handleDecline(appointment.bookAppointmentId)}>Decline</button>
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

export default BookAppointmentRequests;