import React, {useEffect,useState} from 'react';
import { useParams,Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Breadcrumb } from 'react-bootstrap';
import { FaUserPlus, FaPlus, FaTimes, FaHourglassStart, FaCheck } from 'react-icons/fa';
import { format } from 'date-fns';
import { Spinner,Modal } from 'react-bootstrap';
import NotificationService from '../SiganlR/NotificationSender';
import { CiBookmarkRemove } from "react-icons/ci";
import sendNotification from '../SiganlR/NotificationSender';

export default function ProfilePage({signalRHub}) {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [connectionType, setConnectionType] = useState(null);
  const [idRequest,setIdRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal1, setShowModal1] = useState(false);
  const [canMessage, setCanMessage] = useState(false);

  const handleClose = () => setShowModal1(false);
  const handleShow = () => setShowModal1(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://localhost:7207/api/Patient/GetPatientById/?patientId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUserData(userData);
        console.log(userData);
      } catch (error) {
        console.error(error);
      }
    };

    const CheckForFriendRequest = async () => {
      try {
          const loginId = localStorage.getItem('userId');
          const response = await fetch(`https://localhost:7207/api/RequestConnection/CheckConnection?userId=${loginId}&touserId=${userId}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          });
  
          if (response.ok) {
              const data = await response.json();
              setConnectionType(data.type);
              setIdRequest(data.idRequest);
          } else {
              console.error('Network response was not ok');
          }
      } catch (error) {
          console.error('Error:', error);
      }
  }
  
   CheckForFriendRequest();
    fetchUserData();
  }, [userId]); 

  useEffect(()=>{
    setLoading(userData === null);
  },[userData])

  const handleRejectConnection = async()=>{
    try {
      const fetchData = await fetch(`https://localhost:7207/api/RequestConnection/CancelRequestConnection?idRequest=${idRequest}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
  
    if(fetchData.ok){
        const response = await fetchData.json();
        if(response.succeeded === true){
            setConnectionType("NotExist");
        }
    }
      
    } catch (error) {
      console.log(error);
    }
  }
  const handleAddConnection = () => {
    // Logic for adding connection based on the connection type
    switch (connectionType) {
      case 'Accepted':
        const RemoveFromFriendList = async () =>{
          const fetchData = await fetch(`https://localhost:7207/api/Connections/DeleteFromFriends?userId=${localStorage.getItem('userId')}&friendId=${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if(fetchData.ok){
          const data = await fetchData.json();
          console.log(data);
          setConnectionType("NotExist");
        }
        }
        RemoveFromFriendList();
        break;
      case 'Pending':
        const RemoveFromList = async() =>{
          try {
            const fetchData = await fetch(`https://localhost:7207/api/RequestConnection/CancelRequestConnection?idRequest=${idRequest}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        
            if (fetchData.ok) {
                const data = await fetchData.json();
                setConnectionType("NotExist");
  
            } else {
                console.error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        
        }
        RemoveFromList();
        break;
      case 'Waiting':
        
       const AcceptUser = async()=>{
            try {
              const fetchData = await fetch(`https://localhost:7207/api/RequestConnection/AcceptRequest?Id=${idRequest}`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
              });

              if (fetchData.ok){
                  setConnectionType("Accepted");
                  sendNotification(signalRHub, 'Accepted', `${userData.name} ${userData.surname} is your new friend on the list`, userId, 'System', '', 'info');
              }
              
          } catch (error) {
              console.log("Error during accept request: ",error);
          }
       }
       AcceptUser();
  
  
  
  
        break;
      case 'NotExist':
        const AddToList = async () => {
          try {
            const loginId = localStorage.getItem('userId');
            const currentDate = new Date();
            const formattedDateTime = currentDate.toISOString().slice(0, -1);
  
              const requestData = {
                  requestId: "null",
                  fromId:loginId ,
                  toId: userId,
                  dateTimestamp: formattedDateTime
              };
              console.log(requestData);
      
              const fetchData = await fetch(`https://localhost:7207/api/RequestConnection/AddConnection`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(requestData) // Dërgoni instancën e klases në trupin e kërkesës
              });
      
              if (fetchData.ok) {
                  const data = await fetchData.json();
                  if (data.success === true) {
                    setIdRequest(data.idRequest);
                    setConnectionType("Pending");
                    sendNotification(signalRHub, 'Friend Request', `You have a new request from ${userData.name} ${userData.surname}`, userId, 'System', '', 'info');

                } else {
                    console.error('Your request connection failed.');
                }
              } else {
                  console.error('Network response was not ok');
              }
          } catch (error) {
              console.error('Error:', error);
          }
      }
        AddToList();
        break;
      default:
        break;
    }
  }

  const renderConnectionButton = () => {
    switch (connectionType) {
      case 'Accepted':
        return (
          <Button variant="danger" onClick={handleAddConnection}>
            <FaTimes className="mr-2" /> Remove
          </Button>
        );
      case 'Pending':
        return (
          <Button variant="warning" onClick={handleAddConnection}>
            <FaHourglassStart className="mr-2" /> Pending
          </Button>
        );
      case 'Waiting':
        return (
          <>
            <Button variant="info" onClick={handleAddConnection}>
              <FaCheck className="mr-2" fontSize={15}/> Accept
            </Button>
            <Button variant="danger" className='mx-1' onClick={handleRejectConnection}>
              <CiBookmarkRemove className="mr-2" fontSize={15}/> Reject
            </Button>
          </>
        );
      case 'NotExist':
        return (
          <Button variant="primary" onClick={handleAddConnection}>
            <FaUserPlus className="mr-2" /> Add
          </Button>
        );
      default:
        return null;
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }
    return format(date, 'dd MMM, yyyy');
};
const handleToMessage = () => {
  try {
    if (connectionType !== 'Accepted') {
      handleShow();
      setCanMessage(false);
    } else {
      setCanMessage(true);
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <section style={{ backgroundColor: '#eee' }}>
      <Container className="py-5">
      {loading && 
             <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100%' }}>
             <Spinner animation="border" role="status">
               <span className="sr-only">Loading...</span>
             </Spinner>
           </div>
        }
         {userData && (
          <>
        <Row className='w-100'>
          <Col md={12}>
            <Row className='justify-content-center w-100'>
              <Col lg="5">
                <Card className="mb-4">
                  <Card.Body className="text-center">
                  {userData && (
                    <>
                      <Card.Img
                        src={`data:image/${userData.photoFormat};base64,${userData.photoData}`} 
                        alt="avatar"
                        className="rounded-circle"
                        style={{ width: '150px' }}
                        fluid 
                      />
                      <p className="text-muted mb-1">Role: {userData.role}</p>
                      <p className="text-muted mb-4">📍{userData.address}</p>
                      <p className="text-muted mb-4">Gender: {userData.gender}</p>
                      <div className="d-flex justify-content-center mb-2">
                        {renderConnectionButton()}
                        <Link to={canMessage ? `/chat/${userData.userId}` : ''}>
                          <Button variant="outline" className="ms-1" onClick={handleToMessage}>Message</Button>
                        </Link>

                      </div>
                    </>
                  )}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg="6">
                <Card className="mb-4">
                  <Card.Body>
                  {userData &&
                  <>
                    <Row>
                      <Col sm="3">
                        <p>Full Name</p>
                      </Col>
                      <Col sm="9">
                        <p className="text-muted">{userData.name + ' ' + userData.surname}</p>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col sm="3">
                        <p>Email</p>
                      </Col>
                      <Col sm="9">
                        <p className="text-muted">{userData.email}</p>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col sm="3">
                        <p>Phone</p>
                      </Col>
                      <Col sm="9">
                        <p className="text-muted">{userData.phoneNumber}</p>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col sm="3">
                        <p>Mobile</p>
                      </Col>
                      <Col sm="9">
                        <p className="text-muted">{userData.phoneNumber}</p>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col sm="3">
                        <p>Birthday</p>
                      </Col>
                      <Col sm="9">
                        <p className="text-muted">{formatDate(userData.dateOfBirth)}</p>
                      </Col>
                    </Row>
                    </>
                    }
                  </Card.Body>
                </Card>
                
              </Col>
            </Row>
          </Col>
        </Row>
        </>
       ) }
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
    </section>
  );
}
