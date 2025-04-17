import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = ({ transactions }) => {
  const [date, setDate] = useState(new Date());

  // Function to format transactions into a date object
  const getTransactionDates = () => {
    return transactions.map(transaction => new Date(transaction.date));
  };

  return (
    <div>
      <h2>Financial Calendar</h2>
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={({ date, view }) => {
          const transactionDates = getTransactionDates();
          if (transactionDates.some(d => d.toDateString() === date.toDateString())) {
            return <div className="transaction-dot"></div>;
          }
        }}
      />
    </div>
  );
};

export default CalendarComponent;