
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, APP_STORAGE_KEY, NOTIF_STORAGE_KEY } from '../constants';

interface SettingsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const SettingsOverlay: React.FC<SettingsOverlayProps> = ({ isOpen, onClose, lang, setLang }) => {
  const t = TRANSLATIONS[lang];
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  // Khởi tạo trạng thái dựa trên localStorage và quyền trình duyệt thực tế
  useEffect(() => {
    if (isOpen) {
      const savedPref = localStorage.getItem(NOTIF_STORAGE_KEY) === 'true';
      const currentPermission = ("Notification" in window) ? Notification.permission : 'default';
      
      setPermissionStatus(currentPermission);
      // Chỉ bật toggle nếu cả 2 điều kiện: user muốn bật VÀ trình duyệt cho phép
      setNotifEnabled(savedPref && currentPermission === 'granted');
    }
  }, [isOpen]);

  const toggleNotifications = async () => {
    if (!("Notification" in window)) {
      alert(lang === 'vi' ? "Trình duyệt này không hỗ trợ thông báo hệ thống." : "このブラウザは通知をサポートしていません。");
      return;
    }

    if (!notifEnabled) {
      // Trường hợp muốn BẬT
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);

      if (permission === "granted") {
        setNotifEnabled(true);
        localStorage.setItem(NOTIF_STORAGE_KEY, 'true');
        // Test thông báo ngay để user biết đã thành công
        new Notification(t.notif_title, {
          body: lang === 'vi' ? "Thông báo hệ thống đã được kích hoạt!" : "通知が有効になりました！",
          icon: 'https://i.postimg.cc/9Q88BDWv/icon.png'
        });
      } else if (permission === "denied") {
        alert(lang === 'vi' 
          ? "Thông báo đang bị CHẶN trong cài đặt trình duyệt. Vui lòng vào Cài đặt -> Quyền trang web -> Thông báo -> Chọn 'Cho phép' để sử dụng tính năng này." 
          : "通知がブロックされています。ブラウザの設定から通知を許可してください。");
        setNotifEnabled(false);
        localStorage.setItem(NOTIF_STORAGE_KEY, 'false');
      }
    } else {
      // Trường hợp muốn TẮT
      setNotifEnabled(false);
      localStorage.setItem(NOTIF_STORAGE_KEY, 'false');
    }
  };

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

          {/* System Notifications Toggle */}
          <section>
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{t.enable_notif}</h3>
            <button 
              onClick={toggleNotifications}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${notifEnabled ? 'border-green-500 bg-green-50' : 'border-slate-100 bg-slate-50'} ${permissionStatus === 'denied' && !notifEnabled ? 'opacity-70' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${notifEnabled ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className={`text-sm font-bold ${notifEnabled ? 'text-green-800' : 'text-slate-700'}`}>
                    {t.enable_notif}
                    {permissionStatus === 'denied' && <span className="ml-2 text-[8px] text-red-500 font-black uppercase tracking-tighter">(BỊ CHẶN)</span>}
                  </p>
                  <p className="text-[10px] text-slate-500">{notifEnabled ? t.notif_on : t.notif_off}</p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${notifEnabled ? 'bg-green-500' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${notifEnabled ? 'left-6' : 'left-1'}`} />
              </div>
            </button>
            {permissionStatus === 'denied' && (
              <p className="mt-2 text-[9px] text-red-500 italic leading-tight">
                * {lang === 'vi' ? 'Quyền thông báo đang bị chặn. Hãy mở cài đặt trình duyệt để cho phép.' : '通知がブロックされています。設定から許可してください。'}
              </p>
            )}
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
              <p className="text-xs text-blue-900 font-medium italic">Build 1.3.1-STABLE</p>
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
