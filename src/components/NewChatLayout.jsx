import Sidebar from './Sidebar';
import MainContent from './MainContent';

const NewChatLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar activeSessionId={null} />
      <MainContent
        key={Date.now()} // Force remount to clear state
        isChatView={true}
        sessionId={null}
      />
    </div>
  );
};

export default NewChatLayout;