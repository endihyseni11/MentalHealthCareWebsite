import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { BiErrorCircle } from 'react-icons/bi'; 

const UnauthorizedPage = () => {
  return (
    <Container>
      <Row className="container-fluid justify-content-center">
        <Col xs={10} md={6}>
          <div className="mt-5 text-center">
            <h1>This page is not accessible</h1>
            <BiErrorCircle size={50} color="red" /> 
            <p>You don't have access to view this page.</p>
            <Button variant="primary" href="/login">Login</Button> 
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UnauthorizedPage;
