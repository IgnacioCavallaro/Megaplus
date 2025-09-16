import React, { useState, useCallback } from 'react';
import AgeVerificationModal from './components/AgeVerificationModal';
import DniInputForm from './components/DniInputForm';
import ScratchCard from './components/ScratchCard';
import WinnerDisplay from './components/WinnerDisplay';
import BlockedDisplay from './components/BlockedDisplay';
import WinnerForm from './components/WinnerForm'; // Import the new form component
import Layout from './components/Layout';
import { checkDni } from './services/dniService';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.AGE_CHECK);
  const [prize, setPrize] = useState<number | null>(null);
  const [dni, setDni] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAgeVerification = (isOfAge: boolean) => {
    if (isOfAge) {
      setAppState(AppState.DNI_INPUT);
    } else {
      setErrorMessage('Lo sentimos, debes ser mayor de 18 años para ingresar.');
      setAppState(AppState.BLOCKED);
    }
  };

  const handleDniSubmit = useCallback(async (submittedDni: string) => {
    const playedDnis = JSON.parse(localStorage.getItem('playedDnis') || '[]');
    if (playedDnis.includes(submittedDni)) {
      setErrorMessage('Este DNI ya ha participado. ¡Gracias por jugar!');
      setAppState(AppState.BLOCKED);
      return;
    }

    const result = await checkDni(submittedDni);
    if ('error' in result) {
      setErrorMessage(result.error);
    } else {
      setDni(submittedDni);
      setPrize(result.prize);
      setAppState(AppState.SCRATCH_GAME);
      setErrorMessage('');
    }
  }, []);

  const handleGameWon = useCallback(() => {
    // Transition to the form filling state instead of directly to winner
    setAppState(AppState.FILLING_FORM);
  }, []);

  const handleFormSubmit = useCallback((formData: { fullName: string; phone: string; email: string }) => {
    console.log('Winner details submitted:', { dni, prize, ...formData });
    
    // Save DNI to prevent re-playing only after form submission
    const playedDnis = JSON.parse(localStorage.getItem('playedDnis') || '[]');
    localStorage.setItem('playedDnis', JSON.stringify([...playedDnis, dni]));
    
    setAppState(AppState.WINNER);
  }, [dni, prize]);


  const renderContent = () => {
    switch (appState) {
      case AppState.AGE_CHECK:
        return <AgeVerificationModal onVerify={handleAgeVerification} />;
      case AppState.DNI_INPUT:
        return <DniInputForm onSubmit={handleDniSubmit} errorMessage={errorMessage} />;
      case AppState.SCRATCH_GAME:
        return prize && <ScratchCard prize={prize} onComplete={handleGameWon} />;
      case AppState.FILLING_FORM:
        return prize && <WinnerForm prize={prize} onSubmit={handleFormSubmit} />;
      case AppState.WINNER:
        return prize && <WinnerDisplay prize={prize} />;
      case AppState.BLOCKED:
        return <BlockedDisplay message={errorMessage} />;
      default:
        return null;
    }
  };

  return <Layout>{renderContent()}</Layout>;
};

export default App;
