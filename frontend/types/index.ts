export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  stats?: PlayerStats;
  created_at: string;
  updated_at: string;
}

export interface PlayerStats {
  id: string;
  user_id: string;
  games_played: number;
  games_won: number;
  games_lost: number;
  total_time_played: number;
  last_game_at?: string;
  win_rate?: number;
}

export interface Game {
  id: string;
  case_id: string;
  template_id: string;
  started_at?: string;
  ended_at?: string;
  status: 'waiting' | 'playing' | 'finished' | 'abandoned';
  players_count: number;
  winner_team?: boolean;
  result_json?: any;
  game_case?: GameCase;
  template?: GameTemplate;
  players?: GamePlayer[];
  created_at: string;
  updated_at: string;
}

export interface GamePlayer {
  id: string;
  game_id: string;
  user_id: string;
  role_code: string;
  is_traitor: boolean;
  result?: 'win' | 'lose' | 'abandoned';
  stats_json?: any;
  user?: User;
}

export interface GameCase {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  meta_json?: {
    npcs: NPC[];
    weapons: Weapon[];
  };
  created_at: string;
}

export interface NPC {
  id: number;
  name: string;
  role: string;
}

export interface Weapon {
  code: string;
  name: string;
}

export interface GameTemplate {
  id: string;
  name: string;
  type: string;
  layout_json: {
    rooms: Room[];
    connections: Connection[];
  };
  max_players: number;
  created_at: string;
}

export interface Room {
  code: string;
  name: string;
  type: string;
  x: number;
  y: number;
}

export interface Connection {
  from: string;
  to: string;
  bidirectional?: boolean;
}

export interface Clue {
  id: string;
  type: 'true' | 'false';
  description: string;
  relatedTo: 'weapon' | 'suspect' | 'room' | 'motive';
}

export interface Role {
  code: string;
  name: string;
  active_ability: {
    name: string;
    description: string;
    cooldown: number;
  };
  passive_ability: {
    name: string;
    description: string;
  };
}

export interface Player {
  socketId: string;
  userId: string;
  name: string;
  role: string;
  currentRoom: string;
  clues: Clue[];
  abilityCooldown: number;
  isConnected: boolean;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName?: string;
  message: string;
  timestamp: string;
}

export interface SocketResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}
