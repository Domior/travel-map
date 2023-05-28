import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LogIn from './pages/LogIn';
import Stripe from './pages/Stripe';
import Map from './pages/Map';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="login" element={<LogIn />} />
        <Route path="stripe" element={<Stripe />} />
        <Route path="map" element={<Map />} />
      </Routes>
    </>
  );
};

export default App;
