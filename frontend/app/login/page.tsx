'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error) {
      // Error is handled in the store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystery-dark via-mystery-medium to-mystery-light flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Iniciar Sesión
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-white mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:border-mystery-accent"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:border-mystery-accent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-mystery-accent hover:bg-purple-600 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center text-white">
          <p>
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-mystery-accent hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-white/60 hover:text-white text-sm">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
