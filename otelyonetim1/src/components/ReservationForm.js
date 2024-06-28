import React, { useState } from 'react';

const ReservationForm = ({ onClose, onAddReservation }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddReservation(startDate, endDate);
  };

  return (
    <div className="reservation-form">
      <h2>Rezervasyon Yap</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <button type="submit">Rezervasyon Yap</button>
        <button type="button" onClick={onClose}>Kapat</button>
      </form>
    </div>
  );
};

export default ReservationForm;
