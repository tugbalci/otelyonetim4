import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/Home';
import RoomContextProvider from './context/RoomContext';


function App() {
  return (
    <div className="App">
      <RoomContextProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
         </Routes>
      </RoomContextProvider>
    </div>
  );
}

export default App;

