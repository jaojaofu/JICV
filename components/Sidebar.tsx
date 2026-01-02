
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: 'calculator' | 'history' | 'dashboard') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'calculator', label: 'Máy Tính Pha', icon: 'M12 4v16m8-8H4' },
    { id: 'history', label: 'Lịch Sử Pha', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'dashboard', label: 'Thống Kê', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col space-y-8">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-indigo-500 p-2 rounded-lg shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.336a4 4 0 01-2.573.344l-2.141-.428a2 2 0 00-1.302.13l-2.012 1.006A2 2 0 012 14.53V7a2 2 0 011.664-1.972l2.365-.43a2 2 0 011.332.186l2.14 1.07a4 4 0 002.536.423l2.257-.45a6 6 0 013.754.434l2.134 1.067A2 2 0 0121 9.141v6.287a2 2 0 01-1.572 1.962l-2.14.428a4 4 0 00-2.573.344l-.673.336a6 6 0 01-3.86.517l-2.387-.477a2 2 0 00-1.022-.547" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight">H2SO4 Calc</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-indigo-600 shadow-lg text-white font-medium' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-800">
        <div className="bg-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Hỗ trợ kỹ thuật</p>
          <p className="text-sm text-slate-300">Nồng độ mặc định: 60% → 6%</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
