// Mock databases
const db1: string[] = ['11111111', '22222222', '10000001']; // Prize $8000
const db2: string[] = ['33333333', '44444444', '10000002']; // Prize $5000
const db3: string[] = ['55555555', '66666666', '10000003']; // Prize $1000

interface PrizeResult {
  prize: number;
}

interface ErrorResult {
  error: string;
}

export const checkDni = (dni: string): Promise<PrizeResult | ErrorResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!/^\d{7,8}$/.test(dni)) {
        resolve({ error: 'Por favor, ingresa un DNI válido (7 u 8 dígitos).' });
        return;
      }
      if (db1.includes(dni)) {
        resolve({ prize: 8000 });
      } else if (db2.includes(dni)) {
        resolve({ prize: 5000 });
      } else if (db3.includes(dni)) {
        resolve({ prize: 1000 });
      } else {
        // Default prize for any other valid DNI to allow gameplay
        resolve({ prize: 500 });
      }
    }, 500); // Simulate network delay
  });
};