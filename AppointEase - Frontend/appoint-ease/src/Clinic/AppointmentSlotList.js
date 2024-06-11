import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import Sidebar from '../Sidebar';
import { Button, Container, Row, Col, Modal, Form, Dropdown } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import "../Css/AppointmentSlotList.css";
import MessageComponent from '../Messages/MessageComponent'; 

const AppointmentSlotList = (userId) => {
  const UserId = userId.userId;
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [appointmentSlotToUpdate, setAppointmentSlotToUpdate] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // State for error message
  const [clinicDoctors, setClinicDoctors] = useState([]);
  const [selectedAppointmentSlotId, setSelectedAppointmentSlotId] = useState(null);

  useEffect(() => {
    fetchAppointmentSlots();
    fetchClinicDoctors(); // Fetch clinic doctors when the component mounts
    console.log(UserId)
  }, [UserId]);

  useEffect(() => {
    const fetchDoctorsDetails = async () => {
      const slotsWithDoctorInfo = await Promise.all(appointmentSlots.map(async (slot) => {
        if (slot.doctorId && typeof slot.doctorDetails === 'undefined') {
          const doctorDetails = await fetchDoctorById(slot.doctorId);
          return { ...slot, doctorDetails };
        }
        return slot;
      }));
      setAppointmentSlots(slotsWithDoctorInfo);
    };
  
    // Check if any slot is missing doctorDetails
    const shouldFetch = appointmentSlots.some(slot => slot.doctorId && typeof slot.doctorDetails === 'undefined');
    if (shouldFetch) {
      fetchDoctorsDetails();
    }
  }, [appointmentSlots]);

  const fetchAppointmentSlots = async () => {
    try {
      const response = await fetch(`https://localhost:7207/api/AppointmentSlot/GetMyDoctorsAppointmentSlots?clinicID=${UserId}`);
      if (response.ok) {
        const data = await response.json();
        setAppointmentSlots(data);
        console.log("data",data)
      } else {
        console.error('Failed to fetch appointment slots:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching appointment slots:', error);
    }
  };

  const fetchClinicDoctors = async () => {
    try {
      const response = await fetch(`https://localhost:7207/api/Doctor/clinic/${UserId}`);
      if (response.ok) {
        const data = await response.json();
        setClinicDoctors(data);
        console.log("Clinic Doctors", data);
      } else {
        console.error('Failed to fetch clinic doctors:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching clinic doctors:', error);
    }
  };

  const fetchDoctorById = async (doctorId) => {
    try {
      const response = await fetch(`https://localhost:7207/api/Doctor/GetDoctorById?doctorId=${doctorId}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Failed to fetch doctor details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
    return null;
  };

  const handleOpenUpdateModal = (appointmentSlot) => {
    setAppointmentSlotToUpdate(appointmentSlot);
    setShowUpdateModal(true);
  };
  
  const filteredAppointments = appointmentSlots.filter((slot) => {
    const slotDate = moment.utc(`${slot.date} ${slot.startTime}`, 'YYYY-MM-DDTHH:mm:ss').toDate();
    const isSameDate = moment(slotDate).isSame(selectedDate, 'day');
    const isSameDoctor = selectedDoctorId === '' || slot.doctorId === String(selectedDoctorId);
    return isSameDate && isSameDoctor;
});

  
  const handleDeleteAppointmentSlot = async (appointmentSlotId) => {
    try {
      const response = await fetch(`https://localhost:7207/api/AppointmentSlot/${appointmentSlotId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSelectedAppointmentSlotId(null);
        console.log('Appointment Slot deleted successfully');
        setAppointmentSlots(prevSlots => prevSlots.filter(slot => slot.appointmentSlotId !== appointmentSlotId));
      } else {
        console.error('Failed to delete appointment slot:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting appointment slot:', error);
    }
  };

  const convertTo24HourFormat = (time12h) => {
    const [time, modifier] = time12h.split(' ');
  
    let [hours, minutes] = time.split(':');
  
    if (hours === '12') {
      hours = '00';
    }
  
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
  
    return `${hours}:${minutes}:00`;
  };
  

  const handleUpdateAppointmentSlot = async () => {
    // Assuming appointmentSlotToUpdate already has the properties: doctorId, clinicId, isBooked, and patientId
    const startTime = convertTo24HourFormat(appointmentSlotToUpdate.startTime);
    const endTime = convertTo24HourFormat(appointmentSlotToUpdate.endTime);
     const updatedSlot = {
    doctorId: appointmentSlotToUpdate.doctorId,
    clinicId: appointmentSlotToUpdate.clinicId,
    startTime,
    endTime,  
    isBooked: appointmentSlotToUpdate.isBooked,
    date: moment.utc(appointmentSlotToUpdate.date).format('YYYY-MM-DD'), // Adjust if the backend expects just YYYY-MM-DD
    patientId: appointmentSlotToUpdate.patientId
    };
    try {
      const response = await fetch(`https://localhost:7207/api/AppointmentSlot/${appointmentSlotToUpdate.appointmentSlotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSlot),
      });
      if (response.ok)
      {  const responseData = await response.json();
        if (responseData.succeeded === true) {
          console.log('Operation succeeded: true');
          setErrorMessage(responseData);
          fetchAppointmentSlots();
          //setShowUpdateModal(false);
          console.log(responseData);
        } else {
          console.log('Operation succeeded: false');
          setErrorMessage(responseData);
          console.log(responseData);
        }
      } else
      {
          console.error('Failed to update Patient:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating appointment slot:', error);
    }
  };

  
  return (
    <div className="col-py-9">
    <div className="row-md-1">
        <Sidebar userRole='Clinic' />
    </div>
    <Container style={{marginTop:'-5%'}}>
      <h2>Appointment Slots</h2>
      <div style={{ display: 'flex', justifyContent: 'space-beetween', marginBottom:'5%'}}>
        <Link to="/appointment-slot-create">
          <Button variant="primary">Create Appointment Slot</Button>
        </Link>
        <Link to="/appointment-slot-create-by-weeks" style={{marginRight:'-7%'}}>
          <Button variant="primary">Create Appointment Slot By Weeks</Button>
        </Link>
      </div>
      <div style={{width:'40%', marginBottom:'3%'}}>
      <Dropdown onSelect={(doctorId) => setSelectedDoctorId(doctorId)}>
  <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{width:'100%'}}>
    Select Doctor
  </Dropdown.Toggle>
  <Dropdown.Menu style={{width:'100%'}}>
    <Dropdown.Item key="" eventKey="">
      All Doctors
    </Dropdown.Item>
    {clinicDoctors.map((doctor) => (
      <Dropdown.Item key={doctor.id} eventKey={doctor.id}>
        <img
          src={`data:image/${doctor.photoFormat};base64,${doctor.photoData}`}
          alt="Photo"
          style={{ width: '30px', height: '30px', marginRight: '10px' }}
        />
        {`${doctor.name} ${doctor.surname} ${doctor.personalNumber}`}
      </Dropdown.Item>
    ))}
  </Dropdown.Menu>
</Dropdown>
      </div>
      <Row style={{ marginBottom: '5%', width:'70%'}}>
        <Col md={4} >
          <div >
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              style={{ height: '300px', width: '100%', margin: 'auto' }}
            />
          </div>
        </Col>
        <Col md={8} style={{maxHeight: '280px', overflowY: 'auto', scrollbarWidth: 'thin'}}>
  <div>
    {filteredAppointments.length === 0 ? (
      <p>No appointments available for the selected date.</p>
    ) : (
      <ul>
        {filteredAppointments.map((appointment) => (
          <li
            key={appointment.appointmentSlotId}
            style={{
              backgroundColor: appointment.isBooked ? 'lightblue' : selectedAppointmentSlotId === appointment.appointmentSlotId ? 'lightblue' : 'inherit',
              padding: '8px',
              margin: '4px 0',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              {appointment.doctorDetails ? (
                <>
                  <img
                    src={`data:image/${appointment.doctorDetails.photoFormat};base64,${appointment.doctorDetails.photoData}`}
                    className="img-fluid img-thumbnail"
                    alt="Doctor's Photo"
                    style={{
                      width: '50px',
                      height: '50px',
                    }}
                  />
                  {`${appointment.doctorDetails.name} ${appointment.doctorDetails.surname} ${appointment.doctorDetails.personalNumber}, Time: ${appointment.startTime}-${appointment.endTime}`}
                </>
              ) : (
                'Loading doctor info...'
              )}
            </div>
            <Button variant="secondary" onClick={(e) => { e.stopPropagation(); handleOpenUpdateModal(appointment); }}>Update</Button>
            <Button variant="danger" onClick={(e) => { e.stopPropagation(); handleDeleteAppointmentSlot(appointment.appointmentSlotId); }}>Delete</Button>

          </li>
        ))}
      </ul>
    )}
  </div>
</Col>
      </Row>
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} style={{marginTop:'4%'}}>
      <Modal.Header closeButton className='d-flex flex-column'> 
      {errorMessage && <MessageComponent message={errorMessage} />}
        <Modal.Title>Update Appointment Slot</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {appointmentSlotToUpdate && (
  <Form>
  <Form.Group controlId="updateAppointmentSlotStartTime">
    <Form.Label>Start Time</Form.Label>
    <Form.Control
      name="startTime"
      type="time"
      value={moment.utc(appointmentSlotToUpdate.startTime, 'HH:mm:ss').format('HH:mm')}
      onChange={(e) => setAppointmentSlotToUpdate({ ...appointmentSlotToUpdate, startTime: e.target.value })}
    />
  </Form.Group>
  <Form.Group controlId="updateAppointmentSlotEndTime">
    <Form.Label>End Time</Form.Label>
    <Form.Control
      name="endTime"
      type="time"
      value={moment.utc(appointmentSlotToUpdate.endTime, 'HH:mm:ss').format('HH:mm')}
      onChange={(e) => setAppointmentSlotToUpdate({ ...appointmentSlotToUpdate, endTime: e.target.value })}
    />
  </Form.Group>
  <Form.Group controlId="updateAppointmentSlotDate">
    <Form.Label>Date</Form.Label>
    <Form.Control
    name="date"
      type="date"
      value={moment.utc(appointmentSlotToUpdate.date).format('YYYY-MM-DD')}
      onChange={(e) => setAppointmentSlotToUpdate({ ...appointmentSlotToUpdate, date: e.target.value })}
    />
  </Form.Group>
</Form>
)}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdateAppointmentSlot}>
  Save Changes
</Button>
      </Modal.Footer>
    </Modal>
  </Container>
  </div>
);
};

export default AppointmentSlotList;
