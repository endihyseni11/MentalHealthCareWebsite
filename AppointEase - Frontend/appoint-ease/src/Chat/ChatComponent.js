import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, ListGroup, Image, InputGroup, Button } from 'react-bootstrap';
import useSignalRHub from '../SiganlR/SignalRComponent'; 
import { Spinner } from 'react-bootstrap';
import Sidebar from '../Sidebar';
import { useParams,Link } from 'react-router-dom';

function UserList({ users, handleUserClick, searchQuery }) {
  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user-list">
      <h5 className="mb-3">Friends List</h5>
      {users.length === 0 ? (
        <div className='d-flex flex-wrap text-center justify-content-center'>
          <p className='w-100'>You don't have any friends yet.</p>
          <Link to="/user-list">
            <Button className='mr-2'>
              Add Friends
            </Button>
          </Link>
        </div>
      ) : (
        filteredUsers.length === 0 ? (
          <div className="d-flex flex-wrap text-center justify-content-center">
            <p className="w-100">No matching users found.</p>
            <Link to="/user-list">
              <Button className="mr-2">Add Friends</Button>
            </Link>
          </div>
        ) : (
          <ListGroup>
            {users.map(user => (
              <ListGroup.Item
                key={user.userId}
                action
                onClick={() => handleUserClick(user)}
                className="d-flex align-items-center"
              >
                <Image src={`data:image/${user.photoFormat};base64,${user.photo}`} alt={user.fullName} className="avatar mr-2" roundedCircle style={{ width: '70px', height: '70px' }} />
                <span>{user.fullName}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )
      )}
    </div>
  );
}

function MessageList({ messages, currentUser,datalength }) {

  const id = localStorage.getItem('userId');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(messages.length === 0 && datalength === true); // Vendos loading në true nëse nuk ka mesazhe
   }, [messages]);



  return (
    <div className="message-list">
       {loading && 
             <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100%' }}>
             <Spinner animation="border" role="status">
               <span className="sr-only">Loading...</span>
             </Spinner>
           </div>
        }

      {currentUser && (
        <div className="">
          <div className="">
            {messages.map((message, index) => (
              <div key={index} className='row'>
                <div className={`message ${message.user === id ? 'text-right' : 'text-left'}`}>
                  <div key={index} className={`${message.user === id ? 'bg-secondary' : 'bg-primary'} w-auto my-1 p-2 rounded text-white  ${message.user === id ? 'float-right' : 'float-left'}`} style={{maxWidth: "50%",minWidth:"20%"}}>
                    <p className="user">{message.user == id? message.senderName : message.receiverName}</p>
                    <p className="text-white m-0">{message.text}</p>
                    {message.time && <p className="text-muted m-0">{message.time}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


function ChatApp({signalrConnection}) {
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isTyping,SetTyping]= useState(false);
  const [isNullValue,SetNullValue]= useState(false);
  const { personId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [messagesFetched, setMessagesFetched] = useState(false);
  const [noData, noDataSet] = useState(true);

  useEffect(() => {
    if (signalrConnection) {
      const handleMessageReceived = (messageRespons) => {
        const dateObject = new Date(messageRespons.timestamp);
        const time = `${dateObject.getHours()}:${String(dateObject.getMinutes()).padStart(2, '0')}`;
        const dateFormatted = dateObject.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        const newMessage = {
          text: messageRespons.content,
          user: messageRespons.sender,
          senderName: messageRespons.senderName,
          receiverName: messageRespons.receiverName,
          time: time,
          date: dateFormatted
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
      };
  
      const handleTypingStatus = (typingStatus) => {
        console.log(typingStatus);
        SetTyping(typingStatus);
      };
  
      // Subscribe to "ReceiveMessage" event
      signalrConnection.on("ReceiveMessage", handleMessageReceived);
      
      // Subscribe to "SetIsTyping" event
      signalrConnection.on("SetIsTyping", handleTypingStatus);
  
      // Clean up subscriptions when component unmounts or signalrConnection changes
      return () => {
        signalrConnection.off("ReceiveMessage", handleMessageReceived);
        signalrConnection.off("SetIsTyping", handleTypingStatus);
      };
    }
  }, [signalrConnection]);
  
  useEffect(() => {
    if (selectedUser) {
      GetMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    const userFriendList = async () =>{
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
    userFriendList();
  },[])

  const GetMessages = async() => {
    const loginId = localStorage.getItem('userId');
    try {
      const response = await fetch(`https://localhost:7207/api/Chat/messages?senderId=${loginId}&receiverId=${selectedUser.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        if(data.length === 0){
          SetNullValue(true);
          noDataSet(true);
        }
        
        const formattedMessages = data.map(message => {
          const dateObject = new Date(message.timestamp);
  
          const time = `${dateObject.getHours()}:${String(dateObject.getMinutes()).padStart(2, '0')}`;
  
          const date = `${dateObject.getDate()}-${dateObject.getMonth() + 1}-${dateObject.getFullYear()}`;
  
          return {
            text: message.content,
            user: message.sender,
            senderName: message.senderName,
            receiverName: message.receiverName,
            time: time,
            date: date
          };
        });
        setMessages(formattedMessages);
        noDataSet(false);
      } else {
        noDataSet(true);
        console.error('Error fetching messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  const handleInputChange = async (e) => {
    setInputText(e.target.value);
    if ( e.target.value.trim() !== '') {
      setStatusTyping(true);
    } else if ( e.target.value.trim() === '') {
      setStatusTyping(false);
    }
  };
  const setStatusTyping = async (value)=>{
    const userId = selectedUser.userId;
    try {
      await signalrConnection.invoke("NotifyTyping", userId, value);
    } catch (err) {
      console.error(err);
    }
  }

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleMessageSend = async() => {
    if (inputText.trim() === '' || !selectedUser) return;

    const id = localStorage.getItem('userId');
    const messageRequest = {
      senderId: id ,
      receiverId: selectedUser.userId,
      message: inputText.trim(),
      timestamp:  new Date().toISOString().slice(0, -1)
    };

    await signalrConnection.invoke("SendMessage", messageRequest).catch(err => console.error(err));
    setStatusTyping(false);
    setInputText('');
  };

  const scrollToBottom = () => {
    const messageContainer = document.getElementById('messageContainer');
    if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
};


useEffect(() => {
  scrollToBottom();
}, [messages]);

useEffect(() => {
  if (personId !== null) {
    const selectedUser = friends.find(user => user.userId === personId);
    if (selectedUser) {
      setSelectedUser(selectedUser);
  console.log(personId)
    }
  }
}, [personId,friends]);

const handleSearching = (value) => {
  setSearchQuery(value);
};
  return (
    <Container fluid className="py-3" style={{ backgroundColor: "#CDC4F9",minHeight:'100vh'}}>
              <Sidebar userRole='Patient' />

      <Row >
       
        <Col md={4}>
          <div className="card">
            <div className="card-body">
              <InputGroup className="mb-3">
                  <div className="input-group-prepend">
                     <span className="input-group-text" id="basic-addon1">🔍</span>
                  </div>
                 <input type="text" className="form-control" placeholder="Search..." onChange={(e) => handleSearching(e.target.value)} />
              </InputGroup>
              <UserList
                users={friends}
                handleUserClick={handleUserClick}
                isNull = {isNullValue}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </Col>
        <Col md={8}>
          {selectedUser && (
           <div className="container card">
           <div className="row w-100">
             <div className="card-header w-100">
               <img src={selectedUser.image} alt={selectedUser.name} className="avatar mr-2" />
               {selectedUser.name}
             </div>
           </div>
           <div id="messageContainer" 
           className="row h-100 w-100" style={{ maxHeight: '100%', overflowY: 'scroll',minHeight:'100%' }}
          >
            
              <MessageList messages={messages} currentUser={selectedUser} datalength={noData}/>
              {isTyping && (
    <div
      style={{
        position: 'sticky',
        bottom: '0',
        zIndex: '1',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        width:'auto'
      }}
    >
      <Spinner animation="grow" variant="primary" size="sm" />
      <p style={{ marginLeft: '10px', fontSize: '15px', color: '#666' }}>{selectedUser.name} is typing...</p>
    </div>
  )}
           </div>
           <div className="row w-100">
           
             <div className="card-footer">
               <InputGroup>
                 <input
                   type="text"
                   className="form-control"
                   placeholder={`Message ${selectedUser.name}`}
                   value={inputText}
                   onChange={handleInputChange}
                 />
                 <Button variant="primary" onClick={()=>handleMessageSend()}>Send</Button>
               </InputGroup>
             </div>
           </div>
         </div>
         
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ChatApp;
