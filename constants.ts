
import { Hero, StatType } from './types';

export const MAX_HEROES_PER_TASK = 3;
export const GAME_TICK_MS = 1000;
export const INITIAL_REPUTATION = 50;

export const STAT_COLORS: Record<StatType, string> = {
  [StatType.INTELLIGENCE]: 'text-stat-int border-stat-int bg-stat-int/10',
  [StatType.AGILITY]: 'text-stat-agi border-stat-agi bg-stat-agi/10',
  [StatType.FEARLESSNESS]: 'text-stat-fear border-stat-fear bg-stat-fear/10',
  [StatType.DURABILITY]: 'text-stat-dur border-stat-dur bg-stat-dur/10',
  [StatType.CHARISMA]: 'text-stat-cha border-stat-cha bg-stat-cha/10',
};

export const STAT_ICONS: Record<StatType, string> = {
  [StatType.INTELLIGENCE]: '🧠',
  [StatType.AGILITY]: '⚡',
  [StatType.FEARLESSNESS]: '🦁',
  [StatType.DURABILITY]: '🛡️',
  [StatType.CHARISMA]: '👑',
};

export const INITIAL_HEROES: Hero[] = [
  {
    id: 'h1',
    name: 'Dr. Neuron',
    title: 'The Architect',
    description: 'A genius tactician who solves problems before they happen.',
    avatarUrl: 'https://picsum.photos/seed/neuron/200/200',
    status: 'idle',
    cooldownRemaining: 0,
    traumaCount: 0,
    stats: {
      [StatType.INTELLIGENCE]: 55,
      [StatType.AGILITY]: 15,
      [StatType.FEARLESSNESS]: 20,
      [StatType.DURABILITY]: 10,
      [StatType.CHARISMA]: 30,
    },
    abilities: [
      {
        name: 'Predictive Algorithm',
        description: 'Analyzes mission parameters to predict outcomes with 99.9% accuracy.',
        type: 'passive'
      },
      {
        name: 'Neural Network',
        description: 'Connects all squad members mentally, sharing knowledge instantly.',
        type: 'active'
      },
      {
        name: 'Cognitive Overload',
        description: 'Floods enemy minds with raw data, incapacitating them.',
        type: 'ultimate'
      }
    ],
    bio: {
      realName: 'Dr. Aris Thorne',
      age: 45,
      height: "5'11\"",
      history: 'Former head of the Quantum Computing Institute. Merged his consciousness with an AI to save the city from a cyber-attack.',
      facts: [
        'Can read binary code faster than natural language.',
        'Does not sleep, only enters "defrag mode".',
        'His coffee order is just hot water with caffeine powder.'
      ]
    },
    canFly: true
  },
  {
    id: 'h2',
    name: 'Viper',
    title: 'The Shadow',
    description: 'Moves faster than the eye can track. Impossible to hit.',
    avatarUrl: 'https://picsum.photos/seed/viper/200/200',
    status: 'idle',
    cooldownRemaining: 0,
    traumaCount: 0,
    stats: {
      [StatType.INTELLIGENCE]: 30,
      [StatType.AGILITY]: 58,
      [StatType.FEARLESSNESS]: 45,
      [StatType.DURABILITY]: 15,
      [StatType.CHARISMA]: 20,
    },
    abilities: [
      {
        name: 'Phase Shift',
        description: 'Vibrates molecules to pass through solid objects.',
        type: 'active'
      },
      {
        name: 'Venom Strike',
        description: 'Paralyzing nerve strike that disables foes instantly.',
        type: 'passive'
      },
      {
        name: 'Shadow Dance',
        description: 'Becomes invisible and moves at supersonic speeds.',
        type: 'ultimate'
      }
    ],
    bio: {
      realName: 'Elena Vasko',
      age: 28,
      height: "5'7\"",
      history: 'Raised in a secret assassin guild, she defected to use her skills for justice. Her suit is made of experimental stealth fabric.',
      facts: [
        'Can hold her breath for 15 minutes.',
        'Is banned from all casinos in the sector.',
        'Collects vintage daggers.'
      ]
    },
    canFly: true
  },
  {
    id: 'h3',
    name: 'Captain Valor',
    title: 'The Vanguard',
    description: 'Laughs in the face of danger. First in, last out.',
    avatarUrl: 'https://picsum.photos/seed/valor/200/200',
    status: 'idle',
    cooldownRemaining: 0,
    traumaCount: 0,
    stats: {
      [StatType.INTELLIGENCE]: 25,
      [StatType.AGILITY]: 35,
      [StatType.FEARLESSNESS]: 62,
      [StatType.DURABILITY]: 40,
      [StatType.CHARISMA]: 45,
    },
    abilities: [
      {
        name: 'Indomitable Will',
        description: 'Immune to fear and mind control effects.',
        type: 'passive'
      },
      {
        name: 'Shield Throw',
        description: 'Hurls a kinetic energy shield that ricochets between targets.',
        type: 'active'
      },
      {
        name: 'Last Stand',
        description: 'Refuses to fall, fighting with increased power when near defeat.',
        type: 'ultimate'
      }
    ],
    bio: {
      realName: 'Steve Rogers (Clone #42)',
      age: 32,
      height: "6'2\"",
      history: 'A successful result of the Super Soldier program. He believes he is the original, but files suggest otherwise.',
      facts: [
        'Never backs down from a challenge.',
        'Volunteers at the animal shelter on weekends.',
        'Cannot get drunk due to high metabolism.'
      ]
    },
    canFly: false
  },
  {
    id: 'h4',
    name: 'Titan',
    title: 'The Mountain',
    description: 'Unstoppable force and immovable object combined.',
    avatarUrl: 'https://picsum.photos/seed/titan/200/200',
    status: 'idle',
    cooldownRemaining: 0,
    traumaCount: 0,
    stats: {
      [StatType.INTELLIGENCE]: 15,
      [StatType.AGILITY]: 10,
      [StatType.FEARLESSNESS]: 55,
      [StatType.DURABILITY]: 65,
      [StatType.CHARISMA]: 15,
    },
    abilities: [
      {
        name: 'Juggernaut Protocol',
        description: 'Once momentum is built, nothing can stop his forward movement.',
        type: 'passive'
      },
      {
        name: 'Seismic Slam',
        description: 'Strikes the ground, creating a localized earthquake.',
        type: 'active'
      },
      {
        name: 'Unbreakable Skin',
        description: 'Skin hardens to diamond-like density, deflecting all projectiles.',
        type: 'ultimate'
      }
    ],
    bio: {
      realName: 'Marcus Steel',
      age: 38,
      height: "7'5\"",
      history: 'A construction worker exposed to unknown radiation. He now uses his immense strength to rebuild what is broken.',
      facts: [
        'Weighs 450 lbs of pure muscle.',
        'Loves delicate flower arranging.',
        'Has to custom order all his clothes.'
      ]
    },
    canFly: false
  },
  {
    id: 'h5',
    name: 'Siren',
    title: 'The Voice',
    description: 'Can talk anyone out of anything. A natural leader.',
    avatarUrl: 'https://picsum.photos/seed/siren/200/200',
    status: 'idle',
    cooldownRemaining: 0,
    traumaCount: 0,
    stats: {
      [StatType.INTELLIGENCE]: 45,
      [StatType.AGILITY]: 30,
      [StatType.FEARLESSNESS]: 30,
      [StatType.DURABILITY]: 20,
      [StatType.CHARISMA]: 64,
    },
    abilities: [
      {
        name: 'Silver Tongue',
        description: 'Can convince enemies to lay down their arms.',
        type: 'active'
      },
      {
        name: 'Harmonic Resonance',
        description: 'Her voice heals wounds and soothes mental trauma.',
        type: 'passive'
      },
      {
        name: 'Commanding Presence',
        description: 'All allies within range fight with doubled efficiency.',
        type: 'ultimate'
      }
    ],
    bio: {
      realName: 'Lyra Song',
      age: 26,
      height: "5'6\"",
      history: 'A former pop star who discovered her voice had hypno-acoustic properties. Now uses her fame and powers for peace.',
      facts: [
        'Has a platinum album.',
        'Can shatter glass with a whisper.',
        'Is constantly followed by paparazzi drones.'
      ]
    },
    canFly: false
  },
];

