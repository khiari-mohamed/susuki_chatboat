import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatWidget from './components/ChatWidget';
import DebugScanPage from './pages/DebugScanPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatWidget />} />
        <Route path="/debug" element={<DebugScanPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;