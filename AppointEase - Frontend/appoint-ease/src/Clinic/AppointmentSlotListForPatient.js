import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

const AppointmentSlotListForPatient = () => {
const { doctorId } = useParams();
const [appointmentSlots, setAppointmentSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointmentSlotId, setSelectedAppointmentSlotId] = useState(null); // State to store selected appointment slot ID
  const [doctorDetails, setDoctorDetails] = useState(null);
  useEffect(() => {
    fetchAppointmentSlots();
  }, []);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetchDoctorById(doctorId);
        if (response) {
          setDoctorDetails(response); // Set the doctorDetails state
          console.log("doctor", doctorDetails)
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
    };
  
    fetchDoctorDetails();
  }, [doctorId]);
  

  const fetchAppointmentSlots = async () => {
    try {
      const response = await fetch(`https://localhost:7207/api/AppointmentSlot/ByDoctorId?doctorId=${doctorId}`);
      if (response.ok) {
        const data = await response.json();
        setAppointmentSlots(data);
        console.log("data", data)
      } else {
        console.error('Failed to fetch appointment slots:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching appointment slots:', error);
    }
  };

  const fetchDoctorById = async (doctorId) => {
    try {
      const response = await fetch(`https://localhost:7207/api/Doctor/GetDoctorById?doctorId=${doctorId}`);
      if (response.ok) {
        const data = await response.json();
        return data; // Assuming this returns {name, surname} for the doctor
      } else {
        console.error('Failed to fetch doctor details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
    return null; // In case of error, return null
  };

  const filteredAppointments = appointmentSlots.filter((slot) => {
    const slotDate = moment.utc(`${slot.date} ${slot.startTime}`, 'YYYY-MM-DDTHH:mm:ss').toDate();
    return moment(slotDate).isSame(selectedDate, 'day');  
  });

  // Function to handle appointment slot selection
  const handleAppointmentSlotSelect = (appointmentSlotId) => {
    setSelectedAppointmentSlotId(appointmentSlotId);
    console.log('Selected Appointment Slot ID:', appointmentSlotId);
  };

  return (
    <Container>
      <Row className="align-items-center" style={{display:'flex', justifyContent:'center', marginTop:'-7%'}}>
        <Col md={4} className="text-center" style={{width:'15%'}}>
          {doctorDetails && doctorDetails.photoFormat && doctorDetails.photoData && (
            <img 
              src={`data:image/${doctorDetails.photoFormat};base64,${doctorDetails.photoData}`} 
              className="img-fluid img-thumbnail" 
              alt="Doctor's Photo" 
              style={{ 
                Width: '10%', 
                Height: '10%', 
              }} 
            />
          )}
        </Col>
        <Col md={8} style={{width:'auto'}}> 
          {doctorDetails && (
            <div>
              <h5>{`${doctorDetails.name} ${doctorDetails.surname}`}</h5>
            </div>
          )}
        </Col>
      </Row>
      <Row style={{width:'80%', height:'auto', marginTop:'3%'}}>
        <Col md={4}>
          <div style={{ marginBottom: 20 }}>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              style={{ height: '300px', width: '100%', margin: 'auto' }}
            />
          </div>
        </Col>
        <Col md={8}>
          <div>
            {filteredAppointments.length === 0 ? (
              <p>No appointments available for the selected date.</p>
            ) : (
              <select
                className="form-control"
                onChange={(e) => handleAppointmentSlotSelect(e.target.value)}
                value={selectedAppointmentSlotId}
              >
                <option value="">Select Appointment Slot</option>
                {filteredAppointments.map((appointment) => (
                <option 
                  key={appointment.start} 
                  value={appointment.appointmentSlotId} 
                  disabled={appointment.isBooked || moment.utc().isAfter(moment.utc(`${appointment.date} ${appointment.startTime}`))}
                >
                {`Time: ${appointment.startTime}-${appointment.endTime}`}
                </option>
              ))}
              </select>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AppointmentSlotListForPatient;