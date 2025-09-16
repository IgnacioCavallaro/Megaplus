import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

// --- ICONS ---
// A collection of simple SVG icons to be used as symbols in the game.
const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M13.28 3.47a.75.75 0 10-1.06-1.06l-7.5 7.5a.75.75 0 000 1.06l7.5 7.5a.75.75 0 001.06-1.06L6.81 12l6.47-6.47z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M5.25 3a.75.75 0 000 1.5h13.5a.75.75 0 000-1.5H5.25zM12 6a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V6.75A.75.75 0 0112 6zM3.75 8.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" clipRule="evenodd" transform="matrix(.7071 -.7071 .7071 .7071 -4.97 12)" />
    </svg>
);
const CoinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v2.25H9.75a.75.75 0 000 1.5h1.5v1.5h-1.5a.75.75 0 000 1.5h1.5v2.25a.75.75 0 001.5 0v-2.25h1.5a.75.75 0 000-1.5h-1.5v-1.5h1.5a.75.75 0 000-1.5h-1.5V6z" clipRule="evenodd" />
    </svg>
);
const DiamondIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.25 15.75-4.25-4.25-4.25 4.25-1.5-1.5 4.25-4.25-4.25-4.25 1.5-1.5 4.25 4.25 4.25-4.25 1.5 1.5-4.25 4.25 4.25 4.25-1.5 1.5z" />
    </svg>
);
const CherryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM8.25 12a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zm1.5.75a.75.75 0 000-1.5h-.75a.75.75 0 000 1.5h.75zm1.5-.75a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zm1.5.75a.75.75 0 000-1.5h-.75a.75.75 0 000 1.5h.75zm1.5-.75a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zm1.5.75a.75.75 0 000-1.5h-.75a.75.75 0 000 1.5h.75zM9 15a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zm1.5.75a.75.75 0 000-1.5h-.75a.75.75 0 000 1.5h.75zm1.5-.75a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75z" clipRule="evenodd" />
    </svg>
);

const SYMBOLS = [
    { name: 'Crown', Icon: CrownIcon, color: 'text-yellow-400' },
    { name: 'Coin', Icon: CoinIcon, color: 'text-amber-500' },
    { name: 'Diamond', Icon: DiamondIcon, color: 'text-cyan-400' },
    { name: 'Cherry', Icon: CherryIcon, color: 'text-red-500' },
];

interface ScratchableCellProps {
  SymbolIcon: React.FC<{ className?: string }>;
  iconClassName: string;
  isWinning: boolean;
  isRevealed: boolean;
  onReveal: () => void;
}

// --- SCRATCHABLE CELL ---
// A single scratchable area. Manages its own canvas and scratch logic.
const ScratchableCell: React.FC<ScratchableCellProps> = ({ SymbolIcon, iconClassName, isWinning, isRevealed, onReveal }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isCompleted = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#e4e4e7');
        gradient.addColorStop(0.5, '#a1a1aa');
        gradient.addColorStop(1, '#52525b');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let isScratching = false;

        const getPosition = (event: MouseEvent | TouchEvent) => {
            const canvasRect = canvas.getBoundingClientRect();
            if (event instanceof MouseEvent) {
                return { x: event.clientX - canvasRect.left, y: event.clientY - canvasRect.top };
            }
            if (event.touches[0]) {
                return { x: event.touches[0].clientX - canvasRect.left, y: event.touches[0].clientY - canvasRect.top };
            }
            return { x: 0, y: 0 };
        };

        const scratch = (event: MouseEvent | TouchEvent) => {
          if (!isScratching || isCompleted.current) return;
          event.preventDefault();
          const { x, y } = getPosition(event);
          ctx.globalCompositeOperation = 'destination-out';
          ctx.beginPath();
          const brushSize = canvas.width / 4;
          ctx.arc(x, y, brushSize, 0, Math.PI * 2);
          ctx.fill();
        };

        const checkCompletion = () => {
            if (!ctx || isCompleted.current) return;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let transparentPixels = 0;
            for (let i = 3; i < imageData.data.length; i += 4) {
                if (imageData.data[i] === 0) {
                    transparentPixels++;
                }
            }
            if ((transparentPixels / (canvas.width * canvas.height)) > 0.6) {
                isCompleted.current = true;
                canvas.style.transition = 'opacity 0.5s';
                canvas.style.opacity = '0';
                onReveal();
            }
        };

        const startScratching = (e: MouseEvent | TouchEvent) => { isScratching = true; scratch(e); };
        const stopScratching = () => { if(isScratching) { isScratching = false; checkCompletion();} };

        canvas.addEventListener('mousedown', startScratching);
        canvas.addEventListener('mousemove', scratch);
        window.addEventListener('mouseup', stopScratching);
        canvas.addEventListener('touchstart', startScratching, { passive: false });
        canvas.addEventListener('touchmove', scratch, { passive: false });
        window.addEventListener('touchend', stopScratching);

        return () => {
            canvas.removeEventListener('mousedown', startScratching);
            canvas.removeEventListener('mousemove', scratch);
            window.removeEventListener('mouseup', stopScratching);
            canvas.removeEventListener('touchstart', startScratching);
            canvas.removeEventListener('touchmove', scratch);
            window.removeEventListener('touchend', stopScratching);
        };
    }, [onReveal]);

    const winningClass = isRevealed && isWinning ? 'animate-pulse scale-110 shadow-lg' : '';
    const revealedClass = isRevealed ? 'bg-yellow-200' : 'bg-gray-200';

    return (
        <div className={`relative w-full aspect-square rounded-lg shadow-inner overflow-hidden transition-all duration-500 ${revealedClass} ${winningClass}`}>
            <div className="absolute inset-0 flex items-center justify-center z-0 p-2">
                <SymbolIcon className={`w-full h-full ${iconClassName} drop-shadow-lg`} />
            </div>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing rounded-lg"></canvas>
        </div>
    );
};

