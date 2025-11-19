import React, { useState, useEffect, useRef } from 'react';
import { Hero, Task, LogEntry, StatType, MovingSquad } from './types';
import HeroDetailModal from './components/HeroDetailModal';

import { INITIAL_HEROES, INITIAL_REPUTATION, GAME_TICK_MS } from './constants';
import { generateRandomTask } from './services/geminiService';
import HeroCard from './components/HeroCard';
import TaskPin from './components/TaskPin';
import MissionModal from './components/MissionModal';
import ActiveMissionModal from './components/ActiveMissionModal';
import MissionResolutionModal from './components/MissionResolutionModal';
import SquadMarker from './components/SquadMarker';
import { Activity, Terminal, Radio } from 'lucide-react';
// Helper ID generator
const generateId = () => Math.random().toString(36).substring(2, 9);

const HQ_POSITION = { x: 50, y: 90 };
const MOVEMENT_DURATION_MS = 3000; // 3 seconds travel time

const App: React.FC = () => {
  // --- State ---
  const [heroes, setHeroes] = useState<Hero[]>(INITIAL_HEROES);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reputation, setReputation] = useState(INITIAL_REPUTATION);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [viewingActiveTask, setViewingActiveTask] = useState<Task | null>(null);
  const [resolvingTask, setResolvingTask] = useState<Task | null>(null);
  const [movingSquads, setMovingSquads] = useState<MovingSquad[]>([]);
  const [tick, setTick] = useState(0);

  // Game Loop Refs
  const timeSinceLastSpawn = useRef(0);
  const isGameActive = useRef(true);

  // --- Logic: Logging ---
  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: generateId(),
      timestamp: Date.now(),
      message,
      type,
    };
    setLogs(prev => [newLog, ...prev].slice(0, 10));
  };

  // --- Logic: Task Spawning ---
  const spawnTask = async () => {
    try {
      const taskData = await generateRandomTask();

      // Random Map Position (Keeping somewhat central to avoid edge clipping)
      const x = Math.floor(Math.random() * 70) + 15;
      const y = Math.floor(Math.random() * 60) + 15;

      const newTask: Task = {
        id: generateId(),
        ...taskData,
        status: 'pending',
        assignedHeroIds: [],
        position: { x, y }
      };

      setTasks(prev => [newTask, ...prev]);
      addLog(`SECTOR ALERT: ${newTask.title} detected at GRID ${x},${y}`, 'warning');
    } catch (err) {
      console.error("Failed to spawn task", err);
    }
  };

  // --- Logic: Game Loop ---
  useEffect(() => {
    spawnTask(); // Initial task

    const interval = setInterval(() => {
      if (!isGameActive.current) return;

      setTick(t => t + 1); // Trigger re-render for animations

      // 1. Update Task Timers
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          // Update Expiration (only if pending)
          if (task.status === 'pending') {
            const newTimeToExpire = task.timeToExpire - 1;
            if (newTimeToExpire <= 0) {
              // Task Expired
              addLog(`SIGNAL LOST: ${task.title} - Mission Abandoned.`, 'failure');
              setReputation(r => Math.max(0, r - 5));
              return { ...task, status: 'expired', timeToExpire: 0 };
            }
            return { ...task, timeToExpire: newTimeToExpire };
          } else if (task.status === 'active') {
            // Reduce mission duration timer
            const durationLeft = (task.timeToExpire || 0) - 1;
            if (durationLeft <= 0) {
              // Trigger Resolution instead of auto-complete
              // We set status to 'resolving' to stop timer updates
              // And we'll trigger the modal via useEffect or state check
              return { ...task, timeToExpire: 0, status: 'resolving' };
            } else {
              return { ...task, timeToExpire: durationLeft };
            }
          } else {
            return task;
          }
        });
      });

      // 2. Update Hero Cooldowns
      setHeroes(prevHeroes => prevHeroes.map(h => {
        if (h.status === 'cooldown') {
          const timeLeft = h.cooldownRemaining - 1;
          return timeLeft <= 0
            ? { ...h, status: 'idle', cooldownRemaining: 0 }
            : { ...h, cooldownRemaining: timeLeft };
        }
        return h;
      }));

      // 3. Spawn Logic
      timeSinceLastSpawn.current += GAME_TICK_MS;
      if (timeSinceLastSpawn.current >= 15000) {
        if (Math.random() > 0.4) {
          spawnTask();
        }
        timeSinceLastSpawn.current = 0;
      }

    }, GAME_TICK_MS);

    return () => clearInterval(interval);
  }, []);


  // --- Logic: Handle Completed Missions ---
  useEffect(() => {
    // Check for tasks that just entered 'resolving' state and aren't yet being resolved
    const taskToResolve = tasks.find(t => t.status === 'resolving');

    if (taskToResolve && !resolvingTask) {
      // Close active viewer if open
      if (viewingActiveTask?.id === taskToResolve.id) {
        setViewingActiveTask(null);
      }
      setResolvingTask(taskToResolve);
    }
  }, [tasks, resolvingTask, viewingActiveTask]);


  const handleResolutionComplete = (success: boolean) => {
    if (!resolvingTask) return;

    handleMissionResult(resolvingTask, success);

    // Mark task as completed/failed in state to remove it
    setTasks(prev => prev.map(t =>
      t.id === resolvingTask.id ? { ...t, status: success ? 'completed' : 'failed' } : t
    ));

    // Clean up modal
    setResolvingTask(null);

    // Remove from list after a delay (handled by existing effect or just filter now)
    // The existing effect filters 'completed', let's update it to filter 'failed' too or handle it here.
    // Actually, let's just filter them out here to be safe.
    setTasks(prev => prev.filter(t => t.id !== resolvingTask.id));
  };


  const handleMissionResult = (task: Task, isSuccess: boolean) => {
    const assignedHeroes = heroes.filter(h => task.assignedHeroIds.includes(h.id));
    const heroIds = assignedHeroes.map(h => h.id);

    // --- Synergy Check: Neural Echo (Neuron + Viper) ---
    const hasNeuron = assignedHeroes.some(h => h.id === 'h1');
    const hasViper = assignedHeroes.some(h => h.id === 'h2');
    const isNeuralEchoActive = hasNeuron && hasViper;

    if (isNeuralEchoActive) {
      addLog(`SYNERGY: Neural Echo engaged. Viper clone stats applied.`, 'info');
    }

    addLog(`Mission ${isSuccess ? 'Success' : 'Failure'}: ${task.title}`, isSuccess ? 'success' : 'failure');

    // --- Synergy Check: Siren Healing ---
    const hasSiren = assignedHeroes.some(h => h.id === 'h5');
    if (hasSiren && isSuccess) {
      // Heal all heroes by 10%
      // This logic would typically involve increasing hero stats or reducing trauma/cooldown
      // For now, it's a placeholder.
    }

    // --- Update Reputation ---
    if (isSuccess) {
      addLog(`MISSION SUCCESS: ${task.title}. Returning to base.`, 'success');
      setReputation(r => Math.min(100, r + (task.difficultyLevel === 'Hard' ? 15 : 10)));
    } else {
      addLog(`MISSION FAILED: ${task.title}. Squad retreating.`, 'failure');
      setReputation(r => Math.max(0, r - 10));
    }

    // Set Heroes to RETURNING
    setHeroes(prev => prev.map(h =>
      heroIds.includes(h.id) ? { ...h, status: 'returning' } : h
    ));

    // Check flight capability for return
    const canAllFly = assignedHeroes.every(h => h.canFly);
    const movementDuration = canAllFly ? MOVEMENT_DURATION_MS : MOVEMENT_DURATION_MS * 1.5;

    // Calculate Waypoints for return
    let waypoints: { x: number; y: number }[] = [];
    if (canAllFly) {
      waypoints = [HQ_POSITION];
    } else {
      // Reverse Manhattan
      waypoints = [
        { x: task.position.x, y: HQ_POSITION.y }, // Corner point
        HQ_POSITION // Destination
      ];
    }

    // Spawn Return Squad
    const returnSquad: MovingSquad = {
      id: generateId(),
      heroIds: heroIds,
      startPos: task.position,
      endPos: HQ_POSITION,
      waypoints: waypoints,
      startTime: Date.now(),
      duration: movementDuration,
      type: 'return',
      onCompletePayload: { success: isSuccess, hasSiren }
    };
    setMovingSquads(prev => [...prev, returnSquad]);
  };

  // Called when a squad finishes movement
  const handleSquadArrival = (squadId: string) => {
    const squad = movingSquads.find(s => s.id === squadId);
    if (!squad) return;

    setMovingSquads(prev => prev.filter(s => s.id !== squadId));

    if (squad.type === 'deploy') {
      // Deployment arrived: Start Task
      const taskToStartId = squad.onCompletePayload?.taskId;
      if (taskToStartId) {
        setTasks(prev => prev.map(t => {
          if (t.id === taskToStartId) {
            // Re-check solo titan synergy for duration
            const isTitanSolo = squad.heroIds.length === 1 && squad.heroIds[0] === 'h4';
            let duration = t.duration;
            if (isTitanSolo) duration = Math.ceil(duration / 2);

            return { ...t, status: 'active', assignedHeroIds: squad.heroIds, timeToExpire: duration };
          }
          return t;
        }));

        setHeroes(prev => prev.map(h =>
          squad.heroIds.includes(h.id) ? { ...h, status: 'busy' } : h
        ));

        addLog(`SQUAD DEPLOYED: Engagement started at target.`, 'info');
      }
    }
    else if (squad.type === 'return') {
      // Return arrived: Apply Trauma/Rest
      const { success, hasSiren } = squad.onCompletePayload || {};

      setHeroes(prev => prev.map(h => {
        if (squad.heroIds.includes(h.id)) {
          let newTrauma = h.traumaCount;

          // ALWAYS RESET STATS TO BASE FIRST to avoid permanent degradation
          const baseHero = INITIAL_HEROES.find(bh => bh.id === h.id);
          // Create a fresh copy of base stats (or fallback to current if not found, which shouldn't happen)
          let stats = baseHero ? { ...baseHero.stats } : { ...h.stats };

          let cooldown = 5;

          if (success) {
            // Success Logic
            if (hasSiren && h.id !== 'h5' && h.traumaCount > 0) {
              newTrauma = Math.max(0, h.traumaCount - 1);
            }
          } else {
            // Failure Logic
            let traumaIncrease = 1;
            if (hasSiren && h.id !== 'h5') traumaIncrease = 0;

            newTrauma = (h.traumaCount || 0) + 1;
            if (hasSiren && h.id !== 'h5') newTrauma -= 1;

            if (newTrauma >= 2 && h.status !== 'retired') {
              return { ...h, status: 'retired', traumaCount: newTrauma, cooldownRemaining: 0 };
            }

            cooldown = 10;
          }

          // Apply Stat penalty for trauma on the fresh stats
          if (newTrauma > 0) {
            (Object.keys(stats) as StatType[]).forEach(stat => {
              stats[stat] = Math.floor(stats[stat] / 2);
            });
          }

          return {
            ...h,
            status: 'cooldown',
            cooldownRemaining: cooldown,
            traumaCount: newTrauma,
            stats: stats
          };
        }
        return h;
      }));
    }
  };

  const handleDispatch = (heroIds: string[]) => {
    if (!selectedTask) return;

    // Set Heroes to DEPLOYING
    setHeroes(prev => prev.map(h =>
      heroIds.includes(h.id) ? { ...h, status: 'deploying', cooldownRemaining: 0 } : h
    ));

    // Spawn Deployment Squad
    const assignedHeroes = heroes.filter(h => heroIds.includes(h.id));

    // Check flight capability
    const canAllFly = assignedHeroes.every(h => h.canFly);
    const movementDuration = canAllFly ? MOVEMENT_DURATION_MS : MOVEMENT_DURATION_MS * 1.5;

    // Calculate Waypoints
    let waypoints: { x: number; y: number }[] = [];
    if (canAllFly) {
      // Direct path
      waypoints = [selectedTask.position];
    } else {
      // Manhattan path (Corner movement)
      // Move horizontally then vertically (or vice versa)
      // Let's do Horizontal first then Vertical
      waypoints = [
        { x: selectedTask.position.x, y: HQ_POSITION.y }, // Corner point
        selectedTask.position // Destination
      ];
    }

    const deploySquad: MovingSquad = {
      id: generateId(),
      heroIds: heroIds,
      startPos: HQ_POSITION,
      endPos: selectedTask.position,
      waypoints: waypoints,
      startTime: Date.now(),
      duration: movementDuration,
      type: 'deploy',
      onCompletePayload: { taskId: selectedTask.id }
    };

    setMovingSquads(prev => [...prev, deploySquad]);

    // We don't set task to active yet, wait for arrival
    setSelectedTask(null);
    addLog(`DISPATCH ORDERED: Squad en route to Sector ${selectedTask.position.x},${selectedTask.position.y}`, 'info');
  };

  return (
    <div className="relative h-screen w-screen bg-tech-dark overflow-hidden flex flex-col font-sans text-slate-200 selection:bg-tech-teal selection:text-tech-dark">

      {/* Top Bar */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 z-30 shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-tech-teal font-black tracking-widest text-lg flex items-center gap-2">
            <Terminal size={20} />
            CRISIS_COMMAND_OS v2.4
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            SECTOR: ALMATY PRIME
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">City Reputation</div>
            <div className="flex items-center gap-2 justify-end">
              <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${reputation < 40 ? 'bg-red-500' : 'bg-tech-teal'}`}
                  style={{ width: `${reputation}%` }}
                ></div>
              </div>
              <span className="font-mono font-bold text-tech-teal">{reputation}%</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-400">
            <Radio size={18} />
          </div>
        </div>
      </header>

      {/* Main Viewport (Map) */}
      <main className="flex-1 relative bg-tech-dark overflow-hidden">

        {/* Map Background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="/city_map_3d.png"
            alt="City Map"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/80"></div>
        </div>

        {/* Tactical Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.05)_1px,transparent_1px)] bg-[length:50px_50px] pointer-events-none"></div>

        {/* Radar Circles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-tech-teal/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border border-tech-teal/10 rounded-full"></div>
        </div>

        {/* Scanning Line Animation */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(45,212,191,0.05)_50%,transparent_51%)] bg-[length:100%_8px] pointer-events-none animate-pulse"></div>

        {/* Map Pins */}
        {tasks.map(task => (
          <TaskPin
            key={task.id}
            task={task}
            onClick={() => {
              if (task.status === 'pending') setSelectedTask(task);
              if (task.status === 'active') setViewingActiveTask(task);
            }}
          />
        ))}

        {/* Moving Squads Layer */}
        {movingSquads.map(squad => (
          <SquadMarker
            key={squad.id}
            squad={squad}
            onComplete={handleSquadArrival}
            tick={tick}
          />
        ))}{/* Log Terminal Overlay */}
        <div className="absolute top-4 right-4 w-80 pointer-events-none z-20">
          <div className="bg-slate-950/90 border border-slate-800 p-3 rounded clip-corner-top backdrop-blur">
            <div className="flex items-center gap-2 text-slate-500 border-b border-slate-800 pb-2 mb-2">
              <Activity size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">System Logs</span>
            </div>
            <div className="space-y-1.5 font-mono text-[10px] h-40 overflow-hidden flex flex-col-reverse">
              {logs.map(log => (
                <div key={log.id} className={`
                             truncate animate-in slide-in-from-right-5 fade-in duration-200
                             ${log.type === 'failure' ? 'text-red-400' : ''}
                             ${log.type === 'success' ? 'text-green-400' : ''}
                             ${log.type === 'warning' ? 'text-tech-orange' : ''}
                             ${log.type === 'info' ? 'text-blue-300' : ''}
                         `}>
                  <span className="opacity-30">[{new Date(log.timestamp).toLocaleTimeString().split(' ')[0]}]</span> {log.message}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HQ Marker */}
        <div
          className="absolute w-16 h-16 border-2 border-tech-teal rounded-full flex items-center justify-center z-10"
          style={{ left: `${HQ_POSITION.x}%`, top: `${HQ_POSITION.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-12 h-12 bg-tech-teal/10 rounded-full flex items-center justify-center animate-pulse">
            {/* Using explicit svg for home to avoid unused import issue if I removed Home from lucide-react but kept it here */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tech-teal"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          </div>
          <div className="absolute -bottom-6 text-[10px] font-bold text-tech-teal tracking-widest bg-slate-900/80 px-2 rounded">HQ</div>
        </div>

      </main>

      {/* Bottom Roster Bar */}
      <div className="h-56 bg-slate-950 border-t border-slate-800 z-30 shrink-0 relative">
        <div className="absolute -top-3 left-6 bg-slate-950 border border-slate-700 px-3 py-1 text-[10px] font-bold text-tech-teal uppercase tracking-widest">
          Squad Status
        </div>

        <div className="h-full overflow-x-auto flex items-center gap-4 px-6 pt-6 pb-4">
          {heroes.map(hero => (
            <HeroCard key={hero.id} hero={hero} onClick={(h) => setSelectedHero(h)} />
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedTask && (
        <MissionModal
          task={selectedTask}
          heroes={heroes}
          onClose={() => setSelectedTask(null)}
          onDispatch={handleDispatch}
        />
      )}

      {selectedHero && (
        <HeroDetailModal
          hero={selectedHero}
          onClose={() => setSelectedHero(null)}
        />
      )}

      {viewingActiveTask && (
        <ActiveMissionModal
          task={viewingActiveTask}
          heroes={heroes}
          onClose={() => setViewingActiveTask(null)}
        />
      )}

      {resolvingTask && (
        <MissionResolutionModal
          task={resolvingTask}
          heroes={heroes}
          onResolve={handleResolutionComplete}
        />
      )}

    </div>
  );
};

export default App;