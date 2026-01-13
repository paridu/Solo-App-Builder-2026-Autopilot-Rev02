
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';

const kpiData = [
  { name: 'OEE', value: 82, color: '#3b82f6' },
  { name: 'Yield', value: 98, color: '#10b981' },
  { name: 'Availability', value: 85, color: '#f59e0b' },
  { name: 'Performance', value: 91, color: '#8b5cf6' },
];

const trendData = [
  { time: '08:00', value: 75 },
  { time: '10:00', value: 82 },
  { time: '12:00', value: 79 },
  { time: '14:00', value: 85 },
  { time: '16:00', value: 88 },
  { time: '18:00', value: 83 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8">
        <h2 className="text-3xl font-black text-white mb-2 italic">Smart Factory Command Center</h2>
        <p className="text-slate-400">ระบบมอนิเตอร์ KPI และการกำจัด 7 Waste ด้วยพลัง AI (ML/DL/RL)</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-5xl">📊</span>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Overall OEE</p>
          <p className="text-4xl font-black text-blue-400 mt-2">82.4%</p>
          <div className="mt-4 flex items-center text-[10px] text-emerald-400 font-bold">
            <span>↑ 2.1% From last shift</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-5xl">⚡</span>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Yield</p>
          <p className="text-4xl font-black text-emerald-400 mt-2">98.1%</p>
          <div className="mt-4 flex items-center text-[10px] text-slate-500">
            <span>Target: 99.5%</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-5xl">🛠️</span>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Machine Status</p>
          <p className="text-4xl font-black text-amber-400 mt-2">Active</p>
          <div className="mt-4 flex items-center text-[10px] text-slate-500">
            <span>12/14 Units Running</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-5xl">📉</span>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Scrap Rate</p>
          <p className="text-4xl font-black text-red-400 mt-2">1.9%</p>
          <div className="mt-4 flex items-center text-[10px] text-emerald-400 font-bold">
            <span>↓ 0.5% Improved by Vision AI</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">การวัดผล 5M1E และ 7 Waste</h3>
            <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">AI AUDIT ACTIVE</span>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Defects (ของเสีย)', waste: 'CNN Vision Guard', impact: 'ลด Defect ลง 40%' },
              { label: 'Waiting (คอขวด)', waste: 'RL Scheduler', impact: 'ลดเวลารอคอย 25%' },
              { label: 'Inventory (สต็อก)', waste: 'Predictive Forecast', impact: 'ลดสต็อกล้น 15%' },
              { label: 'Motion (เคลื่อนไหว)', waste: 'Pathfinding AI', impact: 'ลดการเดินซ้ำซ้อน 30%' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-800/20 border border-slate-800 rounded-2xl hover:bg-slate-800/40 transition-all">
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">{item.label}</span>
                  <p className="text-blue-400 font-bold text-sm">{item.waste}</p>
                </div>
                <div className="text-right text-emerald-400 font-black text-xs">
                  {item.impact}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <h3 className="text-xl font-bold text-white mb-6">OEE Performance Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px'}}
                  itemStyle={{color: '#3b82f6', fontWeight: 'bold'}}
                />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{fill: '#3b82f6', r: 4}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-around">
            {kpiData.map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{item.name}</p>
                <p className="text-lg font-black" style={{color: item.color}}>{item.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-600/10 border border-blue-500/20 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-blue-600/20 rounded-2xl">
              <span className="text-4xl">🚀</span>
          </div>
          <div className="flex-1">
              <h4 className="text-xl font-black text-white italic">The 1-Year Roadmap to Zero-Waste</h4>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                  เปลี่ยนโรงงานแบบเดิมให้เป็น Smart Factory ภายใน 12 เดือน ด้วยการติดตั้ง AI Agents 52 ตัวที่ทำงานสอดประสานกัน 
                  เริ่มจากวิเคราะห์ 5M1E พื้นฐาน ไปจนถึงการใช้ Reinforcement Learning ในการคุมกระบวนการผลิตทั้งระบบ
              </p>
          </div>
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-900/40 transition-all active:scale-95">
              เริ่มเฟส 1 ทันที
          </button>
      </div>
    </div>
  );
};

export default Dashboard;
