import React from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const AppLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <MainContent isChatView={true} chatTitle="UFDR Report Analysis" />
    </div>
  );
};

export default AppLayout;