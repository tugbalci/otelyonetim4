
import React from 'react';
import { useRoomContext } from '../context/RoomContext';



const Rooms = () => {
  const { rooms } = useRoomContext();

  return (
    <div className="rooms-container">
      <h1>Odalar</h1>
      <div className="rooms-list">
        {rooms.map((room, index) => (
          <div key={index} className="room-card">
            <h2>{room.name}</h2>
            <p>Tip: {room.type}</p>
            <p>Fiyat: {room.price}₺</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
