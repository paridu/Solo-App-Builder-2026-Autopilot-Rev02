
import React, { useState } from 'react';
import { brainstormIdea } from '../services/gemini';

const AutopilotWizard: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleBrainstorm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);
    setSaved(false);

    try {
      const data = await brainstormIdea(input);
      if (data) {
        setResult(data);
      } else {
        setError('สถาปนิก AI ไม่สามารถสรุปไอเดียนี้ได้ ลองระบุรายละเอียดให้ชัดเจนขึ้น');
      }
    } catch (err) {
      setError('ขาดการเชื่อมต่อกับ Solo Architect โปรดลองอีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToWorkspace = () => {
    if (!result) return;
    localStorage.setItem('selected_app_idea', result.refinedName);
    localStorage.removeItem('solo_builder_outputs'); // Clear previous work for new idea
    setSaved(true);
    // You could also store the full specs if needed for later review
    localStorage.setItem('last_refined_specs', JSON.stringify(result));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-20">
      <header className="mb-10 text-center">
        <h2 className="text-4xl font-black text-white mb-4">สถาปนิกวางแผนไอเดีย (Autopilot)</h2>
        <p className="text-slate-400">
          เปลี่ยนความคิดดิบๆ ของคุณให้กลายเป็นสเปกธุรกิจระดับมือโปร 
          ใส่ไอเดียของคุณ แล้ว AI จะใช้เฟรมเวิร์ก Solo Builder ปี 2026 จัดการให้
        </p>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-blue-900/10 mb-8">
        <form onSubmit={handleBrainstorm} className="space-y-4">
          <label className="block text-sm font-medium text-slate-400 uppercase tracking-widest">แนวคิดแอปของคุณ</label>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="เช่น ส่วนขยาย Chrome ที่ช่วยบล็อกเกอร์เขียนโพสต์เก่าใหม่ด้วย AI เพื่อให้ติดอันดับ Google ดีขึ้น..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px] resize-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`absolute bottom-4 right-4 px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                loading || !input.trim() 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/40'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>กำลังวิเคราะห์...</span>
                </>
              ) : (
                <>
                  <span>วางแผนไอเดีย</span>
                  <span>⚡</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-red-400 text-sm text-center mb-8">
          {error}
        </div>
      )}

      {loading && !result && (
        <div className="space-y-6 animate-pulse">
          <div className="h-40 bg-slate-900 rounded-3xl"></div>
          <div className="h-64 bg-slate-900 rounded-3xl"></div>
        </div>
      )}

      {result && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-700 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-xs uppercase tracking-widest font-black text-blue-200 mb-2">เฟส 1: การปรับแต่งตัวตนแอป</h3>
              <h4 className="text-3xl font-black text-white mb-4">{result.refinedName}</h4>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 inline-block">
                <p className="text-white font-mono text-lg">{result.formula}</p>
              </div>
            </div>
            <button
              onClick={handleSaveToWorkspace}
              disabled={saved}
              className={`px-8 py-4 rounded-2xl font-black transition-all shadow-xl ${
                saved 
                ? 'bg-emerald-500 text-white cursor-default' 
                : 'bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 active:scale-95'
              }`}
            >
              {saved ? '✅ บันทึกลงเวิร์กสเปซแล้ว' : '💾 ใช้ไอเดียนี้สร้างแอป'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
              <h3 className="text-emerald-400 font-bold mb-4 flex items-center">
                <span className="mr-2 text-xl">💎</span> วิเคราะห์โมเดล SLC
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                {result.slcBreakdown}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
              <h3 className="text-amber-400 font-bold mb-4 flex items-center">
                <span className="mr-2 text-xl">⚖️</span> คำตัดสินของตลาด
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                {result.marketVerdict}
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <h3 className="text-white font-bold mb-6 flex items-center text-xl">
              <span className="mr-3 p-2 bg-blue-500/10 rounded-lg text-blue-400">📅</span> 
              แผนสร้าง MVP เร่งด่วน
            </h3>
            <div className="space-y-4">
              {result.threeDayMvpPlan.map((step: string, i: number) => (
                <div key={i} className="flex items-start space-x-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-800">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                    {i + 1}
                  </span>
                  <p className="text-slate-300 text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-8">
            <button 
              onClick={() => window.print()} 
              className="text-slate-500 hover:text-white transition-colors text-sm underline underline-offset-4"
            >
              ส่งออกสเปกเป็นไฟล์ PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutopilotWizard;
