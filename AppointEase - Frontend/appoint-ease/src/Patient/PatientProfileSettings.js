import bg from '../Images/4.png'
import {Modal} from 'react-bootstrap'
import React, { useState,useEffect } from 'react';
import MessageComponent from '../Messages/MessageComponent';
import Sidebar from '../Sidebar';

function ProfileSettings({ patientId }) {

    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState(false);
    const [apiMessage, setApiMessage] = useState(null);
    const [errors, setErrors] = useState({});
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        name: '',
        surname: '',
        personalNumber: '',
        email: '',
        address: '',
        phoneNumber: '',
        password: null,
        gender: '',
        dateOfBirth: '',
        photoData:null,
        photoFormat:null,
        role: 'Patient',
    });

    const [newPassword, setNewPassword] = useState({
        password: '',
        confirmPassword: '',
        oldPassword: ''
    });


    useEffect(() =>
    {
        const fetchData = async () =>
        {
            try
            {
                console.log(patientId);
                const response = await fetch(`https://localhost:7207/api/Patient/GetPatientById/?patientId=${patientId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok)
                {
                    const patientData = await response.json();
                    setFormData(patientData);
                } else
                {
                    console.error('Failed to fetch patient data:', response.statusText);
                }
            } catch (error)
            {
                console.error('Error during fetching patient data:', error);
            }
        };

        fetchData();
    }, [patientId]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    photoData: reader.result.split(",")[1],
                    photoFormat: file.type.split("/")[1]
                }));
            };
            reader.readAsDataURL(file);
        }
    };


    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm(); 
        console.log(validateForm);
        if (Object.keys(validationErrors).length === 0) {
            try
            {
                const response = await fetch(`https://localhost:7207/api/Patient/UpdatePatient/${patientId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok)
                {
                    console.log(response.statusText);
                    response.json().then((data) => {
                        setApiMessage(data); 
                    });
                    setMessage(true);
                } else
                {
                    console.error('Failed to update Patient:', response.statusText);
                }
            } catch (error)
            {
                console.error('Error during update:', error);
            }

        } else {
            setErrors(validationErrors);
        }
    };

    const validateForm = () => {
        let validationErrors = {};
        Object.keys(formData).forEach(key => {
            if (key !== 'password' && key !== 'photoData' && key !== 'photoFormat') {
                if (!formData[key] && formData[key] !== 0) {
                    validationErrors[key] = `${key} cannot be empty or null`;
                }
            }
        });
        if (!/^\d{10}$/.test(formData.personalNumber)) {
            validationErrors.personalNumber = 'Personal Number must be 10 digits';
        }
        if (formData.gender !== 'Male' && formData.gender !== 'Female') {
            validationErrors.gender = 'Please select a valid gender (Male or Female)';
        }
        const today = new Date();
        const dob = new Date(formData.dateOfBirth);
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 16) {
            validationErrors.dateOfBirth = 'Invalid age (you must be over 16 years old)';
        }
        return validationErrors;
    };
    
 //password 

 const handleChangePassword = (e) => {
    const { name, value } = e.target;
    
    setNewPassword({ ...newPassword, [name]: value });
    setPasswordMatchError(newPassword.password !== value);
    if (name === 'oldPassword' && !value.trim()) {
        console.error('Old Password cannot be empty');
    }
};

const handleSubmitPassword = async (e) => {
    try {

        e.preventDefault();
        const response = await fetch('https://localhost:7207/api/Authentication/ChangePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: patientId,
                newPassword: newPassword.password,
                oldPassword: newPassword.oldPassword,
            }),
        });

        if (response.ok) {
            response.json().then((data) => {
                setApiMessage(data); 
                if(data.succeeded === true){
                    resetInputs();
                }
            });
            setMessage(true);
        }else
        {
            console.error('Failed to change Password:', response.statusText);
        }
    } catch (error) {
        console.error('Error changing password:', error.message);
    }
    
};
const resetInputs = ()=>{
    newPassword.confirmPassword ='';
    newPassword.password ='';
    newPassword.oldPassword ='';

}

  return (
    <>
    <div className="container-fluid">
        <div className="row">
        <div className="col-md-5 col-lg-4 col-xl-3 card" >
        <div className="row-md-1">
                <Sidebar userRole='Patient' />
            </div>
            <div className="profile-sidebar">
                <div className="widget-profile pro-widget-content">
                    <div className="profile-info-widget d-flex justify-content-center flex-column text-center">
                        <a href="#" className="booking-doc-img">
                        {formData.photoData && <img src={`data:image/${formData.photoFormat};base64,${formData.photoData}`} alt="User Image" className="fluid img-thumbnail mt-4 mb-2" style={{maxHeight:'100px'}} />}
                        {!formData.photoData && <img src={bg} alt="User Image" className="fluid img-thumbnail mt-4 mb-2" style={{maxHeight:'100px'}}/>}
                        </a>
                        <div className="profile-det-info">
                            <h3>{formData.name + ' '+ formData.surname}</h3>
                            <div className="patient-details">
                                <h5><i className="fas fa-birthday-cake"></i> {formData.dateOfBirth}</h5>
                                <h5 className="mb-0"><i className="fas fa-map-marker-alt"></i> {formData.address}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dashboard-widget">
                <nav className="navbar navbar-expand-lg navbar-white bg-white">
                    <ul className="navbar-nav mr-auto d-flex flex-column">
                        <li className="nav-item mr-3">
                            <a className="nav-link" href="#">
                                <i className="fas fa-columns"></i>
                                <span>Dashboard</span>
                            </a>
                        </li>
                        <li className="nav-item mr-3">
                             <a className="nav-link" href="#" onClick={toggleModal}>
                                 <i className="fas fa-lock"></i>
                                 <span>Change Password</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="index-2.html">
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Logout</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                </div>
            </div>
        </div>
            <div className="col-md-7 col-lg-8 col-xl-9">
                <div className="card container container-fluid">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                        <div className="row form-row">
                                 <div className="col-12 col-md-12">
                                    <div className="form-group d-flex justify-content-center mr-3 ">
                                        <div className="card">
                                            <div className="card-body d-flex justify-content-center">
                                                {formData.photoData && <img src={`data:image/${formData.photoFormat};base64,${formData.photoData}`} alt="User Image" className="fluid img-thumbnail mt-4 mb-2" style={{ maxHeight: '250px' }} />}
                                                {!formData.photoData && <img src={bg} alt="User Image" className="fluid img-thumbnail mt-4 mb-2" style={{ maxHeight: '250px' }} />}
                                            </div>
                                            <div className="upload-img">
                                                <div className="change-photo-btn">
                                                    <span><i className="fa fa-upload"></i> Upload Photo</span>
                                                    <input type="file" className="upload" onChange={handlePhotoChange} />
                                                </div>
                                                <small className="form-text text-muted">Allowed JPG or PNG. Max size of 2MB</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {message && (
                                      <MessageComponent message={apiMessage}/>
                                 )}
                                <div className="col-12 col-md-6">
                                    <div className="form-group">
                                        <label>User Name</label>
                                        <input type="text" className="form-control" name="userName" value={formData.userName} onChange={handleChange} />
                                        {errors.userName && <span className="text-danger">{errors.userName}</span>}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="form-group">
                                        <label>Personal Number</label>
                                        <input type="text" className="form-control" name="personalNumber" value={formData.personalNumber} onChange={handleChange} />
                                        {errors.personalNumber && <span className="text-danger">{errors.personalNumber}</span>}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
                                        {errors.name && <span className="text-danger">{errors.name}</span>}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input type="text" className="form-control" name="surname" value={formData.surname} onChange={handleChange} />
                                        {errors.surname && <span className="text-danger">{errors.surname}</span>}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="form-group">
                                        <label>Date of Birth</label>
                                        <input type="date" className="form-control" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                                        {errors.dateOfBirth && <span className="text-danger">{errors.dateOfBirth}</span>}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="form-group">
                                        <label>Email ID</label>
                                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                                        {errors.email && <span className="text-danger">{errors.email}</span>}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="form-group">
                                        <label>Mobile</label>
                                        <input type="text" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                                        {errors.phoneNumber && <span className="text-danger">{errors.phoneNumber}</span>}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="form-group">
                                        <label>Address</label>
                                        <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
                                        {errors.address && <span className="text-danger">{errors.address}</span>}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <select className="form-control" name="gender" value={formData.gender} onChange={handleChange}>
                                            <option>Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                        {errors.gender && <span className="text-danger">{errors.gender}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="submit-section">
                                <button type="submit" className="btn btn-primary submit-btn">Save Changes</button>
                            </div>
                        </form>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
    <Modal show={showModal} onHide={toggleModal} size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
              <Modal.Body>
                    <Modal.Title>Change your Password</Modal.Title>
                    <Modal.Body>
                    {message && (
                          <MessageComponent message={apiMessage}/>
                         )}
                        <div className='container-fluid'>
                            <p className='lead'>Update your password with your old password or through email.</p>
                            <form onSubmit={handleSubmitPassword}>
                                <div className="row form-row">
                                    <div className="col-12 col-md-6 w-100">
                                        <div className="form-group">
                                            <label>Old Password</label>
                                            <input type="password" className="form-control" name="oldPassword" value={newPassword.oldPassword} onChange={handleChangePassword}/>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label>New Password</label>
                                            <input type="password" className="form-control" name="password" value={newPassword.password} onChange={handleChangePassword} />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label>Confirm Password</label>
                                            <input type="password" className="form-control" name="confirmPassword" value={newPassword.confirmPassword} onChange={handleChangePassword} />
                                            {passwordMatchError && <span className="text-danger">Password and Confirm Password must match</span>}
                                        </div>
                                    </div>
                                    <div className="submit-section">
                                        <button type="submit" className="btn btn-primary submit-btn">Change Password</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Modal.Body>
                </Modal.Body>
            </Modal>
            </>

  );
}

export default ProfileSettings;
