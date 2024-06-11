import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalNotify({ show, handleClose, title, body, isQuestion, saveChanges, questionText, saveText }) {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        {isQuestion && (
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveChanges}>
              {saveText || 'Save'}
            </Button>
          </Modal.Footer>
        )}
        {!isQuestion && (
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}

export default ModalNotify;
