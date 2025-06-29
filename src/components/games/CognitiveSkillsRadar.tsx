import React from 'react';
import { Brain } from 'lucide-react';

interface SkillData {
  name: string;
  value: number;
}

interface CognitiveSkillsRadarProps {
  data: SkillData[];
}

export function CognitiveSkillsRadar({ data }: CognitiveSkillsRadarProps) {
  const maxValue = 100; // Maximum possible value
  const centerX = 100; // Center X coordinate
  const centerY = 100; // Center Y coordinate
  const radius = 80; // Radius of the radar chart
  
  // Calculate points for each skill
  const calculatePoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    const normalizedValue = value / maxValue;
    const x = centerX + radius * normalizedValue * Math.cos(angle);
    const y = centerY + radius * normalizedValue * Math.sin(angle);
    return { x, y };
  };
  
  // Generate polygon points for the radar chart
  const polygonPoints = data
    .map((skill, index) => {
      const point = calculatePoint(index, skill.value);
      return `${point.x},${point.y}`;
    })
    .join(' ');
  
  // Generate axis lines
  const axisLines = data.map((_, index) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x1: centerX, y1: centerY, x2: x, y2: y };
  });
  
  // Generate concentric circles
  const circles = [0.25, 0.5, 0.75, 1].map(factor => ({
    cx: centerX,
    cy: centerY,
    r: radius * factor
  }));

  return (
    <div className="w-full">
      <div className="flex items-center space-x-1 mb-2">
        <Brain className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-medium text-gray-700">Cognitive Skills Assessment</span>
      </div>
      
      <div className="relative w-full" style={{ paddingBottom: '100%' }}>
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full"
        >
          {/* Background circles */}
          {circles.map((circle, i) => (
            <circle
              key={i}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          ))}
          
          {/* Axis lines */}
          {axisLines.map((line, i) => (
            <line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Data polygon */}
          <polygon
            points={polygonPoints}
            fill="rgba(147, 51, 234, 0.2)"
            stroke="#9333ea"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {data.map((skill, i) => {
            const point = calculatePoint(i, skill.value);
            return (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="3"
                fill="#9333ea"
              />
            );
          })}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((skill, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{skill.name}</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-purple-600 h-1.5 rounded-full"
                  style={{ width: `${skill.value}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}