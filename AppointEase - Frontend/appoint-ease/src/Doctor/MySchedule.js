import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import MessageComponent from '../Messages/MessageComponent';

function MySchedule() {
    const [appointments, setAppointments] = useState([]);
    const [errors, setErrors] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [patientData, setPatientData] = useState({});
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
            } else {
                setErrors('Failed to fetch appointment data');
            }
        } catch (error) {
            console.error('Error during fetching appointment data:', error);
            setErrors('An error occurred while fetching appointment data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const cancelAppointment = async (id) => {
        try {
            const response = await fetch(`https://localhost:7207/api/Appointment/DoctorCancelAppointment?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.succeeded === true) {
                    console.log('Operation succeeded: true');
                    setErrorMessage(responseData);
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

    useEffect(() => {
        const fetchPatientDetails = async () => {
            const patientDetails = {};
            for (const appointment of appointments) {
                const patientId = appointment.bookAppointment.patientId;
                if (!patientData[patientId]) {
                    try {
                        const response = await fetch(`https://localhost:7207/api/Patient/GetPatientById?patientId=${patientId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        if (response.ok) {
                            const patient = await response.json();
                            patientDetails[patientId] = patient;
                        } else {
                            patientDetails[patientId] = { name: 'Unknown', surname: 'Unknown', personalNumber: 'Unknown' };
                        }
                    } catch (error) {
                        console.error('Error fetching patient data:', error);
                        patientDetails[patientId] = { name: 'Unknown', surname: 'Unknown', personalNumber: 'Unknown' };
                    }
                }
            }
            setPatientData(prevData => ({ ...prevData, ...patientDetails }));
        };

        fetchPatientDetails();
    }, [appointments]);

    const filteredAppointments = appointments.filter(appointment => appointment.appointmentSlot.doctorId === userId && appointment.appointmentSlot.date.includes(searchDate));

    const handleSearchChange = (event) => {
        setSearchDate(event.target.value);
    };

    const isFutureDateTime = (dateTimeString) => {
        const appointmentDateTime = new Date(dateTimeString);
        const currentDateTime = new Date();
        return appointmentDateTime > currentDateTime;
    };

    return (
        <div className="col-py-9">
            <div className="row-md-1">
                <Sidebar userRole='Doctor' />
            </div>
            <div className="row-md-5 d-flex justify-content-center">
                <div className="w-75" >
                    <div className="my-5">
                        <h3>My Schedule</h3>
                        <input type="date" className="form-control" placeholder="Search by Date" value={searchDate} onChange={handleSearchChange} />
                    </div>
                    {errorMessage && <MessageComponent message={errorMessage} />}
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Date</th>
                                    <th scope="col">Start Time - End Time</th>
                                    <th scope="col">Patient</th>
                                    <th scope="col">Meeting Reason</th>
                                    <th scope="col">Meeting Request Description</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.map((appointment, index) => (
                                    <tr key={index}>
                                        <td>{appointment.appointmentSlot.date}</td>
                                        <td>{appointment.appointmentSlot.startTime} - {appointment.appointmentSlot.endTime}</td>
                                        <td>{patientData[appointment.bookAppointment.patientId] ? `${patientData[appointment.bookAppointment.patientId].name} ${patientData[appointment.bookAppointment.patientId].surname} (${patientData[appointment.bookAppointment.patientId].personalNumber})` : 'Unknown'}</td>
                                        <td>{appointment.bookAppointment.meetingReason}</td>
                                        <td>{appointment.bookAppointment.meetingRequestDescription}</td>
                                        <td>{appointment.status}</td>
                                        {appointment.status === "Accepted" && isFutureDateTime(appointment.appointmentSlot.date + 'T' + appointment.appointmentSlot.startTime) && (
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

export default MySchedule;