import React, { useState } from 'react';
import { Hero, StatType } from '../types';
import { X, Shield, Zap, Brain, Activity, Heart, Star, FileText } from 'lucide-react';
import { STAT_COLORS, STAT_ICONS } from '../constants';

interface HeroDetailModalProps {
    hero: Hero;
    onClose: () => void;
}

const HeroDetailModal: React.FC<HeroDetailModalProps> = ({ hero, onClose }) => {
    const [activeTab, setActiveTab] = useState<'powers' | 'bio'>('powers');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh] md:h-[600px]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Left Column: Hero Visual & Stats */}
                <div className="w-full md:w-1/3 bg-slate-950 relative flex flex-col border-b md:border-b-0 md:border-r border-slate-800">
                    {/* Hero Image Background */}
                    <div className="absolute inset-0 opacity-30">
                        <img src={hero.avatarUrl} alt={hero.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    </div>

                    <div className="relative z-10 p-6 flex-1 flex flex-col justify-end">
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">{hero.name}</h2>
                        <div className="text-tech-teal font-mono text-sm tracking-widest mb-4">{hero.title}</div>

                        <div className="space-y-3">
                            {(Object.entries(hero.stats) as [StatType, number][]).map(([stat, value]) => (
                                <div key={stat} className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${STAT_COLORS[stat].split(' ')[2]} ${STAT_COLORS[stat].split(' ')[0]}`}>
                                        {STAT_ICONS[stat]}
                                    </div>
                                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${STAT_COLORS[stat].split(' ')[2].replace('/10', '')}`}
                                            style={{ width: `${value}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs font-mono text-slate-400 w-6 text-right">{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="flex-1 flex flex-col bg-slate-900">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-800">
                        <button
                            onClick={() => setActiveTab('powers')}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors
                ${activeTab === 'powers' ? 'bg-slate-800 text-tech-teal border-b-2 border-tech-teal' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}
              `}
                        >
                            <Zap size={16} />
                            Superpowers
                        </button>
                        <button
                            onClick={() => setActiveTab('bio')}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors
                ${activeTab === 'bio' ? 'bg-slate-800 text-tech-teal border-b-2 border-tech-teal' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}
              `}
                        >
                            <FileText size={16} />
                            Bio & Intel
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {activeTab === 'powers' ? (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div className="flex items-center gap-2 text-tech-teal mb-4">
                                    <Shield size={20} />
                                    <h3 className="text-lg font-bold uppercase tracking-widest">Combat Capabilities</h3>
                                </div>

                                <div className="grid gap-4">
                                    {hero.abilities?.map((ability, index) => (
                                        <div key={index} className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg hover:border-tech-teal/50 transition-colors group">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-white group-hover:text-tech-teal transition-colors">{ability.name}</h4>
                                                <span className={`
                          text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider
                          ${ability.type === 'passive' ? 'bg-blue-500/20 text-blue-300' : ''}
                          ${ability.type === 'active' ? 'bg-amber-500/20 text-amber-300' : ''}
                          ${ability.type === 'ultimate' ? 'bg-purple-500/20 text-purple-300' : ''}
                        `}>
                                                    {ability.type}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-400 leading-relaxed">{ability.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">

                                {/* Personal Info Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-800/30 p-3 rounded border border-slate-700/50">
                                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Real Name</div>
                                        <div className="text-white font-mono">{hero.bio?.realName || 'Unknown'}</div>
                                    </div>
                                    <div className="bg-slate-800/30 p-3 rounded border border-slate-700/50">
                                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Codename</div>
                                        <div className="text-tech-teal font-mono">{hero.name}</div>
                                    </div>
                                    <div className="bg-slate-800/30 p-3 rounded border border-slate-700/50">
                                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Age</div>
                                        <div className="text-white font-mono">{hero.bio?.age || 'Unknown'}</div>
                                    </div>
                                    <div className="bg-slate-800/30 p-3 rounded border border-slate-700/50">
                                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Height</div>
                                        <div className="text-white font-mono">{hero.bio?.height || 'Unknown'}</div>
                                    </div>
                                </div>

                                {/* History */}
                                <div>
                                    <div className="flex items-center gap-2 text-slate-400 mb-3">
                                        <Activity size={16} />
                                        <h3 className="text-xs font-bold uppercase tracking-widest">Service History</h3>
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/20 p-4 rounded border-l-2 border-tech-teal">
                                        {hero.bio?.history || 'No records found.'}
                                    </p>
                                </div>

                                {/* Facts */}
                                <div>
                                    <div className="flex items-center gap-2 text-slate-400 mb-3">
                                        <Star size={16} />
                                        <h3 className="text-xs font-bold uppercase tracking-widest">Intel & Trivia</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {hero.bio?.facts.map((fact, i) => (
                                            <li key={i} className="text-sm text-slate-400 flex gap-3 items-start">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0"></span>
                                                {fact}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroDetailModal;
