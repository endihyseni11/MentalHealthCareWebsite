import React,{useEffect,useState} from 'react';
import { Container, Row, Col, Card, Button, Table,Spinner,Modal  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  Link } from 'react-router-dom';
import { faCalendarCheck, faCheckCircle, faClock, faUserClock } from '@fortawesome/free-solid-svg-icons';
import { faUser, faUserMd, faEye, faComments } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../Sidebar';

function PatientDashboard()
{
    const userId = localStorage.getItem('userId');
    
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal1, setShowModal1] = useState(false);
    const [canMessage, setCanMessage] = useState(false);
  
    const handleClose = () => setShowModal1(false);
    const handleShow = () => setShowModal1(true);

    const handleToMessage = (isFriend) => {
        try {
          if (isFriend === false) {
            handleShow();
          }
        } catch (error) {
          console.log(error);
        }
      };


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch(`https://localhost:7207/api/Dashboard/Patient-Dashboard?patientId=${userId}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }

                const data = await response.json();
                setDashboardData(data);
                setLoading(false); // Set loading to false after data is fetched
                console.log(data);
            } catch (error) {
                console.log(error);
                setLoading(false); // Set loading to false in case of error
            }
        }

        fetchDashboardData();
    }, [userId]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        );
    }
    return (
        <Container fluid>
            <Row className="mt-3">
            <Sidebar userRole={'Patient'} />

                <Col className="text-center px-3 mt-3">
                    <h1 style={{marginRight:'60px'}}>Patient Dashboard</h1>
                </Col>

            </Row>


            {/* Rreshti i parë */}
            <Row className="mt-3">
                <Col>
                    <Card className="text-center bg-light">
                        <Card.Body>
                            <Card.Title className="text-left">Total Appointment</Card.Title>
                            <Card.Text className="text-left">
                                {dashboardData !== null ? dashboardData.totalAppointments :0}
                            </Card.Text>
                            <FontAwesomeIcon icon={faCalendarCheck} size="4x" className="text-primary float-right" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="text-center bg-light">
                        <Card.Body>
                            <Card.Title className="text-left">Accepted Appointments</Card.Title>
                            <Card.Text className="text-left">
                                 {dashboardData !== null ? dashboardData.totalCompleted :0}
                            </Card.Text>
                            <FontAwesomeIcon icon={faCheckCircle} size="4x" className="text-success float-right" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="text-center bg-light">
                        <Card.Body>
                            <Card.Title className="text-left">Pending Appointments</Card.Title>
                            <Card.Text className="text-left">
                            {dashboardData !== null ? dashboardData.totalPending :0}
                            </Card.Text>
                            <FontAwesomeIcon icon={faClock} size="4x" className="text-warning float-right" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="text-center bg-light">
                        <Card.Body>
                            <Card.Title className="text-left">Free Slots Today</Card.Title>
                            <Card.Text className="text-left">
                            {dashboardData !== null ? dashboardData.totalFreeSlots :0}
                            </Card.Text>
                            <FontAwesomeIcon icon={faUserClock} size="4x" className="text-info float-right" />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <h2>Your Appointments</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Start Time - End Time</th>
                                    <th scope="col">Doctor</th>
                                    <th scope="col">Meeting Reason</th>
                                    <th scope="col">Meeting Request Desc.</th>
                                <th style={{ width: '150px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {dashboardData === null ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    <div>
                                        <p>Loading...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : dashboardData.tableAppointments.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    <div>
                                        <p>No appointments available.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            dashboardData.tableAppointments.map((appointment, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{appointment.result.date}</td>
                                    <td>{appointment.result.startTime} - {appointment.result.endTime}</td>
                                    <td>{appointment.result.doctor}</td>
                                    <td>{appointment.result.meetingreason}</td>
                                    <td>{appointment.result.meetingRequest}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        <Button variant="primary" className="mr-2">
                                            <FontAwesomeIcon icon={faInfoCircle} /> Details
                                        </Button>
                                        <Button variant="danger">
                                            <FontAwesomeIcon icon={faTimesCircle} /> Cancel
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    </Table>
                    {dashboardData === null || dashboardData.tableAppointments.length > 4 && (
                        <div className="text-right">
                            <a href="#">View all your appointments</a>
                        </div>
                    )}
                </Col>
            </Row>


            {/* Rreshti i dytë */}
            <Row className="mt-3">
                {/* Doctors */}
                <Col>
                <h2>List of Doctors</h2>
                    {dashboardData === null ? (
                        // Nëse dashboardData është null
                        <p>Loading...</p>
                    ) : (
                        dashboardData.sugestionDoctors.length > 0 ? (
                            <div className="d-flex flex-wrap">
                                {dashboardData.sugestionDoctors.map((doctor, index) => (
                                    <div key={index} className="m-2">
                                        <Card style={{ width: '18rem' }}>
                                            <div className="d-flex justify-content-center align-items-center" style={{ width: '150px', height: '150px', overflow: 'hidden', borderRadius: '50%', margin: 'auto' }}>
                                                <img src={`data:image/${doctor.photoFormat};base64,${doctor.photoData}`} alt="User" className="img-fluid" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                            </div>
                                            <Card.Body className="d-flex flex-column align-items-center">
                                                <Card.Title>{doctor.fullName}</Card.Title>
                                                <Card.Text>
                                                    Specialization: {doctor.specialisation}
                                                </Card.Text>
                                                <div className="d-flex">
                                                    <Link to={`/profile-card/${doctor.doctorId}`}>
                                                        <Button variant="primary" className="mr-2">
                                                            <FontAwesomeIcon icon={faEye} /> Profile
                                                        </Button>
                                                    </Link>
                                                    <Link to={doctor.isFriends ? `/chat/${doctor.doctorId}`:''}>
                                                        <Button variant="success" onClick={()=> handleToMessage(doctor.isFriends)}>
                                                            <FontAwesomeIcon icon={faComments} /> Chat
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <p>No data available for doctors.</p>
                            </div>
                        )
                    )}
                </Col>

                {/* Patients */}
                <Col>
                    <h2>List of Patients</h2>
                    {dashboardData === null ? (
                        // Nëse dashboardData është null
                        <p>Loading...</p>
                    ) : (
                        dashboardData.sugestionPatients.length > 0 ? (
                            <div className="d-flex flex-wrap">
                                {dashboardData.sugestionPatients.map((patient, index) => (
                                    <div key={index} className="m-2">
                                        <Card style={{ width: '18rem' }}>
                                            <div className="d-flex justify-content-center align-items-center" style={{ width: '150px', height: '150px', overflow: 'hidden', borderRadius: '50%', margin: 'auto' }}>
                                                <img src={`data:image/${patient.photoFormat};base64,${patient.photoData}`} alt="User" className="img-fluid" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                            </div>
                                            <Card.Body className="d-flex flex-column align-items-center">
                                                <Card.Title>{patient.fullName}</Card.Title>
                                                <div className="d-flex">
                                                    <Link to={`/user-profile/${patient.patientId}`}>
                                                        <Button variant="primary" className="mr-2">
                                                            <FontAwesomeIcon icon={faEye} /> Profile
                                                        </Button>
                                                    </Link>
                                                    <Link to={patient.isFriends ? `/chat/${patient.patientId}`:''}>
                                                        <Button variant="success" onClick={()=> handleToMessage(patient.isFriends)}>
                                                            <FontAwesomeIcon icon={faComments} /> Chat
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <p>No data available for patients.</p>
                            </div>
                        )
                    )}
                </Col>
            </Row>
            <Modal show={showModal1} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Reminder!</Modal.Title>
                </Modal.Header>
                <Modal.Body>First, you need to establish a connection with this person before you chating!</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default PatientDashboard;
