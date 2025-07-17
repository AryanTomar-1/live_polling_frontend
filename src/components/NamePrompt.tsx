import React, { useState } from 'react';

interface NamePromptProps {
    onSubmit: (name: string) => void;
}

export default function NamePrompt({ onSubmit }: NamePromptProps) {
    const [tempName, setTempName] = useState('');

    const handleSubmit = () => {
        if (tempName.trim()) {
            onSubmit(tempName.trim());
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">

            <div className="flex items-center space-x-2 mb-6">
                <span
                    className="px-3 py-1 rounded-full font-medium text-sm flex items-center gap-2"
                    style={{ backgroundColor: '#7765DA', color: '#ffffff' }}
                >
                    <span>✨</span> Intervue Poll
                </span>
            </div>


            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Let’s <span className="font-bold text-black">Get Started</span>
            </h1>

            <p className="text-sm text-gray-500 max-w-md mb-8">
                If you’re a student, you’ll be able to <span className="font-semibold text-black">submit your answers</span>,
                participate in live polls, and see how your responses compare with your classmates
            </p>


            <div className="w-full max-w-sm space-y-4">
                <div className="text-left text-sm font-medium text-gray-700">Enter your Name</div>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-full font-medium hover:from-indigo-600 hover:to-purple-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={!tempName.trim()}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
