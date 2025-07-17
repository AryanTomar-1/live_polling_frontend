import React, { useState, useEffect } from 'react';
import PopupPanel from './PopupPanel';
import socket from '../sockets/socket';
import NotificationPopup from "./NotificationPopup";

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
}

const FloatingChatButton = ({ isTeacher }: { isTeacher: boolean }) => {
    const [open, setOpen] = useState(false);
    const [latestMessage, setLatestMessage] = useState<ChatMessage | null>(null);

    useEffect(() => {
        socket.on("chat_notify", (data: ChatMessage) => {
            setLatestMessage(data);
        });

        return () => {
            socket.off("chat_notify");
        };
    }, []);

    return (
        <>
            <button
                onClick={() => {
                    if(open){
                        setLatestMessage(null);
                    }
                    setOpen(!open);
                }}
                className="fixed bottom-6 right-6 bg-[#7765DA] w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white text-xl z-50"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                >
                    <path
                        d="M20 2H4C2.897 2 2 2.897 2 4v20l4-4h14c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM6 11c-.552 0-1-.449-1-1s.448-1 1-1 1 .449 1 1-.448 1-1 1zm5 0c-.552 0-1-.449-1-1s.448-1 1-1 1 .449 1 1-.448 1-1 1zm5 0c-.552 0-1-.449-1-1s.448-1 1-1 1 .449 1 1-.448 1-1 1z"
                    />
                </svg>
            </button>
            {open && (
                <div className="fixed bottom-20 right-6 z-50 shadow-xl rounded-lg bg-white border w-80">
                    <PopupPanel isTeacher={isTeacher} />
                </div>
            )}
            {!open && latestMessage && (
                <NotificationPopup
                    name={latestMessage.sender}
                    message={latestMessage.message}
                    onClose={() => setLatestMessage(null)}
                />
            )}
        </>
    );
};

export default FloatingChatButton;
