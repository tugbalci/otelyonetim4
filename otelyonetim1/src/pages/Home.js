import React, { useState, useEffect } from 'react';
import { Button, Input, InputNumber, Select, Space, DatePicker, Form, Image } from 'antd';
import { getRooms, deleteRoom, getPricingRulesForRoom, addRoom, addReservation, updateRoom } from '../services/roomService';
import './Home.css';
import RoomCard from '../components/RoomCard';


const { Option } = Select;
const { RangePicker } = DatePicker;

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomPrices, setRoomPrices] = useState({});
  const [newRoomNo, setNewRoomNo] = useState('');
  const [newRoomType, setNewRoomType] = useState('');
  const [newRoomPrice, setNewRoomPrice] = useState('');
  const [reservationRoomId, setReservationRoomId] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const roomsData = await getRooms();
      setRooms(roomsData);
      setFilteredRooms(roomsData);
    } catch (error) {
      console.error("Odaları getirirken hata oluştu:", error);
    }
  };

  

  const handleReservationComplete = (updatedRoom) => {
    const updatedRooms = rooms.map(room => (room.OdaNo === updatedRoom.OdaNo ? updatedRoom : room));
    setRooms(updatedRooms);
    setFilteredRooms(updatedRooms);
  };

  const handleAddReservation = async (OdaNo, RezBaslangic, RezBitis, guestName, contactInfo) => {
    try {
      const roomToReserve = filteredRooms.find(room => room.OdaNo === OdaNo);

      if (!roomToReserve || roomToReserve.OdaDurumu !== 'Boş') {
        throw new Error(`Oda bulunamadı veya dolu: ${OdaNo}`);
      }

      await addReservation(OdaNo, RezBaslangic, RezBitis, guestName, contactInfo);

      const updatedRoom = { ...roomToReserve, OdaDurumu: 'Dolu', RezBaslangic, RezBitis, MisafirAdi: guestName, IletisimBilgisi: contactInfo };
      await updateRoom(updatedRoom);

      const updatedFilteredRooms = filteredRooms.map(room => (room.OdaNo === OdaNo ? updatedRoom : room));
      setFilteredRooms(updatedFilteredRooms);

      console.log("Rezervasyon başarıyla yapıldı!");
    } catch (error) {
      console.error("Rezervasyon eklenirken hata oluştu: ", error);
    }
  };

  const handleAddRoom = async () => {
    try {
      const newRoomData = {
        OdaNo: newRoomNo,
        OdaTipi: newRoomType,
        OdaDurumu: 'Boş',
        Fiyat: newRoomPrice
      };

      await addRoom(newRoomData);
      setRooms([...rooms, newRoomData]);
      setFilteredRooms([...filteredRooms, newRoomData]);
      setNewRoomNo('');
      setNewRoomType('');
      setNewRoomPrice('');
    } catch (error) {
      console.error("Oda eklenirken hata oluştu:", error);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      const isDeleted = await deleteRoom(roomId);
      if (isDeleted) {
        const updatedRooms = rooms.filter(room => room.OdaNo !== roomId);
        const updatedFilteredRooms = filteredRooms.filter(room => room.OdaNo !== roomId);
        setRooms(updatedRooms);
        setFilteredRooms(updatedFilteredRooms);
      }
    } catch (error) {
      console.error("Oda silinirken hata oluştu:", error);
    }
  };

  const filterByGuestCount = (count) => {
    const filtered = rooms.filter((room) => {
      if (count === 1 && room.OdaTipi === 'Tek') {
        return true;
      } else if (count === 2 && room.OdaTipi === 'Çift') {
        return true;
      } else if (count >= 3 && room.OdaTipi === 'Aile') {
        return true;
      }
      return false;
    });

    setFilteredRooms(filtered);
  };

  const isRoomAvailable = (room, start, end) => {
    const rezBaslangic = room.RezBaslangic ? room.RezBaslangic.toDate() : null;
    const rezBitis = room.RezBitis ? room.RezBitis.toDate() : null;

    if (!rezBaslangic || !rezBitis) {
      return true;
    }

    if (start >= rezBitis || end <= rezBaslangic) {
      return true;
    } else {
      return false;
    }
  };

  const filterByReservationDates = async () => {
    if (!startDate || !endDate) {
      setFilteredRooms(rooms);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = rooms.filter(room => isRoomAvailable(room, start, end));
    setFilteredRooms(filtered);

    const prices = await calculatePrices(filtered, start, end);
    setRoomPrices(prices);
  };

  const calculateRoomPrice = async (room, start, end) => {
    let price = room.Fiyat;
    const pricingRules = getPricingRulesForRoom(room);

    pricingRules.forEach(rule => {
      const ruleStart = new Date(rule.baslangic);
      const ruleEnd = new Date(rule.bitis);

      if ((start >= ruleStart && start <= ruleEnd) || (end >= ruleStart && end <= ruleEnd) || (start <= ruleStart && end >= ruleEnd)) {
        price = rule.fiyat;
      }
    });

    return price;
  };

  const calculatePrices = async (rooms, start, end) => {
    const prices = {};
    await Promise.all(
      rooms.map(async room => {
        const price = await calculateRoomPrice(room, start, end);
        prices[room.OdaNo] = price;
      })
    );
    return prices;
  };

  const handleShowEmptyRooms = () => {
    const emptyRooms = rooms.filter(room => room.OdaDurumu === 'Boş');
    setFilteredRooms(emptyRooms);
  };

  const handleShowFullRooms = () => {
    const fullRooms = rooms.filter(room => room.OdaDurumu === 'Dolu');
    setFilteredRooms(fullRooms);
  };

  const handleShowAllRooms = () => {
    setFilteredRooms(rooms);
  };

  return (
    <div className="home-container">
      <h1>Otel Yönetim Sistemi</h1>

      <div className="filter-form">
        <Space direction="vertical">
          <Form layout="inline">
            <Form.Item label="Kişi Sayısı:">
              <InputNumber
                min={1}
                max={10}
                placeholder="Kişi sayısını girin"
                onChange={filterByGuestCount}
              />
            </Form.Item>
            <Form.Item label="Başlangıç - Bitiş Tarihleri:">
              <RangePicker
                style={{ width: 240 }}
                onChange={(dates) => {
                  if (dates && dates.length === 2) {
                    setStartDate(dates[0]);
                    setEndDate(dates[1]);
                  }
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={filterByReservationDates}>Filtrele</Button>
            </Form.Item>
          </Form>
          <div className="filter-options">
            <Button onClick={handleShowEmptyRooms}>Boş Odaları Göster</Button>
            <Button onClick={handleShowFullRooms}>Dolu Odaları Göster</Button>
            <Button onClick={handleShowAllRooms}>Tüm Odaları Göster</Button>
          </div>
        </Space>
      </div>

      <div className="room-list">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <RoomCard
              key={room.OdaNo}
              room={room}
              onReservationAdded={(roomId, start, end) =>
                handleAddReservation(roomId, start, end, guestName, contactInfo)
              }
            />
          ))
        ) : (
          <p>Uygun oda bulunamadı.</p>
        )}
      </div>

      {reservationRoomId && (
        <div className="reservation-form">
          <h2>Rezervasyon Yap - Oda No: {reservationRoomId}</h2>
          <Form
            layout="vertical"
            onFinish={(values) =>
              handleAddReservation(reservationRoomId, startDate, endDate, guestName, contactInfo)
            }
          >
            <Form.Item
              label="Misafir Adı"
              name="guestName"
              rules={[{ required: true, message: 'Lütfen misafir adını girin!' }]}
            >
              <Input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="İletişim Bilgisi"
              name="contactInfo"
              rules={[{ required: true, message: 'Lütfen iletişim bilgisini girin!' }]}
            >
              <Input
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Rezervasyon Yap
              </Button>
              <Button onClick={() => setReservationRoomId(null)} style={{ marginLeft: 8 }}>
                İptal
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}

      <div className="add-room-form">
        <h2>Yeni Oda Ekle</h2>
        <Form
          layout="vertical"
          onFinish={handleAddRoom}
        >
          <Form.Item
            label="Oda No"
            name="newRoomNo"
            rules={[{ required: true, message: 'Lütfen oda numarasını girin!' }]}
          >
            <Input
              value={newRoomNo}
              onChange={(e) => setNewRoomNo(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Oda Tipi"
            name="newRoomType"
            rules={[{ required: true, message: 'Lütfen oda tipini seçin!' }]}
          >
            <Select
              placeholder="Oda tipi seçin"
              value={newRoomType}
              onChange={(value) => setNewRoomType(value)}
            >
              <Option value="Tek">Tek</Option>
              <Option value="Çift">Çift</Option>
              <Option value="Aile">Aile</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Fiyat (TL)"
            name="newRoomPrice"
            rules={[{ required: true, message: 'Lütfen oda fiyatını girin!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              value={newRoomPrice}
              onChange={(value) => setNewRoomPrice(value)}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Oda Ekle
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default Home;