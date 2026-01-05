
import React from 'react';
import { CalculationResult, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HistoryProps {
  history: CalculationResult[];
  onDelete: (id: string) => void;
  onClear: () => void;
  lang: Language;
}

const History: React.FC<HistoryProps> = ({ history, onDelete, onClear, lang }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase">{t.history}</h3>
        {history.length > 0 && (
          <button onClick={onClear} className="text-[10px] text-red-500 font-bold hover:underline">{t.clear_all}</button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-10 bg-white/50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs">
          {t.no_data}
        </div>
      ) : (
        history.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 transition-all hover:shadow-md relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.checklistCompleted ? 'bg-green-500' : 'bg-red-500'}`} />
            
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="text-[9px] text-slate-400 mb-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(item.timestamp).toLocaleString(lang === 'vi' ? 'vi-VN' : 'ja-JP')}
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-xs font-bold text-slate-700">
                    {item.batchName} ({Math.round(item.targetVolume)} kg)
                  </div>
                  {item.checklistCompleted ? (
                    <span className="bg-green-100 text-green-700 text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase border border-green-200">{t.checked}</span>
                  ) : (
                    <span className="bg-red-100 text-red-700 text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase border border-red-200 animate-pulse">{t.not_checked}</span>
                  )}
                </div>

                <div className="text-[9px] text-slate-500 mt-1 font-medium">
                  <span className="text-[#ef4a2c]">Axit: {Math.round(item.acidVolumeNeeded)} kg</span>
                  <span className="mx-2">|</span>
                  <span className="text-[#00a651]">Nước: {Math.round(item.waterVolumeNeeded)} kg</span>
                </div>
                
                {item.checklistCompletedAt && (
                  <div className="text-[8px] text-slate-400 mt-1 italic">
                    {t.checklist_done_at}: {new Date(item.checklistCompletedAt).toLocaleTimeString(lang === 'vi' ? 'vi-VN' : 'ja-JP')}
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => onDelete(item.id)}
                className="ml-4 p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default History;
