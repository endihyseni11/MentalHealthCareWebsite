const sendNotification = (signalRHub,subject, message,toId,type,typeId,messageType) => {
  const id = localStorage.getItem('userId');
  const currentDate = new Date();

  const notificationRequest = {
    idNotification: '',
    subject: subject,
    body: message,
    fromId: id,
    toId: toId,
    type: type,
    typeId:typeId,
    messageType: messageType,
    dateTimestamp: currentDate,
  };

  signalRHub.invoke('SendNotificationToUser', notificationRequest)
    .catch(err => console.error(err));
};

export default sendNotification;
