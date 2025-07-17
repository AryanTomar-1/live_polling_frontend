import React, { useEffect } from "react";

interface Props {
  name: string;
  message: string;
  onClose: () => void;
}

const NotificationPopup: React.FC<Props> = ({ name,message,onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose(); // auto-close after 3s
    }, 3000);
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg border-l-4 border-[#7765DA] p-4 rounded-md w-72 z-50 animate-slide-in">
      <p className="text-sm font-semibold text-gray-800">{name}</p>
      <p className="text-sm text-gray-600"> {message}</p>
    </div>
  );
};

export default NotificationPopup;
