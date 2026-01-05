
import React, { useState, useEffect, useMemo } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeBatchId: string | null;
  onChecklistComplete: (id: string) => void;
  canInstall?: boolean;
  onInstall?: () => void;
  lang: Language;
}

const STORAGE_KEY_CHECKLIST_PREFIX = 'jicv_acid_checklist_';

const MenuOverlay: React.FC<MenuOverlayProps> = ({ 
  isOpen, 
  onClose, 
  activeBatchId, 
  onChecklistComplete,
  canInstall,
  onInstall,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'checklist' | 'safety' | 'emergency'>('checklist');
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(t.checklist_items.length).fill(false));
  const [isSaved, setIsSaved] = useState(false);

  const allChecked = useMemo(() => checkedItems.every(item => item === true), [checkedItems]);

  useEffect(() => {
    if (isOpen && activeBatchId) {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKLIST_PREFIX + activeBatchId);
      if (saved) {
        try {
          setCheckedItems(JSON.parse(saved));
        } catch (e) {
          console.error("Lỗi load checklist state", e);
        }
      } else {
        setCheckedItems(new Array(t.checklist_items.length).fill(false));
      }
      setIsSaved(false);
    }
  }, [isOpen, activeBatchId, t.checklist_items.length]);

  const handleToggleCheck = (index: number) => {
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
    setIsSaved(false);
  };

  const handleSaveChecklist = () => {
    if (!allChecked) return;
    if (activeBatchId) {
      localStorage.setItem(STORAGE_KEY_CHECKLIST_PREFIX + activeBatchId, JSON.stringify(checkedItems));
      onChecklistComplete(activeBatchId);
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  const handleResetChecklist = () => {
    if (window.confirm(t.confirm_reset_checklist)) {
      const resetState = new Array(t.checklist_items.length).fill(false);
      setCheckedItems(resetState);
      if (activeBatchId) localStorage.removeItem(STORAGE_KEY_CHECKLIST_PREFIX + activeBatchId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#ef4a2c] text-white">
          <h2 className="text-xl font-black tracking-tight uppercase">{t.handbook}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex bg-slate-50 border-b border-slate-200">
          <button onClick={() => setActiveTab('checklist')} className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'checklist' ? 'text-[#ef4a2c] border-b-2 border-[#ef4a2c] bg-white' : 'text-slate-400'}`}>{t.tab_checklist}</button>
          <button onClick={() => setActiveTab('safety')} className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'safety' ? 'text-[#ef4a2c] border-b-2 border-[#ef4a2c] bg-white' : 'text-slate-400'}`}>{t.tab_safety}</button>
          <button onClick={() => setActiveTab('emergency')} className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'emergency' ? 'text-[#ef4a2c] border-b-2 border-[#ef4a2c] bg-white' : 'text-slate-400'}`}>{t.tab_emergency}</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'checklist' && (
            <div className="space-y-4 animate-in fade-in duration-300 pb-20">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-slate-900 font-bold flex items-center text-sm">
                  {t.tab_checklist}
                </h3>
                <button onClick={handleResetChecklist} className="text-[10px] text-slate-400 hover:text-red-500 font-bold uppercase">{t.reset_checklist}</button>
              </div>

              {!activeBatchId && (
                <div className="p-3 bg-blue-50 text-blue-700 text-[9px] font-bold uppercase rounded-lg mb-4 text-center">
                  {t.need_calc_first}
                </div>
              )}

              {t.checklist_items.map((item, idx) => (
                <label key={idx} className={`flex items-start p-3 rounded-xl cursor-pointer border-2 transition-all ${checkedItems[idx] ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-transparent'}`}>
                  <input 
                    type="checkbox" 
                    checked={checkedItems[idx]}
                    onChange={() => handleToggleCheck(idx)}
                    className="mt-1 mr-3 w-5 h-5 rounded border-slate-300 text-[#00a651] focus:ring-[#00a651]" 
                  />
                  <span className={`text-xs leading-tight ${checkedItems[idx] ? 'text-green-800 font-medium' : 'text-slate-600'}`}>{item}</span>
                </label>
              ))}

              <div className="mt-8">
                <button
                  onClick={handleSaveChecklist}
                  disabled={!allChecked || !activeBatchId || isSaved}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 ${allChecked && activeBatchId ? (isSaved ? 'bg-green-500' : 'bg-[#ef4a2c]') : 'bg-slate-300 cursor-not-allowed'}`}
                >
                  {isSaved ? t.confirmed_safe : t.save_complete}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-slate-900 font-bold mb-4 flex items-center text-sm">
                {t.safety_rules_title}
              </h3>
              {t.safety_rules.map((rule, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${rule.urgent ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                  <h4 className={`text-xs font-black mb-1 ${rule.urgent ? 'text-red-600' : 'text-slate-800'}`}>{rule.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{rule.content}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-slate-900 font-bold mb-4 flex items-center text-sm">
                {t.emergency_title}
              </h3>
              {t.emergency.map((item, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-orange-200">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-200" />
                  <h4 className="text-xs font-bold text-slate-800 mb-1">{item.situation}</h4>
                  <p className="text-xs text-slate-600 bg-orange-50/50 p-3 rounded-xl border border-orange-100">{item.action}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {canInstall && (
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button 
              onClick={onInstall}
              className="w-full bg-slate-800 text-white text-[10px] font-black py-3 rounded-xl shadow-sm uppercase"
            >
              {t.install_app}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuOverlay;
