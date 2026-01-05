
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CalculationResult, Language } from './types';
import { APP_STORAGE_KEY, LANG_STORAGE_KEY, NOTIF_STORAGE_KEY, TRANSLATIONS } from './constants';
import Calculator from './components/Calculator';
import History from './components/History';
import MenuOverlay from './components/MenuOverlay';
import SettingsOverlay from './components/SettingsOverlay';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return (saved as Language) || 'vi';
  });
  
  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  const t = TRANSLATIONS[lang];
  const alertInterval = useRef<number | null>(null);
  const hasNotified = useRef<string | null>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    const savedHistory = localStorage.getItem(APP_STORAGE_KEY);
    if (savedHistory) {
      try { 
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
        if (parsed.length > 0 && !parsed[0].checklistCompleted) {
          setActiveBatchId(parsed[0].id);
        }
      } catch (e) { 
        console.error("Lỗi khi load lịch sử:", e); 
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, [lang]);

  const triggerSystemNotification = useCallback(async () => {
    const notifEnabledPref = localStorage.getItem(NOTIF_STORAGE_KEY) === 'true';
    if (!notifEnabledPref || !("Notification" in window)) return;
    
    if (Notification.permission === "granted") {
      const registration = await navigator.serviceWorker.ready;
      const sw = registration.active || navigator.serviceWorker.controller;
      
      const options = {
        body: t.notif_body,
        icon: 'https://i.postimg.cc/kGy3M7x6/icon2.png',
        badge: 'https://i.postimg.cc/kGy3M7x6/icon2.png',
        tag: 'jicv-acid-alert',
        renotify: true,
        vibrate: [200, 100, 200],
        requireInteraction: true
      };

      if (sw) {
        // Gửi tin nhắn vào SW để trigger (Cách ổn định nhất cho mobile)
        sw.postMessage({
          type: 'TRIGGER_NOTIF',
          title: t.notif_title,
          options
        });
      } else {
        // Fallback nếu SW chưa sẵn sàng
        registration.showNotification(t.notif_title, options as any);
      }
    }
  }, [t]);

  useEffect(() => {
    if (activeBatchId) {
      alertInterval.current = window.setInterval(() => {
        const activeBatch = history.find(h => h.id === activeBatchId);
        if (activeBatch && !activeBatch.checklistCompleted) {
          const diff = Date.now() - activeBatch.timestamp;
          if (diff >= 30 * 60 * 1000) {
            setShowAlert(true);
            if (hasNotified.current !== activeBatchId) {
              triggerSystemNotification();
              hasNotified.current = activeBatchId;
            }
          }
        }
      }, 10000); 
    } else {
      if (alertInterval.current) clearInterval(alertInterval.current);
      setShowAlert(false);
      hasNotified.current = null;
    }
    return () => { if (alertInterval.current) clearInterval(alertInterval.current); };
  }, [activeBatchId, history, triggerSystemNotification]);

  const saveCalculation = useCallback((result: CalculationResult) => {
    setHistory(prev => {
      const updated = [result, ...prev];
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setActiveBatchId(result.id);
    setShowAlert(false);
    hasNotified.current = null;
  }, []);

  const markChecklistDone = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, checklistCompleted: true, checklistCompletedAt: Date.now() } : item
      );
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setActiveBatchId(null);
    setShowAlert(false);
    hasNotified.current = null;
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    if (activeBatchId === id) {
      setActiveBatchId(null);
      hasNotified.current = null;
    }
  }, [activeBatchId]);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  return (
    <div className="min-h-screen bg-[#f3f0f5] flex flex-col font-sans max-w-md mx-auto shadow-2xl relative overflow-x-hidden safe-padding-bottom">
      {showAlert && (
        <div className="bg-red-600 text-white p-3 text-center text-[10px] font-bold animate-pulse z-40 sticky top-0 shadow-lg safe-padding-top">
          {t.alert_unfinished}
        </div>
      )}

      <header className={`bg-[#ef4a2c] pb-6 text-center shadow-md relative ${!showAlert ? 'safe-padding-top pt-8' : 'pt-4'}`}>
        <button onClick={() => setIsSettingsOpen(true)} className="absolute left-4 bottom-6 p-2 text-white/90 hover:text-white transition-colors">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <button onClick={() => setIsMenuOpen(true)} className="absolute right-4 bottom-6 p-2 text-white/90 hover:text-white transition-colors">
          <div className="relative">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {(activeBatchId || deferredPrompt) && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400"></span>
              </span>
            )}
          </div>
        </button>

        <h1 className="text-white text-3xl font-black tracking-widest uppercase">{t.title}</h1>
        <p className="text-white/80 text-[10px] font-bold mt-1 tracking-[0.1em] uppercase">{t.subtitle}</p>
      </header>

      <main className="flex-1 p-5 space-y-6">
        <Calculator onSave={saveCalculation} lang={lang} />
        <div className="pt-4 border-t border-slate-200">
          <button onClick={() => setShowHistory(!showHistory)} className="w-full py-2 text-slate-500 font-medium flex items-center justify-center space-x-2">
            <span>{showHistory ? t.hide_history : t.view_history}</span>
            <svg className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showHistory && (
            <div className="mt-4">
              <History history={history} lang={lang} onDelete={deleteRecord} onClear={() => {
                  if (window.confirm(t.confirm_clear)) {
                    setHistory([]);
                    localStorage.removeItem(APP_STORAGE_KEY);
                    setActiveBatchId(null);
                    hasNotified.current = null;
                  }
                }} 
              />
            </div>
          )}
        </div>
      </main>
      <footer className="p-4 text-center text-[10px] text-slate-400 uppercase tracking-widest mb-2">{t.system_ver}</footer>
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} lang={lang} activeBatchId={activeBatchId} onChecklistComplete={markChecklistDone} canInstall={!!deferredPrompt} onInstall={handleInstallClick} />
      <SettingsOverlay isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} lang={lang} setLang={setLang} />
    </div>
  );
};

export default App;
