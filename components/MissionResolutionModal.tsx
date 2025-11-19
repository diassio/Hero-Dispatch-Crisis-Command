import React, { useEffect, useState, useRef } from 'react';
import { Task, Hero, StatType } from '../types';
import RadarChart from './RadarChart';
import { STAT_COLORS } from '../constants';
import { CheckCircle2, XCircle, Activity, Target } from 'lucide-react';

interface MissionResolutionModalProps {
    task: Task;
    heroes: Hero[];
    onResolve: (success: boolean) => void;
}

const MissionResolutionModal: React.FC<MissionResolutionModalProps> = ({ task, heroes, onResolve }) => {
    const [status, setStatus] = useState<'spinning' | 'decelerating' | 'stopped'>('spinning');
    const [cursorPosition, setCursorPosition] = useState(0); // 0 to 100
    const [finalResult, setFinalResult] = useState<boolean | null>(null);

    // Refs for animation
    const animationRef = useRef<number>();
    const velocityRef = useRef(2); // Speed of oscillation
    const positionRef = useRef(0);
    const targetRef = useRef<number | null>(null);

    // --- Stats Calculation ---
    const primaryStat = task.requirements.primaryStat;
    const primaryValue = task.requirements.primaryValue;

    // Filter assigned heroes
    const assignedHeroes = heroes.filter(h => task.assignedHeroIds.includes(h.id));

    // Calculate Squad Stats
    const squadStats = {
        [StatType.INTELLIGENCE]: 0,
        [StatType.AGILITY]: 0,
        [StatType.FEARLESSNESS]: 0,
        [StatType.DURABILITY]: 0,
        [StatType.CHARISMA]: 0,
    };

    assignedHeroes.forEach(h => {
        Object.values(StatType).forEach(stat => {
            squadStats[stat] += h.stats[stat];
        });
    });

    // Calculate Task Requirements Stats (for Radar Overlay)
    // We only know primary and optional secondary. Others are 0 or baseline?
    // Let's set primary to the req value, others to 0 for the shape.
    const taskStats = {
        [StatType.INTELLIGENCE]: 0,
        [StatType.AGILITY]: 0,
        [StatType.FEARLESSNESS]: 0,
        [StatType.DURABILITY]: 0,
        [StatType.CHARISMA]: 0,
    };
    taskStats[primaryStat] = primaryValue;
    if (task.requirements.secondaryStat) {
        taskStats[task.requirements.secondaryStat] = task.requirements.secondaryValue || 0;
    }

    // Calculate Success Chance
    const totalHeroStat = squadStats[primaryStat];
    const successChance = Math.min(100, Math.round((totalHeroStat / primaryValue) * 100));

    // --- Animation Logic ---
    useEffect(() => {
        // 1. Pre-determine result
        const roll = Math.random() * 100;
        const isSuccess = roll < successChance;

        // 2. Determine Target Stop Position
        // If Success: Random point between 0 and successChance
        // If Failure: Random point between successChance and 100
        let target = 0;
        if (isSuccess) {
            target = Math.random() * successChance;
        } else {
            target = successChance + (Math.random() * (100 - successChance));
        }
        targetRef.current = target;

        // Start Animation Loop
        let lastTime = performance.now();

        const animate = (time: number) => {
            const deltaTime = time - lastTime;
            lastTime = time;

            if (status === 'stopped') return;

            // Update Position
            positionRef.current += velocityRef.current;

            // Bounce at edges
            if (positionRef.current >= 100 || positionRef.current <= 0) {
                velocityRef.current *= -1;
            }

            // Clamp
            positionRef.current = Math.max(0, Math.min(100, positionRef.current));
            setCursorPosition(positionRef.current);

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        // Trigger Deceleration after a delay
        const stopTimeout = setTimeout(() => {
            setStatus('decelerating');

            // Simple "snap" to target for now to ensure accuracy, 
            // but ideally we'd physics-simulate it. 
            // For a "Rigged" wheel, we can just lerp to target.

            cancelAnimationFrame(animationRef.current!);

            // Deceleration / Snap Animation
            let startTime = performance.now();
            const startPos = positionRef.current;
            const duration = 2000; // 2 seconds to settle

            const decelerate = (now: number) => {
                const elapsed = now - startTime;
                const progress = Math.min(1, elapsed / duration);

                // Ease Out Quint
                const ease = 1 - Math.pow(1 - progress, 5);

                const currentPos = startPos + (target - startPos) * ease;
                setCursorPosition(currentPos);

                if (progress < 1) {
                    requestAnimationFrame(decelerate);
                } else {
                    setStatus('stopped');
                    setFinalResult(isSuccess);
                    setTimeout(() => onResolve(isSuccess), 1500); // Wait before closing
                }
            };
            requestAnimationFrame(decelerate);

        }, 2000); // Spin for 2 seconds

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            clearTimeout(stopTimeout);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                {/* Left: Radar Chart & Stats */}
                <div className="w-full md:w-1/2 p-8 bg-slate-950 border-r border-slate-800 flex flex-col items-center justify-center relative">
                    <div className="absolute top-4 left-4 flex items-center gap-2 text-slate-500">
                        <Activity size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Mission Resolution</span>
                    </div>

                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 text-center">{task.title}</h2>

                    <div className="relative">
                        <RadarChart stats={squadStats} overlayStats={taskStats} size={300} />

                        {/* Legend */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-4 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                            <div className="flex items-center gap-1 text-tech-teal">
                                <div className="w-2 h-2 bg-tech-teal rounded-full"></div> Squad
                            </div>
                            <div className="flex items-center gap-1 text-tech-orange">
                                <div className="w-2 h-2 border border-tech-orange border-dashed rounded-full"></div> Required
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Minigame & Outcome */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center bg-slate-900 relative overflow-hidden">

                    {/* Background Pulse */}
                    <div className={`absolute inset-0 transition-opacity duration-1000 ${status === 'stopped' ? 'opacity-20' : 'opacity-0'} ${finalResult ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

                    <div className="relative z-10 w-full max-w-sm space-y-12">

                        {/* Header */}
                        <div className="text-center space-y-2">
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Probability of Success</div>
                            <div className="text-5xl font-black text-white tracking-tighter">{successChance}%</div>
                        </div>

                        {/* The Bar Minigame */}
                        <div className="relative h-12 bg-slate-800 rounded-full border-2 border-slate-700 overflow-hidden">

                            {/* Success Zone (Green) */}
                            <div
                                className="absolute top-0 bottom-0 left-0 bg-emerald-500/20 border-r-2 border-emerald-500 transition-all duration-500"
                                style={{ width: `${successChance}%` }}
                            >
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-400 uppercase">Success Zone</div>
                            </div>

                            {/* Failure Zone (Red - Implicit rest of bar) */}

                            {/* Moving Cursor */}
                            <div
                                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_white] z-20 transition-transform will-change-transform"
                                style={{
                                    left: `${cursorPosition}%`,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
                            </div>

                        </div>

                        {/* Outcome Text */}
                        <div className="h-24 flex items-center justify-center">
                            {status === 'stopped' && (
                                <div className={`text-center animate-in zoom-in duration-300 ${finalResult ? 'text-emerald-400' : 'text-red-500'}`}>
                                    <div className="flex justify-center mb-2">
                                        {finalResult ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
                                    </div>
                                    <div className="text-2xl font-black uppercase tracking-widest">
                                        {finalResult ? 'Mission Accomplished' : 'Mission Failed'}
                                    </div>
                                </div>
                            )}
                            {status !== 'stopped' && (
                                <div className="text-slate-500 text-xs uppercase tracking-widest animate-pulse">
                                    Resolving Outcome...
                                </div>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default MissionResolutionModal;
