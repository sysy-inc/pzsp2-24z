import React, { useState } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow">
      {message}
      <button onClick={onClose} className="ml-4">Close</button>
    </div>
  );
};

export default Toast;
