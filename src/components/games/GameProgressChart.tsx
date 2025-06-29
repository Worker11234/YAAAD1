import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ProgressDataPoint {
  date: string;
  score: number;
}

interface GameProgressChartProps {
  data: ProgressDataPoint[];
  height?: number;
}

export function GameProgressChart({ data, height = 150 }: GameProgressChartProps) {
  const maxScore = Math.max(...data.map(d => d.score));
  const minScore = Math.min(...data.map(d => d.score));
  const range = maxScore - minScore;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getHeight = (score: number) => {
    if (range === 0) return 50; // Default height if all scores are the same
    return ((score - minScore) / range) * 80 + 10; // 10% to 90% of height
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">Performance Trend</span>
        </div>
        <span className="text-xs text-gray-500">Last 7 days</span>
      </div>
      
      <div className="relative" style={{ height: `${height}px` }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-500">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-8 h-full flex items-end">
          <div className="flex-1 h-full flex items-end justify-between relative">
            {/* Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="border-t border-gray-200 w-full h-0" />
              ))}
            </div>
            
            {/* Data bars */}
            <div className="absolute inset-0 flex justify-between items-end">
              {data.map((point, index) => (
                <div key={index} className="flex flex-col items-center w-8">
                  <div 
                    className="w-6 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-md"
                    style={{ height: `${getHeight(point.score)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* X-axis labels */}
        <div className="ml-8 mt-2 flex justify-between text-xs text-gray-500">
          {data.map((point, index) => (
            <div key={index} className="w-8 text-center">
              {formatDate(point.date)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Current score */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Current Score:</span>
        <span className={`text-lg font-bold ${getScoreColor(data[data.length - 1].score)}`}>
          {data[data.length - 1].score}%
        </span>
      </div>
    </div>
  );
}