import React from 'react';
import { useToast } from '../../context/ToastContext';

export default function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div aria-live="polite" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 z-50">
      <div className="w-full flex flex-col items-end gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto max-w-xs w-full rounded-lg shadow-lg ring-1 ring-black/5 overflow-hidden">
            <div className={`p-3 ${t.type === 'error' ? 'bg-red-50 text-red-800' : t.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-white text-gray-900'} border border-black/5`}> 
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm">{t.message}</div>
                <button onClick={() => dismiss(t.id)} className="text-xs opacity-80">Dismiss</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
