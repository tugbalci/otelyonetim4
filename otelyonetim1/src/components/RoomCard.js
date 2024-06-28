import React, { useState } from 'react';
import { Card, Button, DatePicker } from 'antd';
import './RoomCard.css';
const { RangePicker } = DatePicker;



const RoomCard = ({ room, onReservationAdded, setStartDate, startDate }) => {
  const [RezBaslangic, setReaz] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleReservation = () => {
    if (startDate && endDate) {
      onReservationAdded(room.id, startDate, endDate);
    } else {
      alert('Lütfen başlangıç ve bitiş tarihlerini seçin.');
    }
  };

  return (
    <div className="room-card">
      <h2>Oda No: {room.OdaNo}</h2>
      <p>Oda Tipi: {room.OdaTipi}</p>
      <p className={`room-status ${room.OdaDurumu.toLowerCase()}`}>
        Oda Durumu: {room.OdaDurumu}
        {room.OdaDurumu === 'Dolu' && room.RezBitis &&
          <span> - Boşalma Tarihi: {room.RezBitis.toDate().toLocaleDateString()}</span>
        }
      </p>
      <p>Fiyat: {room.Fiyat} TL</p>
      {room.OdaDurumu === 'Boş' &&
        <div>
          <label>Başlangıç Tarihi:</label>
          <RangePicker
            value={[startDate, endDate]}
            onChange={(dates) => {
              if (dates && dates.length === 2) {
                setStartDate(dates[0]);
                setEndDate(dates[1]);
              } else {
                setStartDate(null);
                setEndDate(null);
              }
            }}
          />
          <Button onClick={handleReservation}>Rezervasyon Yap</Button>
        </div>
      }
    </div>
  );
};

export default RoomCard;
