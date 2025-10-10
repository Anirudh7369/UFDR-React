import React from 'react';

const UserMessage = ({ message }) => {
  return (
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-accent-dark flex items-center justify-center">
        <span className="font-semibold text-white">JD</span>
      </div>
      <div className="flex-1 rounded-lg bg-accent-dark p-4">
        <p className="font-semibold text-white">User</p>
        <p className="text-gray-300">
          {message}
        </p>
      </div>
    </div>
  );
};

export default UserMessage;