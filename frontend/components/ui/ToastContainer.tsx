'use client';

import { useToast } from '@/hooks/useToast';
import clsx from 'clsx';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            'px-6 py-4 rounded-lg shadow-lg backdrop-blur-lg border-2',
            'transform transition-all duration-300 ease-in-out',
            'animate-slide-in-right',
            toast.type === 'success' && 'bg-green-500/90 border-green-400 text-white',
            toast.type === 'error' && 'bg-red-500/90 border-red-400 text-white',
            toast.type === 'warning' && 'bg-yellow-500/90 border-yellow-400 text-white',
            toast.type === 'info' && 'bg-blue-500/90 border-blue-400 text-white'
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
