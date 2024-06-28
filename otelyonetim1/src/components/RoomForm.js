import React, { useState } from 'react';
import { addRoom } from '../services/roomService';

const RoomForm = ({ onRoomAdded }) => {
  const [OdaNo, setOdaNo] = useState('');
  const [OdaTipi, setOdaTipi] = useState('');
  const [OdaDurumu, setOdaDurumu] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const roomId = await addRoom(OdaNo, OdaTipi, OdaDurumu);
      onRoomAdded({ id: roomId, OdaNo, OdaTipi, OdaDurumu });
      setOdaNo('');
      setOdaTipi('');
      setOdaDurumu('');
    } catch (error) {
      console.error('Oda eklenirken hata oluştu:', error);
    }
  };

  return (
    <div className="room-form">
      <h2>Oda Ekle</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Oda No"
          value={OdaNo}
          onChange={(e) => setOdaNo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Oda Tipi"
          value={OdaTipi}
          onChange={(e) => setOdaTipi(e.target.value)}
        />
        <input
          type="text"
          placeholder="Oda Durumu"
          value={OdaDurumu}
          onChange={(e) => setOdaDurumu(e.target.value)}
        />
        <button type="submit">Oda Ekle</button>
      </form>
    </div>
  );
};

export default RoomForm;
