import React from 'react';

const MessageComponent = ({ message }) => {
  let type = 'information';

  if (message && message.succeeded === false) {
    type = 'error';
  }

  let className = '';
  switch (type) {
    case 'information':
      className = 'alert alert-info';
      break;
    case 'error':
      className = 'alert alert-danger';
      break;
    default:
      className = 'alert alert-info';
  }

  return (
    <div className={className} role="alert">
      {message && message.message}
      {message && message.errors && (
        <ul>
          {message.errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessageComponent;
