import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import UserMessage from './UserMessage';
import AIMessage from './AIMessage';
import AIMessageWithTyping from './AIMessageWithTyping';
import { useChat } from '../context/ChatContext';
import { useUser } from '../context/UserContext';
import UploadUFDR from './UploadUFDR';
import Toast from './Toast';

const MainContent = ({ isChatView = false, sessionId = null }) => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const {
    chats,
    currentSessionId,
    createNewChat,
    updateChatTitle,
    addMessageToChat,
    getChatBySessionId,
    setSession // optional, if your context exposes it
  } = useChat();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(sessionId || currentSessionId);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [attachment, setAttachment] = useState(null); // { data: base64, mime_type, size, name }
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const fileInputRef = useRef(null);
  const maxTextareaHeight = 200;
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  // Sync activeSessionId with props / context
  useEffect(() => {
    const newSessionId = sessionId || currentSessionId;
    setActiveSessionId(newSessionId);

    if (newSessionId) {
      const chat = getChatBySessionId(newSessionId);
      if (chat) {
        const messagesWithoutTyping = chat.messages.map((msg) => ({ ...msg, isTyping: false }));
        setMessages(messagesWithoutTyping);
      } else {
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, currentSessionId, getChatBySessionId]);

  // Auto-select an existing chat when returning (if none active)
  useEffect(() => {
    if (!activeSessionId && chats && chats.length > 0) {
      const idToUse = currentSessionId || chats[0].sessionId;
      setActiveSessionId(idToUse);
      if (typeof setSession === 'function') {
        setSession(idToUse);
      }
      navigate(`/chat/${idToUse}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats, currentSessionId]);

  // Autofocus the textarea when the view becomes active
  useEffect(() => {
    const t = setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
    return () => clearTimeout(t);
  }, [activeSessionId, isChatView]);

  // Click-to-focus: if user clicks container (not exactly textarea), focus textarea
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleClick = (e) => {
      if (textareaRef.current && !textareaRef.current.contains(e.target)) {
        textareaRef.current.focus();
      }
    };
    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, []);

  // Global keydown to focus textarea on first keystroke (so typing anywhere focuses input)
  useEffect(() => {
    const onKeyDown = (e) => {
      const active = document.activeElement;
      const isInputFocused =
        active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);

      // Keyboard shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        navigate('/');
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        textareaRef.current?.focus();
        return;
      }
      if (e.key === 'Escape' && isLoading) {
        e.preventDefault();
        handleStopGeneration();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch((prev) => !prev);
        return;
      }

      if (!isInputFocused && textareaRef.current) {
        // allow normal typing: only focus if a visible character or backspace/enter
        if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') {
          textareaRef.current.focus();
          // Do NOT call preventDefault — we want the keystroke to be accepted by the textarea
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isLoading, navigate]);

  const handleTextareaResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxTextareaHeight);
      textareaRef.current.style.height = newHeight + 'px';
      textareaRef.current.style.overflowY = textareaRef.current.scrollHeight > maxTextareaHeight ? 'auto' : 'hidden';
    }
  };

  // Toast helper
  const showToast = useCallback((message, subText, type = 'success') => {
    setToast({ message, subText, type });
  }, []);

  // Export chat as text
  const exportChat = useCallback(() => {
    if (!messages.length) {
      showToast('No messages to export', 'Start a conversation first', 'error');
      return;
    }

    const chatText = messages.map(msg => {
      const sender = msg.sender === 'user' ? 'You' : 'ForensicAnalyst';
      return `${sender}:\n${msg.content}\n`;
    }).join('\n---\n\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${activeSessionId || 'export'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Chat exported', 'Download started', 'success');
  }, [messages, activeSessionId, showToast]);

  // Filtered messages based on search
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const query = searchQuery.toLowerCase();
    return messages.filter(msg => msg.content.toLowerCase().includes(query));
  }, [messages, searchQuery]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);

    // Add a message indicating the generation was stopped
    const stoppedMessage = {
      id: Date.now() + 1,
      sender: 'ai',
      content: 'Generation stopped by user.',
      isTyping: false,
    };
    setMessages((prev) => [...prev, stoppedMessage]);
    if (activeSessionId) {
      addMessageToChat(activeSessionId, stoppedMessage);
    }

    // Re-focus the textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  // Regenerate last response
  const handleRegenerate = useCallback(() => {
    if (!lastQuery || isLoading) return;

    // Remove last AI message
    setMessages((prev) => {
      const filtered = [...prev];
      for (let i = filtered.length - 1; i >= 0; i--) {
        if (filtered[i].sender === 'ai') {
          filtered.splice(i, 1);
          break;
        }
      }
      return filtered;
    });

    // Resend with last query
    setInputValue(lastQuery);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  }, [lastQuery, isLoading]);

  // Retry failed request
  const handleRetry = useCallback((query) => {
    setInputValue(query);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  }, []);

  // Handle file attachment
  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxFileSize) {
      showToast('File too large', `Maximum size is ${maxFileSize / 1024 / 1024}MB`, 'error');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // Remove data:mime;base64, prefix
      setAttachment({
        data: base64,
        mime_type: file.type,
        size: file.size,
        name: file.name,
      });
      showToast('File attached', file.name, 'success');
    };
    reader.onerror = () => {
      showToast('Upload failed', 'Could not read file', 'error');
    };
    reader.readAsDataURL(file);
  }, [maxFileSize, showToast]);

  // Remove attachment
  const removeAttachment = useCallback(() => {
    // Clear attachment data to free memory
    if (attachment) {
      // Help garbage collection by explicitly clearing large base64 string
      setAttachment(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [attachment]);

  // Cleanup attachment on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (attachment) {
        setAttachment(null);
      }
    };
  }, [attachment]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    // Allow sending if either there's text OR an attachment
    if ((!inputValue.trim() && !attachment) || isLoading) return;

    let sessionIdToUse = activeSessionId;
    const isFirstMessage = messages.length === 0;

    if (!sessionIdToUse) {
      // createNewChat should return the new sessionId synchronously
      sessionIdToUse = createNewChat();
      setActiveSessionId(sessionIdToUse);
      if (typeof setSession === 'function') {
        setSession(sessionIdToUse);
      }
      navigate(`/chat/${sessionIdToUse}`);
    }

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: inputValue || (attachment ? `[Attachment: ${attachment.name}]` : ''),
      attachment: attachment ? {
        name: attachment.name,
        mime_type: attachment.mime_type,
        size: attachment.size,
        data: attachment.data, // Keep for display
      } : null,
    };

    setMessages((prev) => [...prev, userMessage]);
    addMessageToChat(sessionIdToUse, userMessage);

    if (isFirstMessage) {
      const messageContent = inputValue || (attachment ? attachment.name : 'New Chat');
      const title = messageContent.length > 30 ? messageContent.substring(0, 30) + '...' : messageContent;
      updateChatTitle(sessionIdToUse, title);
    }

    const currentQuery = inputValue;
    setLastQuery(currentQuery); // Save for regenerate
    setInputValue('');
    setIsLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      const requestBody = {
        query: currentQuery,
        current_timestamp: timestamp,
        session_id: sessionIdToUse,
        email_id: user?.email || 'anonymous@example.com',
      };

      // Add attachment if present
      if (attachment) {
        requestBody.attachment_data = attachment.data;
        requestBody.mime_type = attachment.mime_type;
        requestBody.attachment_size = attachment.size;
        requestBody.attachment_name = attachment.name;
      }

      const response = await fetch('http://localhost:8000/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.status === 'success' && data.message) {
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          content: data.message,
          isTyping: true,
        };
        setMessages((prev) => [...prev, aiMessage]);
        addMessageToChat(sessionIdToUse, { ...aiMessage, isTyping: false });
      } else {
        const errMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          content: 'I apologize, but I encountered an error while processing your request. Please try again.',
          isTyping: true,
        };
        setMessages((prev) => [...prev, errMsg]);
        addMessageToChat(sessionIdToUse, { ...errMsg, isTyping: false });
      }
    } catch (error) {
      // Check if the request was aborted
      if (error.name === 'AbortError') {
        console.log('Request was aborted by user');
        return; // Don't add any error message, handleStopGeneration already added one
      }

      console.error('Error fetching from API:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        content: 'Unable to connect to the server. Please ensure the backend is running on http://localhost:8000',
        isTyping: false,
        error: true,
        retryQuery: currentQuery,
      };
      setMessages((prev) => [...prev, errorMessage]);
      addMessageToChat(sessionIdToUse, errorMessage);
      showToast('Connection failed', 'Check if backend is running', 'error');
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      setAttachment(null); // Clear attachment after sending
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Re-focus the textarea after the message is sent
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  // Handle click outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const promptCards = useMemo(() => [
    {
      title: "Summarize call logs for user 'John Doe'",
      description: "Get a quick overview of all incoming and outgoing calls"
    },
    {
      title: "Find all locations visited on October 9th",
      description: "Pinpoint geographic data for a specific date"
    },
    {
      title: "Identify all social media applications",
      description: "List all installed and used social media apps"
    },
    {
      title: "Recover deleted images from gallery",
      description: "Attempt to restore image files marked for deletion"
    }
  ], []);

  const currentChat = activeSessionId ? getChatBySessionId(activeSessionId) : null;
  const chatTitle = currentChat ? currentChat.title : "New Chat";

  return (
    <>
      <main ref={containerRef} className="flex flex-1 flex-col bg-surface-dark">
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-800 px-6">
        <div className="flex items-center gap-4 flex-1">
          {isChatView && <h1 className="text-lg font-semibold text-white">{chatTitle}</h1>}
        </div>
        <div className="flex items-center gap-3">
          {isChatView && messages.length > 0 && (
            <>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-accent-dark transition-colors"
                title="Search in chat (Ctrl+F)"
              >
                <span className="material-symbols-outlined text-xl">search</span>
              </button>
              <button
                onClick={exportChat}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-accent-dark transition-colors"
                title="Export chat"
              >
                <span className="material-symbols-outlined text-xl">download</span>
              </button>
              {lastQuery && (
                <button
                  onClick={handleRegenerate}
                  disabled={isLoading}
                  className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-accent-dark transition-colors disabled:opacity-50"
                  title="Regenerate response"
                >
                  <span className="material-symbols-outlined text-xl">refresh</span>
                </button>
              )}
            </>
          )}
          <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="h-10 w-10 rounded-full bg-accent-dark flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary overflow-hidden"
          >
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span className="font-semibold text-white">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-accent-dark shadow-lg ring-1 ring-black ring-opacity-5 py-1">
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-surface-dark/50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        </div>
      </header>

      {showSearch && isChatView && (
        <div className="border-b border-gray-800 bg-surface-dark p-4">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full rounded-lg bg-accent-dark border-gray-700 py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:border-primary focus:ring-primary"
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500">search</span>
            {searchQuery && (
              <span className="absolute right-3 top-2.5 text-sm text-gray-400">
                {filteredMessages.length} of {messages.length}
              </span>
            )}
          </div>
        </div>
      )}

      {isChatView ? (
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center w-full max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-4">Hi, {user?.name || 'User'}</h1>

                {showFileUpload ? (
                  <div className="mt-12">
                    <UploadUFDR />
                    <button
                      onClick={() => setShowFileUpload(false)}
                      className="mt-4 text-sm text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      ← Back to prompts
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setShowFileUpload(true)}
                      className="mt-8 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined">upload_file</span>
                      Upload UFDR Report
                    </button>
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
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              {filteredMessages.map((message) => {
                if (message.sender === 'user') {
                  return <UserMessage key={message.id} message={message.content} />;
                } else {
                  return (
                    <div key={message.id}>
                      {message.isTyping ? (
                        <AIMessageWithTyping fullContent={message.content} />
                      ) : (
                        <AIMessage message={message.content} />
                      )}
                      {message.error && message.retryQuery && (
                        <button
                          onClick={() => handleRetry(message.retryQuery)}
                          disabled={isLoading}
                          className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm">refresh</span>
                          Retry
                        </button>
                      )}
                    </div>
                  );
                }
              })}
              {searchQuery && filteredMessages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  No messages found matching "{searchQuery}"
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
          <div className="text-center w-full max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4">Hi, {user?.name || 'User'}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
              {promptCards.map((card, index) => (
                <button key={index} className="text-left p-4 rounded-lg bg-accent-dark hover:bg-accent-dark/70 transition-colors duration-200">
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
          {/* Attachment Preview */}
          {attachment && (
            <div className="mb-3 p-3 bg-accent-dark rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">attach_file</span>
                  <p className="text-xs text-gray-400">Attachment</p>
                </div>
                <button
                  type="button"
                  onClick={removeAttachment}
                  className="p-1 rounded hover:bg-surface-dark text-gray-400 hover:text-white transition-colors"
                  title="Remove attachment"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <div className="flex items-start gap-3">
                {/* Image preview for image files */}
                {attachment.mime_type.startsWith('image/') && (
                  <div className="flex-shrink-0">
                    <img
                      src={`data:${attachment.mime_type};base64,${attachment.data}`}
                      alt={attachment.name}
                      className="w-20 h-20 rounded object-cover border border-gray-700"
                    />
                  </div>
                )}

                {/* File icon for non-image files */}
                {!attachment.mime_type.startsWith('image/') && (
                  <div className="flex-shrink-0 w-20 h-20 rounded bg-surface-dark border border-gray-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl">description</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{attachment.name}</p>
                  <p className="text-xs text-gray-400">
                    {attachment.mime_type} • {(attachment.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="relative flex items-center">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
            />

            {/* Attach file button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || !!attachment}
              className="absolute left-3 p-1 rounded text-gray-400 hover:text-white hover:bg-surface-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Attach file"
            >
              <span className="material-symbols-outlined text-xl">attach_file</span>
            </button>

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
              className="w-full resize-none rounded-lg bg-accent-dark border-gray-700 py-3 pl-12 pr-14 text-white placeholder-gray-500 focus:border-primary focus:ring-primary"
              placeholder={isChatView ? "Ask a follow-up question..." : "Ask a question or type a command..."}
              rows="1"
              disabled={isLoading}
            />
            {isLoading ? (
              <button
                type="button"
                onClick={handleStopGeneration}
                className="absolute right-2.5 flex h-8 w-8 items-center justify-center rounded-md bg-red-600 text-white transition-colors hover:bg-red-700"
                title="Stop generation"
              >
                <span className="material-symbols-outlined text-sm">stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputValue.trim() && !attachment}
                className="absolute right-2.5 flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-primary/90 disabled:bg-primary/50"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            )}
          </div>
        </form>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            ForensicAnalyst AI can make mistakes. Consider checking important information.
          </p>
          <p className="text-xs text-gray-500">
            {inputValue.length} characters
          </p>
        </div>
      </div>

      {/* UFDR Extraction Overlay */}
      <UfdrExtractionOverlay
        isExtracting={isExtracting}
        uploadId={currentUploadId}
        onComplete={(data) => {
          setIsExtracting(false);
          setCurrentUploadId(null);
          console.log('UFDR extraction completed!', data);

          // Optionally show a success message
          if (data?.overall_status === 'completed') {
            console.log('✓ All data extracted successfully');
          }
        }}
      />
    </main>
    {toast && (
      <div className="fixed bottom-6 right-6 z-50">
        <Toast
          message={toast.message}
          subText={toast.subText}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      </div>
    )}
    </>
  );
};

export default MainContent;