// --- MAIN SCRATCH CARD COMPONENT ---
interface ScratchCardProps {
  prize: number;
  onComplete: () => void;
}

type GridItem = {
    id: number;
    symbol: typeof SYMBOLS[0];
    isRevealed: boolean;
};

const ScratchCard: React.FC<ScratchCardProps> = ({ prize, onComplete }) => {
    const [grid, setGrid] = useState<GridItem[]>([]);
    const [revealedCounts, setRevealedCounts] = useState<Record<string, number>>({});
    const [isWon, setIsWon] = useState(false);
    const winningSymbolName = useRef<string | null>(null);

    // Generate the game grid on mount
    useEffect(() => {
        const winningSymbolIndex = Math.floor(Math.random() * SYMBOLS.length);
        const winningSymbol = SYMBOLS[winningSymbolIndex];
        winningSymbolName.current = winningSymbol.name;

        const losingSymbols = SYMBOLS.filter((_, index) => index !== winningSymbolIndex);
        const gridSymbols = [winningSymbol, winningSymbol, winningSymbol];

        for (let i = 0; i < 6; i++) {
            gridSymbols.push(losingSymbols[i % losingSymbols.length]);
        }
        
        // Shuffle the grid
        for (let i = gridSymbols.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gridSymbols[i], gridSymbols[j]] = [gridSymbols[j], gridSymbols[i]];
        }

        setGrid(gridSymbols.map((symbol, id) => ({ id, symbol, isRevealed: false })));
    }, []);

    const handleReveal = useCallback((symbolName: string, id: number) => {
        // Prevent updates after winning
        if (isWon) return;

        setGrid(prevGrid => prevGrid.map(item => item.id === id ? { ...item, isRevealed: true } : item));
        
        const newCounts = { ...revealedCounts };
        newCounts[symbolName] = (newCounts[symbolName] || 0) + 1;
        setRevealedCounts(newCounts);

        if (newCounts[symbolName] === 3) {
            setIsWon(true);
            setTimeout(() => {
                onComplete();
            }, 1500); // Wait for animation before proceeding
        }
    }, [revealedCounts, onComplete, isWon]);

  return (
    <div className="w-full max-w-sm mx-auto bg-white p-1.5 rounded-2xl shadow-2xl animate-fade-in">
        <div className="flex flex-col w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-300 to-green-600 rounded-lg p-3 text-white">
            <div className="relative text-center mb-2">
                <span className="absolute top-0 right-0 bg-black text-yellow-300 text-lg font-bold px-2 py-0.5 rounded-md transform -rotate-6">$700</span>
                <h2 className="text-4xl font-black text-yellow-300 uppercase" style={{ WebkitTextStroke: '2px #059669' }}>Sapo</h2>
                 <p className="font-bold text-xl text-center text-purple-900 mt-2">
                    ¡IGUALÁ 3 SÍMBOLOS Y GANÁ!
                </p>
                <p className="text-5xl font-black text-yellow-400 drop-shadow-lg" style={{ WebkitTextStroke: '2px #4c1d95' }}>
                    ${prize.toLocaleString('es-AR')}
                </p>
            </div>

            {/* Scratch Grid */}
            <div className="grid grid-cols-3 gap-2 p-2 bg-green-800/50 rounded-lg">
                {grid.map((item) => (
                    <ScratchableCell
                        key={item.id}
                        SymbolIcon={item.symbol.Icon}
                        iconClassName={item.symbol.color}
                        isWinning={isWon && item.symbol.name === winningSymbolName.current}
                        isRevealed={item.isRevealed}
                        onReveal={() => handleReveal(item.symbol.name, item.id)}
                    />
                ))}
            </div>
        </div>
    </div>
  );
};

export default ScratchCard;
