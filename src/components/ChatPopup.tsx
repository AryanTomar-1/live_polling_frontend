import React, { useEffect, useRef, useState } from 'react';
import socket from '../sockets/socket';

interface ChatMessage {
    id: string;
    sender: string;
    message: string;
    timestamp: string;
}

const ChatPopup = ({ isTeacher }: { isTeacher: boolean }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [name, setName] = useState<string>('');
    const [id, setId] = useState<string>('');

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        const storedName = isTeacher ? 'Teacher' : localStorage.getItem('studentName') ?? '';
        const storedId = isTeacher ? '1' : localStorage.getItem('studentId') ?? '';
        setId(storedId);
        setName(storedName);

        // Request chat history from backend
        socket.emit('get_chat_history');

        // Receive full history
        socket.on('chat_history', (history: ChatMessage[]) => {
            setMessages(history);
        });

        // Receive new chat messages
        socket.on('chat_message', (data: ChatMessage) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.off('chat_history');
            socket.off('chat_message');
        };
    }, [isTeacher]);

    const sendMessage = () => {
        if (!input.trim()) return;
        const msg: ChatMessage = {
            id: id,
            sender: name,
            message: input,
            timestamp: new Date().toLocaleTimeString(),
        };
        socket.emit('chat_message', msg);
        setInput('');
    };

    return (
        <div className="h-60 flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-sm">
                {messages.length === 0 ? (
                    <div className="text-gray-400 text-sm italic">No messages yet.</div>
                ) : (
                    messages.map((msg, index) => {
                        const isOwn = msg.id === id;
                        return (
                            <div key={index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                <div className="max-w-[75%]">
                                    <div className={`text-xs font-semibold mb-0.5 ${isOwn ? 'text-purple-700 text-right' : 'text-blue-700 text-left'}`}>
                                        {msg.sender}
                                    </div>
                                    <div
                                        className={`px-3 py-2 rounded-lg text-white text-sm break-words ${isOwn
                                            ? 'bg-purple-500 text-right rounded-tr-none'
                                            : 'bg-gray-800 text-left rounded-tl-none'
                                            }`}
                                    >
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-2 border-t flex gap-2">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault(); // prevent newline
                            sendMessage(); // your send message function
                        }
                    }}
                    rows={2}
                    className="flex-1 text-sm px-3 py-1 border rounded-md focus:outline-none resize-none"
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    className="bg-[#7765DA] text-white px-4 py-1 rounded-md text-sm hover:bg-[#6654c7] transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatPopup;
