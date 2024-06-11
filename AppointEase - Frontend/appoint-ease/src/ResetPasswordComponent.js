import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { jwtDecode } from 'jwt-decode';
const ResetPassword = () =>
{
    const { token } = useParams();
    const history = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userId, setUserId] = useState('');


    useEffect(() =>
    {
        if (token)
        {
            try
            {
                const decoded = jwtDecode(token);
                const _Id = decoded.UserId;
                const expirationTime = decoded.exp;
                if (expirationTime < Date.now() / 1000)
                {
                    alert("The time for changing password has expired. Please try again.");
                    history.push('/login');
                }
                else
                {
                    setUserId(_Id);
                    console.log(_Id);
                    console.log(decoded);
                }



            } catch (error)
            {
                console.error('Error decoding token:', error);
            }
        }
    }, [token]);

    const handleResetPassword = async (e) =>
    {
        e.preventDefault();

        if (password !== confirmPassword)
        {
            alert('Password doesnt match!');
            return;
        }

        try
        {
            const response = await fetch('https://localhost:7207/api/Authentication/ResetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId, newPassword: confirmPassword }),
            });

            if (response.ok)
            {
                alert('Fjalëkalimi u ndryshua me sukses!');
                history.push('/login'); // Redirekto pas ndryshimit të fjalëkalimit
            } else
            {
                const errorMessage = await response.text();
                alert(`Gabim gjatë ndryshimit të fjalëkalimit: ${errorMessage}`);
            }
        } catch (error)
        {
            console.error('Gabim gjatë ndryshimit të fjalëkalimit:', error);
        }
    };

    return (
        <div>

            <Container>
                <Row className="vh-100 w-100 d-flex justify-content-center align-items-center">
                    <Col md={8} lg={6} xs={12}>
                        <Card className="shadow">
                            <div className="border border-3 border-primary"></div>
                            <Card.Body>
                                <div className="mb-3 mt-md-4">
                                    <h2 className="fw-bold mb-2 text-uppercase ">Change your old password</h2>
                                    <p className=" mb-5">Please enter your new password!</p>
                                    <div className="mb-3">
                                        <Form onSubmit={handleResetPassword}>
                                            <Form.Group controlId="password">
                                                <Form.Label>New Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="New Password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="confirmPassword">
                                                <Form.Label>Confirm Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                />
                                            </Form.Group><br></br>
                                            <Button variant="primary" type="submit">
                                                Save Changes
                                            </Button>
                                        </Form>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

        </div>
    );
};

export default ResetPassword;
