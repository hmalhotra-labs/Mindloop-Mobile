import React from 'react';

interface SessionControlsProps {
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
}

export const SessionControls: React.FC<SessionControlsProps> = ({ 
  onPause, 
  onResume, 
  onStop 
}) => {
  return (
    <div>
      <button onClick={onPause}>Pause</button>
      <button onClick={onResume}>Resume</button>
      <button onClick={onStop}>Stop</button>
    </div>
  );
};