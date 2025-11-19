export enum StatType {
  INTELLIGENCE = 'Intelligence',
  AGILITY = 'Agility',
  FEARLESSNESS = 'Fearlessness',
  DURABILITY = 'Durability',
  CHARISMA = 'Charisma',
}

export interface HeroStats {
  [StatType.INTELLIGENCE]: number;
  [StatType.AGILITY]: number;
  [StatType.FEARLESSNESS]: number;
  [StatType.DURABILITY]: number;
  [StatType.CHARISMA]: number;
}

export interface HeroAbility {
  name: string;
  description: string;
  type: 'passive' | 'active' | 'ultimate';
}

export interface HeroBio {
  realName: string;
  age: number;
  height: string;
  history: string;
  facts: string[];
}

export interface Hero {
  id: string;
  name: string;
  title: string;
  description: string;
  avatarUrl: string;
  stats: HeroStats;
  status: 'idle' | 'busy' | 'cooldown' | 'retired' | 'deploying' | 'returning';
  cooldownRemaining: number; // in seconds
  traumaCount: number;
  abilities: HeroAbility[];
  bio: HeroBio;
  canFly: boolean;
}

export interface TaskRequirements {
  primaryStat: StatType;
  primaryValue: number;
  secondaryStat?: StatType;
  secondaryValue?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  requirements: TaskRequirements;
  difficultyLevel: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  timeToExpire: number; // seconds until task disappears/fails
  duration: number; // seconds it takes to complete
  status: 'pending' | 'active' | 'resolving' | 'completed' | 'failed' | 'expired';
  assignedHeroIds: string[];
  position: { x: number; y: number }; // Percentage coordinates (0-100)
}

export interface MovingSquad {
  id: string;
  heroIds: string[];
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
  waypoints: { x: number; y: number }[];
  startTime: number;
  duration: number; // ms
  type: 'deploy' | 'return';
  onCompletePayload?: any; // Data to pass when movement finishes
}

export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'success' | 'failure' | 'info' | 'warning';
}