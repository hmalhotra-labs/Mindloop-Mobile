import React from 'react';

interface ProgressIndicatorProps {
  progress: number;
  total: number;
  label: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress, total, label }) => {
  return (
    <div>
      <div>{label}: {progress}/{total}</div>
      <div>Progress: {((progress / total) * 100).toFixed(0)}%</div>
    </div>
  );
};