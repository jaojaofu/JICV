
import React, { useMemo } from 'react';
import { CalculationResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  history: CalculationResult[];
}

const Dashboard: React.FC<DashboardProps> = ({ history }) => {
  const stats = useMemo(() => {
    const totalBatches = history.length;
    const totalVolume = history.reduce((acc, item) => acc + item.targetVolume, 0);
    const totalAcidUsed = history.reduce((acc, item) => acc + item.acidVolumeNeeded, 0);
    const avgVolume = totalBatches > 0 ? totalVolume / totalBatches : 0;

    return {
      totalBatches,
      totalVolume: totalVolume.toFixed(2),
      totalAcidUsed: totalAcidUsed.toFixed(2),
      avgVolume: avgVolume.toFixed(2),
    };
  }, [history]);

  // Dữ liệu biểu đồ 7 mẻ gần nhất
  const chartData = useMemo(() => {
    return history.slice(0, 7).reverse().map(item => ({
      name: item.batchName.substring(0, 10),
      volume: item.targetVolume
    }));
  }, [history]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Tổng số mẻ pha" 
          value={stats.totalBatches} 
          icon="M13 10V3L4 14h7v7l9-11h-7z"
          color="bg-indigo-500"
        />
        <StatCard 
          label="Tổng thành phẩm (L)" 
          value={stats.totalVolume} 
          icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          color="bg-emerald-500"
        />
        <StatCard 
          label="Axit đã tiêu thụ (L)" 
          value={stats.totalAcidUsed} 
          icon="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.336a4 4 0 01-2.573.344l-2.141-.428a2 2 0 00-1.302.13l-2.012 1.006A2 2 0 012 14.53V7a2 2 0 011.664-1.972l2.365-.43a2 2 0 011.332.186l2.14 1.07a4 4 0 002.536.423l2.257-.45a6 6 0 013.754.434l2.134 1.067A2 2 0 0121 9.141v6.287a2 2 0 01-1.572 1.962l-2.14.428a4 4 0 00-2.573.344l-.673.336a6 6 0 01-3.86.517l-2.387-.477a2 2 0 00-1.022-.547"
          color="bg-rose-500"
        />
        <StatCard 
          label="Trung bình mẻ (L)" 
          value={stats.avgVolume} 
          icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          color="bg-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h4 className="text-lg font-bold text-slate-800 mb-6">Sản lượng các mẻ gần nhất</h4>
          <div className="h-80">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#4f46e5" fillOpacity={0.8 - (index * 0.1)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic">Chưa đủ dữ liệu biểu đồ</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h4 className="text-lg font-bold text-slate-800 mb-6">Mẹo vận hành tối ưu</h4>
          <div className="space-y-4">
            <FeatureItem title="Tiết kiệm tài nguyên" desc="Phần lớn axit được tiêu thụ trong ca sáng, hãy cân nhắc nạp nguyên liệu định kỳ." />
            <FeatureItem title="An toàn thiết bị" desc="Đảm bảo bơm định lượng được vệ sinh sau mỗi 500L thành phẩm." />
            <FeatureItem title="Kiểm soát chất lượng" desc="Độ sai lệch nồng độ cho phép trong khoảng +/- 0.1%." />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{label: string, value: string | number, icon: string, color: string}> = ({label, value, icon, color}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
    <div className={`${color} p-4 rounded-xl shadow-inner`}>
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const FeatureItem: React.FC<{title: string, desc: string}> = ({title, desc}) => (
  <div className="flex space-x-3">
    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
    <div>
      <p className="text-sm font-bold text-slate-800">{title}</p>
      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
    </div>
  </div>
);

export default Dashboard;
