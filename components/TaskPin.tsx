
import React from 'react';
import { Task } from '../types';
import { AlertTriangle, Clock, Skull, Zap } from 'lucide-react';

interface TaskPinProps {
  task: Task;
  onClick: () => void;
}

const TaskPin: React.FC<TaskPinProps> = ({ task, onClick }) => {
  const isPending = task.status === 'pending';
  const isActive = task.status === 'active';
  
  // Color coding based on difficulty
  const colors = {
    Easy: 'text-green-400 border-green-400 bg-green-400/10',
    Medium: 'text-yellow-400 border-yellow-400 bg-yellow-400/10',
    Hard: 'text-orange-500 border-orange-500 bg-orange-500/10',
    Extreme: 'text-red-500 border-red-500 bg-red-500/10',
  };
  
  const colorClass = colors[task.difficultyLevel];

  // Calculate position
  const style = {
    left: `${task.position?.x || 50}%`,
    top: `${task.position?.y || 50}%`,
  };

  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
      style={style}
      onClick={onClick}
    >
      {/* Ping Effect */}
      {isPending && (
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping-slow ${colorClass.split(' ')[0].replace('text-', 'bg-')}`}></span>
      )}
      
      {/* Icon Container */}
      <div className={`
        relative flex flex-col items-center justify-center
        transition-transform duration-200 group-hover:scale-110
      `}>
        
        <div className={`
           w-12 h-12 flex items-center justify-center 
           border-2 backdrop-blur-sm rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]
           ${isActive ? 'border-blue-400 bg-blue-500/20 animate-spin-slow' : colorClass}
           ${task.status === 'completed' ? 'border-emerald-500 bg-emerald-500/20' : ''}
           ${task.status === 'failed' ? 'border-red-600 bg-red-600/20' : ''}
        `}>
            {isActive ? (
                <Zap className="w-6 h-6 text-blue-400" />
            ) : (
                <AlertTriangle className="w-6 h-6" />
            )}
        </div>

        {/* Label (Visible on Hover) */}
        <div className={`
            absolute top-14 min-w-[150px] bg-slate-900/90 border border-slate-600 p-2 rounded clip-corner
            opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
            flex flex-col gap-1 z-30
        `}>
            <div className="text-xs font-bold text-white uppercase">{task.title}</div>
            <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span className={`font-bold ${colorClass.split(' ')[0]}`}>{task.difficultyLevel}</span>
                <div className="flex items-center gap-1">
                    <Clock size={10} />
                    <span className={task.timeToExpire < 15 ? 'text-red-400 animate-pulse' : ''}>{task.timeToExpire}s</span>
                </div>
            </div>
        </div>

        {/* Countdown Ring (SVG) */}
        {isPending && (
             <svg className="absolute top-0 left-0 w-12 h-12 -rotate-90 pointer-events-none">
                <circle
                    cx="24" cy="24" r="22"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="text-slate-800"
                />
                <circle
                    cx="24" cy="24" r="22"
                    fill="none"
                    strokeWidth="2"
                    strokeDasharray={138} // 2 * PI * 22
                    strokeDashoffset={138 * (1 - task.timeToExpire / 60)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    className={colorClass.split(' ')[0]}
                />
             </svg>
        )}

      </div>
    </div>
  );
};

export default TaskPin;
