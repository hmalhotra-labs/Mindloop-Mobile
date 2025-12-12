import React from 'react';

interface BreathingScreenProps {
  onBack?: () => void;
}

export const BreathingScreen: React.FC<BreathingScreenProps> = ({ onBack }) => {
  return <div>Breathing Screen</div>;
};