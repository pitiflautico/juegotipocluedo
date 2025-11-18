import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-white mb-2 text-sm font-medium">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-4 py-2 rounded bg-white/10 text-white border transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-mystery-accent',
          'placeholder:text-gray-400',
          error ? 'border-red-500' : 'border-white/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

export function TextArea({ label, error, className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-white mb-2 text-sm font-medium">
          {label}
        </label>
      )}
      <textarea
        className={clsx(
          'w-full px-4 py-2 rounded bg-white/10 text-white border transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-mystery-accent',
          'placeholder:text-gray-400',
          error ? 'border-red-500' : 'border-white/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
