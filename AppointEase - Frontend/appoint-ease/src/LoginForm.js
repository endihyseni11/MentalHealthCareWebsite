import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import EmailConfirmationMessage from './EmailConfirmationMessage';
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { createBrowserHistory } from 'history';
import MessageComponent from './Messages/MessageComponent';


const LoginForm = ({ handleLogin }) =>
{
  const history = createBrowserHistory ();
  const [message, setMessage] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);

  const [showEmailConfirmationMessage, setShowEmailConfirmationMessage] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [showForgotPasswordOffCanvas, setShowForgotPasswordOffCanvas] = useState(false);

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) =>
  {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) =>
  {
    e.preventDefault();

    try
    {
      const response = await fetch('https://localhost:7207/api/Authentication/SignIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok)
      {
        const jsonResponse = await response.json();
        const token = jsonResponse.token;
        const decodedToken = jwtDecode(token);
        const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        const username = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const emailConfirmation = decodedToken.EmailConfirmation;
        const photoData = decodedToken.Photodata;
        const photoFormat = decodedToken.Photoformat;
        const name = decodedToken.Name;
        const Surname = decodedToken.Surname;

        if (emailConfirmation === "False")
        {
          setShowEmailConfirmationMessage(true);
          console.log("False");
          setLoginFailed(false);
        } else
        {
          setShowEmailConfirmationMessage(false);

          localStorage.setItem('token', decodedToken);
          localStorage.setItem('userId', userId);
          localStorage.setItem('role', role);
          localStorage.setItem('name', name);
          localStorage.setItem('surname', Surname);
          localStorage.setItem('photodata', photoData);
          localStorage.setItem('photoformat', photoFormat);

          handleLogin(role, decodedToken, userId);
          console.log('Login successful');
          console.log(role);
          console.log(userId);
          
        }

      } else
      {
        setShowEmailConfirmationMessage(false);
        setLoginFailed(true);
        console.error('Login failed');
      }
    } catch (error)
    {
      console.error('Error during login:', error);
    }
  };

  const handleForgotPasswordClick = () =>
  {
    setShowForgotPasswordOffCanvas(true);
  };

  const handleForgotPasswordEmailChange = (e) =>
  {
    setForgotPasswordEmail(e.target.value);
  };

  const handleSubmitForgotPassword = async (e) =>
  {
    e.preventDefault()
    //
    if (forgotPasswordEmail !== null)
    {
      const response = await fetch(`https://localhost:7207/api/Authentication/ForgetPassword?email=${forgotPasswordEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok)
      {
        response.json().then((data) => {
          setApiMessage(data); 
          if(data.succeeded){
            handleCloseForgotPassword();
          }
          else{
            setMessage(true);
          }
      });
      }
    }

  };

  const handleCloseForgotPassword = () =>
  {
    setShowForgotPasswordOffCanvas(false);
  };

  return (
    <div>
      <Container>
    
        <Row className="vh-100 w-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <Card className="shadow">
              <div className="border border-3 border-primary"></div>
              <Card.Body>
                {showEmailConfirmationMessage && (
                  <div className="alert alert-warning" role="alert">
                    <EmailConfirmationMessage />
                  </div>
                )}
                {loginFailed && <div className="alert alert-danger mt-3" role="alert">Login failed. Please check your credentials and try again.</div>}

                <div className="mb-3 mt-md-4">
                  <h2 className="fw-bold mb-2 text-uppercase ">Login to AppointEase</h2>
                  <p className=" mb-5">Please enter your login and password!</p>
                  <div className="mb-3">
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" >
                        <Form.Label className="text-center">
                          UserName
                        </Form.Label>
                        <Form.Control type="text" placeholder="UserName" id="username" name="username" value={formData.username} onChange={handleInputChange} required />
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                      >
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" id="password" name="password" value={formData.password} onChange={handleInputChange} required />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                      >
                        <p className="small" style={{ cursor: 'pointer' }}>
                          <a className="text-primary " onClick={handleForgotPasswordClick}>
                            Forgot password?
                          </a>
                        </p>
                      </Form.Group>
                      <div className="d-grid">
                        <Button variant="primary" type="submit">
                          Login
                        </Button>
                      </div>
                    </Form>
                    <div className="mt-3">
                      <p className="mb-0  text-center">
                        Don't have an account?{" "}
                        <a href="/register-patient" className="text-primary fw-bold">
                          Sign Up
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Offcanvas  show={showForgotPasswordOffCanvas} onHide={handleCloseForgotPassword} placement="top" className='h-50'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Please enter your email address below. We'll send you a link to reset your password if your account exists.</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='h-100'>
          <>
          {message && (
          <MessageComponent message={apiMessage}/>
         )}
            <form onSubmit={handleSubmitForgotPassword}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input type="email" className="form-control" id="email" value={forgotPasswordEmail} onChange={handleForgotPasswordEmailChange} required />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </>
        </Offcanvas.Body>
      </Offcanvas >
    </div >

  );
};

export default LoginForm;
