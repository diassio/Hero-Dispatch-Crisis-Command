import React, { useState } from 'react';
import { Hero, Task, StatType } from '../types';
import { MAX_HEROES_PER_TASK } from '../constants';
import RadarChart from './RadarChart';
import { ShieldCheck, Lock, AlertOctagon, X, CheckCircle2, Sparkles, Zap, Timer, Heart } from 'lucide-react';

interface MissionModalProps {
  task: Task;
  heroes: Hero[];
  onClose: () => void;
  onDispatch: (heroIds: string[]) => void;
}

const MissionModal: React.FC<MissionModalProps> = ({ task, heroes, onClose, onDispatch }) => {
  const [selectedHeroIds, setSelectedHeroIds] = useState<string[]>([]);

  // Filter available heroes
  const availableHeroes = heroes.filter(h => h.status === 'idle');

  const toggleHero = (id: string) => {
    if (selectedHeroIds.includes(id)) {
      setSelectedHeroIds(prev => prev.filter(hid => hid !== id));
    } else {
      if (selectedHeroIds.length < MAX_HEROES_PER_TASK) {
        setSelectedHeroIds(prev => [...prev, id]);
      }
    }
  };

  // Detect Synergies
  const hasNeuron = selectedHeroIds.includes('h1');
  const hasViper = selectedHeroIds.includes('h2');
  const synergyNeuralEcho = hasNeuron && hasViper;

  const hasTitan = selectedHeroIds.includes('h4');
  const synergyJuggernaut = selectedHeroIds.length === 1 && hasTitan;

  const hasSiren = selectedHeroIds.includes('h5');
  const synergyHealer = hasSiren;

  // Calculate combined stats for the selected team safely
  const teamStats = {
      [StatType.INTELLIGENCE]: 0,
      [StatType.AGILITY]: 0,
      [StatType.FEARLESSNESS]: 0,
      [StatType.DURABILITY]: 0,
      [StatType.CHARISMA]: 0,
  };

  selectedHeroIds.forEach(id => {
      const hero = heroes.find(h => h.id === id);
      if (hero) {
          Object.keys(hero.stats).forEach(k => {
             const key = k as StatType;
             teamStats[key] += hero.stats[key];
             
             // Apply Visual Boost for Synergy
             if (synergyNeuralEcho && id === 'h2') {
                 teamStats[key] += hero.stats[key]; // Double Viper
             }
             
             // Cap visually at 100 for the chart, though logic uses raw
             if (teamStats[key] > 100) teamStats[key] = 100;
          });
      }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-tech-panel border border-slate-700 w-full max-w-6xl h-[85vh] flex shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative">
        
        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-tech-teal"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-tech-teal"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-tech-teal"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-tech-teal"></div>

        {/* Left Column: Mission Intel */}
        <div className="w-1/3 bg-slate-900/50 border-r border-slate-800 p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tech-orange to-transparent"></div>
          
          <div className="mb-8">
            <div className="flex items-center gap-2 text-tech-orange mb-2">
                <AlertOctagon size={20} />
                <span className="font-mono text-sm tracking-widest uppercase">Mission Briefing</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-4 leading-tight">{task.title}</h2>
            <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-slate-700 pl-4">
              {task.description}
            </p>
          </div>

          <div className="bg-black/40 rounded p-4 mb-6 border border-slate-800/50">
            <div className="flex items-center gap-3 mb-2 text-slate-500">
                <Lock size={16} />
                <span className="text-xs font-bold uppercase">Threat Analysis</span>
            </div>
            <div className="text-xs text-slate-600 font-mono">
                <p>CLASSIFIED // UNKNOWN VECTORS</p>
                <p>RECOMMEND MULTI-DISCIPLINARY RESPONSE</p>
            </div>
          </div>

          {/* Active Synergies Display */}
          <div className="mt-4 space-y-2">
             {(synergyNeuralEcho || synergyJuggernaut || synergyHealer) && (
                 <div className="text-xs font-bold text-tech-teal uppercase mb-2 flex items-center gap-2">
                     <Sparkles size={14} /> Active Synergies
                 </div>
             )}
             
             {synergyNeuralEcho && (
                 <div className="p-3 border border-purple-500/30 bg-purple-500/10 rounded flex gap-3 items-center animate-in slide-in-from-left-5">
                     <div className="p-2 bg-purple-500/20 rounded-full text-purple-400"><Zap size={16}/></div>
                     <div>
                         <div className="text-purple-300 text-xs font-bold">NEURAL ECHO DETECTED</div>
                         <div className="text-purple-400/60 text-[10px]">Viper creates a kinetic clone. Agility doubled.</div>
                     </div>
                 </div>
             )}

             {synergyJuggernaut && (
                 <div className="p-3 border border-orange-500/30 bg-orange-500/10 rounded flex gap-3 items-center animate-in slide-in-from-left-5">
                     <div className="p-2 bg-orange-500/20 rounded-full text-orange-400"><Timer size={16}/></div>
                     <div>
                         <div className="text-orange-300 text-xs font-bold">JUGGERNAUT PROTOCOL</div>
                         <div className="text-orange-400/60 text-[10px]">Solo Titan dispatch. Mission time reduced by 50%.</div>
                     </div>
                 </div>
             )}

             {synergyHealer && (
                 <div className="p-3 border border-pink-500/30 bg-pink-500/10 rounded flex gap-3 items-center animate-in slide-in-from-left-5">
                     <div className="p-2 bg-pink-500/20 rounded-full text-pink-400"><Heart size={16}/></div>
                     <div>
                         <div className="text-pink-300 text-xs font-bold">EMPATHIC RESONANCE</div>
                         <div className="text-pink-400/60 text-[10px]">Siren heals team trauma post-mission.</div>
                     </div>
                 </div>
             )}
          </div>

          <div className="mt-auto">
            <button onClick={onClose} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm">
                <X size={16} /> ABORT MISSION
            </button>
          </div>
        </div>

        {/* Middle Column: Team Analysis */}
        <div className="w-1/3 bg-slate-950 p-8 flex flex-col items-center justify-center border-r border-slate-800 relative">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
            
            <h3 className="absolute top-6 text-center font-mono text-tech-teal text-sm tracking-widest uppercase">Projected Efficiency</h3>
            
            <div className="relative z-10">
                <RadarChart stats={teamStats} size={300} />
            </div>

            <div className="absolute bottom-8 w-full px-8">
                <button 
                    disabled={selectedHeroIds.length === 0}
                    onClick={() => onDispatch(selectedHeroIds)}
                    className={`
                        w-full py-4 clip-corner font-bold text-lg tracking-widest flex items-center justify-center gap-3 transition-all
                        ${selectedHeroIds.length === 0 
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                            : 'bg-tech-teal text-slate-900 hover:bg-emerald-400 shadow-[0_0_20px_rgba(45,212,191,0.4)]'
                        }
                    `}
                >
                    <ShieldCheck size={24} />
                    DISPATCH SQUAD
                </button>
            </div>
        </div>

        {/* Right Column: Roster Selection */}
        <div className="w-1/3 bg-slate-900/80 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-2">
                <h3 className="font-bold text-slate-300 uppercase tracking-wider">Available Assets</h3>
                <span className="font-mono text-tech-teal">{selectedHeroIds.length} / {MAX_HEROES_PER_TASK}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {availableHeroes.map(hero => (
                     <div 
                        key={hero.id} 
                        onClick={() => toggleHero(hero.id)}
                        className={`
                            relative p-2 border cursor-pointer transition-all group
                            ${selectedHeroIds.includes(hero.id) 
                                ? 'bg-slate-800 border-tech-teal' 
                                : 'bg-transparent border-slate-700 hover:border-slate-500'
                            }
                            ${(selectedHeroIds.length >= MAX_HEROES_PER_TASK && !selectedHeroIds.includes(hero.id)) ? 'opacity-50 grayscale' : ''}
                        `}
                     >
                        <div className="flex items-center gap-3">
                            <img src={hero.avatarUrl} className="w-10 h-10 rounded bg-slate-800 object-cover" alt={hero.name} />
                            <div className="min-w-0">
                                <div className={`font-bold text-xs truncate ${selectedHeroIds.includes(hero.id) ? 'text-tech-teal' : 'text-slate-300'}`}>{hero.name}</div>
                                <div className="text-[10px] text-slate-500 truncate">{hero.title}</div>
                            </div>
                            {selectedHeroIds.includes(hero.id) && (
                                <div className="absolute top-1 right-1 text-tech-teal">
                                    <CheckCircle2 size={14} />
                                </div>
                            )}
                        </div>
                        {/* Mini bars */}
                        <div className="mt-2 flex gap-0.5 h-1">
                             <div className="flex-1 bg-stat-int/50" style={{ opacity: hero.stats.Intelligence / 100 }}></div>
                             <div className="flex-1 bg-stat-agi/50" style={{ opacity: hero.stats.Agility / 100 }}></div>
                             <div className="flex-1 bg-stat-fear/50" style={{ opacity: hero.stats.Fearlessness / 100 }}></div>
                             <div className="flex-1 bg-stat-dur/50" style={{ opacity: hero.stats.Durability / 100 }}></div>
                             <div className="flex-1 bg-stat-cha/50" style={{ opacity: hero.stats.Charisma / 100 }}></div>
                        </div>
                     </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default MissionModal;