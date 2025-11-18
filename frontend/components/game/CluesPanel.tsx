'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface Clue {
  id: string;
  type: string;
  description: string;
  relatedTo: string;
}

interface CluesPanelProps {
  clues: Clue[];
}

export function CluesPanel({ clues }: CluesPanelProps) {
  const getClueIcon = (relatedTo: string) => {
    const icons: Record<string, string> = {
      weapon: '🔪',
      suspect: '👤',
      room: '🚪',
      motive: '💭',
    };
    return icons[relatedTo] || '📝';
  };

  const getClueColor = (type: string) => {
    return type === 'false' ? 'border-red-500/30 bg-red-500/5' : 'border-green-500/30 bg-green-500/5';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Pistas Encontradas ({clues.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {clues.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              Aún no has encontrado pistas.
              <br />
              Inspecciona habitaciones para descubrir información.
            </p>
          ) : (
            clues.map((clue) => (
              <div
                key={clue.id}
                className={`p-3 rounded-lg border-2 ${getClueColor(clue.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getClueIcon(clue.relatedTo)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-gray-300">
                        {clue.relatedTo}
                      </span>
                      {clue.type === 'false' && (
                        <span className="text-xs px-2 py-0.5 bg-red-500/20 rounded text-red-400">
                          Posible pista falsa
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white">{clue.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
