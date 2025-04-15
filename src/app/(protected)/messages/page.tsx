import React from 'react';
import Main from './components/Main';

const Messages = async () => {
  return (
    <div className="px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl font-semibold text-secondary-foreground mb-4">
          Messages
        </h3>
        <Main />
      </div>
    </div>
  );
};

export default Messages;
