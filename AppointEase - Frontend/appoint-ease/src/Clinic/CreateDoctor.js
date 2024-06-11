import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Css/CreateDoctor.css';
import Sidebar from '../Sidebar';
import MessageComponent from '../Messages/MessageComponent'; // Import MessageComponent

const CreateDoctor = (userId) => {
  const [doctors, setDoctors] = useState([]);
  const actualUserId = userId.userId;
  const [newDoctor, setNewDoctor] = useState({
    userName: '',
    name: '',
    surname: '',
    role: 'Doctor',
    personalNumber: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
    specialisation: '',
    gender: '',
    address: '',
    description: '',
    clinicId: actualUserId,
  });
  const [formErrors, setFormErrors] = useState({
    userName: '',
    name: '',
    surname: '',
    personalNumber: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
    specialisation: '',
    gender: '',
    address: '',
    description: '',
  });
  const [errorMessage, setErrorMessage] = useState(null); 

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('https://localhost:7207/api/Doctor/GetAllDoctors');
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else {
        console.error('Failed to fetch doctors:', response.statusText);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({
      ...newDoctor,
      [name]: value,
    });

    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'userName':
      case 'name':
      case 'surname':
      case 'address':
      case 'specialisation':
      case 'description':
      case 'gender':
        setFormErrors({
          ...formErrors,
          [fieldName]: value ? '' : 'This field is required',
        });
        break;
      case 'personalNumber':
      case 'phoneNumber':
        setFormErrors({
          ...formErrors,
          [fieldName]: /^\d+$/.test(value) ? '' : 'Please enter a valid number',
        });
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setFormErrors({
          ...formErrors,
          email: emailRegex.test(value) ? '' : 'Please enter a valid email address',
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
  };

  const handleCreateDoctor = async () => {
    for (const key in newDoctor) {
      validateField(key, newDoctor[key]);
    }

    // Check if any error exists
    for (const key in formErrors) {
      if (formErrors[key]) {
        return; // Stop submission if any error exists
      }
    }
    try {
      const response = await fetch('https://localhost:7207/api/Doctor/CreateDoctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDoctor),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.succeeded === true) {
          console.log('Operation succeeded: true');
          setErrorMessage(responseData);
          console.log(responseData);
          window.location.href = '/doctor-list';
        } else {
          console.log('Operation succeeded: false');
          setErrorMessage(responseData);
          console.log(responseData);
        }
      } else {
        console.error('Failed to create doctor:', response.statusText);
      }
    } catch (error) {
      console.error('Error during create:', error);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDoctor((prevDoctor) => ({
          ...prevDoctor,
          photoData: reader.result.split(",")[1],
          photoFormat: file.type.split("/")[1],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="col-py-9">
      <div className="row-md-1">
        <Sidebar userRole='Clinic' />
      </div>
      <div className="row-md-5 d-flex justify-content-center">
        <div className="w-75">
          <h2>Create Doctor</h2>
          {errorMessage && <MessageComponent message={errorMessage} />}
          <form>
            <div className="form-group">
              <label htmlFor="userName">User Name:</label>
              <input type="text" id="userName" name="userName" value={newDoctor.userName} onChange={handleInputChange} />
              {formErrors.userName && <p className="error-message">{formErrors.userName}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" value={newDoctor.name} onChange={handleInputChange} />
              {formErrors.name && <p className="error-message">{formErrors.name}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="surname">Surname:</label>
              <input type="text" id="surname" name="surname" value={newDoctor.surname} onChange={handleInputChange} />
              {formErrors.surname && <p className="error-message">{formErrors.surname}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="personalNumber">Personal Number:</label>
              <input type="number" id="personalNumber" name="personalNumber" value={newDoctor.personalNumber} onChange={handleInputChange} />
              {formErrors.personalNumber && <p className="error-message">{formErrors.personalNumber}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" value={newDoctor.email} onChange={handleInputChange} />
              {formErrors.email && <p className="error-message">{formErrors.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" value={newDoctor.password} onChange={handleInputChange} />
              {formErrors.password && <p className="error-message">{formErrors.password}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input type="text" id="phoneNumber" name="phoneNumber" value={newDoctor.phoneNumber} onChange={handleInputChange} />
              {formErrors.phoneNumber && <p className="error-message">{formErrors.phoneNumber}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth:</label>
              <input type="date" id="dateOfBirth" name="dateOfBirth" value={newDoctor.dateOfBirth} onChange={handleInputChange} />
              {formErrors.dateOfBirth && <p className="error-message">{formErrors.dateOfBirth}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="specialisation">Specialisation:</label>
              <input type="text" id="specialisation" name="specialisation" value={newDoctor.specialisation} onChange={handleInputChange} />
              {formErrors.specialisation && <p className="error-message">{formErrors.specialisation}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <br />
              <div className="btn-group" role="group">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  onChange={handleInputChange}
                  checked={newDoctor.gender === 'male'}
                  className="btn-check"
                  required
                />
                <label htmlFor="male" className="btn btn-outline-primary">
                  Male
                </label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  onChange={handleInputChange}
                  checked={newDoctor.gender === 'female'}
                  className="btn-check"
                  required
                />
                <label htmlFor="female" className="btn btn-outline-primary">
                  Female
                </label>
                {formErrors.gender && <p className="error-message">{formErrors.gender}</p>}
              </div>
              <br />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <input type="text" id="address" name="address" value={newDoctor.address} onChange={handleInputChange} />
              {formErrors.address && <p className="error-message">{formErrors.address}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea id="description" name="description" value={newDoctor.description} onChange={handleInputChange}></textarea>
              {formErrors.description && <p className="error-message">{formErrors.description}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="photo">Photo:</label>
              <input type="file" id="photo" name="photo" accept="image/*" onChange={handlePhotoChange} />
            </div>
            <div className="form-group d-flex flex-column">
            <button type="button" className="create-button btn btn-primary" onClick={handleCreateDoctor}>
              Create Doctor
            </button>
            <Link to="/doctor-list" className="btn btn-secondary mt-3">Back to Doctors List</Link>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default CreateDoctor;

