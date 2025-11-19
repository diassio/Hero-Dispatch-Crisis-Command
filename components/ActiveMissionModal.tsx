import React from 'react';
import { Task, Hero, StatType } from '../types';
import { X, Target, Shield, Brain, Zap, Activity, Heart, Users } from 'lucide-react';
import { STAT_COLORS, STAT_ICONS } from '../constants';

interface ActiveMissionModalProps {
    task: Task;
    heroes: Hero[];
    onClose: () => void;
}

const ActiveMissionModal: React.FC<ActiveMissionModalProps> = ({ task, heroes, onClose }) => {
    const primaryStat = task.requirements.primaryStat;
    const primaryValue = task.requirements.primaryValue;

    // Find assigned heroes
    const assignedHeroes = heroes.filter(h => task.assignedHeroIds.includes(h.id));
    const leader = assignedHeroes[0]; // Display first hero as leader

    // Calculate Total Squad Stat
    const totalHeroStat = assignedHeroes.reduce((sum, h) => sum + h.stats[primaryStat], 0);

    // Calculate Success Chance (Intersection)
    // If Hero >= Req, 100%. Else Hero / Req.
    const successChance = Math.min(100, Math.round((totalHeroStat / primaryValue) * 100));

    if (!leader) return null; // Should not happen if task is active

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-950">
                    <div>
                        <div className="flex items-center gap-2 text-tech-teal mb-1">
                            <Activity className="animate-pulse" size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Mission In Progress</span>
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{task.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">

                    {/* Hero vs Task Info */}
                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img src={leader.avatarUrl} alt={leader.name} className="w-16 h-16 rounded border border-slate-600 object-cover" />
                                {assignedHeroes.length > 1 && (
                                    <div className="absolute -bottom-2 -right-2 bg-slate-800 text-white text-xs font-bold px-1.5 py-0.5 rounded border border-slate-600 flex items-center gap-1">
                                        <Users size={10} />
                                        +{assignedHeroes.length - 1}
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider">
                                    {assignedHeroes.length > 1 ? 'Squad Leader' : 'Operative'}
                                </div>
                                <div className="text-lg font-bold text-white">{leader.name}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-slate-500 uppercase tracking-wider">Target Metric</div>
                            <div className={`text-lg font-bold ${STAT_COLORS[primaryStat].split(' ')[0]}`}>
                                {primaryStat}
                            </div>
                        </div>
                    </div>

                    {/* Intersection Visualization */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-mono text-slate-400">
                            <span>0</span>
                            <span>STAT MAGNITUDE</span>
                            <span>{Math.max(100, primaryValue, totalHeroStat)}</span>
                        </div>

                        <div className="relative h-16 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700">

                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex justify-between px-2">
                                {[...Array(11)].map((_, i) => (
                                    <div key={i} className="h-full w-px bg-slate-700/30"></div>
                                ))}
                            </div>

                            {/* Task Requirement Bar (Background/Target) */}
                            <div
                                className="absolute top-2 bottom-2 left-0 bg-slate-600/30 border-r-2 border-slate-500/50 transition-all duration-500"
                                style={{ width: `${Math.min(100, (primaryValue / Math.max(100, primaryValue, totalHeroStat)) * 100)}%` }}
                            >
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                                    REQ: {primaryValue}
                                </div>
                            </div>

                            {/* Hero Stat Bar (Foreground/Actual) */}
                            <div
                                className={`absolute top-4 bottom-4 left-0 ${STAT_COLORS[primaryStat].split(' ')[2]} opacity-80 transition-all duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
                                style={{ width: `${Math.min(100, (totalHeroStat / Math.max(100, primaryValue, totalHeroStat)) * 100)}%` }}
                            >
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-900">
                                    {totalHeroStat}
                                </div>
                            </div>

                            {/* Intersection Highlight (The overlapping part) */}
                            <div
                                className="absolute top-0 bottom-0 left-0 bg-white/10 pointer-events-none animate-pulse"
                                style={{ width: `${Math.min(100, (Math.min(totalHeroStat, primaryValue) / Math.max(100, primaryValue, totalHeroStat)) * 100)}%` }}
                            ></div>

                        </div>

                        <div className="text-center text-xs text-slate-500 mt-2">
                            Intersection of Squad Capability and Mission Requirement
                        </div>
                    </div>

                    {/* Success Probability */}
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Projected Outcome</div>
                            <div className="text-sm text-slate-400">
                                Based on current field data
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-black text-white tracking-tighter">
                                {successChance}%
                            </div>
                            <div className={`text-xs font-bold uppercase tracking-widest ${successChance >= 100 ? 'text-emerald-500' : successChance > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                Probability of Success
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ActiveMissionModal;
