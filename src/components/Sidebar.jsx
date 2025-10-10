import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/landing');
  };

  return (
    <aside className="w-72 flex-shrink-0 bg-background-dark p-4 flex flex-col justify-between border-r border-gray-800">
      <div>
        <button 
          onClick={handleLogoClick}
          className="flex items-center gap-3 px-3 py-2 hover:bg-surface-dark/30 rounded-lg transition-colors w-full text-left"
        >
          <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
          </svg>
          <h2 className="text-xl font-bold text-white">ForensicAnalyst AI</h2>
        </button>
        <div className="mt-8">
          <button 
            onClick={() => navigate('/new-chat')}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-semibold text-white transition-all hover:bg-primary/90"
          >
            <span className="material-symbols-outlined">add</span>
            New Chat
          </button>
        </div>
        <nav className="mt-8 space-y-2">
          <h3 className="px-3 text-xs font-semibold uppercase text-gray-500">
            Recent Chats
          </h3>
          <a className="flex items-center justify-between rounded-lg bg-surface-dark px-3 py-2 text-sm font-medium text-white" href="#">
            <span>UFDR Report Analysis</span>
            <span className="material-symbols-outlined text-gray-500 text-base">more_horiz</span>
          </a>
          <a className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-surface-dark/50" href="#">
            <span>Case #1032 Data...</span>
            <span className="material-symbols-outlined text-gray-500 text-base">more_horiz</span>
          </a>
          <a className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-surface-dark/50" href="#">
            <span>Deleted Files Reco...</span>
            <span className="material-symbols-outlined text-gray-500 text-base">more_horiz</span>
          </a>
        </nav>
      </div>
      <div className="border-t border-gray-800 pt-4">
      </div>
    </aside>
  );
};

export default Sidebar;