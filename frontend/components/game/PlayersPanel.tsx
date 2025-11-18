'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface Player {
  socketId: string;
  userId: string;
  name: string;
  role: string;
  currentRoom: string;
  isConnected: boolean;
}

interface PlayersPanelProps {
  players: Player[];
  currentPlayerId?: string;
}

const ROLE_ICONS: Record<string, string> = {
  detective: '🔍',
  scientist: '🔬',
  visionary: '🔮',
  chronicler: '📚',
  infiltrator: '🥷',
  handyman: '🔧',
};

const ROLE_NAMES: Record<string, string> = {
  detective: 'Detective',
  scientist: 'Científico',
  visionary: 'Visionario',
  chronicler: 'Cronista',
  infiltrator: 'Infiltrado',
  handyman: 'Manitas',
};

export function PlayersPanel({ players, currentPlayerId }: PlayersPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jugadores ({players.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {players.map((player) => {
            const isCurrentPlayer = player.socketId === currentPlayerId;
            return (
              <div
                key={player.socketId}
                className={`p-3 rounded-lg border-2 ${
                  isCurrentPlayer
                    ? 'border-mystery-accent bg-mystery-accent/20'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{ROLE_ICONS[player.role] || '🎭'}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{player.name}</p>
                      {isCurrentPlayer && (
                        <span className="text-xs px-2 py-0.5 bg-mystery-accent rounded text-white">
                          Tú
                        </span>
                      )}
                      {!player.isConnected && (
                        <span className="text-xs px-2 py-0.5 bg-red-500/20 rounded text-red-400">
                          Desconectado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {ROLE_NAMES[player.role] || player.role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
