
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
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedPref = localStorage.getItem(NOTIF_STORAGE_KEY) === 'true';
      const currentPermission = ("Notification" in window) ? Notification.permission : 'default';
      setPermissionStatus(currentPermission);
      setNotifEnabled(savedPref && currentPermission === 'granted');
      
      // Kiểm tra xem có đang chạy ở chế độ PWA (Standalone) không - quan trọng cho iOS
      setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true);
    }
  }, [isOpen]);

  const testNotification = async () => {
    if (Notification.permission === "granted") {
      try {
        const registration = await navigator.serviceWorker.ready;
        const sw = registration.active || navigator.serviceWorker.controller;
        
        const options = {
          body: lang === 'vi' ? "Thông báo thử nghiệm thành công! Hệ thống JICV đã sẵn sàng." : "テスト通知成功！JICVシステムは準備完了です。",
          icon: 'https://i.postimg.cc/kGy3M7x6/icon2.png',
          badge: 'https://i.postimg.cc/kGy3M7x6/icon2.png',
          vibrate: [200, 100, 200],
          requireInteraction: true
        };

        if (sw) {
          sw.postMessage({
            type: 'TRIGGER_NOTIF',
            title: t.notif_title,
            options
          });
        } else {
          registration.showNotification(t.notif_title, options as any);
        }
      } catch (err) {
        console.error("Lỗi test notif:", err);
        alert(lang === 'vi' ? "Lỗi: Hãy load lại trang để Service Worker kích hoạt." : "エラー：ページをリロードしてください。");
      }
    } else {
      alert(lang === 'vi' ? "Bạn chưa cấp quyền thông báo!" : "通知権限が許可されていません！");
    }
  };

  const toggleNotifications = async () => {
    if (!("Notification" in window)) {
      alert(lang === 'vi' ? "Trình duyệt này không hỗ trợ thông báo." : "このブラウザは通知をサポートしていません。");
      return;
    }

    if (!notifEnabled) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);

      if (permission === "granted") {
        setNotifEnabled(true);
        localStorage.setItem(NOTIF_STORAGE_KEY, 'true');
        setTimeout(testNotification, 500);
      } else if (permission === "denied") {
        alert(lang === 'vi' 
          ? "Thông báo bị CHẶN. Vui lòng vào Cài đặt -> Quyền trang web để mở lại." 
          : "通知がブロックされています。設定から許可してください。");
        setNotifEnabled(false);
        localStorage.setItem(NOTIF_STORAGE_KEY, 'false');
      }
    } else {
      setNotifEnabled(false);
      localStorage.setItem(NOTIF_STORAGE_KEY, 'false');
    }
  };

  if (!isOpen) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

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
          <section>
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{t.language}</h3>
            <div className="flex space-x-4">
              <button onClick={() => setLang('vi')} className={`flex-1 flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${lang === 'vi' ? 'border-[#ef4a2c] bg-red-50' : 'border-slate-100 grayscale hover:grayscale-0'}`}>
                <img src="https://flagcdn.com/w160/vn.png" alt="VN" className="w-12 h-8 object-cover rounded shadow-sm mb-2" />
                <span className={`text-xs font-bold ${lang === 'vi' ? 'text-[#ef4a2c]' : 'text-slate-500'}`}>TIẾNG VIỆT</span>
              </button>
              <button onClick={() => setLang('ja')} className={`flex-1 flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${lang === 'ja' ? 'border-[#ef4a2c] bg-red-50' : 'border-slate-100 grayscale hover:grayscale-0'}`}>
                <img src="https://flagcdn.com/w160/jp.png" alt="JP" className="w-12 h-8 object-cover rounded shadow-sm mb-2" />
                <span className={`text-xs font-bold ${lang === 'ja' ? 'text-[#ef4a2c]' : 'text-slate-500'}`}>日本語</span>
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{t.enable_notif}</h3>
            
            {isIOS && !isStandalone && (
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 mb-4">
                <p className="text-[10px] text-orange-700 font-bold uppercase leading-tight">
                  {lang === 'vi' 
                    ? "Lưu ý cho iPhone: Bạn PHẢI dùng tính năng 'Thêm vào màn hình chính' mới nhận được thông báo." 
                    : "iPhoneの注意：『ホーム画面に追加』を使用しないと通知を受け取れません。"}
                </p>
              </div>
            )}

            <button 
              onClick={toggleNotifications}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${notifEnabled ? 'border-green-500 bg-green-50' : 'border-slate-100 bg-slate-50'}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${notifEnabled ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className={`text-sm font-bold ${notifEnabled ? 'text-green-800' : 'text-slate-700'}`}>{t.enable_notif}</p>
                  <p className="text-[10px] text-slate-500">{notifEnabled ? t.notif_on : t.notif_off}</p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${notifEnabled ? 'bg-green-500' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${notifEnabled ? 'left-6' : 'left-1'}`} />
              </div>
            </button>

            {notifEnabled && (
              <button 
                onClick={testNotification}
                className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all"
              >
                {lang === 'vi' ? "Thử thông báo ngay" : "通知をテストする"}
              </button>
            )}
            
            {permissionStatus === 'denied' && (
              <p className="text-[9px] text-red-500 italic leading-tight">* Cảnh báo: Quyền thông báo đang bị chặn trong cài đặt máy.</p>
            )}
          </section>

          <section className="space-y-4">
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Hệ thống</h3>
            <button onClick={() => { if (window.confirm(t.confirm_clear)) { localStorage.removeItem(APP_STORAGE_KEY); window.location.reload(); } }} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="text-sm font-bold">{t.clear_all}</span>
              </div>
            </button>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-[10px] text-blue-700 font-bold uppercase mb-1">Phiên bản</p>
              <p className="text-xs text-blue-900 font-medium italic">Build 1.3.3-PWA-MODE</p>
            </div>
          </section>

          <section className="pt-8 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-300 uppercase tracking-widest">Designed for JICV Operations</p>
            <p className="text-[10px] text-slate-300">© 2026 JICV-QC Department</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsOverlay;
