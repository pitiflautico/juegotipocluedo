'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useChatStore } from '@/store/chat';

interface ChatBoxProps {
  onSendMessage: (message: string) => void;
  currentUserId?: string;
}

export function ChatBox({ onSendMessage, currentUserId }: ChatBoxProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages } = useChatStore();

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Chat del Equipo</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4 max-h-64">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              No hay mensajes aún. ¡Empieza la conversación!
            </p>
          ) : (
            messages.map((msg) => {
              const isOwnMessage = msg.playerId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg ${
                      isOwnMessage
                        ? 'bg-mystery-accent text-white'
                        : 'bg-white/10 text-gray-200'
                    }`}
                  >
                    {!isOwnMessage && (
                      <p className="text-xs font-semibold mb-1 opacity-70">
                        {msg.playerName || 'Jugador'}
                      </p>
                    )}
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1"
            maxLength={200}
          />
          <Button type="submit" disabled={!message.trim()}>
            Enviar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
