'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useGameStore } from '@/store/game';
import { api } from '@/lib/api';
import { socket } from '@/lib/socket';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export default function LobbyPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const { setRoomId } = useGameStore();

  const [cases, setCases] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadData();
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const [casesRes, templatesRes] = await Promise.all([
        api.getCases(),
        api.getTemplates(),
      ]);

      setCases(casesRes.data || []);
      setTemplates(templatesRes.data || []);

      // Select first case and template by default
      if (casesRes.data?.length > 0) {
        setSelectedCase(casesRes.data[0].id);
      }
      if (templatesRes.data?.length > 0) {
        setSelectedTemplate(templatesRes.data[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleCreateRoom = async () => {
    if (!selectedCase || !selectedTemplate) {
      alert('Selecciona un caso y un tablero');
      return;
    }

    setIsCreating(true);

    try {
      const response = await socket.createRoom({
        caseId: selectedCase,
        templateId: selectedTemplate,
        maxPlayers: 6,
      });

      const roomId = response.data.id;
      setRoomId(roomId);

      // Join the created room
      await socket.joinRoom(roomId, {
        userId: user?.id,
        name: user?.name,
        role: 'detective', // Will be assigned by server
      });

      router.push(`/game/${roomId}`);
    } catch (error: any) {
      console.error('Error creating room:', error);
      alert(error.message || 'Error al crear la sala');
    } finally {
      setIsCreating(false);
      setIsCreateModalOpen(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mystery-dark via-mystery-medium to-mystery-light flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  const selectedCaseData = cases.find(c => c.id === selectedCase);
  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystery-dark via-mystery-medium to-mystery-light">
      {/* Header */}
      <header className="bg-mystery-dark/50 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Lobby</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
              ← Volver al Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Room */}
          <Card hover onClick={() => setIsCreateModalOpen(true)}>
            <CardHeader>
              <div className="text-6xl mb-4">➕</div>
              <CardTitle>Crear Nueva Sala</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Crea una nueva partida y espera a que otros jugadores se unan</p>
            </CardContent>
          </Card>

          {/* Quick Join */}
          <Card>
            <CardHeader>
              <div className="text-6xl mb-4">🚀</div>
              <CardTitle>Unión Rápida</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Únete a una sala disponible automáticamente</p>
              <p className="text-sm text-gray-400 mt-2">(Próximamente)</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Rooms (placeholder) */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Salas Disponibles</h2>
          <Card>
            <CardContent>
              <div className="text-center py-8 text-gray-400">
                No hay salas disponibles en este momento
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Room Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nueva Sala"
        size="lg"
      >
        <div className="space-y-6">
          {/* Select Case */}
          <div>
            <label className="block text-white mb-2 font-semibold">Selecciona un Caso</label>
            <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
              {cases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedCase === caseItem.id
                      ? 'border-mystery-accent bg-mystery-accent/20'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                  onClick={() => setSelectedCase(caseItem.id)}
                >
                  <h4 className="text-white font-semibold">{caseItem.title}</h4>
                  <p className="text-sm text-gray-400 mt-1">{caseItem.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300">
                      Dificultad: {caseItem.difficulty}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Select Template */}
          <div>
            <label className="block text-white mb-2 font-semibold">Selecciona un Tablero</label>
            <div className="grid grid-cols-1 gap-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'border-mystery-accent bg-mystery-accent/20'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <h4 className="text-white font-semibold">{template.name}</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Tipo: {template.type} • Max jugadores: {template.max_players}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {selectedCaseData && selectedTemplateData && (
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-white font-semibold mb-2">Resumen</h4>
              <p className="text-gray-300 text-sm">
                <strong>Caso:</strong> {selectedCaseData.title}
              </p>
              <p className="text-gray-300 text-sm">
                <strong>Tablero:</strong> {selectedTemplateData.name}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateRoom}
              isLoading={isCreating}
              disabled={!selectedCase || !selectedTemplate}
              className="flex-1"
            >
              Crear Sala
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
