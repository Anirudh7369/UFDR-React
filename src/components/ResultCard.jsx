import React from 'react';

const ResultCard = ({ title, description, attachment, listItems }) => {
  return (
    <div className="rounded-lg border border-gray-700 bg-accent-dark p-4">
      <h4 className="font-semibold text-white mb-2">{title}</h4>
      
      {description && (
        <p className="text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: description }} />
      )}
      
      {attachment && (
        <button className="mt-3 flex items-center gap-2 text-sm text-primary hover:underline">
          <span className="material-symbols-outlined text-base">attachment</span>
          {attachment}
        </button>
      )}
      
      {listItems && (
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
          {listItems.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResultCard;