
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

  useEffect(() => {
    if (isOpen) {
      const savedPref = localStorage.getItem(NOTIF_STORAGE_KEY) === 'true';
      const currentPermission = ("Notification" in window) ? Notification.permission : 'default';
      setPermissionStatus(currentPermission);
      setNotifEnabled(savedPref && currentPermission === 'granted');
    }
  }, [isOpen]);

  const testNotification = async () => {
    if (!("Notification" in window)) {
      alert("Thiết bị không hỗ trợ thông báo.");
      return;
    }

    if (Notification.permission !== "granted") {
      alert("Quyền hiện tại: " + Notification.permission + ". Vui lòng Bật thông báo ở mục trên.");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const options = {
        body: lang === 'vi' ? "Nếu bạn thấy dòng này, hệ thống đã hoạt động!" : "この通知が見えれば、システムは正常です。",
        icon: 'https://i.postimg.cc/kGy3M7x6/icon2.png',
        badge: 'https://i.postimg.cc/kGy3M7x6/icon2.png',
        vibrate: [500, 110, 500, 110, 450, 110, 200],
        tag: 'test-direct-' + Date.now(),
        requireInteraction: true,
        data: { url: window.location.origin }
      };

      // Cách 1: Thử gọi trực tiếp từ main thread (Nhanh nhất)
      await registration.showNotification("TEST: JICV AXIT 6%", options as any);
      
      // Cách 2: Gửi tin nhắn vào SW (Dành cho chạy ngầm)
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'TRIGGER_NOTIF',
          title: "TEST SW: JICV AXIT 6%",
          options
        });
      }

      console.log("Notification test triggered");
    } catch (err) {
      alert("Lỗi Android: " + err);
    }
  };

  const toggleNotifications = async () => {
    if (!("Notification" in window)) {
      alert("Trình duyệt không hỗ trợ thông báo.");
      return;
    }

    // Yêu cầu quyền trực tiếp
    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);

    if (permission === "granted") {
      setNotifEnabled(true);
      localStorage.setItem(NOTIF_STORAGE_KEY, 'true');
      alert("Đã cấp quyền thành công. Đang gửi thử...");
      testNotification();
    } else {
      setNotifEnabled(false);
      localStorage.setItem(NOTIF_STORAGE_KEY, 'false');
      alert("Thông báo đang bị: " + permission + ". Hãy kiểm tra Cài đặt máy.");
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
          {/* LỰA CHỌN NGÔN NGỮ */}
          <section>
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{t.language}</h3>
            <div className="flex space-x-4">
              <button onClick={() => setLang('vi')} className={`flex-1 flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${lang === 'vi' ? 'border-[#ef4a2c] bg-red-50' : 'border-slate-100 grayscale'}`}>
                <img src="https://flagcdn.com/w160/vn.png" alt="VN" className="w-12 h-8 rounded mb-2" />
                <span className="text-[10px] font-black">TIẾNG VIỆT</span>
              </button>
              <button onClick={() => setLang('ja')} className={`flex-1 flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${lang === 'ja' ? 'border-[#ef4a2c] bg-red-50' : 'border-slate-100 grayscale'}`}>
                <img src="https://flagcdn.com/w160/jp.png" alt="JP" className="w-12 h-8 rounded mb-2" />
                <span className="text-[10px] font-black">日本語</span>
              </button>
            </div>
          </section>

          {/* CÀI ĐẶT THÔNG BÁO */}
          <section className="space-y-4">
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{t.enable_notif}</h3>
            <button 
              onClick={toggleNotifications}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 ${notifEnabled ? 'border-green-500 bg-green-50' : 'border-slate-100 bg-slate-50'}`}
            >
              <div className="flex items-center space-x-3 text-left">
                <div className={`p-2 rounded-lg ${notifEnabled ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-black">{t.enable_notif}</p>
                  <p className="text-[10px] text-slate-500">{notifEnabled ? "ĐÃ BẬT" : "ĐANG TẮT"}</p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full relative ${notifEnabled ? 'bg-green-500' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${notifEnabled ? 'left-6' : 'left-1'}`} />
              </div>
            </button>

            {notifEnabled && (
              <button 
                onClick={testNotification}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95"
              >
                Gửi thông báo thử nghiệm
              </button>
            )}

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[9px] text-slate-500 font-bold uppercase mb-2">Trạng thái kỹ thuật:</p>
              <ul className="text-[9px] text-slate-400 space-y-1">
                <li>• Quyền hệ thống: {permissionStatus}</li>
                <li>• Service Worker: {'serviceWorker' in navigator ? 'Hỗ trợ' : 'Không hỗ trợ'}</li>
                <li>• Trạng thái SW: {navigator.serviceWorker.controller ? 'Đang điều khiển' : 'Chưa kích hoạt'}</li>
              </ul>
            </div>
          </section>

          {/* HỆ THỐNG */}
          <section className="space-y-4">
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Hệ thống</h3>
            <button onClick={() => { if (confirm("Xóa toàn bộ dữ liệu?")) { localStorage.clear(); window.location.reload(); } }} className="w-full p-4 bg-red-50 rounded-2xl text-red-600 flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              <span className="text-xs font-black">XÓA TẤT CẢ DỮ LIỆU</span>
            </button>
            <div className="text-center">
              <p className="text-[8px] text-slate-300 uppercase font-bold">JICV-QC Department • Build 1.3.8-FIX</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsOverlay;
