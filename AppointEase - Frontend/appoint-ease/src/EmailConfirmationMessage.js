import React from 'react';
import { Link } from 'react-router-dom'; 

const EmailConfirmationMessage = () => {
  return (
    <div>
      <h2>Email Confirmation Required</h2>
      <p> Your email is not confirmed. Please confirm your email before continuing.
    <br />
    If you haven't received the confirmation email, please check your spam folder. 
    </p>
    </div>
  );
};

export default EmailConfirmationMessage;