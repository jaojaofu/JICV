
import React from 'react';

interface HeaderProps {
  activeTab: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const titles: Record<string, string> = {
    calculator: 'Tính Toán Pha Loãng Axit',
    history: 'Lịch Sử Hoạt Động',
    dashboard: 'Tổng Quan & Thống Kê',
  };

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{titles[activeTab]}</h2>
          <p className="text-slate-500 text-sm mt-1">Hệ thống quản lý pha chế hóa chất công nghiệp</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-slate-700">Người vận hành</span>
            <span className="text-xs text-green-600 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Đang hoạt động
            </span>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
