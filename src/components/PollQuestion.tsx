import React from 'react';
import socket from '../sockets/socket';

export default function PollQuestion({
  question,
  options,
  onAnswered,
}: {
  question: string;
  options: string[];
  onAnswered: () => void;
}) {
  const handleAnswer = (option: string) => {
    socket.emit('submit_answer', { option });
    onAnswered();
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-[#F6F7FB] px-4">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-xl text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">{question}</h2>
        <div className="space-y-4">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-3 rounded-md transition"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
