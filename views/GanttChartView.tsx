
import React, { useState, useEffect } from 'react';
import { APP_IDEAS } from '../constants';
import { PDCAStatus } from '../types';

const GanttChartView: React.FC = () => {
  const [projectStatuses, setProjectStatuses] = useState<Record<string, PDCAStatus>>(() => {
    const saved = localStorage.getItem('solo_gantt_statuses');
    return saved ? JSON.parse(saved) : {};
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('solo_gantt_statuses', JSON.stringify(projectStatuses));
  }, [projectStatuses]);

  const updateStatus = (id: string, status: PDCAStatus) => {
    setProjectStatuses(prev => ({ ...prev, [id]: status }));
  };

  const getStatusColor = (status: PDCAStatus) => {
    switch (status) {
      case 'P': return 'bg-blue-600 text-white';
      case 'D': return 'bg-amber-500 text-white';
      case 'C': return 'bg-purple-600 text-white';
      case 'A': return 'bg-emerald-600 text-white';
      default: return 'bg-slate-800 text-slate-500';
    }
  };

  const getStatusLabel = (status: PDCAStatus) => {
    switch (status) {
      case 'P': return 'Plan (วางแผน)';
      case 'D': return 'Do (เริ่มทำ)';
      case 'C': return 'Check (ตรวจสอบ)';
      case 'A': return 'Act (ปรับปรุง)';
      default: return 'รอคิวสร้าง';
    }
  };

  const filteredIdeas = APP_IDEAS.filter(idea => 
    idea.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedCount = Object.values(projectStatuses).filter(s => s === 'A').length;
  const inProgressCount = Object.values(projectStatuses).filter(s => s !== 'None' && s !== 'A').length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-white mb-2 italic">Solo Roadmap 2026</h2>
            <p className="text-slate-400">แผนปฏิบัติการ 52 สัปดาห์ 52 โปรเจกต์ (PDCA Tracking)</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">สำเร็จ (Act)</p>
              <p className="text-2xl font-black text-emerald-400">{completedCount}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">กำลังดำเนินงาน</p>
              <p className="text-2xl font-black text-blue-400">{inProgressCount}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="ค้นหาโปรเจกต์ในตาราง..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-4 px-4 overflow-x-auto bg-slate-900 border border-slate-800 rounded-xl py-2">
            <div className="flex items-center gap-2 flex-shrink-0">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <span className="text-[10px] text-slate-400">P = Plan</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-[10px] text-slate-400">D = Do</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                <span className="text-[10px] text-slate-400">C = Check</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                <span className="text-[10px] text-slate-400">A = Act</span>
            </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-24">สัปดาห์</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">ชื่อโปรเจกต์</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">สถานะ PDCA</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-48 text-center">ความก้าวหน้า</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredIdeas.map((idea, index) => {
                const status = projectStatuses[idea.id] || 'None';
                const progressWidth = status === 'P' ? '25%' : status === 'D' ? '50%' : status === 'C' ? '75%' : status === 'A' ? '100%' : '5%';
                
                return (
                  <tr key={idea.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-blue-400 font-bold">W{index + 1}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{idea.icon}</span>
                        <div>
                          <p className="text-white font-bold text-sm leading-tight">{idea.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{idea.target}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {['P', 'D', 'C', 'A'].map((p) => (
                          <button
                            key={p}
                            onClick={() => updateStatus(idea.id, p as PDCAStatus)}
                            className={`w-8 h-8 rounded-lg text-xs font-black transition-all border ${
                              status === p 
                              ? getStatusColor(p as PDCAStatus) + ' border-transparent scale-110 shadow-lg' 
                              : 'bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-600'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                        {status !== 'None' && (
                            <button 
                                onClick={() => updateStatus(idea.id, 'None')}
                                className="w-8 h-8 rounded-lg text-[10px] bg-slate-950 text-slate-700 border border-slate-800 hover:text-red-400 hover:border-red-400"
                            >
                                ล้าง
                            </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mb-1.5">
                          <div 
                            className={`h-full transition-all duration-500 ${status === 'A' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-blue-500'}`}
                            style={{ width: progressWidth }}
                          ></div>
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-tighter ${status === 'A' ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {getStatusLabel(status)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-600/5 border border-blue-500/20 p-6 rounded-3xl">
              <h4 className="text-blue-400 font-bold mb-3 flex items-center">
                  <span className="mr-2">💡</span> คำแนะนำ Solo Developer
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                  อย่าพยายามสร้างทุกอย่างให้เสร็จในอาทิตย์เดียว ให้ใช้โมเดล <strong>1 Week 1 MVP</strong> โฟกัสไปที่กระบวนการ 
                  <strong> PDCA</strong> (Plan-Do-Check-Act) เพื่อวัดผลตลาดและปรับปรุงทันที ถ้าไอเดียไหนไม่เวิร์ก ให้รีบ Pivot หรือเริ่มสัปดาห์ถัดไป
              </p>
          </div>
          <div className="bg-emerald-600/5 border border-emerald-500/20 p-6 rounded-3xl">
              <h4 className="text-emerald-400 font-bold mb-3 flex items-center">
                  <span className="mr-2">🚀</span> เคล็ดลับความสม่ำเสมอ
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                  การมี 52 โปรเจกต์ใน 1 ปีหมายถึงคุณจะมี <strong>"สลากกินแบ่งธุรกิจ"</strong> 52 ใบ ถ้าคุณทำสำเร็จเพียง 1-2 แอป 
                  มันก็อาจจะเปลี่ยนชีวิตคุณได้ตลอดกาล รักษาความเร็ว (Velocity) ให้คงที่ และเน้นที่การปล่อยตัว (Shipping)
              </p>
          </div>
      </div>
    </div>
  );
};

export default GanttChartView;
