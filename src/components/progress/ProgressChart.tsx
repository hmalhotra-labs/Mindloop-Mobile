import React from 'react';

interface ProgressChartProps {
  data: Array<{ date: string; completed: boolean; }>;
  type: 'daily' | 'weekly' | 'monthly';
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, type }) => {
  return (
    <div>
      <div>Progress Chart - {type}</div>
      <div>Data points: {data.length}</div>
    </div>
  );
};