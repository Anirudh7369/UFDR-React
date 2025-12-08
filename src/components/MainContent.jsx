import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserMessage from "./UserMessage";
import AIMessage from "./AIMessage";
import AIMessageWithTyping from "./AIMessageWithTyping";
import { useChat } from "../context/ChatContext";
import { useUser } from "../context/UserContext";
import UploadUFDR from "./UploadUFDR";

const MainContent = ({ isChatView = false, sessionId = null }) => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const {
    currentSessionId,
    createNewChat,
    updateChatTitle,
    addMessageToChat,
    getChatBySessionId,
  } = useChat();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(
    sessionId || currentSessionId
  );
  const [showUploader, setShowUploader] = useState(false);

  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Sync activeSessionId with sessionId prop when it changes
  useEffect(() => {
    const newSessionId = sessionId || currentSessionId;
    const sessionChanged = newSessionId !== activeSessionId;

    setActiveSessionId(newSessionId);

    if (sessionChanged) {
      // Close uploader when switching sessions
      setShowUploader(false);

      if (!newSessionId) {
        // Clear messages when switching to a new chat (null sessionId)
        setMessages([]);
      } else {
        // Load messages from the new session
        const chat = getChatBySessionId(newSessionId);
        if (chat) {
          const messagesWithoutTyping = chat.messages.map((msg) => ({
            ...msg,
            isTyping: false,
          }));
          setMessages(messagesWithoutTyping);
        }
      }
    }
  }, [sessionId, currentSessionId, activeSessionId, getChatBySessionId]);

  const handleTextareaResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Create new session if none exists
    let sessionIdToUse = activeSessionId;
    const isFirstMessage = messages.length === 0;

    if (!sessionIdToUse) {
      sessionIdToUse = createNewChat();
      setActiveSessionId(sessionIdToUse);
      navigate(`/chat/${sessionIdToUse}`);
    }

    // 1. Add user message to the UI instantly
    const userMessage = {
      id: Date.now(),
      sender: "user",
      content: inputValue,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    addMessageToChat(sessionIdToUse, userMessage);

    // Update chat title based on first message
    if (isFirstMessage) {
      const title =
        inputValue.length > 30
          ? inputValue.substring(0, 30) + "..."
          : inputValue;
      updateChatTitle(sessionIdToUse, title);
    }

    const currentQuery = inputValue;
    setInputValue("");
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      // Format timestamp as 2025-01-10T12:00:00Z
      const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

      const response = await fetch("http://localhost:8000/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: currentQuery,
          current_timestamp: timestamp,
          session_id: sessionIdToUse,
          email_id: user?.email || "anonymous@example.com",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success" && data.message) {
        const aiMessage = {
          id: Date.now() + 1,
          sender: "ai",
          content: data.message,
          isTyping: true,
        };

        setMessages((prevMessages) => [...prevMessages, aiMessage]);

        const aiMessageForStorage = { ...aiMessage, isTyping: false };
        addMessageToChat(sessionIdToUse, aiMessageForStorage);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          sender: "ai",
          content:
            "I apologize, but I encountered an error while processing your request. Please try again.",
          isTyping: true,
        };

        setMessages((prevMessages) => [...prevMessages, errorMessage]);

        const errorMessageForStorage = { ...errorMessage, isTyping: false };
        addMessageToChat(sessionIdToUse, errorMessageForStorage);
      }
    } catch (error) {
      console.error("Error fetching from API:", error);

      const mockResponse = {
        id: Date.now() + 1,
        sender: "ai",
        content: `### **ForensicAnalyst Report**

**Query:** \`${currentQuery}\`

I received your message: "${currentQuery}"

This is a **test response** since the backend is currently not accessible.

**Mock Analysis Results:**
- Query processed successfully
- Response generated with typing effect
- Markdown formatting supported

*Note: This is a demo response. Once the backend is configured, real analysis will be provided.*`,
        isTyping: true,
      };

      setMessages((prevMessages) => [...prevMessages, mockResponse]);

      const mockResponseForStorage = { ...mockResponse, isTyping: false };
      addMessageToChat(sessionIdToUse, mockResponseForStorage);
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
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const promptCards = [
    {
      title: "Summarize call logs for user 'John Doe'",
      description: "Get a quick overview of all incoming and outgoing calls.",
    },
    {
      title: "Find all locations visited on October 9th",
      description: "Pinpoint geographic data for a specific date.",
    },
    {
      title: "Identify all social media applications",
      description: "List all installed and used social media apps.",
    },
    {
      title: "Recover deleted images from gallery",
      description: "Attempt to restore image files marked for deletion.",
    },
  ];

  const currentChat = activeSessionId
    ? getChatBySessionId(activeSessionId)
    : null;
  const chatTitle = currentChat ? currentChat.title : "New Chat";

  return (
    <main className="flex flex-1 flex-col bg-surface-dark">
      {/* Top bar */}
      <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-800 px-6">
        {isChatView && (
          <h1 className="text-lg font-semibold text-white">{chatTitle}</h1>
        )}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="h-10 w-10 rounded-full bg-accent-dark flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-dark overflow-hidden"
          >
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error("Error loading profile image:", user.picture);
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<span class="font-semibold text-white">${
                    user?.name?.charAt(0).toUpperCase() || "U"
                  }</span>`;
                }}
              />
            ) : (
              <span className="font-semibold text-white">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            )}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-accent-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-surface-dark/50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main area: chat view or welcome view */}
      {isChatView ? (
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center w-full max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Hi, {user?.name || "User"}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                  {promptCards.map((card, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(card.title)}
                      className="text-left p-4 rounded-lg bg-accent-dark hover:bg-accent-dark/70 transition-colors duration-200"
                    >
                      <p className="font-semibold text-gray-200">
                        {card.title}
                      </p>
                      <p className="text-sm text-gray-400">
                        {card.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              if (message.sender === "user") {
                return (
                  <UserMessage key={message.id} message={message.content} />
                );
              } else {
                if (message.isTyping) {
                  return (
                    <AIMessageWithTyping
                      key={message.id}
                      fullContent={message.content}
                    />
                  );
                } else {
                  return (
                    <AIMessage key={message.id} message={message.content} />
                  );
                }
              }
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
          <div className="text-center w-full max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4">
              Hi, {user?.name || "User"}
            </h1>
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

      {/* Footer: upload + input bar */}
      <div className="border-t border-gray-800 bg-surface-dark p-6">
        {/* UFDR uploader panel (like ChatGPT attachment UI) */}
        {isChatView && (
          <div className="mb-3">
            <button
              type="button"
              onClick={() => setShowUploader((prev) => !prev)}
              className="mb-2 inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-accent-dark px-3 py-1.5 text-xs font-medium text-gray-200 hover:bg-accent-dark/80 transition-colors"
            >
              <span>📎</span>
              <span>
                {showUploader ? "Hide UFDR upload" : "Upload UFDR report"}
              </span>
            </button>

            {showUploader && (
              <div className="rounded-lg border border-gray-700 bg-accent-dark/60 p-3">
                <p className="mb-2 text-xs text-gray-400">
                  Attach a UFDR file for analysis. Large files are uploaded via
                  MinIO; you can continue chatting while it processes.
                </p>
                <UploadUFDR />
              </div>
            )}
          </div>
        )}

        {/* Chat input */}
        <form onSubmit={handleSendMessage}>
          <div className="relative flex items-center">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onInput={handleTextareaResize}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              className="w-full resize-none rounded-lg bg-accent-dark border-gray-700 py-3 pl-4 pr-14 text-white placeholder-gray-500 focus:border-primary focus:ring-primary"
              placeholder={
                isChatView
                  ? "Ask a follow-up question..."
                  : "Ask a question or type a command..."
              }
              rows="1"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-2.5 flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-primary/90 disabled:bg-primary/50"
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <span className="material-symbols-outlined">send</span>
              )}
            </button>
          </div>
        </form>

        <p className="mt-2 text-center text-xs text-gray-500">
          ForensicAnalyst AI can make mistakes. Consider checking important
          information.
        </p>
      </div>
    </main>
  );
};

export default MainContent;
