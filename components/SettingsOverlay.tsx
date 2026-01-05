
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS, APP_STORAGE_KEY } from '../constants';

interface SettingsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const SettingsOverlay: React.FC<SettingsOverlayProps> = ({ isOpen, onClose, lang, setLang }) => {
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-800 text-white">
          <h2 className="text-xl font-black tracking-tight uppercase">{t.settings}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Language Selection */}
          <section>
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{t.language}</h3>
            <div className="flex space-x-4">
              <button 
                onClick={() => setLang('vi')}
                className={`flex-1 flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${lang === 'vi' ? 'border-[#ef4a2c] bg-red-50' : 'border-slate-100 grayscale hover:grayscale-0'}`}
              >
                <img src="https://flagcdn.com/w160/vn.png" alt="VN" className="w-12 h-8 object-cover rounded shadow-sm mb-2" />
                <span className={`text-xs font-bold ${lang === 'vi' ? 'text-[#ef4a2c]' : 'text-slate-500'}`}>TIẾNG VIỆT</span>
              </button>
              
              <button 
                onClick={() => setLang('ja')}
                className={`flex-1 flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${lang === 'ja' ? 'border-[#ef4a2c] bg-red-50' : 'border-slate-100 grayscale hover:grayscale-0'}`}
              >
                <img src="https://flagcdn.com/w160/jp.png" alt="JP" className="w-12 h-8 object-cover rounded shadow-sm mb-2" />
                <span className={`text-xs font-bold ${lang === 'ja' ? 'text-[#ef4a2c]' : 'text-slate-500'}`}>日本語</span>
              </button>
            </div>
          </section>

          {/* System Settings */}
          <section className="space-y-4">
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Hệ thống</h3>
            
            <button 
              onClick={() => {
                if (window.confirm(t.confirm_clear)) {
                  localStorage.removeItem(APP_STORAGE_KEY);
                  window.location.reload();
                }
              }}
              className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="text-sm font-bold">{t.clear_all}</span>
              </div>
            </button>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-[10px] text-blue-700 font-bold uppercase mb-1">Phiên bản</p>
              <p className="text-xs text-blue-900 font-medium italic">Build 1.2.0-STABLE</p>
            </div>
          </section>

          <section className="pt-8 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-300 uppercase tracking-widest">Designed for JICV Operations</p>
            <p className="text-[10px] text-slate-300">© 2024 JICV-IT Department</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsOverlay;
