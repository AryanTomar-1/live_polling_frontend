import React, { useState } from 'react';
import ParticipantsList from './ParticipantsList';
import ChatPopup from './ChatPopup';

const PopupPanel = ({ isTeacher }: { isTeacher: boolean }) => {
  const [activeTab, setActiveTab] = useState('Participants');

  return (
    <div className="rounded-md border">
      <div className="flex border-b">
        {['Chat', 'Participants'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === tab
                ? 'border-b-2 border-purple-500 text-black'
                : 'text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-4 h-64 overflow-auto">
        {activeTab === 'Participants' && <ParticipantsList isTeacher={isTeacher} />}
        {activeTab === 'Chat' && <ChatPopup isTeacher={isTeacher} />}
      </div>
    </div>
  );
};

export default PopupPanel;