export const FALLBACK_TASKS = [
  {
    title: "Cat Stuck in Tree",
    description: "A classic emergency. Requires agility to climb or charisma to lure it down.",
    difficulty: "Easy",
    primary: StatType.AGILITY,
    val1: 40,
    secondary: StatType.CHARISMA,
    val2: 30
  },
  {
    title: "Meteor Shower",
    description: "Small debris falling on the city. Needs durability to shield civilians.",
    difficulty: "Hard",
    primary: StatType.DURABILITY,
    val1: 80,
    secondary: StatType.FEARLESSNESS,
    val2: 60
  },
  {
    title: "Rogue AI Negotiation",
    description: "An AI has taken over the traffic grid. Needs intellect to hack or charisma to persuade.",
    difficulty: "Medium",
    primary: StatType.INTELLIGENCE,
    val1: 70,
    secondary: StatType.CHARISMA,
    val2: 50
  },
  {
    title: "Chemical Spill",
    description: "Toxic waste truck overturned. Containment requires bravery and resilience.",
    difficulty: "Medium",
    primary: StatType.DURABILITY,
    val1: 60,
    secondary: StatType.FEARLESSNESS,
    val2: 50
  },
  {
    title: "Bank Heist Hostage",
    description: "Armed robbers trapped in vault. Needs tactical planning or shock and awe.",
    difficulty: "Hard",
    primary: StatType.INTELLIGENCE,
    val1: 75,
    secondary: StatType.FEARLESSNESS,
    val2: 65
  },
  {
    title: "Subway Derailment",
    description: "Train tracks bent. Passengers trapped. Needs strength to lift debris.",
    difficulty: "Hard",
    primary: StatType.DURABILITY,
    val1: 85,
    secondary: StatType.AGILITY,
    val2: 40
  },
  {
    title: "Lost Tourist Group",
    description: "Wandered into the sewers. Needs someone approachable to guide them out.",
    difficulty: "Easy",
    primary: StatType.CHARISMA,
    val1: 45,
    secondary: StatType.INTELLIGENCE,
    val2: 30
  },
  {
    title: "Rooftop Chase",
    description: "Thief with jetpack fleeing across skyline. Speed is essence.",
    difficulty: "Medium",
    primary: StatType.AGILITY,
    val1: 70,
    secondary: StatType.FEARLESSNESS,
    val2: 40
  },
  {
    title: "Diplomatic Crisis",
    description: "Alien ambassador offended by parking ticket. Smooth things over.",
    difficulty: "Extreme",
    primary: StatType.CHARISMA,
    val1: 90,
    secondary: StatType.INTELLIGENCE,
    val2: 80
  },
  {
    title: "Shadow Monster",
    description: "Creature of pure fear stalking alleys. Needs absolute bravery to face.",
    difficulty: "Extreme",
    primary: StatType.FEARLESSNESS,
    val1: 95,
    secondary: StatType.INTELLIGENCE,
    val2: 50
  }
];