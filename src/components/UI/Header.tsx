import React, { useState } from 'react';
import { 
  RotateCcw, 
  ArrowLeftRight, 
  Download, 
  Grid3X3, 
  Eye, 
  Maximize,
  HelpCircle,
  Camera,
  Languages
} from 'lucide-react';
import { useTacticsStore } from '../../store/useTacticsStore';
import { useTranslation } from '../../i18n/useTranslation';

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
  const toggleBehindGoalClearance = useTacticsStore((s) => s.toggleBehindGoalClearance);

  const { t, language, setLanguage, languages } = useTranslation();
  const [showHelp, setShowHelp] = useState(false);

  const handleExportPNG = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `roller-hockey-tactic-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // Canvas may be tainted or unavailable
    }
  };

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
              {t.common.appTitle}
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                {t.common.badgeWorldSkate}
              </span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-400">
            {t.common.appSubtitle}
          </p>
        </div>
      </div>

      {/* Quick Actions & Preferences */}
      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60" title={t.header.languageSelect}>
          <div className="pl-1.5 pr-1 text-slate-400">
            <Languages className="w-3.5 h-3.5" />
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
                language === lang.code
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={lang.nativeName}
            >
              <span className="text-[11px] leading-none">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-slate-800 mx-0.5" />

        {/* Court Theme Selector */}
        <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
          <button
            onClick={() => setRinkViewTheme('parquet')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              rinkTheme === 'parquet'
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={t.header.parquetFloor}
          >
            {t.header.parquetFloor}
          </button>
          <button
            onClick={() => setRinkViewTheme('modern-dark')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              rinkTheme === 'modern-dark'
                ? 'bg-slate-700 text-slate-200 border border-slate-600'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={t.header.darkWhiteboard}
          >
            {t.header.darkWhiteboard}
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
          title={t.header.toggleGrid}
        >
          <Grid3X3 className="w-4 h-4" />
        </button>

        {/* Behind Net Clearance Indicator */}
        <button
          onClick={toggleBehindGoalClearance}
          className={`p-2 rounded-lg border transition-all ${
            showBehindGoalClearance
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
          title={t.header.toggleBehindGoal}
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Flip Sides */}
        <button
          onClick={flipSides}
          className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors"
          title={t.header.flipSides}
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>

        {/* Reset */}
        <button
          onClick={resetToInitial}
          className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-red-400 hover:bg-slate-700/60 transition-colors"
          title={t.header.resetBoard}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-800 mx-1" />

        {/* Export Image Snapshot */}
        <button
          onClick={handleExportPNG}
          className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 transition-colors"
          title={t.header.downloadScreenshot}
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Export / Import JSON */}
        <button
          onClick={onOpenExportImport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-200 hover:bg-slate-700 text-xs font-semibold shadow-sm transition-all hover:border-slate-600"
        >
          <Download className="w-3.5 h-3.5 text-red-400" />
          <span>{t.header.saveLoad}</span>
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors"
          title={t.header.toggleFullscreen}
        >
          <Maximize className="w-4 h-4" />
        </button>

        {/* Help Guide */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-amber-300 transition-colors"
          title={t.header.helpTitle}
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Help Modal */}
      {showHelp && (
        <div className="fixed top-16 right-6 w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl p-4 shadow-2xl z-50 text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <h3 className="font-bold text-sm text-amber-400">{t.header.quickGuideTitle}</h3>
            <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-100 text-sm">✕</button>
          </div>
          <ul className="text-xs space-y-2 text-slate-300">
            <li>🎯 <strong className="text-white">{t.header.guideDrag}:</strong> {t.header.guideDragDesc}</li>
            <li>🔄 <strong className="text-white">{t.header.guideRotate}:</strong> {t.header.guideRotateDesc}</li>
            <li>🏒 <strong className="text-white">{t.header.guideBehindNet}:</strong> {t.header.guideBehindNetDesc}</li>
            <li>✏️ <strong className="text-white">{t.header.guideVectors}:</strong> {t.header.guideVectorsDesc}</li>
            <li>⏱️ <strong className="text-white">{t.header.guideSequencer}:</strong> {t.header.guideSequencerDesc}</li>
          </ul>
        </div>
      )}
    </header>
  );
};
