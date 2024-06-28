
import React from 'react';

const SearchByDate = ({ startDate, setStartDate, endDate, setEndDate, filterByReservationDates }) => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label>Başlangıç Tarihi:</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <label>Bitiş Tarihi:</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button onClick={filterByReservationDates}>Tarihe Göre Ara</button>
    </form>
  );
};

export default SearchByDate;
