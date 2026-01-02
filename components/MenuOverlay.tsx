
import React, { useState, useEffect, useMemo } from 'react';
import { CHECKLIST_ITEMS, SAFETY_RULES, EMERGENCY_RESPONSE } from '../constants';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeBatchId: string | null;
  onChecklistComplete: (id: string) => void;
}

const STORAGE_KEY_CHECKLIST_PREFIX = 'jicv_acid_checklist_';

const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose, activeBatchId, onChecklistComplete }) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'safety' | 'emergency'>('checklist');
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(CHECKLIST_ITEMS.length).fill(false));
  const [isSaved, setIsSaved] = useState(false);

  const allChecked = useMemo(() => checkedItems.every(item => item === true), [checkedItems]);

  // Load trạng thái checklist cho mẻ đang hoạt động
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
        setCheckedItems(new Array(CHECKLIST_ITEMS.length).fill(false));
      }
      setIsSaved(false);
    }
  }, [isOpen, activeBatchId]);

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
    if (window.confirm("Bạn muốn làm mới toàn bộ checklist?")) {
      const resetState = new Array(CHECKLIST_ITEMS.length).fill(false);
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
          <h2 className="text-xl font-black tracking-tight uppercase">CẨM NANG VẬN HÀNH</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex bg-slate-50 border-b border-slate-200">
          <button onClick={() => setActiveTab('checklist')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'checklist' ? 'text-[#ef4a2c] border-b-2 border-[#ef4a2c] bg-white' : 'text-slate-400'}`}>Checklist</button>
          <button onClick={() => setActiveTab('safety')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'safety' ? 'text-[#ef4a2c] border-b-2 border-[#ef4a2c] bg-white' : 'text-slate-400'}`}>An Toàn</button>
          <button onClick={() => setActiveTab('emergency')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'emergency' ? 'text-[#ef4a2c] border-b-2 border-[#ef4a2c] bg-white' : 'text-slate-400'}`}>Ứng Phó</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'checklist' && (
            <div className="space-y-4 animate-in fade-in duration-300 pb-20">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-slate-900 font-bold flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2 text-sm">✓</span>
                  Quy trình mẻ hiện tại
                </h3>
                <button onClick={handleResetChecklist} className="text-[10px] text-slate-400 hover:text-red-500 font-bold uppercase transition-colors">Làm mới</button>
              </div>

              {!activeBatchId && (
                <div className="p-3 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded-lg mb-4 text-center">
                  Cần nhấn "Tính Toán" mẻ mới trước khi làm Checklist
                </div>
              )}

              {CHECKLIST_ITEMS.map((item, idx) => (
                <label key={idx} className={`flex items-start p-3 rounded-xl cursor-pointer border-2 transition-all ${checkedItems[idx] ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-transparent'}`}>
                  <input 
                    type="checkbox" 
                    checked={checkedItems[idx]}
                    onChange={() => handleToggleCheck(idx)}
                    className="mt-1 mr-3 w-5 h-5 rounded border-slate-300 text-[#00a651] focus:ring-[#00a651]" 
                  />
                  <span className={`text-sm leading-tight ${checkedItems[idx] ? 'text-green-800 font-medium' : 'text-slate-600'}`}>{item}</span>
                </label>
              ))}

              <div className="mt-8">
                {!allChecked && activeBatchId && (
                  <p className="text-[10px] text-red-500 font-bold uppercase text-center mb-2 animate-pulse">
                    Vui lòng check toàn bộ các mục để xác nhận an toàn
                  </p>
                )}
                <button
                  onClick={handleSaveChecklist}
                  disabled={!allChecked || !activeBatchId || isSaved}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 ${allChecked && activeBatchId ? (isSaved ? 'bg-green-500' : 'bg-[#ef4a2c]') : 'bg-slate-300 cursor-not-allowed'}`}
                >
                  {isSaved ? 'ĐÃ XÁC NHẬN AN TOÀN' : 'LƯU HOÀN THÀNH'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-slate-900 font-bold mb-4 flex items-center">
                <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-2">!</span>
                Nguyên tắc an toàn hóa chất
              </h3>
              {SAFETY_RULES.map((rule, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${rule.urgent ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                  <h4 className={`text-sm font-black mb-1 ${rule.urgent ? 'text-red-600' : 'text-slate-800'}`}>{rule.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{rule.content}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-slate-900 font-bold mb-4 flex items-center">
                <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mr-2">🆘</span>
                Xử lý sự cố khẩn cấp
              </h3>
              {EMERGENCY_RESPONSE.map((item, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-orange-200">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-200" />
                  <h4 className="text-sm font-bold text-slate-800 mb-1">{item.situation}</h4>
                  <p className="text-sm text-slate-600 bg-orange-50/50 p-3 rounded-xl border border-orange-100">{item.action}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <p className="text-[10px] text-slate-400 text-center font-bold tracking-widest uppercase">Hỗ trợ bởi Google Gemini</p>
        </div>
      </div>
    </div>
  );
};

export default MenuOverlay;
