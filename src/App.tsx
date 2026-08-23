import React, { useState } from 'react';
import { Header } from './components/UI/Header';
import { Toolbar } from './components/UI/Toolbar';
import { PresetsBar } from './components/UI/PresetsBar';
import { PlayerInspector } from './components/UI/PlayerInspector';
import { TimelineControls } from './components/UI/TimelineControls';
import { ExportImportModal } from './components/UI/ExportImportModal';
import { TacticsCanvas } from './components/Board/TacticsCanvas';

export const App: React.FC = () => {
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden select-none font-sans">
      {/* Top Navigation & Status */}
      <Header onOpenExportImport={() => setIsExportImportOpen(true)} />

      {/* Main Tactical Workbench Stage */}
      <main className="relative flex-1 w-full overflow-hidden">
        {/* 3D Top-Down Interactive Rink Canvas */}
        <div className="absolute inset-0 z-0">
          <TacticsCanvas />
        </div>

        {/* Floating Tool Palette (Left) */}
        <Toolbar />

        {/* Floating Tactical Formations Presets (Top Right) */}
        <PresetsBar />

        {/* Floating Player Inspector (When token selected) */}
        <PlayerInspector />

        {/* Multi-Step Play Sequencer & Keyframe Controls (Bottom) */}
        <TimelineControls />
      </main>

      {/* Export / Import Modal */}
      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
      />
    </div>
  );
};

export default App;
