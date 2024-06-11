import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, Tab, Nav, Button, Dropdown,Modal } from 'react-bootstrap';
import ModalNotify from './ModalMessages/ModalNotifications';
import { format } from 'date-fns';
import MessageComponent from './Messages/MessageComponent';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { MdVisibility } from "react-icons/md";
import { CiCircleMore } from "react-icons/ci";
import { FaTheRedYeti } from 'react-icons/fa';

const FriendList = (signalRHub) =>
{
    const [friends, setFriends] = useState([]);
    const [friendRequests, setRequests] = useState([]);
    const [allOtherUsers, setOthers] = useState([]);

    const pageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('friends');
    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [message, setMessage] = useState(false);
    const [noRows, setNoRows] = useState(false);
    const [apiMessage, setApiMessage] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [removeId, setRemoveId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
      };

      const handleClose = () => setShowModal1(false);
      const handleShow = () => setShowModal1(true);
    
      const handleRemoveClick = (id) => {
        setRemoveId(id);
        handleShow();
      };
    
      const handleConfirmRemove = async () => {
        try {
            if(removeId ===null){
                alert('First needed to pick the user before click remove!');
                return null;
            }

            const fetchData = await fetch(`https://localhost:7207/api/Connections/DeleteFromFriends?userId=${localStorage.getItem('userId')}&friendId=${removeId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if(fetchData.ok){
              const data = await fetchData.json();
              console.log(data);
              const requestId = friends.find(request => request.userId === removeId);
                const updatedRequests = friends.filter(request => request.userId !== requestId.userId);
                setFriends(updatedRequests);
                setRemoveId(null);
            }


        } catch (error) {
            console.log(error);
        }
        handleClose();
      };

      const handleRemoveRequest = async (id)=> {
        try {
            const fetchData = await fetch(`https://localhost:7207/api/RequestConnection/CancelRequestConnection?idRequest=${id}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(fetchData.ok){
                const response = await fetchData.json();
                setMessage(true);
                setApiMessage(response);
                if(response.succeeded === true){
                    const requestId = friendRequests.find(request => request.connectionId === id);
                    const updatedRequests = friendRequests.filter(request => request.userId !== requestId.userId);
                    setRequests(updatedRequests);
                }
               
            }


        } catch (error) {
            console.log(error);
        }
      }
    




    useEffect(() => {
       
        const dummyRequests = async () =>{
            try {

                const fetchData = await fetch(`https://localhost:7207/api/RequestConnection/GetConnections?userId=${localStorage.getItem('userId')}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
            
                if (fetchData.ok) {
                    const response = await fetchData.json();
                    setRequests(response);
                    console.log(response);
                    
                } else {
                    console.error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        const dummyFriendsList = async ()=>{
            try {
                const fetchData = await fetch(`https://localhost:7207/api/Connections/UserConnection?userId=${localStorage.getItem('userId')}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if(fetchData.ok){
                    const response = await fetchData.json();
                    setFriends(response);
                }
                
            } catch (error) {
                console.log("Error: ",error);
            }
            
        }
        const dummyOtherUsers = async () => {
            try {
                const fetchData = await fetch(`https://localhost:7207/api/RequestConnection/GetOtherConnections?userId=${localStorage.getItem('userId')}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if(fetchData.ok){
                    const response = await fetchData.json();
                    console.log(response)
                    setOthers(response);
                }
                
            } catch (error) {
                console.log("Error: ",error);
            }
        }

        dummyRequests();
        dummyFriendsList();
        dummyOtherUsers();
    
    }, []);
    const handlePageChange = (pageNumber) =>
    {
        setCurrentPage(pageNumber);
    };

    const handleTabChange = (tab) =>
    {
        setNoRows(false);
        if(tab === 'friends'){
            if (friends.length === 0)
            {
                setShowModal(true);
                setNoRows(true);
            }; 
        }
        else if (tab === 'requests' && friendRequests.length === 0){

            setNoRows(true);
        }
        else if(tab === 'Add more' && allOtherUsers.length === 0){
            setNoRows(true);
        }

        setActiveTab(tab);
        setCurrentPage(1);
    };
    const handleCloseModal = () => {
        setShowModal(false); 
    };

    const renderPagination = (totalItems) =>
    {
        const pageCount = Math.ceil(totalItems / pageSize);
        const totalPages = Math.ceil(pageCount / 10);
        const currentGroup = Math.ceil(currentPage / 10);

        const handleNextGroup = () =>
        {
            setCurrentPage((currentGroup * 10) + 1);
        };

        const handlePrevGroup = () =>
        {
            setCurrentPage(((currentGroup - 2) * 10) + 1);
        };

      


        if (!totalItems || totalItems === 0) return null; // Hide buttons if totalItems is null or 0

        return (
            <div className="mt-3 d-flex justify-content-center">
                <Button onClick={handlePrevGroup} disabled={currentGroup === 1}>{'<'}</Button>
                {Array.from({ length: Math.min(10, pageCount - ((currentGroup - 1) * 10)) }, (_, i) => ((currentGroup - 1) * 10) + i + 1).map(page => (
                    <Button key={page} variant="light" bg='primary' onClick={() => handlePageChange(page)} className="mx-1">
                        {page}
                    </Button>
                ))}
                <Button bg='primary' onClick={handleNextGroup} disabled={currentGroup === totalPages}>{'>'}</Button>
            </div>
        );
    };
    const handleAcceptRequest = async(connectionId)=>{
    
        try {
            const fetchData = await fetch(`https://localhost:7207/api/RequestConnection/AcceptRequest?Id=${connectionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },


            });

            if (fetchData.ok){
                fetchData.json().then((data) => {
                    setApiMessage(data); 
                });
                setMessage(true);
                const requestId = friendRequests.find(request => request.connectionId === connectionId);
                const updatedRequests = friendRequests.filter(request => request.userId !== requestId.userId);
                setRequests(updatedRequests);
                
                const id = localStorage.getItem('userId');
                const currentDate = new Date();

                const notificationRequest = {
                    idNotification: '',
                    subject: 'Accepted',
                    body: message,
                    fromId: id,
                    toId:id,
                    type:'Friend Request',
                    typeId:'',
                    messageType: 'info',
                    dateTimestamp:currentDate
                  };
                  signalRHub.invoke("SendNotificationToUser", notificationRequest).catch(err => console.error(err));
            }
        } catch (error) {
            console.log("Error during accept request: ",error);
        }
    }

    const renderUsers = (users) =>
    {
        const usersArray = users || [];
        if (usersArray.length === 0) {
            return (
                <p className="w-100 lead text-center">No matching users found.</p>
            );
        }
        
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return "Invalid Date";
            }
            if(activeTab === 'friends'){
                return format(date, 'dd MMM, yyyy');
            }
            else if(activeTab === 'requests'){
                return format(date, 'dd MMM, yyyy | HH:mm');
            }
        };
       

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return users.slice(startIndex, endIndex).map(user => (
            <ListGroup.Item key={user.userId} className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center">
                    <img src={`data:image/${user.photoFormat};base64,${user.photo}`} alt={user.fullName} className="mr-3" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                    <span className="lead mx-2">{user.fullName}</span>
                    { activeTab === 'requests' &&
                    <>
                    {' | '}
                    <span className="lead mx-2">{formatDate(user.date)}</span>

                    </>
                    }
                    { activeTab === 'friends' &&
                         <>
                         {' | '}
                         <span className="lead mx-2">{formatDate(user.date)}</span>
                         </>
                    }
                </div>
                {activeTab === 'friends' &&
                <>
                    <div className='d-flex justify-content-between'>
                        <Link to={`/chat/${user.userId}`}>
                             <IoChatbubbleEllipsesOutline style={{fontSize: '35px',cursor:'hand'}} className='mr-2'/>
                        </Link>
                        <Dropdown  align={{lg:'end'}} show={showDropdown} onToggle={toggleDropdown} >
                            <Dropdown.Toggle as={CiCircleMore} className='text-primary' style={{cursor:'hand'}}  fontSize={35} id="dropdown-basic" />
                            <Dropdown.Menu>
                            <Dropdown.Item onClick={() =>handleRemoveClick(user.userId)}>Remove</Dropdown.Item>
                            <Link to={user.role === 'Doctor' ? `/profile-card/${user.userId}` : `/user-profile/${user.userId}`} className='mr-2'>
                                 <Dropdown.Item>View Profile</Dropdown.Item>
                           </Link>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                   
                    </>
                }
                {activeTab === 'requests' &&
                    <div className='d-flex justify-content-between'>
                        <Button variant="primary" className="mx-1" onClick={()=>handleAcceptRequest(user.connectionId)}>Accept</Button>
                        <Button variant="danger" className="mx-1" onClick={()=>handleRemoveRequest(user.connectionId)}>Reject</Button>
                        <Link to={user.role === 'Doctor' ? `/profile-card/${user.userId}` : `/user-profile/${user.userId}`} className='mr-2'>
                            <Button variant="secondary" className="mx-1">View Profile</Button>
                        </Link>
                    </div>
                }
                {activeTab === 'Add more' &&
                <>
                    <Link to={user.role === 'Doctor' ? `/profile-card/${user.userId}` : `/user-profile/${user.userId}`} className='mr-2'>
                        <MdVisibility style={{fontSize:'35px'}} />
                    </Link>
                 </>
                }
            </ListGroup.Item>
        ));
    };


    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredFriends = friends.filter(user =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredRequests = friendRequests.filter(user =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredOthers = allOtherUsers.filter(user =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

   
    return (
        <div className='container-fluid'>
            <Row className='h-100 w-100'>
                <Col className='h-100 w-100'>
                {message && (
                     <MessageComponent message={apiMessage}/>
                 )}
                    <Tab.Container id="friend-list-tabs" defaultActiveKey="friends" onSelect={(tab) => handleTabChange(tab)} >
                        <Row className="my-4 align-items-center mx-3">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">🔍</span>
                                </div>
                                <input type="text" className="form-control" placeholder="Search..." aria-label="Search" aria-describedby="basic-addon1"  onChange={handleSearch} />
                            </div>
                            <Nav variant="pills" className="ml-auto">
                                <Nav.Item>
                                    <Nav.Link eventKey="friends">Friends</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="requests">Friend Requests</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="Add more">Add Other Users</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Row>
                        <Tab.Content className='mx-3' style={{minHeight:'100vh'}}>
                            {noRows && (
                                <p className='w-100 lead text-center'>No data!</p>
                            )}
                           <Tab.Pane eventKey="friends">
                                <ListGroup>
                                    {renderUsers(filteredFriends)}
                                </ListGroup>
                                {renderPagination(filteredFriends.length)}
                            </Tab.Pane>
                            <Tab.Pane eventKey="requests">
                                <ListGroup>
                                    {renderUsers(filteredRequests)}
                                </ListGroup>
                                {renderPagination(filteredRequests.length)}
                            </Tab.Pane>
                            <Tab.Pane eventKey="Add more">
                                <ListGroup>
                                    {renderUsers(filteredOthers)}
                                </ListGroup>
                                {renderPagination(filteredOthers.length)}
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Col>
            </Row>
            <Modal show={showModal1} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you want to remove this person?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    No
                </Button>
                <Button variant="primary" onClick={handleConfirmRemove}>
                    Yes
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default FriendList;
