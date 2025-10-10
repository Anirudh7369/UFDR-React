import React, { useState, useRef, useEffect } from 'react';
import UserMessage from './UserMessage';
import AIMessage from './AIMessage';
import AIMessageWithTyping from './AIMessageWithTyping';

const MainContent = ({ isChatView = false, chatTitle = "New Chat" }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);
  const messagesEndRef = useRef(null);

  console.log('MainContent - isChatView:', isChatView, 'messages:', messages);

  const handleTextareaResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    console.log('Sending message:', inputValue);

    // 1. Add user message to the UI instantly
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: inputValue,
    };
    console.log('Adding user message:', userMessage);
    setMessages(prevMessages => {
      const newMessages = [...prevMessages, userMessage];
      console.log('New messages array:', newMessages);
      return newMessages;
    });
    const currentQuery = inputValue;
    setInputValue(''); // Clear the input field
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // 2. Call the backend API
      console.log('Making API call to backend...');
      
      // Format timestamp to match 2025-01-10T12:00:00Z format
      const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
      console.log('Formatted timestamp:', timestamp);
      
      const response = await fetch('http://localhost:8000/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: currentQuery,
          current_timestamp: timestamp,
          session_id: 'test-session-123',
          email_id: 'investigator@example.com',
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response:', data);

      if (data.status === 'success' && data.message) {
        // 3. Add AI message with typing effect
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          content: data.message,
          isTyping: true,
        };
        console.log('Adding AI message:', aiMessage);
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } else {
        // Handle error case
        const errorMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          content: 'I apologize, but I encountered an error while processing your request. Please try again.',
          isTyping: true,
        };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }

    } catch (error) {
      console.error("Error fetching from API:", error);
      
      // For testing: Add a mock AI response when backend is not available
      const mockResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        content: `### **ForensicAnalyst Report**

**Query:** \`${currentQuery}\`

I received your message: "${currentQuery}"

This is a **test response** since the backend is currently not accessible due to CORS issues. 

**Mock Analysis Results:**
- Query processed successfully
- Response generated with typing effect
- Markdown formatting supported

*Note: This is a demo response. Once the backend CORS is configured, real analysis will be provided.*`,
        isTyping: true,
      };
      console.log('Adding mock AI response:', mockResponse);
      setMessages(prevMessages => [...prevMessages, mockResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const promptCards = [
    {
      title: "Summarize call logs for user 'John Doe'",
      description: "Get a quick overview of all incoming and outgoing calls."
    },
    {
      title: "Find all locations visited on October 9th",
      description: "Pinpoint geographic data for a specific date."
    },
    {
      title: "Identify all social media applications",
      description: "List all installed and used social media apps."
    },
    {
      title: "Recover deleted images from gallery",
      description: "Attempt to restore image files marked for deletion."
    }
  ];


  return (
    <main className="flex flex-1 flex-col bg-surface-dark">
      <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-800 px-6">
        {isChatView && (
          <h1 className="text-lg font-semibold text-white">{chatTitle}</h1>
        )}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="h-10 w-10 rounded-full bg-accent-dark flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-dark"
          >
            <span className="font-semibold text-white">JD</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-accent-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
              <a className="block px-4 py-2 text-sm text-gray-300 hover:bg-surface-dark/50" href="#">
                Logout
              </a>
            </div>
          )}
        </div>
      </header>
      
      {isChatView ? (
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {messages.length === 0 ? (
            // Show welcome screen if no messages exist
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center w-full max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-4">Hi, John Doe</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                  {promptCards.map((card, index) => (
                    <button 
                      key={index}
                      onClick={() => setInputValue(card.title)}
                      className="text-left p-4 rounded-lg bg-accent-dark hover:bg-accent-dark/70 transition-colors duration-200"
                    >
                      <p className="font-semibold text-gray-200">{card.title}</p>
                      <p className="text-sm text-gray-400">{card.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Show real conversation messages
            messages.map((message) => {
              console.log('Rendering message:', message);
              if (message.sender === 'user') {
                console.log('Rendering UserMessage with content:', message.content);
                return <UserMessage key={message.id} message={message.content} />;
              } else {
                console.log('Rendering AIMessage with content:', message.content);
                return (
                  <AIMessageWithTyping 
                    key={message.id} 
                    fullContent={message.content} 
                  />
                );
              }
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
          <div className="text-center w-full max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4">Hi, John Doe</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
              {promptCards.map((card, index) => (
                <button 
                  key={index}
                  className="text-left p-4 rounded-lg bg-accent-dark hover:bg-accent-dark/70 transition-colors duration-200"
                >
                  <p className="font-semibold text-gray-200">{card.title}</p>
                  <p className="text-sm text-gray-400">{card.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-800 bg-surface-dark p-6">
        <form onSubmit={handleSendMessage}>
          <div className="relative flex items-center">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onInput={handleTextareaResize}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              className="w-full resize-none rounded-lg bg-accent-dark border-gray-700 py-3 pl-4 pr-14 text-white placeholder-gray-500 focus:border-primary focus:ring-primary"
              placeholder={isChatView ? "Ask a follow-up question..." : "Ask a question or type a command..."}
              rows="1"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-2.5 flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-primary/90 disabled:bg-primary/50"
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <span className="material-symbols-outlined">send</span>
              )}
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-xs text-gray-500">
          ForensicAnalyst AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </main>
  );
};

export default MainContent;