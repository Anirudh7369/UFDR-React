import React from 'react';
import ResultCard from './ResultCard';

const AIMessage = ({ message, resultCards }) => {
  return (
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary flex items-center justify-center">
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
        </svg>
      </div>
      <div className="flex-1 space-y-4">
        <p className="font-semibold text-primary">ForensicAnalyst AI</p>
        <div className="space-y-4 text-gray-300">
          {message.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          
          {resultCards && resultCards.map((card, index) => (
            <ResultCard
              key={index}
              title={card.title}
              description={card.description}
              attachment={card.attachment}
              listItems={card.listItems}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIMessage;