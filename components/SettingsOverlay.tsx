
import React, { useState, useEffect, useRef } from 'react';
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
  const [swActive, setSwActive] = useState(!!navigator.serviceWorker.controller);
  const testAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    testAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3');
    testAudio.current.loop = true;
  }, []);

  useEffect(() => {
    if (isOpen) {
      const savedPref = localStorage.getItem(NOTIF_STORAGE_KEY) === 'true';
      const currentPermission = ("Notification" in window) ? Notification.permission : 'default';
      setPermissionStatus(currentPermission);
      setNotifEnabled(savedPref && currentPermission === 'granted');
      setSwActive(!!navigator.serviceWorker.controller);
    } else {
      if (testAudio.current) {
        testAudio.current.pause();
        testAudio.current.currentTime = 0;
      }
    }
  }, [isOpen]);

  const forceActivateSW = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          await reg.update();
          alert("Đang làm mới hệ thống...");
          window.location.reload();
        } else {
          await navigator.serviceWorker.register('/sw.js?v=10');
          alert("Đã đăng ký lại. Đang khởi động...");
          window.location.reload();
        }
      } catch (e) {
        alert("Lỗi kích hoạt: " + e);
      }
    }
  };

  const testNotification = async () => {
    if (!("Notification" in window)) {
      alert("Thiết bị không hỗ trợ thông báo.");
      return;
    }

    if (Notification.permission !== "granted") {
      alert("Vui lòng nhấn 'Bật thông báo' trước.");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const options = {
        body: "TEST CHUÔNG DÀI: Đang rung mạnh & hú còi...",
        icon: 'https://i.postimg.cc/kGy3M7x6/icon2.png',
        badge: 'https://i.postimg.cc/kGy3M7x6/icon2.png',
        vibrate: [1000, 500, 1000, 500, 1000, 500, 1000],
        tag: 'jicv-acid-critical',
        renotify: true,
        requireInteraction: true,
      };

      if (testAudio.current) {
        testAudio.current.play().catch(e => console.log("Audio block"));
      }

      await registration.showNotification("JICV AXIT: CHUÔNG BÁO THỬ", options as any);
      
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'TRIGGER_NOTIF', title: "JICV AXIT: CHUÔNG BÁO THỬ", options });
      }
    } catch (err) {
      alert("Lỗi Android: " + err);
    }
  };

  const toggleNotifications = async () => {
    if (!("Notification" in window)) {
      alert("Trình duyệt không hỗ trợ thông báo.");
      return;
    }

    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);

    if (permission === "granted") {
      setNotifEnabled(true);
      localStorage.setItem(NOTIF_STORAGE_KEY, 'true');
      alert("Đã cấp quyền! Đang thử gửi...");
      testNotification();
    } else {
      setNotifEnabled(false);
      localStorage.setItem(NOTIF_STORAGE_KEY, 'false');
      alert("Quyền bị chặn.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-800 text-white">
          <h2 className="text-xl font-black uppercase">{t.settings}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{t.language}</h3>
            <div className="flex space-x-4">
              <button onClick={() => setLang('vi')} className={`flex-1 flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${lang === 'vi' ? 'border-[#ef4a2c] bg-red-50' : 'border-slate-100 grayscale'}`}>
                <img src="https://flagcdn.com/w160/vn.png" alt="VN" className="w-12 h-8 rounded mb-2 shadow-sm" />
                <span className="text-[10px] font-black">TIẾNG VIỆT</span>
              </button>
              <button onClick={() => setLang('ja')} className={`flex-1 flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${lang === 'ja' ? 'border-[#ef4a2c] bg-red-50' : 'border-slate-100 grayscale'}`}>
                <img src="https://flagcdn.com/w160/jp.png" alt="JP" className="w-12 h-8 rounded mb-2 shadow-sm" />
                <span className="text-[10px] font-black">日本語</span>
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{t.enable_notif}</h3>
            
            <button 
              onClick={toggleNotifications}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${notifEnabled ? 'border-green-500 bg-green-50' : 'border-slate-100 bg-slate-50'}`}
            >
              <div className="flex items-center space-x-3 text-left">
                <div className={`p-2 rounded-lg ${notifEnabled ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
                <div>
                  <p className="text-xs font-black">{t.enable_notif}</p>
                  <p className="text-[10px] text-slate-500 font-bold">{notifEnabled ? "ĐÃ CẤP QUYỀN" : "CHƯA BẬT"}</p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${notifEnabled ? 'bg-green-500' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${notifEnabled ? 'left-6' : 'left-1'}`} />
              </div>
            </button>

            {notifEnabled && (
              <button 
                onClick={testNotification}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Gửi thông báo thử (Kèm còi hú)
              </button>
            )}

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 text-[9px]">
              <div className="flex justify-between font-bold">
                <span className="text-slate-400">QUYỀN: {permissionStatus.toUpperCase()}</span>
                <span className={swActive ? 'text-green-600' : 'text-red-500'}>{swActive ? 'ĐÃ KÍCH HOẠT SW' : 'CHƯA KÍCH HOẠT SW'}</span>
              </div>
              {!swActive && (
                <button onClick={forceActivateSW} className="w-full py-2 bg-[#ef4a2c] text-white font-black rounded uppercase">Kích hoạt ngay</button>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Mẹo Android</h3>
            <div className="bg-blue-50 p-4 rounded-xl text-[9px] text-blue-700 leading-relaxed font-bold">
              Để chuông hệ thống dài hơn nữa, hãy vào:<br/>
              <span className="text-black underline">Cài đặt máy -> Thông báo -> Chrome -> JICV Axit -> Kiểu âm thanh</span><br/>
              và chọn một bản nhạc dài thay vì tiếng "Ting" ngắn.
            </div>
            <button onClick={() => { if (confirm("Xóa lịch sử?")) { localStorage.clear(); window.location.reload(); } }} className="w-full p-4 bg-red-50 rounded-2xl text-red-600 flex items-center justify-center space-x-3">
              <span className="text-xs font-black uppercase">Xóa dữ liệu App</span>
            </button>
            <div className="text-center pt-4">
              <p className="text-[8px] text-slate-300 uppercase font-black">Build 1.4.0-SOUND-FIX</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsOverlay;
