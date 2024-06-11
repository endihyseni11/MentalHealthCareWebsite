import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../Sidebar';
import MessageComponent from '../Messages/MessageComponent';

const ClinicProfile = ({ userId }) => {
  const [clinic, setClinic] = useState(null);
  const [updatedClinic, setUpdatedClinic] = useState({
    userName: '',
    name: '',
    surname: null,
    role: 'Clinic',
    email: '',
    password: '',
    address: '',
    phoneNumber: '',
    location: '',
    createdDate: '',
    otherDetails: '',
    photoData: null,
    photoFormat: null,
  });
  const [errorMessage, setErrorMessage] = useState(null); 
  const [formErrors, setFormErrors] = useState({
    userName: '',
    name: '',
    email: '',
    address: '',
    phoneNumber: '',
    location: '',
    otherDetails: '',
  });

  useEffect(() => {
    const fetchClinicData = async () => {
      try {
        const response = await fetch(`https://localhost:7207/api/Clinic/GetClinicById?clinicId=${userId}`);

        if (response.ok) {
          const clinicData = await response.json();
          setClinic(clinicData);
          setUpdatedClinic(clinicData);
        } else {
          console.error('Failed to fetch clinic details:', response.statusText);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    };
    fetchClinicData();
  }, [userId]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://localhost:7207/api/Clinic/UpdateClinic/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClinic),
      });

      if (response.ok) {
        const updatedData = await response.json();
        if (updatedData.succeeded === true) {
          console.log('Operation succeeded: true');
          setErrorMessage(updatedData);
          console.log(updatedData);
        } else {
          console.log('Operation succeeded: false');
          setErrorMessage(updatedData);
          console.log(updatedData);
        }
        setClinic((prevClinic) => ({
          ...prevClinic,
          otherDetails: updatedData.otherDetails,
        }));
      } else {
        const errorResponse = await response.json();
        console.error('Failed to update clinic:', errorResponse);
      }
    } catch (error) {
      console.error('Error during update:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedClinic((prevClinic) => ({
      ...prevClinic,
      [name]: value,
    }));

    // Validate each field as it's being typed
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
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setFormErrors({
          ...formErrors,
          email: emailRegex.test(value)
            ? ''
            : 'Please enter a valid email address (e.g., example@example.com)',
        });
        break;
      case 'phoneNumber':
        // Check if the phone number contains only numbers
        const isValidPhoneNumber = /^\d+$/.test(value);
        setFormErrors({
          ...formErrors,
          phoneNumber: isValidPhoneNumber
            ? ''
            : 'Please enter a valid phone number containing only numbers',
        });
        break;
      default:
        break;
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedClinic((prevClinic) => ({
          ...prevClinic,
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
      <div className="row-md-5 d-flex justify-content-center" style={{marginTop:'-5%'}}>
        <div className="w-75">
          <div className="my-5">
            <h2>Clinic Profile</h2>
            <hr />
          </div>
          {errorMessage && <MessageComponent message={errorMessage} />}
          <form className="file-upload" onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                className="form-control"
                name="userName"
                value={updatedClinic.userName}
                onChange={handleInputChange}
                required
              />
              {formErrors.userName && (
                <p className="error-message">{formErrors.userName}</p>
              )}
            </div>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={updatedClinic.name}
                onChange={handleInputChange}
                required
              />
              {formErrors.name && (
                <p className="error-message">{formErrors.name}</p>
              )}
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={updatedClinic.email}
                onChange={handleInputChange}
                required
              />
              {formErrors.email && (
                <p className="error-message">{formErrors.email}</p>
              )}
            </div>
            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={updatedClinic.address}
                onChange={handleInputChange}
                required
              />
              {formErrors.address && (
                <p className="error-message">{formErrors.address}</p>
              )}
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="text"
                className="form-control"
                name="phoneNumber"
                value={updatedClinic.phoneNumber}
                onChange={handleInputChange}
                required
              />
              {formErrors.phoneNumber && (
                <p className="error-message">{formErrors.phoneNumber}</p>
              )}
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                className="form-control"
                name="location"
                value={updatedClinic.location}
                onChange={handleInputChange}
                required
              />
              {formErrors.location && (
                <p className="error-message">{formErrors.location}</p>
              )}
            </div>
            <div className="form-group">
              <label>Created Date *</label>
              <input
                type="text"
                className="form-control"
                name="createdDate"
                value={updatedClinic.createdDate}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Other Details *</label>
              <input
                type="text"
                className="form-control"
                name="otherDetails"
                value={updatedClinic.otherDetails}
                onChange={handleInputChange}
                required
              />
              {formErrors.otherDetails && (
                <p className="error-message">{formErrors.otherDetails}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="photo">Photo:</label>
              <input type="file" id="photo" name="photo" accept="image/*" onChange={handlePhotoChange} />
            </div>
            <button type="submit" className="btn btn-primary w-100">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClinicProfile;
