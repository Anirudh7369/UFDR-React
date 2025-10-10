import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import AppLayout from './components/AppLayout';
import ChatLayout from './components/ChatLayout';
import NewChatLayout from './components/NewChatLayout';

function App() {
  return (
    <div className="dark">
      <div className="font-display bg-background-dark text-gray-300 antialiased">
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/dashboard" element={<AppLayout />} />
            <Route path="/chat" element={<ChatLayout />} />
            <Route path="/new-chat" element={<NewChatLayout />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;