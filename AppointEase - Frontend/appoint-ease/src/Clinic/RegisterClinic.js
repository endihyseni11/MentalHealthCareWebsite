import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/Register.css';
import RegistrationLinks from '../RegistrationLinks';
import MessageComponent from '../Messages/MessageComponent';
const RegisterClinic = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    UserName: '',
    Name: '',
    Surname: null,
    Role: 'Clinic',
    Email: '',
    Password: '',
    Address: '',
    PhoneNumber: '',
    Location: '',
    CreatedDate: '',
    OtherDetails: '',
    Doctors: [],
  });
  const [errorMessage, setErrorMessage] = useState(null); // State for error message
  const [formErrors, setFormErrors] = useState({
    userName: '',
    name: '',
    email: '',
    password: '',
    address: '',
    phoneNumber: '',
    location: '',
    createdDate: '',
    otherDetails: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'userName':
      case 'name':
      case 'address':
      case 'location':
      case 'otherDetails':
        setFormErrors({
          ...formErrors,
          [fieldName]: value ? '' : 'This field is required',
        });
        break;
      
        case 'createdDate':
          // Check if the provided date is in the future
          const currentDate = new Date();
          const selectedDate = new Date(value);
          if (selectedDate > currentDate) {
            setFormErrors({
              ...formErrors,
              createdDate: 'Created date cannot be in the future',
            });
          } else {
            setFormErrors({
              ...formErrors,
              createdDate: '',
            });
          }
          break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setFormErrors({
          ...formErrors,
          email: emailRegex.test(value)
            ? ''
            : 'Please enter a valid email address (e.g., example@example.com)',
        });
        break;
      case 'password':
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        setFormErrors({
          ...formErrors,
          password: passwordRegex.test(value)
            ? ''
            : 'Password must contain one uppercase letter, one lowercase letter, one digit, one symbol, and must be at least 8 characters long',
        });
        break;
      case 'phoneNumber':
        const phoneNumberRegex = /^\d+$/;
        setFormErrors({
          ...formErrors,
          phoneNumber: phoneNumberRegex.test(value)
            ? ''
            : 'Please enter a valid phone number containing only numbers',
        });
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    for (const key in formData) {
      validateField(key, formData[key]);
    }

    // Check if any error exists
    for (const key in formErrors) {
      if (formErrors[key]) {
        return; // Stop submission if any error exists
      }
    }

    try {
      const convertKeysToPascalCase = (data) => {
        const convertedData = {};
        for (const key in data) {
          const pascalCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
          convertedData[pascalCaseKey] = data[key];
        }
        return convertedData;
      };

      const response = await fetch('https://localhost:7207/api/Clinic/CreateClinic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(convertKeysToPascalCase(formData)),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.succeeded === true) {
          console.log('Operation succeeded: true');
          setErrorMessage(responseData);
          console.log(responseData);
          navigate('/login');
        } else {
          console.log('Operation succeeded: false');
          setErrorMessage(responseData);
          console.log(responseData);
        }
      } else {
        console.error('Registration failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="container">
      <div className="card mt-4">
        <RegistrationLinks />
        <div className="card-body" style={{ marginTop: '10%' }}>
        {errorMessage && <MessageComponent message={errorMessage} />}
          <form onSubmit={handleSubmit}>
            <label htmlFor="userName" className="form-label">
              User Name
            </label>
            <input
              type="text"
              className="form-input"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              required
            />
            {formErrors.userName && (
              <p className="error-message">{formErrors.userName}</p>
            )}

            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-input"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            {formErrors.name && (
              <p className="error-message">{formErrors.name}</p>
            )}

            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-input"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {formErrors.email && (
              <p className="error-message">{formErrors.email}</p>
            )}

            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-input"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {formErrors.password && (
              <p className="error-message">{formErrors.password}</p>
            )}

            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-input"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            {formErrors.address && (
              <p className="error-message">{formErrors.address}</p>
            )}

            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              className="form-input"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
            {formErrors.phoneNumber && (
              <p className="error-message">{formErrors.phoneNumber}</p>
              )}        <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              type="text"
              className="form-input"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
            {formErrors.location && (
              <p className="error-message">{formErrors.location}</p>
            )}
    
            <label htmlFor="createdDate" className="form-label">
              Created Date
            </label>
            <input
              type="date"
              className="form-input"
              id="createdDate"
              name="createdDate"
              value={formData.createdDate}
              onChange={handleInputChange}
              required
            />
            {formErrors.createdDate && (
              <p className="error-message">{formErrors.createdDate}</p>
            )}
    
            <label htmlFor="otherDetails" className="form-label">
              Other Details
            </label>
            <input
              type="text"
              className="form-input"
              id="otherDetails"
              name="otherDetails"
              value={formData.otherDetails}
              onChange={handleInputChange}
              required
            />
            {formErrors.otherDetails && (
              <p className="error-message">{formErrors.otherDetails}</p>
            )}
    
            <div className="d-flex mt-3 justify-content-end">
              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}    

export default RegisterClinic;