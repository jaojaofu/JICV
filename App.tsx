
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CalculationResult } from './types';
import { APP_STORAGE_KEY } from './constants';
import Calculator from './components/Calculator';
import History from './components/History';
import MenuOverlay from './components/MenuOverlay';

const App: React.FC = () => {
  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  const alertInterval = useRef<number | null>(null);

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

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    if (activeBatchId) {
      alertInterval.current = window.setInterval(() => {
        const activeBatch = history.find(h => h.id === activeBatchId);
        if (activeBatch && !activeBatch.checklistCompleted) {
          const diff = Date.now() - activeBatch.timestamp;
          if (diff >= 30 * 60 * 1000) {
            setShowAlert(true);
          }
        }
      }, 60000);
    } else {
      if (alertInterval.current) clearInterval(alertInterval.current);
      setShowAlert(false);
    }
    return () => { if (alertInterval.current) clearInterval(alertInterval.current); };
  }, [activeBatchId, history]);

  const saveCalculation = useCallback((result: CalculationResult) => {
    setHistory(prev => {
      const updated = [result, ...prev];
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setActiveBatchId(result.id);
    setShowAlert(false);
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
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    if (activeBatchId === id) setActiveBatchId(null);
  }, [activeBatchId]);

  return (
    <div className="min-h-screen bg-[#f3f0f5] flex flex-col font-sans max-w-md mx-auto shadow-2xl relative overflow-x-hidden">
      {showAlert && (
        <div className="bg-red-600 text-white p-3 text-center text-xs font-bold animate-pulse z-40 sticky top-0 shadow-lg">
          ⚠️ CẢNH BÁO: MẺ PHA CHƯA HOÀN THÀNH CHECK LIST (>30P)
        </div>
      )}

      <header className="bg-[#ef4a2c] pt-8 pb-6 text-center shadow-md relative">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="absolute right-4 top-8 p-2 text-white/90 hover:text-white transition-colors"
        >
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

        <h1 className="text-white text-4xl font-black tracking-widest uppercase">JICV AXIT 6%</h1>
        <p className="text-white/80 text-[10px] font-bold mt-1 tracking-[0.1em] uppercase">
          TÍNH TOÁN LƯỢNG PHA AXIT 6%
        </p>
      </header>

      <main className="flex-1 p-5 space-y-6">
        <Calculator onSave={saveCalculation} />
        
        <div className="pt-4 border-t border-slate-200">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="w-full py-2 text-slate-500 font-medium flex items-center justify-center space-x-2"
          >
            <span>{showHistory ? "Ẩn lịch sử" : "Xem lịch sử pha chế"}</span>
            <svg className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showHistory && (
            <div className="mt-4">
              <History 
                history={history} 
                onDelete={deleteRecord} 
                onClear={() => {
                  if (window.confirm("Xóa toàn bộ lịch sử?")) {
                    setHistory([]);
                    localStorage.removeItem(APP_STORAGE_KEY);
                    setActiveBatchId(null);
                  }
                }} 
              />
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 text-center text-[10px] text-slate-400 uppercase tracking-widest">
        HỆ THỐNG VẬN HÀNH JICV - BẢN 1.0
      </footer>

      <MenuOverlay 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        activeBatchId={activeBatchId}
        onChecklistComplete={markChecklistDone}
        canInstall={!!deferredPrompt}
        onInstall={handleInstallClick}
      />
    </div>
  );
};

export default App;
