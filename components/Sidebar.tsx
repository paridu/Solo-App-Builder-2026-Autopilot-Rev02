
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const navItems: { id: View; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'แดชบอร์ดแนวคิด', icon: '🎯' },
    { id: 'ideas', label: '52 ไอเดียแอป 2026', icon: '💡' },
    { id: 'gantt', label: 'ตารางงาน 52 สัปดาห์', icon: '📅' },
    { id: 'checklist', label: 'เครื่องมือสร้างอัตโนมัติ', icon: '⚡' },
    { id: 'schema', label: 'โครงสร้างโปรเจกต์', icon: '📂' },
    { id: 'autopilot', label: 'สถาปนิกวางแผน', icon: '🧠' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900 p-6">
      <div className="mb-10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          SoloBuilder v2.6
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">ระบบ Autopilot</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeView === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-800 mt-auto">
        <div className="bg-slate-800/50 rounded-xl p-4 text-xs">
          <p className="text-slate-400 mb-2 italic">"อย่าสร้างแค่ฟีเจอร์ ให้สร้างสินทรัพย์ธุรกิจ"</p>
          <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-3/4"></div>
          </div>
          <p className="mt-2 text-[10px] uppercase text-slate-500">ระบบพร้อมทำงาน</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
