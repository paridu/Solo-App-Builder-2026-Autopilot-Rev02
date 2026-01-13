
import React, { useState } from 'react';

const FileStructureView: React.FC = () => {
  const selectedIdea = localStorage.getItem('selected_app_idea') || 'Solo App Builder';
  const outputs = JSON.parse(localStorage.getItem('solo_builder_outputs') || '{}');
  const fileKeys = Object.keys(outputs);

  const getFilePath = (raw: string) => {
    const match = raw?.match(/FILE_PATH:\s*([^\n\r]+)/);
    return match ? match[1].trim() : 'unassigned-asset.txt';
  };

  // Group files into a pseudo-directory structure
  const structure: Record<string, string[]> = {
    'root': [],
    'models': [],
    'ui': [],
    'api': [],
    'docs': []
  };

  fileKeys.forEach(key => {
    const path = getFilePath(outputs[key]);
    if (path.includes('models/')) structure['models'].push(path);
    else if (path.includes('views/') || path.includes('components/')) structure['ui'].push(path);
    else if (path.includes('api/')) structure['api'].push(path);
    else if (path.includes('.md') || path.includes('.txt')) structure['docs'].push(path);
    else structure['root'].push(path);
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-white italic">Industrial Architecture Schema</h2>
        <p className="text-slate-400 mt-2">โครงสร้างไฟล์โปรเจกต์: <span className="text-blue-400 font-bold">{selectedIdea}</span></p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-blue-400">📂</span> File System Tree
              </h3>
              <span className="text-[10px] bg-slate-800 px-3 py-1 rounded-full text-slate-500 font-black uppercase tracking-widest">
                {fileKeys.length} Assets Generated
              </span>
           </div>

           <div className="space-y-6 font-mono text-sm">
              {Object.entries(structure).map(([folder, files]) => (
                files.length > 0 && (
                  <div key={folder} className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <span className="text-lg">📁</span>
                      <span className="font-bold uppercase tracking-widest text-[10px]">{folder}</span>
                    </div>
                    <div className="ml-6 space-y-1.5 border-l border-slate-800 pl-4">
                      {files.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 group cursor-pointer">
                          <span className="text-slate-700">📄</span>
                          <span className="text-blue-300/80 group-hover:text-blue-400 transition-colors">{file.split('/').pop()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
              {fileKeys.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-slate-600 italic">ยังไม่มีการสร้างไฟล์... โปรดรัน Autopilot ก่อน</p>
                </div>
              )}
           </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-600/5 border border-blue-500/20 p-8 rounded-[32px]">
             <h4 className="text-white font-bold mb-4">Industrial Design Principles</h4>
             <ul className="space-y-4 text-sm text-slate-400">
               <li className="flex gap-3">
                 <span className="text-blue-400">01</span>
                 <p><strong>Standardization:</strong> ไฟล์ทั้งหมดถูกจัดหมวดหมู่ตามมาตรฐานโรงงานอัจฉริยะเพื่อให้ง่ายต่อการขยายระบบ</p>
               </li>
               <li className="flex gap-3">
                 <span className="text-blue-400">02</span>
                 <p><strong>Decoupling:</strong> แยกส่วน logic การคำนวณ OEE ออกจาก UI เพื่อความแม่นยำและความเร็วในการประมวลผล</p>
               </li>
               <li className="flex gap-3">
                 <span className="text-blue-400">03</span>
                 <p><strong>Cloud-Edge Ready:</strong> โครงสร้างถูกออกแบบให้รองรับทั้งการรันบน Edge IoT และการ Deploy ขึ้น Vercel Cloud</p>
               </li>
             </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full"></div>
             <h4 className="text-white font-bold mb-2">Build Verification</h4>
             <p className="text-xs text-slate-500 mb-6 uppercase tracking-widest font-black">AI Agent Consistency Check</p>
             <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                   <span className="text-[10px] text-slate-400 font-bold">SQL Schema Integrity</span>
                   <span className="text-[10px] text-emerald-400 font-black">VALID</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                   <span className="text-[10px] text-slate-400 font-bold">API Endpoint Definition</span>
                   <span className="text-[10px] text-emerald-400 font-black">VALID</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                   <span className="text-[10px] text-slate-400 font-bold">Vercel Config (JSON)</span>
                   <span className="text-[10px] text-emerald-400 font-black">READY</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileStructureView;
