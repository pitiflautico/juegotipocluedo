'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useGameStore } from '@/store/game';
import { useChatStore } from '@/store/chat';
import { socket } from '@/lib/socket';
import { GameBoard } from '@/components/game/GameBoard';
import { PlayerHUD } from '@/components/game/PlayerHUD';
import { CluesPanel } from '@/components/game/CluesPanel';
import { AbilitiesPanel } from '@/components/game/AbilitiesPanel';
import { ChatBox } from '@/components/game/ChatBox';
import { PlayersPanel } from '@/components/game/PlayersPanel';
import { ActionsPanel } from '@/components/game/ActionsPanel';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

// Load roles config
const ROLES_CONFIG: Record<string, any> = {
  detective: {
    code: 'detective',
    name: 'Detective',
    active_ability: {
      name: 'Interrogar',
      description: 'Obtiene 2 pistas en vez de 1 al inspeccionar',
      cooldown: 3,
    },
    passive_ability: {
      name: 'Compartir conocimiento',
      description: 'Puede compartir pistas sin coste de acción',
    },
  },
  scientist: {
    code: 'scientist',
    name: 'Científico',
    active_ability: {
      name: 'Análisis forense',
      description: 'Revela un objeto oculto en la habitación',
      cooldown: 4,
    },
    passive_ability: {
      name: 'Observador',
      description: '+1 acción al inspeccionar',
    },
  },
  visionary: {
    code: 'visionary',
    name: 'Artista de Visiones',
    active_ability: {
      name: 'Visión',
      description: 'Revelar una habitación sin estar en ella',
      cooldown: 5,
    },
    passive_ability: {
      name: 'Sexto sentido',
      description: 'Ve pistas de habitaciones adyacentes',
    },
  },
  chronicler: {
    code: 'chronicler',
    name: 'Cronista',
    active_ability: {
      name: 'Cronología',
      description: 'Ver el orden de eventos pasados en una habitación',
      cooldown: 4,
    },
    passive_ability: {
      name: 'Registro automático',
      description: 'Registra automáticamente movimientos de NPCs',
    },
  },
  infiltrator: {
    code: 'infiltrator',
    name: 'Infiltrado',
    active_ability: {
      name: 'Camuflaje',
      description: 'Moverse 2 veces sin ser detectado',
      cooldown: 3,
    },
    passive_ability: {
      name: 'Paso silencioso',
      description: 'Puede atravesar habitaciones bloqueadas',
    },
  },
  handyman: {
    code: 'handyman',
    name: 'Manitas',
    active_ability: {
      name: 'Reparar/Sabotear',
      description: 'Abrir puertas cerradas o bloquear pasillos',
      cooldown: 3,
    },
    passive_ability: {
      name: 'Uso de herramientas',
      description: 'Puede usar objetos del entorno',
    },
  },
};

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const {
    players,
    currentTurn,
    turnNumber,
    actionsRemaining,
    myPlayerId,
    boardLayout,
    clues,
    setGameState,
    addClue,
  } = useGameStore();

  const { addMessage, clearMessages } = useChatStore();

  const [myRole, setMyRole] = useState<any>(null);
  const [abilityCooldown, setAbilityCooldown] = useState(0);
  const [isAccuseModalOpen, setIsAccuseModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!roomId) return;

    // Connect to socket
    socket.connect();

    // Setup event listeners
    socket.on('room:state', handleRoomState);
    socket.on('room:joined', handleRoomJoined);
    socket.on('player:joined', handlePlayerJoined);
    socket.on('player:left', handlePlayerLeft);
    socket.on('turn:start', handleTurnStart);
    socket.on('game:update', handleGameUpdate);
    socket.on('clues:found', handleCluesFound);
    socket.on('chat:message', handleChatMessage);
    socket.on('error', handleError);

    // Join room
    joinRoom();

    return () => {
      socket.off('room:state');
      socket.off('room:joined');
      socket.off('player:joined');
      socket.off('player:left');
      socket.off('turn:start');
      socket.off('game:update');
      socket.off('clues:found');
      socket.off('chat:message');
      socket.off('error');
    };
  }, [isAuthenticated, roomId]);

  const joinRoom = async () => {
    if (!user) return;

    try {
      await socket.joinRoom(roomId, {
        userId: user.id,
        name: user.name,
      });
    } catch (error) {
      console.error('Error joining room:', error);
      router.push('/lobby');
    }
  };

  const handleRoomState = (data: any) => {
    console.log('Room state:', data);
    // Update game state
  };

  const handleRoomJoined = (data: any) => {
    console.log('Room joined:', data);
    if (data.player?.role) {
      const roleConfig = ROLES_CONFIG[data.player.role];
      setMyRole(roleConfig);
    }
  };

  const handlePlayerJoined = (data: any) => {
    console.log('Player joined:', data);
    // Update players list
  };

  const handlePlayerLeft = (data: any) => {
    console.log('Player left:', data);
  };

  const handleTurnStart = (data: any) => {
    console.log('Turn start:', data);
    setGameState({
      currentTurn: data.nextPlayer,
      turnNumber: data.turnNumber,
      actionsRemaining: 3,
    });
  };

  const handleGameUpdate = (data: any) => {
    console.log('Game update:', data);
    if (data.actionsLeft !== undefined) {
      setGameState({ actionsRemaining: data.actionsLeft });
    }
  };

  const handleCluesFound = (data: any) => {
    console.log('Clues found:', data);
    if (data.clues) {
      data.clues.forEach((clue: any) => addClue(clue));
    }
  };

  const handleChatMessage = (data: any) => {
    addMessage({
      id: Date.now().toString(),
      playerId: data.playerId,
      playerName: data.playerName,
      message: data.message,
      timestamp: data.timestamp,
    });
  };

  const handleError = (data: any) => {
    console.error('Socket error:', data);
    alert(data.message || 'Error en el juego');
  };

  // Actions
  const handleMove = async () => {
    if (!selectedRoom) {
      alert('Selecciona una habitación en el tablero');
      return;
    }

    try {
      await socket.move(roomId, selectedRoom);
    } catch (error: any) {
      alert(error.message || 'No puedes moverte a esa habitación');
    }
  };

  const handleInspect = async () => {
    try {
      await socket.inspect(roomId);
    } catch (error: any) {
      alert(error.message || 'Error al inspeccionar');
    }
  };

  const handleUseAbility = async () => {
    try {
      await socket.useAbility(roomId);
    } catch (error: any) {
      alert(error.message || 'Error al usar habilidad');
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      await socket.sendChatMessage(roomId, message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLeaveGame = async () => {
    if (confirm('¿Seguro que quieres salir de la partida?')) {
      try {
        await socket.leaveRoom(roomId);
        router.push('/dashboard');
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    }
  };

  if (!user || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mystery-dark via-mystery-medium to-mystery-light flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  const isMyTurn = currentTurn === myPlayerId;
  const currentPlayerName =
    players.find((p) => p.socketId === currentTurn)?.name || 'Esperando...';

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystery-dark via-mystery-medium to-mystery-light">
      {/* Header */}
      <header className="bg-mystery-dark/50 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Club Misterium</h1>
          <div className="flex items-center gap-3">
            <span className="text-white text-sm">Sala: {roomId.substring(0, 8)}...</span>
            <Button variant="danger" size="sm" onClick={handleLeaveGame}>
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        {/* HUD */}
        <div className="mb-4">
          <PlayerHUD
            turnNumber={turnNumber}
            currentPlayerName={currentPlayerName}
            actionsRemaining={actionsRemaining}
            isMyTurn={isMyTurn}
          />
        </div>

        {/* Game Board and Panels */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left Column - Board */}
          <div className="lg:col-span-2 space-y-4">
            {boardLayout ? (
              <GameBoard
                layout={boardLayout}
                players={players}
                currentPlayer={myPlayerId}
                onRoomClick={setSelectedRoom}
              />
            ) : (
              <div className="bg-mystery-dark/50 rounded-lg p-8 text-center text-white">
                Cargando tablero...
              </div>
            )}

            {/* Chat */}
            <ChatBox onSendMessage={handleSendMessage} currentUserId={myPlayerId} />
          </div>

          {/* Right Column - Info Panels */}
          <div className="space-y-4">
            {/* Actions */}
            <ActionsPanel
              canAct={isMyTurn}
              actionsRemaining={actionsRemaining}
              onMove={handleMove}
              onInspect={handleInspect}
              onAccuse={() => setIsAccuseModalOpen(true)}
            />

            {/* Abilities */}
            {myRole && (
              <AbilitiesPanel
                role={myRole}
                abilityCooldown={abilityCooldown}
                onUseAbility={handleUseAbility}
                canUseAbility={isMyTurn && actionsRemaining > 0}
              />
            )}

            {/* Players */}
            <PlayersPanel players={players} currentPlayerId={myPlayerId} />

            {/* Clues */}
            <CluesPanel clues={clues} />
          </div>
        </div>
      </div>

      {/* Accuse Modal */}
      <Modal
        isOpen={isAccuseModalOpen}
        onClose={() => setIsAccuseModalOpen(false)}
        title="Hacer Acusación Final"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-white">
            Esta es tu oportunidad de resolver el caso. Elige cuidadosamente:
          </p>
          {/* TODO: Add accusation form */}
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-300 text-sm">
              ⚠️ Solo tienes 3 intentos. Una acusación incorrecta cuenta contra el equipo.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setIsAccuseModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button variant="danger" className="flex-1">
              Acusar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
