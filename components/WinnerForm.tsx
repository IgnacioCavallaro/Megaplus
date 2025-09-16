import React, { useState } from 'react';

interface WinnerFormProps {
  prize: number;
  onSubmit: (details: { fullName: string; phone: string; email: string }) => void;
}

const WinnerForm: React.FC<WinnerFormProps> = ({ prize, onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = 'El nombre es obligatorio.';
    if (!/^\d{8,}$/.test(phone)) newErrors.phone = 'Ingresá un teléfono válido (mín. 8 dígitos).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Ingresá un email válido.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        onSubmit({ fullName, phone, email });
      }, 1000);
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center border-2 border-white/50 animate-fade-in w-full max-w-md">
      <h2 className="text-3xl font-bold text-purple-900 mb-2 drop-shadow-md">¡Casi listo!</h2>
      <p className="text-lg text-purple-800 mb-4">Completá tus datos para reclamar tu premio de <span className="font-bold text-yellow-500">${prize.toLocaleString('es-AR')}</span>.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nombre y Apellido"
              className={`w-full text-center text-xl p-3 rounded-lg border-2 ${errors.fullName ? 'border-red-500 bg-red-100' : 'border-purple-300'} focus:ring-4 focus:ring-yellow-400 focus:border-purple-500 outline-none transition`}
            />
            {errors.fullName && <p className="text-red-800 text-sm mt-1">{errors.fullName}</p>}
        </div>
        
        <div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="Teléfono (Ej: 1122334455)"
              className={`w-full text-center text-xl p-3 rounded-lg border-2 ${errors.phone ? 'border-red-500 bg-red-100' : 'border-purple-300'} focus:ring-4 focus:ring-yellow-400 focus:border-purple-500 outline-none transition`}
            />
            {errors.phone && <p className="text-red-800 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo Electrónico"
              className={`w-full text-center text-xl p-3 rounded-lg border-2 ${errors.email ? 'border-red-500 bg-red-100' : 'border-purple-300'} focus:ring-4 focus:ring-yellow-400 focus:border-purple-500 outline-none transition`}
            />
            {errors.email && <p className="text-red-800 text-sm mt-1">{errors.email}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-purple-700 text-white text-2xl font-bold py-3 px-8 rounded-lg border-4 border-yellow-400 hover:bg-purple-800 transition-all shadow-lg transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando...' : 'Reclamar Premio'}
        </button>
      </form>
    </div>
  );
};

export default WinnerForm;
