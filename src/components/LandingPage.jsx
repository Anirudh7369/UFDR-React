import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 sm:px-10 py-5">
        <div className="flex items-center gap-3">
          <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
          </svg>
          <h2 className="text-xl font-bold text-gray-100 dark:text-white">ForensicAnalyst AI</h2>
        </div>
        <button 
          onClick={handleLoginClick}
          className="px-5 py-2 text-sm font-medium rounded-DEFAULT bg-primary/20 dark:bg-primary/20 text-white hover:bg-primary/30 dark:hover:bg-primary/30 transition-colors"
        >
          Login
        </button>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="flex flex-col items-center max-w-3xl space-y-8">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-100 dark:text-white">
            Uncover Truth at the Speed of Thought
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-gray-400 dark:text-gray-400">
            Meticulously analyze UFDR reports, identify critical connections, and uncover subtle patterns that human analysts might miss. ForensicAnalyst is your AI force multiplier in solving cases.
          </p>
          <div className="w-full max-w-md pt-4">
            <div className="aurora-bar"></div>
          </div>
        </div>
        <div className="absolute bottom-16 sm:bottom-24">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 text-base font-bold rounded-DEFAULT bg-primary text-white shadow-button-glow animate-pulse-glow transition-all hover:shadow-lg hover:shadow-primary/50"
          >
            Upload UFDR Report
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;