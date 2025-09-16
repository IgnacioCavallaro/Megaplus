
import React from 'react';

// FIX: Added style prop to allow dynamic styling of stars.
const StarIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
      clipRule="evenodd"
    />
  </svg>
);

const Logo: React.FC = () => (
  <div className="relative flex items-center justify-center my-8">
    <StarIcon className="absolute text-yellow-400 w-64 h-64 opacity-90 filter drop-shadow-lg" />
    <StarIcon className="absolute text-yellow-300 w-64 h-64 transform rotate-12 opacity-80 filter drop-shadow-lg" />
    <div className="relative z-10 text-center">
      <h1
        className="text-7xl font-bold text-white uppercase"
        style={{ WebkitTextStroke: '3px #4c1d95' }}
      >
        Mega
      </h1>
      <h2
        className="text-8xl font-bold text-white uppercase -mt-4"
        style={{ WebkitTextStroke: '3px #4c1d95' }}
      >
        Plu$
      </h2>
    </div>
  </div>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 text-purple-900 overflow-hidden relative">
       {/* Stars background effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const size = Math.random() * 3 + 1;
          const style = {
            width: `${size}rem`,
            height: `${size}rem`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${Math.random() * 5 + 3}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          };
          return <StarIcon key={i} className="absolute text-white/30" style={style} />;
        })}
      </div>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
      
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <Logo />
        <div className="w-full max-w-md">{children}</div>
        <footer className="absolute bottom-4 text-center w-full text-purple-800/60 text-sm">
            <p>Juego exclusivo para mayores de 18 años.</p>
            <p>&copy; {new Date().getFullYear()} Mega Plu$ Entertainment</p>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
