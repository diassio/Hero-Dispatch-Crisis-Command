import React, { useEffect, useState } from 'react';
import { MovingSquad } from '../types';
import { ChevronsRight, Home } from 'lucide-react';

interface SquadMarkerProps {
  squad: MovingSquad;
  onComplete: (squadId: string) => void;
  tick: number; // Add tick prop for animation updates
}

const SquadMarker: React.FC<SquadMarkerProps> = ({ squad, onComplete, tick }) => {
  const [position, setPosition] = useState(squad.startPos);

  useEffect(() => {
    const startTime = squad.startTime;
    const duration = squad.duration;
    const now = Date.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // If no waypoints or direct path, use simple interpolation
    if (!squad.waypoints || squad.waypoints.length === 0) {
      const x = squad.startPos.x + (squad.endPos.x - squad.startPos.x) * progress;
      const y = squad.startPos.y + (squad.endPos.y - squad.startPos.y) * progress;
      setPosition({ x, y });
      return;
    }

    // Waypoint logic
    // Total path includes start -> waypoints -> end
    const allPoints = [squad.startPos, ...squad.waypoints, squad.endPos];

    // Calculate total distance to normalize progress
    let totalDistance = 0;
    const distances: number[] = [];
    for (let i = 0; i < allPoints.length - 1; i++) {
      const p1 = allPoints[i];
      const p2 = allPoints[i + 1];
      const d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      distances.push(d);
      totalDistance += d;
    }

    // Find which segment we are on
    const currentDist = totalDistance * progress;
    let accumulatedDist = 0;

    for (let i = 0; i < distances.length; i++) {
      if (currentDist <= accumulatedDist + distances[i]) {
        // We are on this segment
        const segmentProgress = (currentDist - accumulatedDist) / distances[i];
        const p1 = allPoints[i];
        const p2 = allPoints[i + 1];
        const x = p1.x + (p2.x - p1.x) * segmentProgress;
        const y = p1.y + (p2.y - p1.y) * segmentProgress;
        setPosition({ x, y });
        return;
      }
      accumulatedDist += distances[i];
    }

    // Fallback to end pos if something goes wrong or finished
    setPosition(squad.endPos);

  }, [squad, tick]); // Re-run on game tick

  // Use ref for callback to avoid re-triggering effect when parent re-renders
  const onCompleteRef = React.useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Handle completion
  useEffect(() => {
    const timer = setTimeout(() => {
      onCompleteRef.current(squad.id);
    }, squad.duration);
    return () => clearTimeout(timer);
  }, [squad.id, squad.duration]);

  const isReturn = squad.type === 'return';

  return (
    <div
      className="absolute z-40 pointer-events-none flex items-center justify-center"
      style={{
        left: `${position.x}% `,
        top: `${position.y}% `,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Pulse Ring */}
      <div className={`absolute w-full h-full rounded-full animate-ping opacity-50 ${isReturn ? 'bg-emerald-500' : 'bg-tech-teal'}`}></div>

      {/* Marker Body */}
      <div className={`
        relative w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]
        ${isReturn
          ? 'bg-emerald-500/80 border-emerald-300 text-emerald-100'
          : 'bg-tech-teal/80 border-teal-200 text-teal-900'
        }
`}>
        {isReturn ? <Home size={14} /> : <ChevronsRight size={16} />}
      </div>

      {/* Squad Count Badge */}
      <div className="absolute -top-2 -right-2 bg-slate-900 border border-slate-600 text-[10px] text-white w-4 h-4 flex items-center justify-center rounded-full">
        {squad.heroIds.length}
      </div>

      {/* Label */}
      <div className="absolute top-8 whitespace-nowrap text-[10px] font-bold bg-black/50 px-1 rounded text-white backdrop-blur-sm">
        {isReturn ? 'RTB' : 'DEPLOYING'}
      </div>
    </div>
  );
};

export default SquadMarker;