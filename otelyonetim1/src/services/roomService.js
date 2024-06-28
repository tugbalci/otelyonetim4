
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';


export const getRooms = async () => {
  try {
    const roomsCol = collection(db, 'rooms');
    const roomsSnapshot = await getDocs(roomsCol);
    const roomsList = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return roomsList;
  } catch (error) {
    console.error("Odaları getirirken hata oluştu:", error);
    throw error;
  }
};


export const addRoom = async (roomData) => {
  try {
    const roomsCol = collection(db, 'rooms');
    await addDoc(roomsCol, roomData);
  } catch (error) {
    console.error("Oda eklerken hata oluştu:", error);
    throw error;
  }
};


export const deleteRoom = async (roomId) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    await deleteDoc(roomRef);
    return true;
  } catch (error) {
    console.error("Odayı silerken hata oluştu:", error);
    return false;
  }
};


export const updateRoom = async (updatedRoom) => {
  try {
    const { id, ...roomData } = updatedRoom;
    const roomRef = doc(db, 'rooms', id);
    await updateDoc(roomRef, roomData);
    return true;
  } catch (error) {
    console.error("Odayı güncellerken hata oluştu:", error);
    return false;
  }
};


export const getPricingRulesForRoom = (room) => {
  return room.FiyatKurallari || [];
};


export const addReservation = async (OdaNo, RezBaslangic, RezBitis, MisafirAdi, IletisimBilgisi) => {
  try {
    const roomRef = doc(db, 'rooms', OdaNo);
    const roomSnapshot = await getDoc(roomRef);

    if (!roomSnapshot.exists()) {
      throw new Error(`Oda bulunamadı: ${OdaNo}`);
    }

    const roomData = roomSnapshot.data();

    if (roomData.OdaDurumu === 'Dolu') {
      throw new Error(`Oda dolu: ${OdaNo}`);
    }

    const updatedRoom = {
      ...roomData,
      OdaDurumu: 'Dolu',
      RezBaslangic: RezBaslangic,
      RezBitis: RezBitis,
      MisafirAdi: MisafirAdi,
      IletisimBilgisi: IletisimBilgisi
    };

    await updateRoom(updatedRoom);

    return { success: true, updatedRoom };
  } catch (error) {
    console.error("Rezervasyon eklenirken hata oluştu: ", error);
    throw error;
  }
};
