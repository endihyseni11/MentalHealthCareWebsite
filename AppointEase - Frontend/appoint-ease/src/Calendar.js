import React, { useState, useEffect } from 'react';

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Data for events
    const sampleEvents = [
      { startTime: "6:00", endTime: "6:30", mTime: "pm", text: "Weirdo was born" },
      { startTime: "6:00", endTime: "7:00", mTime: "am", text: "This is scheduled to show today, anyday." },
      // Add more events as needed
    ];

    setEvents(sampleEvents);
  }, []);

  return (
    <div className="wrapper">
      <div id="calendarContainer">
        <CalendarComponent />
      </div>
      <div id="organizerContainer" style={{ marginLeft: '8px' }}>
        <Organizer events={events} />
      </div>
    </div>
  );
};

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const label = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Function to update date
  const updateDate = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="calendar small">
      <div className="year" style={{ backgroundColor: '#c2185b', color: '#ffffff' }}>
        <div id="year">{date.getFullYear()}</div>
      </div>
      <div className="month" style={{ backgroundColor: '#e91e63', color: '#f8bbd0' }}>
        <div id="month">{months[date.getMonth()]}</div>
      </div>
      <div className="labels">
        {label.map((day, index) => (
          <span key={index}>{day.substring(0, 3)}</span>
        ))}
      </div>
      <div className="days">
        {/* Render days here */}
      </div>
    </div>
  );
};

const Organizer = ({ events }) => {
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    // Set selectedDate based on calendar selection
  }, []);

  return (
    <div className="events small">
      <div className="date" style={{ backgroundColor: '#e91e63', color: '#f8bbd0' }}>
        {/* Display selected date here */}
      </div>
      <div className="rows">
        <ol className="list">
          {/* Render events here */}
          {events.map((event, index) => (
            <li key={index}>
              <div>
                <span className="time">{`${event.startTime} - ${event.endTime} ${event.mTime}`}</span>
                <span className="m">{event.text}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Calendar;
