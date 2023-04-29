import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LogIn from './components/LogIn';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="login" element={<LogIn />} />
      </Routes>
    </>
  );
};

export default App;
