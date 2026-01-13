
import React, { useState } from 'react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import IdeasBox from './views/IdeasBox';
import ChecklistView from './views/ChecklistView';
import AutopilotWizard from './views/AutopilotWizard';
import GanttChartView from './views/GanttChartView';
import FileStructureView from './views/FileStructureView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'ideas': return <IdeasBox onSelectIdea={() => setActiveView('checklist')} />;
      case 'gantt': return <GanttChartView />;
      case 'checklist': return <ChecklistView />;
      case 'autopilot': return <AutopilotWizard />;
      case 'schema': return <FileStructureView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Navigation Sidebar */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {renderView()}
        </div>
      </main>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-800 flex justify-around">
        <button onClick={() => setActiveView('dashboard')} className={`p-2 rounded-lg ${activeView === 'dashboard' ? 'text-blue-400' : 'text-slate-500'}`}>
          🏠
        </button>
        <button onClick={() => setActiveView('ideas')} className={`p-2 rounded-lg ${activeView === 'ideas' ? 'text-blue-400' : 'text-slate-500'}`}>
          💡
        </button>
        <button onClick={() => setActiveView('schema')} className={`p-2 rounded-lg ${activeView === 'schema' ? 'text-blue-400' : 'text-slate-500'}`}>
          📂
        </button>
        <button onClick={() => setActiveView('checklist')} className={`p-2 rounded-lg ${activeView === 'checklist' ? 'text-blue-400' : 'text-slate-500'}`}>
          ⚡
        </button>
      </div>
    </div>
  );
};

export default App;
