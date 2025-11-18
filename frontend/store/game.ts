import { create } from 'zustand';

interface Player {
  socketId: string;
  userId: string;
  name: string;
  role: string;
  currentRoom: string;
  clues: any[];
  abilityCooldown: number;
}

interface GameState {
  roomId: string | null;
  status: 'waiting' | 'playing' | 'finished' | null;
  players: Player[];
  currentTurn: string | null;
  turnNumber: number;
  actionsRemaining: number;
  myPlayerId: string | null;
  boardLayout: any | null;
  clues: any[];
  events: any[];

  setRoomId: (roomId: string) => void;
  setGameState: (state: Partial<GameState>) => void;
  updatePlayer: (socketId: string, updates: Partial<Player>) => void;
  addClue: (clue: any) => void;
  addEvent: (event: any) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  roomId: null,
  status: null,
  players: [],
  currentTurn: null,
  turnNumber: 1,
  actionsRemaining: 3,
  myPlayerId: null,
  boardLayout: null,
  clues: [],
  events: [],

  setRoomId: (roomId) => set({ roomId }),

  setGameState: (state) => set(state),

  updatePlayer: (socketId, updates) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.socketId === socketId ? { ...p, ...updates } : p
      ),
    })),

  addClue: (clue) =>
    set((state) => ({
      clues: [...state.clues, clue],
    })),

  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),

  resetGame: () =>
    set({
      roomId: null,
      status: null,
      players: [],
      currentTurn: null,
      turnNumber: 1,
      actionsRemaining: 3,
      myPlayerId: null,
      boardLayout: null,
      clues: [],
      events: [],
    }),
}));
