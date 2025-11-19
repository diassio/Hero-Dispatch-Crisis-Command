import React from 'react';
import { Hero } from '../types';
import { HeartCrack, Skull, Clock, CheckCircle2, Plane, Home } from 'lucide-react';

interface HeroCardProps {
  hero: Hero;
  onClick?: (hero: Hero) => void;
  selected?: boolean;
  disabled?: boolean;
  compact?: boolean;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, onClick, selected, disabled }) => {
  const isBusy = hero.status === 'busy';
  const isCooldown = hero.status === 'cooldown';
  const isRetired = hero.status === 'retired';
  const isDeploying = hero.status === 'deploying';
  const isReturning = hero.status === 'returning';
  const isTraumatized = hero.traumaCount > 0 && !isRetired;

  let statusColor = 'bg-slate-700';
  let statusText = 'RESTING';

  if (isBusy) {
    statusColor = 'bg-tech-orange animate-pulse';
    statusText = 'ON SITE';
  } else if (isDeploying) {
    statusColor = 'bg-tech-teal animate-pulse';
    statusText = 'EN ROUTE';
  } else if (isReturning) {
    statusColor = 'bg-emerald-500 animate-pulse';
    statusText = 'RETURNING';
  } else if (isCooldown) {
    statusColor = 'bg-yellow-600';
    statusText = 'RECOVERING';
  } else if (isRetired) {
    statusColor = 'bg-red-900';
    statusText = 'MIA';
  } else {
    statusColor = 'bg-emerald-600/20 border border-emerald-500/50 text-emerald-400';
  }

  // Disable clicking if busy in any way
  const isUnavailable = isBusy || isCooldown || isRetired || isDeploying || isReturning;

  return (
    <div
      onClick={() => !disabled && !isUnavailable && onClick?.(hero)}
      className={`
        group relative flex flex-col items-center shrink-0 w-32 h-48
        transition-all duration-200 clip-corner-top
        ${selected ? 'mt-[-20px] z-10' : 'mt-0 hover:mt-[-10px]'}
        ${disabled || isUnavailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* Status Bar Top */}
      <div className={`
        w-full h-6 flex items-center justify-center text-[10px] font-bold tracking-widest text-white uppercase 
        ${isBusy ? 'bg-tech-orange' :
          isDeploying ? 'bg-tech-teal' :
            isReturning ? 'bg-emerald-600' :
              isCooldown ? 'bg-yellow-600' :
                'bg-slate-800 border-t border-x border-slate-600'
        }
      `}>
        {statusText}
      </div>

      {/* Main Image Area */}
      <div className={`
        relative w-full flex-1 bg-slate-900 border-x border-slate-600 overflow-hidden
        ${selected ? 'border-tech-teal shadow-[0_0_15px_rgba(45,212,191,0.3)]' : ''}
      `}>
        <img
          src={hero.avatarUrl}
          alt={hero.name}
          className={`w-full h-full object-cover transition-all duration-500 ${isRetired ? 'grayscale contrast-150' : 'group-hover:scale-110'}`}
        />

        {/* Scanline on card */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30"></div>

        {/* Overlays based on status */}
        {isCooldown && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-[2px]">
            <Clock className="text-yellow-500 mb-1" size={24} />
            <span className="text-xl font-mono font-bold text-yellow-500">{hero.cooldownRemaining}s</span>
          </div>
        )}

        {isDeploying && (
          <div className="absolute inset-0 bg-tech-teal/20 flex flex-col items-center justify-center backdrop-blur-[1px]">
            <Plane className="text-tech-teal mb-1 animate-bounce" size={24} />
          </div>
        )}

        {isReturning && (
          <div className="absolute inset-0 bg-emerald-500/20 flex flex-col items-center justify-center backdrop-blur-[1px]">
            <Home className="text-emerald-400 mb-1 animate-pulse" size={24} />
          </div>
        )}

        {/* Retired Overlay */}
        {isRetired && (
          <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center">
            <Skull className="text-red-300 mb-1" size={32} />
          </div>
        )}

        {/* Trauma Indicator */}
        {isTraumatized && (
          <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg animate-pulse">
            <HeartCrack size={12} />
          </div>
        )}

        {/* Selection Highlight */}
        {selected && (
          <div className="absolute inset-0 border-2 border-tech-teal pointer-events-none"></div>
        )}
      </div>

      {/* Name Bar Bottom */}
      <div className={`
         w-full py-2 px-1 bg-slate-900 border border-slate-600 flex flex-col items-center justify-center z-10
         ${selected ? 'bg-tech-teal text-slate-900' : 'text-slate-300'}
      `}>
        <span className="text-xs font-black uppercase tracking-tighter truncate w-full text-center">{hero.name}</span>
        <div className="flex gap-0.5 mt-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full ${i < (hero.traumaCount > 0 ? 2 : 4) ? (selected ? 'bg-slate-900' : 'bg-tech-teal') : 'bg-slate-700'}`}></div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HeroCard;