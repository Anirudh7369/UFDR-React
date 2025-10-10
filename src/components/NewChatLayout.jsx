import React from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const NewChatLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <MainContent 
        key={Date.now()} // Force remount to clear state
        isChatView={true} 
        chatTitle="New Chat" 
      />
    </div>
  );
};

export default NewChatLayout;