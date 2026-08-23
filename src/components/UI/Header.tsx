import React, { useState } from 'react';
import { 
  RotateCcw, 
  ArrowLeftRight, 
  Download, 
  Grid3X3, 
  Eye, 
  Maximize,
  HelpCircle
} from 'lucide-react';
import { useTacticsStore } from '../../store/useTacticsStore';

interface HeaderProps {
  onOpenExportImport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenExportImport }) => {
  const resetToInitial = useTacticsStore((s) => s.resetToInitial);
  const flipSides = useTacticsStore((s) => s.flipSides);
  const showCourtGrid = useTacticsStore((s) => s.showCourtGrid);
  const toggleCourtGrid = useTacticsStore((s) => s.toggleCourtGrid);
  const rinkTheme = useTacticsStore((s) => s.rinkViewTheme);
  const setRinkViewTheme = useTacticsStore((s) => s.setRinkViewTheme);
  const showBehindGoalClearance = useTacticsStore((s) => s.showBehindGoalClearance);

  const [showHelp, setShowHelp] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 flex items-center justify-between z-30 shrink-0 select-none shadow-md">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20 ring-1 ring-white/20">
          <span className="font-mono font-black text-white text-base">RH</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm text-slate-100 tracking-wide flex items-center gap-1.5">
              Roller Hockey Tactics Board
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                World Skate 40×20
              </span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-400">
            Hóquei em Patins • Inset Net (3m clearance) • Step Sequencer
          </p>
        </div>
      </div>

      {/* Quick Actions & Preferences */}
      <div className="flex items-center gap-2">
        {/* Court Theme Selector */}
        <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
          <button
            onClick={() => setRinkViewTheme('parquet')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              rinkTheme === 'parquet'
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Parquet Wood Floor"
          >
            Parquet Floor
          </button>
          <button
            onClick={() => setRinkViewTheme('modern-dark')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              rinkTheme === 'modern-dark'
                ? 'bg-slate-700 text-slate-200 border border-slate-600'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Modern Dark Whiteboard"
          >
            Dark Whiteboard
          </button>
        </div>

        {/* Grid Toggle */}
        <button
          onClick={toggleCourtGrid}
          className={`p-2 rounded-lg border transition-all ${
            showCourtGrid
              ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
              : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
          title="Toggle Grid Overlay"
        >
          <Grid3X3 className="w-4 h-4" />
        </button>

        {/* Behind Net Clearance Indicator */}
        <button
          onClick={() => useTacticsStore.setState({ showBehindGoalClearance: !showBehindGoalClearance })}
          className={`p-2 rounded-lg border transition-all ${
            showBehindGoalClearance
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
          title="Toggle 3m Behind-the-Net Highlight"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Flip Sides */}
        <button
          onClick={flipSides}
          className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors"
          title="Flip Home / Away Sides"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>

        {/* Reset */}
        <button
          onClick={resetToInitial}
          className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-red-400 hover:bg-slate-700/60 transition-colors"
          title="Reset Tactics Board"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-800 mx-1" />

        {/* Export / Import JSON */}
        <button
          onClick={onOpenExportImport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-200 hover:bg-slate-700 text-xs font-semibold shadow-sm transition-all hover:border-slate-600"
        >
          <Download className="w-3.5 h-3.5 text-red-400" />
          <span>Save / Load</span>
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize className="w-4 h-4" />
        </button>

        {/* Help Guide */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-amber-300 transition-colors"
          title="Tactical Board Help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Help Modal */}
      {showHelp && (
        <div className="fixed top-16 right-6 w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl p-4 shadow-2xl z-50 text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <h3 className="font-bold text-sm text-amber-400">Quick Guide: Roller Hockey Board</h3>
            <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-100 text-sm">✕</button>
          </div>
          <ul className="text-xs space-y-2 text-slate-300">
            <li>🎯 <strong className="text-white">Drag Players & Ball:</strong> Select & drag anywhere on the 40×20m rink.</li>
            <li>🔄 <strong className="text-white">Rotate Player:</strong> Click a player to show the yellow rotation handle ring, or use the inspector.</li>
            <li>🏒 <strong className="text-white">Behind the Net:</strong> The goals are inset at 17m, allowing authentic 3m behind-the-net plays.</li>
            <li>✏️ <strong className="text-white">Draw Vectors:</strong> Use Pass (dashed), Move (solid), or Curved routes.</li>
            <li>⏱️ <strong className="text-white">Play Sequencer:</strong> Add steps to build multi-phase tactical plays with smooth animated playback.</li>
          </ul>
        </div>
      )}
    </header>
  );
};
