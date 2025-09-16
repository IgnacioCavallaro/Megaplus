
import React, { useState } from 'react';

interface DniInputFormProps {
  onSubmit: (dni: string) => void;
  errorMessage: string;
}

const DniInputForm: React.FC<DniInputFormProps> = ({ onSubmit, errorMessage }) => {
  const [dni, setDni] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onSubmit(dni);
    // The loading state will be reset by the parent component re-rendering
    // or we can add a timeout if it stays on the same page for error.
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="bg-white/30 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center border-2 border-white/50 animate-fade-in">
      <h2 className="text-3xl font-bold text-purple-900 mb-4 drop-shadow-md">¡Ingresá tu DNI para jugar!</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={dni}
          onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
          placeholder="Tu DNI sin puntos"
          maxLength={8}
          className="text-center text-2xl p-3 rounded-lg border-2 border-purple-300 focus:ring-4 focus:ring-yellow-400 focus:border-purple-500 outline-none transition"
        />
        <button
          type="submit"
          disabled={isLoading || dni.length < 7}
          className="bg-purple-700 text-white text-2xl font-bold py-3 px-8 rounded-lg border-4 border-yellow-400 hover:bg-purple-800 transition-all shadow-lg transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? 'Verificando...' : '¡Jugar Ahora!'}
        </button>
        {errorMessage && <p className="text-red-800 bg-red-200 p-3 rounded-lg mt-2">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default DniInputForm;
