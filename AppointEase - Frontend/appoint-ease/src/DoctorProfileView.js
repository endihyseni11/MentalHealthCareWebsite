import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button, Tab, Nav } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import './Css/VisitProfile.css';
import Sidebar from './Sidebar';
import { FaUserPlus, FaPlus, FaTimes, FaHourglassStart, FaCheck } from 'react-icons/fa';
import ModalNotify from './ModalMessages/ModalNotifications';
import moment from 'moment';
import { CiBookmarkRemove } from "react-icons/ci";



const UserProfileCard = () => {
  const [activeTab, setActiveTab] = useState('details');
  const { userId } = useParams();
  const [connectionType, setConnectionType] = useState(null);
  const [doctor, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [idRequest,setIdRequest] = useState(null);


  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
          const response = await fetch(`https://localhost:7207/api/Doctor/GetDoctorById?doctorId=${userId}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          });
          const data = await response.json();
          console.log(data);
          if (response.ok) {
              setDoctors(data);
          } else {
              console.error('Network response was not ok');
          }
      } catch (error) {
          console.error('Error:', error);
      }
  }
  
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
   fetchData();

    //
  }, [userId]);
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

// Function to render button based on connection type
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

  return (
    <>
    <Sidebar userRole={'Patient'}/>
      <div className='container-fluid my-5'>
        <Row className="profile-row">
          <div className='d-flex align-items-center border rounded p-3 shadow smaller-box'>
            <Col sm={12} md={6} lg={3} className="col-fixed-width">
              <Image src={`data:image/${doctor.photoFormat};base64,${doctor.photoData}`} fluid />
            </Col>
            <Col sm={12} md={6} lg={9} className="col-fixed-width d-flex flex-column">
              <div>
                <h4>{doctor.name} {doctor.surname}</h4>
                <p className="specialisation-text">{doctor.specialisation}</p>
                <p className="birth-date">{doctor.dateOfBirth}</p>
                <p>📍{doctor.address}</p>
              </div>
              <div className="mt-auto d-flex w-100">
              
              </div>
            </Col>
            <Col sm={12} md={6} lg={9} className="col-fixed-width d-flex flex-row justify-content-between align-items-end">
              <div className="mt-auto" style={{marginBottom:'-20%'}}>
                <Link to={`/book-appointment/${doctor.id}`} className='mr-2' >
                  <Button variant="primary" className="custom-book-btn">
                    BOOK NOW
                  </Button>
                </Link>
                {renderConnectionButton()}
              </div>
            </Col>
          </div>
        </Row>
      </div>

      <div className="smaller-box">
        <Row className="mt-4">
          <Col sm={12}>
            <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
              <Row>
                <Col sm={12}>
                  <Nav variant="tabs" className="profile-tabs">
                    <Nav.Item className="flex-fill text-center">
                      <Nav.Link
                        eventKey="details"
                        className={`nav-link ${activeTab === 'details' ? 'active-tab' : ''}`}
                      >
                        Overview
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="flex-fill text-center">
                      <Nav.Link
                        eventKey="clinic"
                        className={`nav-link ${activeTab === 'clinic' ? 'active-tab' : ''}`}
                      >
                        Locations
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <Tab.Content>
                    <Tab.Pane eventKey="details">
                      <div>
                        <h5>About me</h5>
                        <p>{doctor.description}</p>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="clinic">
                      <div>
                        <p>{doctor.address}</p>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default UserProfileCard;
