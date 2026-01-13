
import React, { useState, useEffect, useRef } from 'react';
import { CHECKLIST_STEPS } from '../constants';
import { executeAutopilotTask, generateSpeech } from '../services/gemini';
import AIVisualizer from './AIVisualizer';
import JSZip from 'jszip';

// Helper to decode base64 pcm to audio buffer
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const ChecklistView: React.FC = () => {
  const [selectedIdea, setSelectedIdea] = useState<string>(() => {
    return localStorage.getItem('selected_app_idea') || 'Solo App Builder';
  });
  
  const [taskOutputs, setTaskOutputs] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('solo_builder_outputs');
    return saved ? JSON.parse(saved) : {};
  });

  const [runningTasks, setRunningTasks] = useState<Record<string, boolean>>({});
  const [isBuildingAll, setIsBuildingAll] = useState(false);
  const [viewingOutput, setViewingOutput] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [narrativeText, setNarrativeText] = useState<string>("");

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    localStorage.setItem('solo_builder_outputs', JSON.stringify(taskOutputs));
  }, [taskOutputs]);

  const speakNarration = async (task: string) => {
    try {
      setIsSpeaking(true);
      setNarrativeText("กำลังวิเคราะห์ความคืบหน้าของ Agent...");
      
      const speechData = await generateSpeech(task);
      if (!speechData || !speechData.audio) {
        setIsSpeaking(false);
        return;
      }

      setNarrativeText(speechData.text || "กำลังรายงานสถานะ...");

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      const audioBuffer = await decodeAudioData(
        decode(speechData.audio),
        ctx,
        24000,
        1
      );

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => {
        setIsSpeaking(false);
        setTimeout(() => setNarrativeText(""), 3000);
      };
      source.start();
    } catch (err) {
      console.error("Audio playback failed", err);
      setIsSpeaking(false);
      setNarrativeText("");
    }
  };

  const handleRunTask = async (day: number, task: string, idx: number, silent = false) => {
    const key = `${day}-${idx}`;
    setRunningTasks(prev => ({ ...prev, [key]: true }));

    window.dispatchEvent(new CustomEvent('ai-task-activity', { 
      detail: { task, phase: day, status: 'running', key } 
    }));

    if (!silent) {
      speakNarration(task);
    }

    try {
      const output = await executeAutopilotTask(selectedIdea, task, `Phase ${day}`);
      setTaskOutputs(prev => ({ ...prev, [key]: output }));
      
      window.dispatchEvent(new CustomEvent('ai-task-activity', { 
        detail: { task, phase: day, status: 'completed', key } 
      }));

      return output;
    } catch (err) {
      console.error("Task execution failed", err);
      window.dispatchEvent(new CustomEvent('ai-task-activity', { 
        detail: { task, phase: day, status: 'error', key } 
      }));
      return null;
    } finally {
      setRunningTasks(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleBuildAll = async () => {
    setIsBuildingAll(true);
    for (const step of CHECKLIST_STEPS) {
      for (let i = 0; i < step.tasks.length; i++) {
        const key = `${step.day}-${i}`;
        if (!taskOutputs[key]) {
          await handleRunTask(step.day, step.tasks[i], i);
        }
      }
    }
    setIsBuildingAll(false);
  };

  const handleGitHubDeploy = async () => {
    setIsDeploying(true);
    const message = "กำลังเตรียมแพ็กเกจข้อมูลและเชื่อมต่อกับ GitHub Repository เพื่อทำการส่งมอบโปรเจกต์อุตสาหกรรมของคุณขึ้นสู่คลาวด์...";
    setNarrativeText(message);
    
    // Start special deployment narration
    try {
        const speechData = await generateSpeech("การเตรียมการส่งออกโปรเจกต์ไปยัง GitHub และการ Deploy ระบบ Cloud");
        if (speechData && speechData.audio) {
            const ctx = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const audioBuffer = await decodeAudioData(decode(speechData.audio), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.start();
        }
    } catch(e) {}

    // Simulate deployment delay
    await new Promise(r => setTimeout(r, 4000));
    setIsDeploying(false);
    alert("🚀 จำลองการ Deploy สำเร็จ! ไฟล์ทั้งหมดถูกเตรียมพร้อมสำหรับ GitHub แล้ว คุณสามารถดาวน์โหลด Project Bundle ไปอัปโหลดต่อได้ทันที");
    setNarrativeText("ภารกิจเสร็จสิ้น โปรเจกต์ของคุณพร้อมสำหรับการเป็นสินทรัพย์ธุรกิจที่ทรงพลังแล้ว");
  };

  const getCleanContent = (key: string) => {
    const raw = taskOutputs[key];
    if (!raw) return "";
    return raw.split('---CONTENT---')[1] || raw;
  };

  const getFilePath = (key: string) => {
    const raw = taskOutputs[key];
    const match = raw?.match(/FILE_PATH:\s*([^\n\r]+)/);
    return match ? match[1].trim() : null;
  };

  const handleDownloadZip = async () => {
    if (Object.keys(taskOutputs).length === 0) return;
    setIsZipping(true);
    const zip = new JSZip();
    const folderName = selectedIdea.replace(/\s+/g, '-').toLowerCase();
    const projectFolder = zip.folder(folderName);
    if (!projectFolder) return;

    Object.keys(taskOutputs).forEach(key => {
      let path = getFilePath(key);
      const content = getCleanContent(key);
      if (!path) path = `generated-output-${key}.txt`;
      projectFolder.file(path, content);
    });

    try {
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${folderName}-project-bundle.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to generate zip", err);
    } finally {
      setIsZipping(false);
    }
  };

  const totalTasks = CHECKLIST_STEPS.reduce((acc, step) => acc + step.tasks.length, 0);
  const completedCount = Object.keys(taskOutputs).length;
  const progress = Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-blue-600/20 text-blue-400 text-[10px] px-3 py-1 rounded-full border border-blue-500/30 font-black uppercase tracking-widest animate-pulse">
                System Autopilot Mode
              </span>
              <h2 className="text-3xl font-black text-white italic tracking-tight">Project Execution Timeline</h2>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-slate-400 text-sm">Target Asset: <span className="text-blue-400 font-bold underline decoration-blue-500/30">{selectedIdea}</span></p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
             <button 
              onClick={handleBuildAll}
              disabled={isBuildingAll || progress === 100}
              className={`px-6 py-2.5 rounded-2xl font-black transition-all flex items-center space-x-2 shadow-xl ${
                isBuildingAll 
                ? 'bg-slate-800 text-slate-500 cursor-wait' 
                : progress === 100 
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 hover:-translate-y-0.5'
              }`}
            >
              <span>{isBuildingAll ? '🚀 Executing Build...' : progress === 100 ? '✅ Build Complete' : '⚡ Start Autopilot Build'}</span>
            </button>
             <button 
              onClick={handleDownloadZip}
              disabled={completedCount === 0 || isZipping}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-700 rounded-2xl font-black transition-all flex items-center space-x-2 border border-slate-700"
            >
              <span>{isZipping ? '📦 Packing...' : '📦 Export ZIP'}</span>
            </button>
            <button 
              onClick={handleGitHubDeploy}
              disabled={completedCount === 0 || isDeploying}
              className="px-6 py-2.5 bg-[#24292e] hover:bg-[#2c3137] text-white rounded-2xl font-black transition-all flex items-center space-x-2 shadow-lg shadow-black/20 hover:-translate-y-0.5"
            >
              <span className="text-lg">🐙</span>
              <span>{isDeploying ? 'Deploying...' : 'Deploy to GitHub'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* INTEGRATED VISUALIZER CENTER */}
      <div className="mb-12 rounded-[40px] overflow-hidden border border-slate-800 shadow-2xl relative bg-slate-900/50 backdrop-blur-sm">
        <AIVisualizer />
        
        {/* STORYTELLING OVERLAY */}
        {narrativeText && (
          <div className="absolute inset-x-0 bottom-8 flex justify-center px-6 pointer-events-none z-20">
             <div className="bg-slate-950/90 backdrop-blur-2xl border border-blue-500/30 p-6 rounded-[32px] shadow-2xl max-w-3xl flex items-start gap-5 animate-in fade-in slide-in-from-bottom-8 duration-500 ring-1 ring-blue-500/20">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-all ${isSpeaking || isDeploying ? 'bg-blue-600 text-white animate-pulse shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-slate-800 text-slate-400'}`}>
                   {isDeploying ? '🐙' : isSpeaking ? '📡' : '🤖'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">Autopilot Agent Report</span>
                    {(isSpeaking || isDeploying) && <div className="flex gap-0.5 h-3 items-end"><div className="w-1 bg-blue-500 animate-[wave_1s_infinite]"></div><div className="w-1 bg-blue-500 animate-[wave_1s_infinite_0.2s]"></div><div className="w-1 bg-blue-500 animate-[wave_1s_infinite_0.4s]"></div></div>}
                  </div>
                  <p className="text-slate-200 text-sm font-medium leading-relaxed italic">
                    "{narrativeText}"
                  </p>
                </div>
             </div>
          </div>
        )}

        <div className="absolute top-6 right-6 hidden xl:block">
            <div className="bg-slate-950/80 backdrop-blur border border-slate-800 p-6 rounded-[32px] w-64 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Project Progress</h4>
                    <span className="text-blue-400 font-black text-xs">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{width: `${progress}%`}}></div>
                </div>
                <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3">Recent Manifest</h4>
                <div className="space-y-1 font-mono text-[9px] max-h-40 overflow-y-auto custom-scrollbar pr-2">
                    {Object.keys(taskOutputs).length > 0 ? (
                        Object.keys(taskOutputs).slice(-8).map(key => (
                            <div key={key} className="flex items-center space-x-2 text-blue-400 animate-in fade-in slide-in-from-right-2">
                                <span className="text-slate-600">📄</span>
                                <span className="truncate">{getFilePath(key) || `file-${key}`}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-700 italic">No files generated yet</p>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* TIMELINE VIEW */}
      <div className="relative pl-8 md:pl-12 border-l-2 border-slate-800 space-y-16 py-4">
        {CHECKLIST_STEPS.map((step, stepIdx) => {
          const dayTasksCompleted = step.tasks.filter((_, idx) => taskOutputs[`${step.day}-${idx}`]).length;
          const isDayDone = dayTasksCompleted === step.tasks.length;
          const isCurrent = !isDayDone && (stepIdx === 0 || step.tasks.filter((_, idx) => taskOutputs[`${CHECKLIST_STEPS[stepIdx-1].day}-${idx}`]).length > 0);

          return (
            <div key={step.day} className="relative group">
              <div className={`absolute -left-[41px] md:-left-[53px] top-0 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 flex items-center justify-center transition-all duration-500 z-10 ${
                isDayDone 
                ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                : isCurrent 
                  ? 'bg-blue-600 border-slate-950 animate-pulse' 
                  : 'bg-slate-900 border-slate-800'
              }`}>
                {isDayDone && <span className="text-white text-[10px] md:text-xs">✓</span>}
              </div>

              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg w-fit ${
                    isDayDone ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-500 bg-slate-800/50'
                  }`}>
                    PHASE 0{step.day}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white">{step.title}</h3>
                </div>
                <p className="text-slate-500 text-sm max-w-2xl">{step.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {step.tasks.map((task, idx) => {
                  const key = `${step.day}-${idx}`;
                  const isRunning = !!runningTasks[key];
                  const hasOutput = !!taskOutputs[key];

                  return (
                    <div 
                      key={idx} 
                      className={`relative bg-slate-900/40 border p-6 rounded-[24px] transition-all duration-300 flex flex-col justify-between h-44 group/task ${
                        hasOutput 
                        ? 'border-blue-500/20 bg-blue-500/[0.02]' 
                        : isRunning 
                          ? 'border-blue-500 bg-blue-500/5' 
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-3">
                           <span className={`text-[9px] font-bold uppercase tracking-widest ${hasOutput ? 'text-blue-400' : 'text-slate-600'}`}>
                             Task {idx + 1}
                           </span>
                           {hasOutput && <span className="text-emerald-500 text-[10px] font-black">SYNCED</span>}
                        </div>
                        <p className="text-white font-bold text-sm leading-snug group-hover/task:text-blue-100 transition-colors">
                          {task}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-auto">
                        <button
                          onClick={() => handleRunTask(step.day, task, idx)}
                          disabled={isRunning || isBuildingAll}
                          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                            isRunning 
                              ? 'bg-slate-800 text-slate-500 cursor-wait' 
                              : hasOutput 
                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'
                          }`}
                        >
                          {isRunning ? 'Building...' : hasOutput ? 'Re-Generate' : 'Execute AI'}
                        </button>
                        {hasOutput && (
                          <button 
                            onClick={() => setViewingOutput(key)}
                            className="px-4 py-2 bg-slate-950 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-black hover:bg-emerald-500/10 transition-all"
                          >
                            Inspect
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Output Viewer Modal */}
      {viewingOutput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-6xl h-[90vh] rounded-[40px] overflow-hidden flex flex-col shadow-2xl ring-1 ring-white/5">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400">📄</div>
                <div>
                  <h3 className="text-white font-black text-xl">
                    {getFilePath(viewingOutput) || 'Manifest Output'}
                  </h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">
                    Autopilot Generated Component • Vercel Ready
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setViewingOutput(null)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 font-mono text-xs text-slate-300 bg-slate-950 leading-loose whitespace-pre-wrap selection:bg-blue-600/30 custom-scrollbar">
              {getCleanContent(viewingOutput)}
            </div>
            <div className="p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur flex justify-end gap-4">
                <button 
                  onClick={() => navigator.clipboard.writeText(getCleanContent(viewingOutput))}
                  className="px-8 py-3 bg-slate-800 text-slate-200 rounded-2xl font-black hover:text-white transition-all border border-slate-700"
                >📋 Copy</button>
                <button 
                  onClick={() => setViewingOutput(null)}
                  className="px-12 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20"
                >Confirm</button>
            </div>
          </div>
        </div>
      )}

      {progress === 100 && (
          <div className="mt-20 p-12 bg-emerald-600/10 border border-emerald-500/20 rounded-[48px] text-center animate-in zoom-in-95 duration-700">
              <h3 className="text-4xl font-black text-white italic mb-4">Construction Ready</h3>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto italic">"ผลงานชิ้นโบแดงของคุณพร้อมแล้วสำหรับการส่งมอบขึ้นสู่สนามจริง"</p>
              <div className="flex justify-center gap-4">
                <button onClick={handleGitHubDeploy} className="px-12 py-4 bg-[#24292e] text-white font-black rounded-3xl shadow-2xl transition-all hover:scale-105">
                   Deploy to GitHub
                </button>
                <button onClick={handleDownloadZip} className="px-12 py-4 bg-emerald-500 text-white font-black rounded-3xl shadow-2xl transition-all hover:scale-105">
                   Download Project Bundle
                </button>
              </div>
          </div>
      )}
      
      <style>{`
        @keyframes wave {
          0%, 100% { height: 10px; opacity: 0.5; }
          50% { height: 20px; opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ChecklistView;
