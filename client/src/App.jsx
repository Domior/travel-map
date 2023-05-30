import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import LogIn from './pages/LogIn';
import Stripe from './pages/Stripe';
import Map from './pages/Map';

import StripeWrapper from './components/StripeWrapper';

const App = () => {
  return (
    <>
      <StripeWrapper>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="login" element={<LogIn />} />
          <Route path="stripe" element={<Stripe />} />
          <Route path="map" element={<Map />} />
        </Routes>
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      </StripeWrapper>
    </>
  );
};

export default App;
