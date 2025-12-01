import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const ChatLayout = () => {
  const { sessionId } = useParams();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar activeSessionId={sessionId} />
      <MainContent isChatView={true} sessionId={sessionId} />
    </div>
  );
};

export default ChatLayout;