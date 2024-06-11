import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../Sidebar';
import MessageComponent from '../Messages/MessageComponent'; // Import MessageComponent

const EditDoctor = ({ match }) => {
    const { id } = useParams();
    const [existingDoctor, setExistingDoctor] = useState({
        userName: '',
        name: '',
        surname: '',
        role: 'Doctor',
        personalNumber: '',
        email: '',
        password: null,
        phoneNumber: '',
        dateOfBirth: '',
        specialisation: '',
        gender: '',
        address: '',
        description: '',
        clinicId: '',
    });
    const [formErrors, setFormErrors] = useState({}); // State for form validation errors
    const [errorMessage, setErrorMessage] = useState(null); 

    useEffect(() => {
        console.log('Doctor ID:', id);

        const fetchExistingDoctor = async () => {
            try {
                const response = await fetch(`https://localhost:7207/api/Doctor/GetDoctorById?doctorId=${id}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched existing doctor data:', data);
                    setExistingDoctor(data);
                } else {
                    console.error('Failed to fetch existing doctor:', response.statusText);
                }
            } catch (error) {
                console.error('Error during fetch:', error);
            }
        };

        if (id) {
            fetchExistingDoctor();
        } else {
            console.warn('Doctor ID is missing.');
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExistingDoctor((prevDoctor) => ({
            ...prevDoctor,
            [name]: value,
        }));

        // Validate field on change
        validateField(name, value);
    };

    const validateField = (fieldName, value) => {
        // Implement validation rules for each field
        let errors = {};
        switch (fieldName) {
            case 'userName':
            case 'name':
            case 'surname':
            case 'address':
            case 'specialisation':
            case 'description':
                errors[fieldName] = value ? '' : 'This field is required';
                break;
            case 'personalNumber':
            case 'phoneNumber':
                errors[fieldName] = /^\d+$/.test(value) ? '' : 'Please enter a valid number';
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                errors[fieldName] = emailRegex.test(value) ? '' : 'Please enter a valid email address';
                break;
                case 'dateOfBirth':
                    const dob = new Date(value);
                    const today = new Date();
                    const age = today.getFullYear() - dob.getFullYear();
                    const monthDiff = today.getMonth() - dob.getMonth();
            
                    // Check if the user is at least 18 years old
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                      age--;
                    }
                    if (age < 21) {
                      setFormErrors({
                        ...formErrors,
                        dateOfBirth: 'You must be at least 21 years old',
                      });
                    } else {
                      setFormErrors({
                        ...formErrors,
                        dateOfBirth: '',
                      });
                    }
                    break;
            default:
                break;
        }
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            ...errors,
        }));
    };

    const handleUpdateDoctor = async () => {
        try {
            // Validate all fields before submission
            for (const key in existingDoctor) {
                validateField(key, existingDoctor[key]);
            }

            // Check if any error exists
            for (const key in formErrors) {
                if (formErrors[key]) {
                    return; // Stop submission if any error exists
                }
            }

            console.log('Updating Doctor:', existingDoctor);

            const response = await fetch(`https://localhost:7207/api/Doctor/UpdateDoctor/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(existingDoctor),
            });

            if (response.ok) {
                const updatedData = await response.json();
                if (updatedData.succeeded === true) {
                    console.log('Operation succeeded: true');
                    setErrorMessage(updatedData);
                    console.log(updatedData);
                    window.location.href = '/doctor-list';
                } else {
                    console.log('Operation succeeded: false');
                    setErrorMessage(updatedData);
                    console.log(updatedData);
                }
                // Handle successful update, e.g., redirect or display a success message
            } else {
                console.error('Failed to update doctor:', response.statusText);
                // Handle the error, e.g., display an error message
            }
        } catch (error) {
            console.error('Error during update:', error);
        }
    };

    return (
        <div className="col-py-9">
            <div className="row-md-1">
                <Sidebar userRole='Clinic' />
            </div>
            <div className="row-md-5 d-flex justify-content-center">
                <div className="w-75">
                    <h2>Update Doctor</h2>
                    {errorMessage && <MessageComponent message={errorMessage}/>}
                    <form>
                        <div className="form-group">
                            <label htmlFor="userName">User Name:</label>
                            <input type="text" id="userName" name="userName" value={existingDoctor.userName} onChange={handleInputChange} className={`form-control ${formErrors.userName ? 'is-invalid' : ''}`} />
                            {formErrors.userName && <div className="invalid-feedback">{formErrors.userName}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input type="text" id="name" name="name" value={existingDoctor.name} onChange={handleInputChange} className={`form-control ${formErrors.name ? 'is-invalid' : ''}`} />
                            {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="surname">Surname:</label>
                            <input type="text" id="surname" name="surname" value={existingDoctor.surname} onChange={handleInputChange} className={`form-control ${formErrors.surname ? 'is-invalid' : ''}`} />
                            {formErrors.surname && <div className="invalid-feedback">{formErrors.surname}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="personalNumber">Personal Number:</label>
                            <input type="number" id="personalNumber" name="personalNumber" value={existingDoctor.personalNumber} onChange={handleInputChange} className={`form-control ${formErrors.personalNumber ? 'is-invalid' : ''}`} />
                            {formErrors.personalNumber && <div className="invalid-feedback">{formErrors.personalNumber}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" value={existingDoctor.email} onChange={handleInputChange} className={`form-control ${formErrors.email ? 'is-invalid' : ''}`} />
                            {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number:</label>
                            <input type="text" id="phoneNumber" name="phoneNumber" value={existingDoctor.phoneNumber} onChange={handleInputChange} className={`form-control ${formErrors.phoneNumber ? 'is-invalid' : ''}`} />
                            {formErrors.phoneNumber && <div className="invalid-feedback">{formErrors.phoneNumber}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="dateOfBirth">Date of Birth:</label>
                            <input type="date" id="dateOfBirth" name="dateOfBirth" value={existingDoctor.dateOfBirth} onChange={handleInputChange} className={`form-control ${formErrors.dateOfBirth ? 'is-invalid' : ''}`} />
                            {formErrors.dateOfBirth && <div className="invalid-feedback">{formErrors.dateOfBirth}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="specialisation">Specialisation:</label>
                            <input type="text" id="specialisation" name="specialisation" value={existingDoctor.specialisation} onChange={handleInputChange} className={`form-control ${formErrors.specialisation ? 'is-invalid' : ''}`} />
                            {formErrors.specialisation && <div className="invalid-feedback">{formErrors.specialisation}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="gender">Gender:</label>
                            <br/>
                            <div className="btn-group" role="group">
                                <input type="radio" id="male" name="gender" value="male" onChange={handleInputChange} checked={existingDoctor.gender === 'male'} className="btn-check" />
                                <label htmlFor="male" className="btn btn-outline-primary">Male</label>
                                <input type="radio" id="female" name="gender" value="female" onChange={handleInputChange} checked={existingDoctor.gender === 'female'} className="btn-check" />
                                <label htmlFor="female" className="btn btn-outline-primary">Female</label>
                            </div>
                            {formErrors.gender && <div className="invalid-feedback">{formErrors.gender}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address:</label>
                            <input type="text" id="address" name="address" value={existingDoctor.address} onChange={handleInputChange} className={`form-control ${formErrors.address ? 'is-invalid' : ''}`} />
                            {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <input type="text" id="description" name="description" value={existingDoctor.description} onChange={handleInputChange} className={`form-control ${formErrors.description ? 'is-invalid' : ''}`} />
                            {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
                        </div>
                        <div className="form-group d-flex flex-column">
                            <button type="button" className="update-button btn btn-primary" onClick={handleUpdateDoctor}>
                                Update Doctor
                            </button>
                            <Link to="/doctor-list" className="btn btn-secondary mt-3">Back to Doctors List</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditDoctor;
