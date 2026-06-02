'use client';

import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Já está instalado como PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Detectar iPhone/iPad
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIOS(ios);

    // Evento automático do Android (Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (isInstalled || dismissed) return null;
  if (!installEvent && !isIOS) return null;

  // Banner para iPhone
  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-[#1a237e] rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
            🐄
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900">Instalar como App</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Toque em <span className="font-semibold text-[#1a237e]">Compartilhar</span> <span className="text-base">⬆️</span> e depois em{' '}
              <span className="font-semibold text-[#1a237e]">"Adicionar à Tela de Início"</span>
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-300 text-2xl leading-none flex-shrink-0 -mt-1"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  // Banner para Android
  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-[#1a237e] rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
          🐄
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900">Instalar como App</p>
          <p className="text-xs text-gray-500 mt-0.5">Acesso rápido sem precisar abrir o navegador</p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-300 text-2xl leading-none flex-shrink-0 -mt-1"
        >
          ×
        </button>
      </div>
      <button
        onClick={async () => {
          if (!installEvent) return;
          await installEvent.prompt();
          const { outcome } = await installEvent.userChoice;
          if (outcome === 'accepted') setIsInstalled(true);
          setDismissed(true);
        }}
        className="w-full mt-3 bg-[#1a237e] text-white font-bold text-sm py-3 rounded-xl
                   tracking-widest uppercase shadow-md active:opacity-80 transition-opacity"
      >
        Instalar Agora
      </button>
    </div>
  );
}
