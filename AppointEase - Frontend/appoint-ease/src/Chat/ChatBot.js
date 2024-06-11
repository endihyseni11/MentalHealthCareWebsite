import React, { useEffect, useState } from 'react';
import { Container, Form, Button,Card,Dropdown  } from 'react-bootstrap';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { format } from 'date-fns';
import NotificationService from '../SiganlR/NotificationSender';
import sendNotification from '../SiganlR/NotificationSender';

function ChatBot({signalR,navigateToChat}) {
  const [messages, setMessages] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showSubServices, setShowSubServices] = useState(false);
  const [selectedSubService, setSelectedSubService] = useState(null);

  useEffect(() => {
    try {
      const handleChatbotResponse = (response) => {
        const responseText = JSON.parse(response);
        if(responseText.isFreeQuestion !== undefined || responseText.isFreeQuestion === true){
            animateMessage(responseText.message,[]);
            return;
        }
        
        const message = responseText.Result.message;
        const date = responseText.Result.date;
        const time = responseText.Result.time;
        const problemSolutionInformation = responseText.Result.problemSolutionInformation;
        if(selectedService === 'Problem Solution' || selectedService === 'Find a Doctor'){
  
          const doctorsresponse = responseText.Result.doctors;
          const messageText = (selectedService === 'Problem Solution')?message:'';
          if (problemSolutionInformation !== undefined) {
            animateMessage(`${problemSolutionInformation}\n\n${messageText}`,doctorsresponse);
          } else {
            animateMessage(message,doctorsresponse);
          }
         
        }
        
        else {
           animateMessage(message,[]);
        }
  
      };
    
      signalR.on('ChatbotResponse', handleChatbotResponse);
    
      // Clean up the event listener when the component unmounts
      return () => {
        signalR.off('ChatbotResponse', handleChatbotResponse);
      };
    } catch (error) {
      console.log(error);
    }
    
  }, [signalR,selectedService]);

  const animateMessage = (text,doctors) => {
    const chars = text.split('') ?? []; 
    const currentDate = new Date();

    let updatedMessage = ''; // Një varg i zbrazët për të ruajtur karakteret e animuara

    setMessages(prevMessages => [...prevMessages, { sender: 'Chatbot', text: '' ,doctors: [],time:'',date:''}]);

    chars.forEach((char, index) => {
        setTimeout(() => {
            updatedMessage += char;
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages[prevMessages.length - 1].text = updatedMessage; 
                updatedMessages[prevMessages.length - 1].doctors = doctors; 
                updatedMessages[prevMessages.length - 1].time = format(currentDate, 'HH:mm'); 
                updatedMessages[prevMessages.length - 1].date = format(currentDate, 'dd MMM, yyyy'); 
                return updatedMessages;
            });
        }, 50 * (index + 1)); 
    });
};


  const services = {
    'Technical Support': {
      'Application Errors': ['Login Issues', 'Crashes', 'UI Errors'],
      'Server Connectivity': ['Connection Drops', 'Latency Issues', 'Firewall Problems'],
      'Database Access': ['SQL Queries', 'Connection Pooling', 'Data Integrity']
    },
    'Problem Solution': {
      'Common Ailments': ['Fever', 'Headache', 'Stomach ache'],
      'Injuries': ['Sprain', 'Cut', 'Burn'],
      'Specific Conditions': ['Diabetes', 'Asthma', 'Hypertension']
    },
    'Find a Doctor': {
      'General Practitioner': ['Internal medicine', 'Pediatrics', 'Family medicine','General Practitioner'],
      'Specialists': ['Cardiologist', 'Dermatologist', 'Orthopedic surgeon','Specialists'],
      'Mental Health Professional': ['Psychiatrist', 'Psychologist', 'Licensed therapist']
    },
    'Medical Assistance': {
      'Emergency Services': ['911', 'Local emergency rooms'],
      'Medical Advice Hotline': ['Local medical advice hotline number'],
      'Pharmacy Information': ['Local pharmacy contact information']
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    if (message) {

      const currentDate = new Date();
      const time = format(currentDate, 'HH:mm'); 
      const date = format(currentDate, 'dd MMM, yyyy'); 
      setMessages([...messages, { sender: 'You', text: message,time:time,date: date }]);

      const chatbotRequest = {
        UserId: localStorage.getItem('userId'), 
        Problem: selectedService || '', 
        Options: selectedSubService ,
        FreeTextQuestion: message
      };
      signalR.invoke('ChatbotServiceResponse', chatbotRequest).catch(err => console.error(err));

      e.target.reset();

    }
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
   
    setShowSubServices(true);

    const chatbotRequest = {
      UserId: localStorage.getItem('userId'), 
      Problem: service,
      Options: '',
      FreeTextQuestion: '' 
    };
    signalR.invoke('ChatbotServiceResponse', chatbotRequest).catch(err => console.error(err));
  };

  const handleSubServiceClick = (subService) => {
    const chatbotRequest = {
      userId: localStorage.getItem('userId'), 
      problem: selectedService || '', 
      options: subService ,
      freeTextQuestion: ''
    };
    signalR.invoke('ChatbotServiceResponse', chatbotRequest).catch(err => console.error(err));

  };

  const handleReset = () => {
    setMessages([]);
    setSelectedService(null);
    setShowSubServices(false);
    setSelectedSubService(null);
  };


  const handleButtonClick = (id) => {
    navigateToChat(`/profile-card/${id}`); // Navigate to the target route
  };


  return (
    <Container fluid>
        <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center my-2">
          <BsFillChatDotsFill size={30} />
          <span style={{ marginLeft: '10px' }}>AppointEase Bot</span>
        </div>
        <Dropdown style={{ marginLeft: '10px' }}>
          <Dropdown.Toggle variant="primary" id="dropdown-services">
            Services
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {Object.keys(services).map((service, index) => (
              <Dropdown.Item key={index} onClick={() => handleServiceClick(service)}>
                {service}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div style={{ height: '70vh', width: '100%', overflowY: 'scroll', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px' }}>
        {messages?.map((message, index) => (
          <>
          <div key={index} className={`m-3 ${message.sender === "You" ? 'bg-secondary' : 'bg-primary'} rounded text-white p-3`} style={{ minHeight: '50px' }}>
            <strong>{message?.sender}: </strong>
            <div>
              {message?.text?.split('\n').map((line, lineIndex) => (
                <p key={lineIndex} className="message-text">
                  {line?.split('').map((char, charIndex) => (
                    <span key={charIndex} style={{ animationDelay: `${charIndex * 0.05}s` }}>{char}</span>
                  ))}
                </p>
              ))}
            </div>
            <small className="text-muted mt-auto">{message.time}</small>
          </div>
          {message?.doctors && message.doctors.length > 0 && (
              <div className="m-3">
                <h5>Doctors:</h5>
                {message.doctors.map((doctor, index) => (
                  <Card key={index} className="mb-3">
                    <Card.Body>
                      <Card.Title>{doctor?.doctorName}</Card.Title>
                      <Card.Text>Specialization:<br />{doctor?.specialization}</Card.Text>
                      <Card.Text>Location:<br />{doctor?.location}</Card.Text>
                      <Card.Text>Email:<br />{doctor?.email}</Card.Text>
                      <Card.Text>Phone:<br />{doctor?.phone}</Card.Text>
                      <Button variant="secondary" onClick={()=>handleButtonClick(doctor.doctorId)}>
                        View Profile
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
              </div>
              )}
          </>
        ))}
        {showSubServices && selectedService &&
          <div className="m-3 bg-primary rounded text-white p-3" style={{ minHeight: '50px' }}>
            <p>Choose an option:</p>
            {Object.keys(services[selectedService]).map((option, index) => (
              <Button key={index} variant="secondary" className="mr-2 mb-2" onClick={() => setSelectedSubService(option)}>
                {option}
              </Button>
            ))}
          </div>
        }
        
        {selectedSubService && typeof services[selectedService][selectedSubService] === 'object' &&
          <div className="m-3 bg-primary rounded text-white p-3" style={{ minHeight: '50px' }}>
            <p>Choose a sub-option for {selectedSubService}:</p>
            {Object.keys(services[selectedService][selectedSubService]).map((subOption, index) => (
              <Button key={index} variant="secondary" className="mr-2 mb-2" onClick={() => handleSubServiceClick(services[selectedService][selectedSubService][subOption])}>
                {services[selectedService][selectedSubService][subOption]}
              </Button>
            ))}
          </div>
        }
        
      </div>
      <Form onSubmit={handleSendMessage} className='w-100'>
        <Form.Group className="d-flex flex-column align-items-center justify-content-between">
          <Form.Control type="text" name="message" placeholder="Type your message..." />
          <div className='my-2 d-flex'>
            <Button variant="danger" className="mr-2 w-100" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="primary" type="submit" className="mr-2 w-100">
              Send
            </Button>
          </div>
        </Form.Group>
      </Form>
    </Container>
  );
}

export default ChatBot;
