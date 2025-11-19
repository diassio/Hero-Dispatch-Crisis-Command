import React from 'react';
import { Task, StatType } from '../types';
import { STAT_COLORS, STAT_ICONS } from '../constants';
import { Clock, AlertTriangle, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
}

const DifficultyBadge: React.FC<{ level: string }> = ({ level }) => {
  const colors = {
    Easy: 'bg-green-500/20 text-green-400 border-green-500/50',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    Hard: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    Extreme: 'bg-red-500/20 text-red-400 border-red-500/50',
  };
  
  const color = colors[level as keyof typeof colors] || colors.Medium;

  return (
    <span className={`text-xs px-2 py-0.5 rounded border ${color} uppercase font-bold tracking-wider`}>
      {level}
    </span>
  );
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onSelect }) => {
  const isProcessing = task.status === 'active';
  
  // Calculate percentage for progress bar if active
  const progress = isProcessing 
    ? ((task.duration - (task.timeToExpire || 0)) / task.duration) * 100 // Note: logic handled in parent, this is visual
    : ((task.timeToExpire) / 60) * 100; // Visual decay for pending tasks

  return (
    <div 
      className={`
        relative rounded-xl border p-5 transition-all duration-300
        bg-slate-900/80 backdrop-blur-sm
        ${task.status === 'pending' ? 'border-slate-700 hover:border-tech-accent cursor-pointer' : ''}
        ${task.status === 'active' ? 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : ''}
        ${task.status === 'completed' ? 'border-green-500/50' : ''}
        ${task.status === 'failed' ? 'border-red-500/50' : ''}
      `}
      onClick={() => task.status === 'pending' && onSelect(task)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DifficultyBadge level={task.difficultyLevel} />
            {task.status === 'pending' && (
               <span className={`text-xs font-mono flex items-center gap-1 ${task.timeToExpire < 15 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>
                 <Clock size={12} /> {task.timeToExpire}s
               </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white leading-tight">{task.title}</h3>
        </div>
        
        {task.status === 'active' && (
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 animate-spin">
            <span className="block w-2 h-2 bg-current rounded-full"></span>
          </div>
        )}
      </div>

      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{task.description}</p>

      {task.status !== 'pending' ? (
        <div className="space-y-2 animate-in fade-in">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Required Assets</div>
          <div className="flex flex-wrap gap-2">
              <div className={`px-2 py-1 rounded bg-slate-800 border border-slate-700 flex items-center gap-2 text-xs ${STAT_COLORS[task.requirements.primaryStat]}`}>
                  <span>{STAT_ICONS[task.requirements.primaryStat]}</span>
                  <span className="font-bold">{task.requirements.primaryStat}</span>
                  <span className="font-mono bg-black/20 px-1 rounded">{task.requirements.primaryValue}+</span>
              </div>
              {task.requirements.secondaryStat && (
                  <div className={`px-2 py-1 rounded bg-slate-800 border border-slate-700 flex items-center gap-2 text-xs ${STAT_COLORS[task.requirements.secondaryStat]}`}>
                  <span>{STAT_ICONS[task.requirements.secondaryStat]}</span>
                  <span className="font-bold">{task.requirements.secondaryStat}</span>
                  <span className="font-mono bg-black/20 px-1 rounded">{task.requirements.secondaryValue}+</span>
              </div>
              )}
          </div>
        </div>
      ) : (
        <div className="mt-3 p-2 bg-slate-800/50 border border-slate-700/50 rounded flex items-center gap-3">
            <div className="p-1.5 bg-slate-700/50 rounded-full">
                <HelpCircle size={14} className="text-slate-400" />
            </div>
            <span className="text-xs font-mono text-slate-400">Analyze description to identify requirements</span>
        </div>
      )}

      {/* Progress / Timer Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800 rounded-b-xl overflow-hidden">
        <div 
            className={`h-full transition-all duration-1000 ease-linear ${task.status === 'active' ? 'bg-blue-500' : 'bg-slate-600'}`}
            style={{ width: task.status === 'active' ? '100%' : `${(task.timeToExpire / 60) * 100}%` }} 
        />
      </div>
    </div>
  );
};

export default TaskCard;