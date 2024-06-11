import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';

function MyPendingAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:7207/api/BookAppointment');
                if (response.ok) {
                    const appointmentData = await response.json();
                    const appointmentDetailsPromises = appointmentData
                        .filter(appointment => appointment.bookAppointmentStatus === "Pending" && appointment.patientId === userId)
                        .map(async appointment => {
                            const response = await fetch(`https://localhost:7207/api/AppointmentSlot/${appointment.appointmentSlotId}`);
                            if (response.ok) {
                                const slotData = await response.json();
                                const doctorResponse = await fetch(`https://localhost:7207/api/Doctor/GetDoctorById?doctorId=${slotData.doctorId}`);
                                if (doctorResponse.ok) {
                                    const doctorData = await doctorResponse.json();
                                    return {
                                        ...appointment,
                                        date: slotData.date,
                                        startTime: slotData.startTime,
                                        endTime: slotData.endTime,
                                        doctorName: doctorData.name,
                                        doctorSurname: doctorData.surname,
                                        doctorPersonalNumber: doctorData.personalNumber
                                    };
                                } else {
                                    return {
                                        ...appointment,
                                        date: 'Unknown',
                                        startTime: 'Unknown',
                                        endTime: 'Unknown',
                                        doctorName: 'Unknown',
                                        doctorSurname: 'Unknown',
                                        doctorPersonalNumber: 'Unknown'
                                    };
                                }
                            } else {
                                return {
                                    ...appointment,
                                    date: 'Unknown',
                                    startTime: 'Unknown',
                                    endTime: 'Unknown',
                                    doctorName: 'Unknown',
                                    doctorSurname: 'Unknown',
                                    doctorPersonalNumber: 'Unknown'
                                };
                            }
                        });
                    const resolvedAppointments = await Promise.all(appointmentDetailsPromises);
                    setAppointments(resolvedAppointments);
                } else {
                    setErrorMessage('Failed to fetch appointment data');
                }
            } catch (error) {
                console.error('Error during fetching appointment data:', error);
                setErrorMessage('An error occurred while fetching appointment data');
            }
        };

        fetchData();
    }, [userId]);

    const cancelAppointment = async (id) => {
        try {
            const response = await fetch(`https://localhost:7207/api/Appointment/PatientCancelAppointmentPostMethod?id=${id}`, {
                method: 'POST',
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
                    const updatedAppointments = appointments.filter(appointment => appointment.bookAppointmentId !== id);
                    setAppointments(updatedAppointments);
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

    const isFutureDateTime = (dateTime) => {
        const appointmentDateTime = new Date(dateTime);
        return appointmentDateTime > new Date();
    };

    return (
        <div className="col-py-9">
            <div className="row-md-5 d-flex justify-content-center">
                <div className="w-80">
                    <div className="my-5">
                        <h3>Pending Appointments</h3>
                    </div>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Date</th>
                                    <th scope="col">Start Time - End Time</th>
                                    <th scope="col">Doctor Name, Surname and Personal Number</th>
                                    <th scope="col">Meeting Reason</th>
                                    <th scope="col">Meeting Request </th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(appointment => (
                                    <tr key={appointment.bookAppointmentId}>
                                        <td>{appointment.date}</td>
                                        <td>{appointment.startTime} - {appointment.endTime}</td>
                                        <td>{appointment.doctorName} - {appointment.doctorSurname} - {appointment.doctorPersonalNumber}</td>
                                        <td>{appointment.meetingReason}</td>
                                        <td>{appointment.meetingRequestDescription}</td>
                                        <td>{appointment.bookAppointmentStatus}</td>
                                         {isFutureDateTime(appointment.date + 'T' + appointment.startTime) && (
                                            <td>
                                                <button className="btn btn-danger btn-sm" onClick={() => cancelAppointment(appointment.bookAppointmentId)}>Cancel Appointment</button>
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

export default MyPendingAppointments;
