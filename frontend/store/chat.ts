import { create } from 'zustand';

interface ChatMessage {
  id: string;
  playerId: string;
  playerName?: string;
  message: string;
  timestamp: string;
}

interface ChatStore {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  clearMessages: () => set({ messages: [] }),
}));
