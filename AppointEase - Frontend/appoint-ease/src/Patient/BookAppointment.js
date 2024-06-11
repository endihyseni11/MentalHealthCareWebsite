import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { Button, Container, Row, Col, Form, Modal } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import MessageComponent from '../Messages/MessageComponent';

const BookAppointment = (userId) => {
  const { doctorId } = useParams();
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointmentSlotId, setSelectedAppointmentSlotId] = useState('');
  const [meetingReason, setMeetingReason] = useState('');
  const [meetingRequestDescription, setMeetingRequestDescription] = useState('');
  const [bookAppointmentStatus, setBookAppointmentStatus] = useState('');
  const [responseDateTime, setResponseDateTime] = useState(null);
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentIntentRequest, setPaymentIntentRequest] = useState({
    amount: '5000', // Static amount
    currency: 'usd', // Static currency
    paymentMethodTypes: ['card'], // Assuming you're using card payments
    paymentMethod: 'pm_card_visa', // Empty by default
    patientId: 'cus_QEMX8jjv6nK7SC', // Change to use userId directly
  });

  useEffect(() => {
    fetchAppointmentSlots();
  }, [doctorId, userId]);

  const fetchAppointmentSlots = async () => {
    try {
      const response = await fetch(`https://localhost:7207/api/AppointmentSlot/ByDoctorId?doctorId=${doctorId}`);
      if (response.ok) {
        const data = await response.json();
        setAppointmentSlots(data);
      } else {
        console.error('Failed to fetch appointment slots:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching appointment slots:', error);
    }
  };

  const filteredAppointments = appointmentSlots.filter(slot => {
    const slotDate = moment.utc(`${slot.date} ${slot.startTime}`, 'YYYY-MM-DDTHH:mm:ss').toDate();
    return moment(slotDate).isSame(selectedDate, 'day');
  });

  const handleAppointmentSlotSelect = (event) => {
    const selectedId = event.target.value;
    setSelectedAppointmentSlotId(selectedId);
  };

  const handlePaymentSubmit = () => {
    // Here you can handle the submission of payment intent and appointment booking
    // You can integrate your payment logic here
    console.log('Payment intent request:', paymentIntentRequest);
    // After successful payment, you can call bookAppointment()
    setShowModal(false);
    bookAppointment();
  };

  const bookAppointment = async () => {
    setIsBookingInProgress(true);
    try {
      const requestBody = {
        appointmentSlotId: selectedAppointmentSlotId,
        patientId: userId.userId, // Change this line
        meetingReason,
        meetingRequestDescription,
        bookAppointmentStatus: 'Pending',
        responseDateTime,
        paymentIntentRequest,
      };
  
      const response = await fetch('https://localhost:7207/api/BookAppointment/CreateBookAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.succeeded === true) {
          console.log('Operation succeeded: true');
          setErrorMessage(responseData);
          console.log(responseData);
          window.location.href = '/my-patient-appointments';
        } else {
          console.log('Operation succeeded: false');
          setErrorMessage(responseData);
          console.log(responseData);
        }
      } else {
        console.error('Failed to book appointment:', response.statusText);
        console.log('Request body:', JSON.stringify(requestBody));
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('An error occurred while booking the appointment. Please try again later.');
    } finally {
      setIsBookingInProgress(false);
    }
  };
  
const [doctorDetails, setDoctorDetails] = useState(null);
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

const Payment = () => {
  window.location.href = '/stripe-payment-form';
}

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
    <Row>
      <Col md={5} className="text-center">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
        />
      </Col>
      <Col md={7}>
        <Form>
          <Form.Group controlId="appointmentSlotSelect" className="mb-3">
            <Form.Control as="select" value={selectedAppointmentSlotId} onChange={handleAppointmentSlotSelect}>
              <option value="">Select Appointment Slot</option>
              {filteredAppointments.map(appointment => (
                <option key={appointment.appointmentSlotId} value={appointment.appointmentSlotId} disabled={appointment.isBooked || moment.utc().isAfter(moment.utc(`${appointment.date} ${appointment.startTime}`))}>
                {`${appointment.startTime}-${appointment.endTime}`}
              </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="meetingReason" className="mb-3">
            <Form.Control type="text" placeholder="Enter meeting reason" value={meetingReason} onChange={(e) => setMeetingReason(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="meetingRequestDescription" className="mb-3">
            <Form.Control as="textarea" rows={3} placeholder="Enter meeting request description" value={meetingRequestDescription} onChange={(e) => setMeetingRequestDescription(e.target.value)} />
          </Form.Group>
          <Button variant="primary" onClick={() => setShowModal(true)} disabled={!selectedAppointmentSlotId || isBookingInProgress}>
          {isBookingInProgress ? 'Booking...' : 'Proceed to Pay '}
        </Button>
        </Form>
      </Col>
    </Row>
    <Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Payment Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
    <Form.Group controlId="paymentAmount" className="mb-3">
        <Form.Label>Amount</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Enter amount" 
          value={(parseFloat(paymentIntentRequest.amount) / 100).toFixed(2)} // Display value as dollars with 2 decimal places
          onChange={(e) => setPaymentIntentRequest({ ...paymentIntentRequest, amount: e.target.value })} 
          readOnly
        />
      </Form.Group>
      <Form.Group controlId="paymentCurrency" className="mb-3">
        <Form.Label>Currency</Form.Label>
        <Form.Control type="text" placeholder="Enter currency" value={paymentIntentRequest.currency} onChange={(e) => setPaymentIntentRequest({ ...paymentIntentRequest, currency: e.target.value })} readOnly/>
      </Form.Group>
      <Form.Group controlId="paymentMethodTypes" className="mb-3">
        <Form.Label>Payment Method</Form.Label>
        <Form.Control as="select" value={paymentIntentRequest.paymentMethodType} onChange={(e) => setPaymentIntentRequest({ ...paymentIntentRequest, paymentMethodType: e.target.value })}>
          <option value="card">Card</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="paymentMethod" className="mb-3">
        <Form.Label>Payment Method</Form.Label>
        <Form.Control type="text" placeholder="Enter payment method"/>
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
    <Button variant="primary" onClick={handlePaymentSubmit}>
      Submit Payment
    </Button>
  </Modal.Footer>
</Modal>

  </Container>
);
};

export default BookAppointment;