import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Container, Nav, Dropdown, Button ,NavDropdown, Offcanvas,Badge,Modal } from 'react-bootstrap';
import './Navbar.css';
import { CgProfile } from "react-icons/cg";
import { IoMdChatbubbles } from "react-icons/io";
import { IoMdNotifications } from "react-icons/io";
import { HiChatBubbleBottomCenterText } from "react-icons/hi2";
import { FaUserFriends } from "react-icons/fa";
import ChatBot from './Chat/ChatBot';
import { NotificationManager,NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { CiCircleMore } from "react-icons/ci";
import { IoNotificationsOff,IoNotifications  } from "react-icons/io5";
import { MdNotificationsPaused } from "react-icons/md";

const Navbar = ({ isLoggedIn, handleLogout,signalR}) => {

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const userRole=localStorage.getItem('role');
  console.log("userRole", userRole)
  useEffect(() => {
    // Fetch notifications from API
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const fetchData = await fetch(`https://localhost:7207/api/Notification/Notificatoin/user?id=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
      if(fetchData.ok){
        
        const data = await fetchData.json();
        const sortedNotifications = data.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateB - dateA;
        });
        console.log(sortedNotifications);
        setNotifications(sortedNotifications);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const totalUnread = notifications.filter(notification => notification.read === false).length;

  const handleNotificationClick = async () => {
    await fetchNotifications();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const markAsRead = (id) => {
    try {
      const index = notifications.findIndex(notification => notification.idNotification === id);
      if (index !== -1) {
        const updatedNotifications = [...notifications];
        updatedNotifications[index] = { ...updatedNotifications[index], read: true };
        setNotifications(updatedNotifications);
      }
    } catch (error) {
      console.log(error)
    }
   
  };
  const handleDelete = async (id) => {
    try {
      const idsToDelete = [id];
      const queryParams = idsToDelete.map(id => `id=${id}`).join('&');
      const response =  await fetch(`https://localhost:7207/api/Notification/Notificatoin/delete?${queryParams}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      if(data.succeeded === true){
        setNotifications(prevNotifications => prevNotifications.filter(notification => notification.idNotification !== id));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  
  const handleMarkAsRead = async (id) => {
    try {

      const index = notifications.find(notification => notification.idNotification === id);
      const notificationRequest = {
          IdNotification: index.idNotification,
          Subject: index.subject,
          Body: index.body,
          FromId: index.fromId,
          ToId: index.toId,
          Type: index.type,
          IdType: index.typeId,
          MessageType: index.messageType,
          IsRead: true,
          dateTimestamp: index.dateTimestamp
      }
      const response = await fetch(`https://localhost:7207/api/Notification/Notificatoin/update?id=${index.idNotification}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationRequest)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      if(data.succeeded === true){
          markAsRead(id);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  useEffect( () => {
    try {
      if (signalR) {
        signalR.on('ReceiveNotification', (notificationRequest) => {
          const messageBody = notificationRequest.body;
          const subject = notificationRequest.subject;
        if(notificationRequest.messageType === 'info')
            NotificationManager.info(messageBody,subject );
        });
        fetchNotifications();
      }
    } catch (error) {
      console.log(error);
    }

    return () => {
      if (signalR) {
        signalR.off('ReceiveNotification');
      }
    };
    
  }, [signalR]);

  const navbarTextColor = '#ffffff'; 
  const navigateToChatWithUser = (location) => {
    window.location.href = location;
  };

const handleLogoClick = ()=>{
  const role = localStorage.getItem("role");
  if(isLoggedIn){
    if(role === 'Patient'){
      return '/patient-dashboard';
    }
    else if(role === 'Clinic'){
      return '/clinic-dashboard';
    }
  }
  else{
    return '/home';
  }
}


  return (
    <>
    <BootstrapNavbar bg="primary" expand="lg" sticky="top" data-bs-theme="dark">
      <BootstrapNavbar.Brand href={handleLogoClick()} className="navbar-brand">
        <span style={{ color: navbarTextColor }} >AppointEase</span>
      </BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {isLoggedIn === false && (
            <>
              <Nav.Link href="/home" style={{ color: navbarTextColor }}>Home</Nav.Link>
              <Nav.Link href="/about-us" style={{ color: navbarTextColor }}>About Us</Nav.Link>
              <Nav.Link href="/contact-us" style={{ color: navbarTextColor }}>Contact Us</Nav.Link>
            </>
          )}
         
          {isLoggedIn ? (
            <>
             <Nav.Link href="/user-list" style={{ color: navbarTextColor }}><FaUserFriends style={{ fontSize: "30px" }}/></Nav.Link>
             <Nav.Link className="notification-icon" style={{position:'relative'}} onClick={handleNotificationClick}>
             
            
              {totalUnread !== null && totalUnread > 0 ? (
                <IoNotifications style={{ fontSize: "30px", color: '#ffffff', marginRight: '5px' }} />
              ) : (
                <IoNotificationsOff style={{ fontSize: "30px", color: '#ffffff', marginRight: '5px' }} />
              )}
              {totalUnread !== null && totalUnread > 0 &&(
                <Badge pill bg="danger" style={{ position: 'absolute', top: '0', right: '-2px', zIndex: '1' }}>{notifications.length}</Badge>
              ) }
              </Nav.Link>

              <NavDropdown align={{ lg: 'end' }} drop='down-centered' title={<IoMdChatbubbles style={{ fontSize: "30px",color:"white" }}/>} id="chat-dropdown" >
                <NavDropdown.Item href="/chat" style={{ color: '#ffffff' }}>
                  <IoMdChatbubbles className='mr-2' style={{ fontSize: "25px" }}/>
                  Messages
                </NavDropdown.Item>
                <NavDropdown.Item href="#" style={{ color: '#ffffff' }} onClick={toggleOffcanvas}>
                  <HiChatBubbleBottomCenterText className='' style={{ fontSize: "25px" }}/>
                  Chat bot
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown align={{ lg: 'end' }} title={<CgProfile style={{ fontSize: "30px", color: '#ffffff' }}></CgProfile>} id="profile-dropdown">
              <NavDropdown.Item href="/profile" style={{ color: '#ffffff' }}>Profile</NavDropdown.Item>
              {userRole === 'Patient' && (
                <NavDropdown.Item href="/patient-dashboard" style={{ color: '#ffffff' }}>Dashboard</NavDropdown.Item>
              )}
              {userRole === 'Admin' && (
                <NavDropdown.Item href="/admin-dashboard" style={{ color: '#ffffff' }}>Dashboard</NavDropdown.Item>
              )}
              {userRole === 'Clinic' && (
                <NavDropdown.Item href="/clinic-dashboard" style={{ color: '#ffffff' }}>Dashboard</NavDropdown.Item>
              )}
              {userRole === 'Doctor' && (
                <NavDropdown.Item href="/doctor-dashboard" style={{ color: '#ffffff' }}>Dashboard</NavDropdown.Item>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout} style={{ color: '#ffffff' }}>Log Out</NavDropdown.Item>
            </NavDropdown>
            </>
          ) : (
            <>
              <Nav.Link href="/login" style={{ color: navbarTextColor }}>Login</Nav.Link>
              <Nav.Link href="/register-patient" style={{ color: navbarTextColor }}>Register</Nav.Link>
            </>
          )}
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>


     <Offcanvas show={showOffcanvas} onHide={toggleOffcanvas} placement="end">
     <Offcanvas.Header closeButton>
       <Offcanvas.Title>Chatbot</Offcanvas.Title>
     </Offcanvas.Header>
     <Offcanvas.Body>
       <ChatBot signalR = {signalR} navigateToChat={navigateToChatWithUser}/>
     </Offcanvas.Body>
   </Offcanvas>
   <NotificationContainer style={{ maxWidth: '300px' }}/>

   <Modal show={showModal} onHide={handleCloseModal} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {notifications !== null && notifications.length === 0 && (
        <div className="container-fluid">
        <div className="row justify-content-center mt-5">
          <div className="col-md-6 text-center">
          <div className="alert" role="alert">
                <MdNotificationsPaused style={{ fontSize: "80px", color: 'black', marginRight: '5px' }} />
                  <p>You don't have any notifications.</p>
              </div>
          </div>
        </div>
      </div>
      )}
        {notifications.map(notification => (
          <div key={notification.idNotification} className={`w-100 rounded my-2 p-3 bg-light position-relative`} onClick={()=> handleMarkAsRead(notification.idNotification)}>
             <Dropdown align={{lg:'end'}} className="position-absolute top-2 end-0 mx-2">
             <Dropdown.Toggle as={CiCircleMore} className='text-primary' style={{cursor:'hand'}}  fontSize={35} id="dropdown-basic" />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleDelete(notification.idNotification)}>Delete</Dropdown.Item>
                  {notification.read === false &&(
                    <Dropdown.Item onClick={() => handleMarkAsRead(notification.idNotification)}>Mark as Read</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>     
            <strong>
              <span className="text-primary">{notification.subject}</span>
              {notification.read ? <Badge pill className='bg-secondary ml-2'>Read</Badge> : <Badge pill className='bg-primary ml-2'>Unread</Badge>}
            </strong>
            <br />
            <p>{notification.body}</p>
            <div className="text-muted">
              <p className="mb-0">From: {notification.fullName}</p>
              <p className="mb-0">Hour: {notification.time}</p>
              <p className="mb-0">Date: {notification.date}</p>
            </div>
          </div>
        ))}


        </Modal.Body>
        <Modal.Footer>
        `<Button variant="danger" onClick={handleCloseModal}>
            Delete All
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Read All
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

   </>
  );
};

export default Navbar;
