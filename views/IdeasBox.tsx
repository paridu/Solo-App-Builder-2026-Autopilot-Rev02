
import React, { useState } from 'react';
import { APP_IDEAS } from '../constants';

interface IdeasBoxProps {
  onSelectIdea: (ideaId: string) => void;
}

const IdeasBox: React.FC<IdeasBoxProps> = ({ onSelectIdea }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIdeas = APP_IDEAS.filter(idea => 
    idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (idea: typeof APP_IDEAS[0]) => {
    localStorage.setItem('selected_app_idea', idea.title);
    // ล้างข้อมูลเก่าเมื่อเลือกไอเดียใหม่
    localStorage.removeItem('solo_builder_outputs');
    onSelectIdea(idea.id);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <header className="mb-10 text-center">
        <h2 className="text-4xl font-black text-white mb-4">52 อัญมณีแอป Solo ปี 2026</h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-8">
          หนึ่งไอเดียสำหรับทุกสัปดาห์ของปี โซลูชันเฉพาะทางที่เป็นที่ต้องการสูง ออกแบบมาเพื่อโมเดลธุรกิจตัวคนเดียวโดยใช้พลังของ AI
        </p>

        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="ค้นหาไอเดีย, ตลาด หรือปัญหา..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
            🔍
          </div>
        </div>
      </header>

      {filteredIdeas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.map((idea) => (
            <div key={idea.id} className="group bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">{idea.icon}</div>
                <span className="text-[10px] font-mono text-slate-600 bg-slate-800 px-2 py-1 rounded">ID: {idea.id}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{idea.title}</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed flex-grow">
                <span className="text-slate-200 font-semibold italic">ปัญหา: </span> {idea.problem}
              </p>
              
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">กลุ่มเป้าหมาย</span>
                  <span className="text-blue-400 font-medium">{idea.target}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">รูปแบบรายได้</span>
                  <span className="bg-slate-800 px-2 py-1 rounded-md text-slate-200">{idea.monetization === 'Subscription' ? 'รายเดือน' : idea.monetization === 'One-time' ? 'จ่ายครั้งเดียว' : 'ตามการใช้งาน'}</span>
                </div>
              </div>

              <button 
                onClick={() => handleSelect(idea)}
                className="w-full mt-6 bg-slate-800 group-hover:bg-blue-600 text-white font-semibold py-3 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>เลือกและเริ่มสร้างอัตโนมัติ</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl">
          <p className="text-slate-500">ไม่พบไอเดียสำหรับ "{searchTerm}" ลองค้นหาจุดเจ็บปวดอื่นดูสิ</p>
        </div>
      )}
    </div>
  );
};

export default IdeasBox;
