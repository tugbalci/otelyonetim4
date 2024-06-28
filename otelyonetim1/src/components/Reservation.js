import React, { useState } from 'react';
import { addReservation } from '../services/roomService'; 

const Reservation = () => {
  const [guestName, setGuestName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleReservation = async () => {
    try {
      if (!guestName || !contactInfo || !startDate || !endDate) {
        alert('Lütfen tüm alanları doldurun.');
        return;
      }

      
      const result = await addReservation({
        guestName,
        contactInfo,
        startDate,
        endDate,
      });

      
      if (result.success) {
        alert('Rezervasyon başarıyla yapıldı!');
      } else {
        alert('Rezervasyon yapılırken bir hata oluştu.');
      }

      
      setGuestName('');
      setContactInfo('');
      setStartDate('');
      setEndDate('');
    } catch (error) {
      console.error('Rezervasyon eklenirken hata oluştu:', error);
      alert('Rezervasyon eklenirken bir hata oluştu.');
    }
  };

  return (
    <div>
      <h2>Rezervasyon Yap</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleReservation(); }}>
        <label>Misafir Adı:</label>
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
        />
        <label>İletişim Bilgisi:</label>
        <input
          type="text"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          required
        />
        <label>Başlangıç Tarihi:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <label>Bitiş Tarihi:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <button type="submit">Rezervasyon Yap</button>
      </form>
    </div>
  );
};

export default Reservation;
