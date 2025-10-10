import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const AIMessageWithTyping = ({ fullContent }) => {
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    if (fullContent) {
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedContent(fullContent.slice(0, i));
        i++;
        if (i > fullContent.length) {
          clearInterval(intervalId);
        }
      }, 20); // Typing speed in milliseconds

      return () => clearInterval(intervalId);
    }
  }, [fullContent]);

  return (
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary flex items-center justify-center">
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
        </svg>
      </div>
      <div className="flex-1 space-y-4">
        <p className="font-semibold text-primary">ForensicAnalyst AI</p>
        <div className="prose prose-invert prose-sm max-w-none text-gray-300">
          <ReactMarkdown
            components={{
              // Custom styling for markdown elements
              h1: ({ children }) => <h1 className="text-xl font-bold text-white mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-semibold text-white mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-semibold text-white mb-2">{children}</h3>,
              p: ({ children }) => <p className="text-gray-300 mb-2">{children}</p>,
              strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
              ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-gray-300">{children}</ul>,
              li: ({ children }) => <li className="text-gray-300">{children}</li>,
              code: ({ children }) => <code className="bg-accent-dark px-2 py-1 rounded text-primary">{children}</code>,
            }}
          >
            {displayedContent}
          </ReactMarkdown>
          {displayedContent && displayedContent.length < fullContent.length && (
            <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1"></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIMessageWithTyping;