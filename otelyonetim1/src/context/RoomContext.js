import React, { createContext, useContext, useState } from 'react';

const RoomContext = createContext();

export const useRoomContext = () => useContext(RoomContext);

const RoomContextProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);

  const addRoom = (newRoom) => {
    setRooms([...rooms, { id: rooms.length + 1, ...newRoom }]);
  };

  const removeRoom = (id) => {
    const updatedRooms = rooms.filter(room => room.id !== id);
    setRooms(updatedRooms);
  };

  const filterRooms = (guestCount) => {
    return rooms.filter(room => {
      if (guestCount === 1 && room.type === 'tek') {
        return true;
      } else if (guestCount === 2 && room.type === 'çift') {
        return true;
      } else if (guestCount >= 3 && room.type === 'aile') {
        return true;
      } else {
        return false;
      }
    });
  };

  return (
    <RoomContext.Provider value={{ rooms, addRoom, removeRoom, filterRooms }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContextProvider;
