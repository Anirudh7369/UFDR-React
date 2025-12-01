import Sidebar from './Sidebar';
import MainContent from './MainContent';

const AppLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar activeSessionId={null} />
      <MainContent isChatView={false} sessionId={null} />
    </div>
  );
};

export default AppLayout;