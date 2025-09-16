
import React, { useEffect, useState } from 'react';

const ConfettiPiece: React.FC<{ initialX: number; initialY: number; rotation: number; color: string }> = ({ initialX, initialY, rotation, color }) => {
  return (
    <div
      className="absolute w-3 h-5"
      style={{
        left: `${initialX}vw`,
        top: `${initialY}vh`,
        transform: `rotate(${rotation}deg)`,
        backgroundColor: color,
        animation: `fall ${Math.random() * 2 + 3}s linear forwards`,
      }}
    ></div>
  );
};

const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 150 }).map((_, index) => {
      const colors = ['#fde047', '#a855f7', '#facc15', '#ddd6fe'];
      return (
        <ConfettiPiece
          key={index}
          initialX={Math.random() * 100}
          initialY={-10 - Math.random() * 20}
          rotation={Math.random() * 360}
          color={colors[Math.floor(Math.random() * colors.length)]}
        />
      );
    });
    setPieces(newPieces);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-20">
      <style>
        {`
          @keyframes fall {
            to {
              transform: translateY(120vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}
      </style>
      {pieces}
    </div>
  );
};

interface WinnerDisplayProps {
  prize: number;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ prize }) => {
  return (
    <div className="relative bg-white/30 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center border-2 border-white/50 animate-fade-in w-full">
      <Confetti />
      <div className="relative z-10">
        <h2 className="text-5xl md:text-6xl font-bold text-purple-900 mb-4 drop-shadow-md animate-bounce">
          🎉 ¡Felicitaciones! 🎉
        </h2>
        <p className="text-2xl mb-2 text-purple-800">Ganaste</p>
        <p className="text-7xl md:text-8xl font-black text-yellow-500 drop-shadow-lg" style={{ WebkitTextStroke: '2px #4c1d95' }}>
          ${prize.toLocaleString('es-AR')}
        </p>
        <p className="mt-6 text-purple-800">Pronto nos contactaremos para coordinar la entrega de tu premio.</p>
      </div>
    </div>
  );
};

export default WinnerDisplay;
