'use client';

import { useEffect, useRef } from 'react';
import { socket } from '@/lib/socket';
import { useGameStore } from '@/store/game';
import { useChatStore } from '@/store/chat';

export function useSocket(roomId: string) {
  const isConnected = useRef(false);
  const { setGameState, addClue } = useGameStore();
  const { addMessage } = useChatStore();

  useEffect(() => {
    if (isConnected.current) return;

    socket.connect();
    isConnected.current = true;

    // Setup event listeners
    socket.on('room:state', (data) => {
      console.log('Room state:', data);
      if (data.players) {
        setGameState({ players: data.players });
      }
    });

    socket.on('room:joined', (data) => {
      console.log('Room joined:', data);
    });

    socket.on('turn:start', (data) => {
      setGameState({
        currentTurn: data.nextPlayer,
        turnNumber: data.turnNumber,
        actionsRemaining: 3,
      });
    });

    socket.on('game:update', (data) => {
      if (data.actionsLeft !== undefined) {
        setGameState({ actionsRemaining: data.actionsLeft });
      }
    });

    socket.on('clues:found', (data) => {
      if (data.clues) {
        data.clues.forEach((clue: any) => addClue(clue));
      }
    });

    socket.on('chat:message', (data) => {
      addMessage({
        id: Date.now().toString(),
        playerId: data.playerId,
        playerName: data.playerName,
        message: data.message,
        timestamp: data.timestamp,
      });
    });

    socket.on('error', (data) => {
      console.error('Socket error:', data);
    });

    return () => {
      socket.off('room:state');
      socket.off('room:joined');
      socket.off('turn:start');
      socket.off('game:update');
      socket.off('clues:found');
      socket.off('chat:message');
      socket.off('error');
      isConnected.current = false;
    };
  }, [roomId]);

  return {
    socket,
    isConnected: socket.isConnected(),
  };
}
