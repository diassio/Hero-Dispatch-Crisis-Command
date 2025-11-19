
import React from 'react';
import { HeroStats, StatType } from '../types';
import { STAT_COLORS } from '../constants';

interface RadarChartProps {
  stats: HeroStats;
  overlayStats?: HeroStats; // Optional second dataset (e.g. Task Requirements)
  size?: number;
  showLabels?: boolean;
}

const RadarChart: React.FC<RadarChartProps> = ({ stats, overlayStats, size = 200, showLabels = true }) => {
  const center = size / 2;
  const radius = (size / 2) - (showLabels ? 30 : 5); // Leave room for labels
  const maxStatValue = 100;

  const statKeys = Object.values(StatType);
  const totalPoints = statKeys.length;

  // Helper to calculate points
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / totalPoints - Math.PI / 2;
    const r = (Math.min(value, maxStatValue) / maxStatValue) * radius; // Cap at maxStatValue for visual
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate polygon points for the main stats
  const points = statKeys.map((key, i) => {
    const val = stats[key];
    const { x, y } = getPoint(i, val);
    return `${x},${y}`;
  }).join(' ');

  // Generate polygon points for overlay stats if present
  const overlayPoints = overlayStats ? statKeys.map((key, i) => {
    const val = overlayStats[key];
    const { x, y } = getPoint(i, val);
    return `${x},${y}`;
  }).join(' ') : '';

  // Generate background webs (25%, 50%, 75%, 100%)
  const webs = [0.25, 0.5, 0.75, 1.0].map(scale => {
    return statKeys.map((_, i) => {
      const { x, y } = getPoint(i, maxStatValue * scale);
      return `${x},${y}`;
    }).join(' ');
  });

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Webs */}
        {webs.map((pointsStr, i) => (
          <polygon
            key={i}
            points={pointsStr}
            fill="none"
            stroke="#334155"
            strokeWidth="1"
            className={i === 3 ? 'stroke-slate-500' : ''}
          />
        ))}

        {/* Axis Lines */}
        {statKeys.map((_, i) => {
          const end = getPoint(i, maxStatValue);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="#334155"
              strokeWidth="1"
            />
          );
        })}

        {/* Overlay Polygon (Task Requirements) - Render BEHIND or WITH DIFFERENT STYLE */}
        {overlayStats && (
          <polygon
            points={overlayPoints}
            fill="rgba(251, 146, 60, 0.1)" // tech-orange with low opacity
            stroke="#fb923c" // tech-orange
            strokeWidth="2"
            strokeDasharray="4 2" // Dashed line
            className="filter drop-shadow-[0_0_4px_rgba(251,146,60,0.3)]"
          />
        )}

        {/* Main Data Polygon (Squad Stats) */}
        <polygon
          points={points}
          fill="rgba(45, 212, 191, 0.2)" // tech-teal with opacity
          stroke="#2dd4bf"
          strokeWidth="2"
          className="filter drop-shadow-[0_0_4px_rgba(45,212,191,0.5)]"
        />

        {/* Points on the polygon */}
        {statKeys.map((key, i) => {
          const { x, y } = getPoint(i, stats[key]);
          return (
            <circle key={i} cx={x} cy={y} r="3" fill="#2dd4bf" />
          );
        })}

        {/* Labels */}
        {showLabels && statKeys.map((key, i) => {
          const { x, y } = getPoint(i, maxStatValue + 15);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#94a3b8"
              fontSize="10"
              fontWeight="bold"
              className="uppercase"
            >
              {key.substring(0, 3)}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default RadarChart;
