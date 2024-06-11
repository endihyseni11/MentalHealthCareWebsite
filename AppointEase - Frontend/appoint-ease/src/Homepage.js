import React from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import background from './Images/61804.jpg';
import background2 from './Images/3.jpg';
import Calendar from './Calendar';


const Homepage = () =>
{
    return (
        <>

            <header>

                <div
                    className="p-5 text-center bg-image bg-primary"
                    style={{
                        //backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        //backgroundImage: `url(${background2})`,
                        height: '400px',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="mask" style={{}}>
                        <div className="d-flex justify-content-center align-items-center h-100vh">
                            <div className="text-white">
                                <Col className="text-center">
                                    <h1>Welcome to HealthCare App</h1>
                                    <p className="lead">Providing quality healthcare solutions</p>
                                    <Button variant="outline-light" size="lg" href="/about-us">
                                        Learn More
                                    </Button>
                                </Col>

                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div
                className="homepage d-flex flex-column"
                style={{
                    overflowX: 'hidden'
                }}
            >

                <div className="py-5">
                    <div className='container' style={{ height: '100%' }}>
                        <Row className="justify-content-center align-items-center">
                            <Col className="text-center">
                                <h1>Our Services</h1>
                                <hr className="bg-primary" />
                                <p className="lead">
                                    Explore our wide range of healthcare services tailored to your needs. From finding experienced doctors to booking appointments, we provide comprehensive solutions to ensure your well-being.
                                </p>
                            </Col>
                        </Row>
                        <br></br>
                        <Row className="mt-5 justify-content-center mb-4">
                            <Col md={4}>
                                <Card className="mb-4 bg-primary text-white rounded">
                                    <Card.Body>
                                        <Card.Title>Find a Doctor</Card.Title>
                                        <hr className="bg-white" />
                                        <Card.Text>
                                            Search for experienced doctors in various specialties.
                                        </Card.Text>
                                        <Button variant="outline-light" href="/find-doctor">Find Now</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="mb-4 bg-primary text-white rounded">
                                    <Card.Body>
                                        <Card.Title>Book an Appointment</Card.Title>
                                        <hr className="bg-white" />
                                        <Card.Text>
                                            Easily schedule appointments with your preferred healthcare providers.
                                        </Card.Text>
                                        <Button variant="outline-light" href="/appointments">Book Now</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="mb-4 bg-primary text-white rounded">
                                    <Card.Body>
                                        <Card.Title>24h Emergency Service</Card.Title>
                                        <hr className="bg-white" />
                                        <Card.Text>
                                            Get immediate assistance with our 24-hour emergency service.
                                        </Card.Text>
                                        <Button variant="outline-light" href="/emergency">Call Now</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="mb-4 bg-primary text-white rounded">
                                    <Card.Body>
                                        <Card.Title>Online Consultations</Card.Title>
                                        <hr className="bg-white" />
                                        <Card.Text>
                                            Schedule online consultations with our healthcare professionals.
                                        </Card.Text>
                                        <Button variant="outline-light" href="/consultations">Get Started</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="mb-4 bg-primary text-white rounded">
                                    <Card.Body>
                                        <Card.Title>Health Check-ups</Card.Title>
                                        <hr className="bg-white" />
                                        <Card.Text>
                                            Maintain your health with regular check-ups by our experts.
                                        </Card.Text>
                                        <Button variant="outline-light" href="/check-ups">Learn More</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="mb-4 bg-primary text-white rounded">
                                    <Card.Body>
                                        <Card.Title>Health Education</Card.Title>
                                        <hr className="bg-white" />
                                        <Card.Text>
                                            Access informative resources for better health education.
                                        </Card.Text>
                                        <Button variant="outline-light" href="/education">Explore</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>


                    </div>
                </div>
            </div>

            <div className="py-5 bg-primary" >
                <div className='container' style={{ height: '100%' }}>

                    <Row className="justify-content-center align-items-center text-white">
                        <Col className="text-center">
                            <h1>Statistic</h1>
                            <hr className="bg-white" />
                            <p className="lead">
                                Below are some key statistics regarding our services
                            </p>
                        </Col>
                    </Row>

                    <div className="row justify-content-center">
                        <div className="col-md-3">
                            <div className="card text-center bg-primary text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Numri i pacientëve</h5>
                                    <h3>20</h3> {/* Vendosni numrin e pacientëve këtu */}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card text-center bg-primary text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Numri i klinikave </h5>
                                    <h3>30</h3> {/* Vendosni numrin e klinikave këtu */}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card text-center bg-primary text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Numri i doktorëve</h5>
                                    <h3>45</h3> {/* Vendosni numrin e doktorëve këtu */}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card text-center bg-primary text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Eksperienc Pune</h5>
                                    <h3>20 Vite</h3> {/* Vendosni numrin mesatar të viteve të përvojës këtu */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-5 ">
                <div className="container">
                    <Row className="justify-content-center align-items-center ">
                        <Col className="text-center">
                            <h1>Who Are We?</h1>
                            <hr className="bg-white" />

                        </Col>
                    </Row>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>

                    <div className="row gy-3 gy-md-4 gy-lg-0 align-items-lg-center">
                        <div className="col-12 col-lg-6 col-xl-5">
                            <img className="img-fluid rounded" loading="lazy" src={background2} alt=" Background Image" />
                        </div>
                        <div className="col-12 col-lg-6 col-xl-7">
                            <div className="row justify-content-xl-center">
                                <div className="col-12 col-xl-11">
                                    <p className="lead fs-4 text-secondary mb-3">We help people to build incredible brands and superior products. Our perspective is to furnish outstanding captivating services.</p>
                                    <p className="mb-5">We are a fast-growing company, but we have never lost sight of our core values. We believe in collaboration, innovation, and customer satisfaction. We are always looking for new ways to improve our products and services.</p>
                                    <div className="row gy-4 gy-md-0 gx-xxl-5X">
                                        <div className="col-12 col-md-6">
                                            <div className="d-flex">
                                                <div className="me-4 text-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
                                                        <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h2 className="h4 mb-3">Versatile Brand</h2>
                                                    <p className="text-secondary mb-0">We are crafting a digital method that subsists life across all mediums.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className="d-flex">
                                                <div className="me-4 text-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-fire" viewBox="0 0 16 16">
                                                        <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15Z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h2 className="h4 mb-3">Digital Agency</h2>
                                                    <p className="text-secondary mb-0">We believe in innovation by merging primary with elaborate ideas.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-5">
                <div className='container' style={{ height: '100%' }}>
                    <Row className="justify-content-center align-items-center ">
                        <Col className="text-center">
                            <h1>Register Right Now!</h1>
                            <hr className="bg-primary" />
                            <Button variant="primary" href="/register-patient">Register Now</Button>

                        </Col>
                    </Row>


                </div>
            </div>

        </>

    );
};

export default Homepage;
