
import React from 'react';

interface BlockedDisplayProps {
  message: string;
}

const BlockedDisplay: React.FC<BlockedDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-100/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center border-2 border-red-300/50 animate-fade-in">
      <div className="text-6xl mb-4">🚫</div>
      <h2 className="text-3xl font-bold text-red-900 mb-4 drop-shadow-md">Acceso denegado</h2>
      <p className="text-xl text-red-800">{message}</p>
    </div>
  );
};

export default BlockedDisplay;
