import React from 'react';
import { InputNumber, Button } from 'antd';

const SearchByPerson = ({ guestCount, setGuestCount, filterByGuestCount }) => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label>Kişi Sayısı:</label>
      <InputNumber
        value={guestCount}
        onChange={(value) => setGuestCount(parseInt(value, 10))}
        placeholder="Kişi sayısını girin"
        style={{ width: 120 }}
      />
      <Button type="primary" onClick={filterByGuestCount}>Kişi Sayısına Göre Ara</Button>
    </form>
  );
};

export default SearchByPerson;
