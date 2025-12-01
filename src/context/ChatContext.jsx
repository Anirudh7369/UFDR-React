import { createContext, useState, useContext, useEffect } from 'react';

// Simple UUID generator
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
};

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('forensicAnalystChats');
    if (savedChats) {
      try {
        setChats(JSON.parse(savedChats));
      } catch (error) {
        console.error('Error loading chats from localStorage:', error);
      }
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('forensicAnalystChats', JSON.stringify(chats));
    }
  }, [chats]);

  // Create a new chat session
  const createNewChat = () => {
    const sessionId = generateUUID();
    const newChat = {
      sessionId,
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentSessionId(sessionId);
    return sessionId;
  };

  // Update chat title (based on first message)
  const updateChatTitle = (sessionId, title) => {
    setChats(prev => prev.map(chat =>
      chat.sessionId === sessionId
        ? { ...chat, title, updatedAt: new Date().toISOString() }
        : chat
    ));
  };

  // Add message to a chat
  const addMessageToChat = (sessionId, message) => {
    setChats(prev => prev.map(chat =>
      chat.sessionId === sessionId
        ? {
            ...chat,
            messages: [...chat.messages, message],
            updatedAt: new Date().toISOString()
          }
        : chat
    ));
  };

  // Get current chat
  const getCurrentChat = () => {
    return chats.find(chat => chat.sessionId === currentSessionId);
  };

  // Get chat by session ID
  const getChatBySessionId = (sessionId) => {
    return chats.find(chat => chat.sessionId === sessionId);
  };

  // Delete a chat
  const deleteChat = (sessionId) => {
    setChats(prev => prev.filter(chat => chat.sessionId !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  };

  // Set current session
  const setSession = (sessionId) => {
    setCurrentSessionId(sessionId);
  };

  const value = {
    chats,
    currentSessionId,
    createNewChat,
    updateChatTitle,
    addMessageToChat,
    getCurrentChat,
    getChatBySessionId,
    deleteChat,
    setSession,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
