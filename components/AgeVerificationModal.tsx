
import React from 'react';

interface AgeVerificationModalProps {
  onVerify: (isOfAge: boolean) => void;
}

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({ onVerify }) => {
  return (
    <div className="bg-white/30 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center border-2 border-white/50 animate-fade-in">
      <h2 className="text-4xl font-bold text-purple-900 mb-6 drop-shadow-md">¿Sos mayor de 18 años?</h2>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => onVerify(true)}
          className="bg-purple-700 text-white text-2xl font-bold py-3 px-8 rounded-lg border-4 border-yellow-400 hover:bg-purple-800 transition-all shadow-lg transform hover:scale-105"
        >
          Sí
        </button>
        <button
          onClick={() => onVerify(false)}
          className="bg-purple-700 text-white text-2xl font-bold py-3 px-8 rounded-lg border-4 border-yellow-400 hover:bg-purple-800 transition-all shadow-lg transform hover:scale-105"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
