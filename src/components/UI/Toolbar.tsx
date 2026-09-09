import React from 'react';
import { 
  MousePointer2, 
  MoveRight, 
  Split, 
  CornerUpRight, 
  Square, 
  Eraser, 
  Trash2 
} from 'lucide-react';
import { ToolMode } from '../../types/tactics';
import { useTacticsStore } from '../../store/useTacticsStore';
import { useTranslation } from '../../i18n/useTranslation';

const COLOR_PALETTE = [
  { key: 'red' as const, hex: '#ef233c' },
  { key: 'yellow' as const, hex: '#fbbf24' },
  { key: 'blue' as const, hex: '#0284c7' },
  { key: 'green' as const, hex: '#22c55e' },
  { key: 'orange' as const, hex: '#ff7b00' },
  { key: 'white' as const, hex: '#ffffff' },
];

export const Toolbar: React.FC = () => {
  const activeTool = useTacticsStore((s) => s.activeTool);
  const setActiveTool = useTacticsStore((s) => s.setActiveTool);
  const activeColor = useTacticsStore((s) => s.activeColor);
  const setActiveColor = useTacticsStore((s) => s.setActiveColor);
  const clearAnnotations = useTacticsStore((s) => s.clearAnnotations);

  const { t } = useTranslation();

  const tools: Array<{ id: ToolMode; label: string; shortLabel: string; icon: React.ReactNode }> = [
    { id: 'select', label: t.toolbar.select, shortLabel: t.toolbar.selectShort, icon: <MousePointer2 className="w-4 h-4" /> },
    { id: 'arrow', label: t.toolbar.arrow, shortLabel: t.toolbar.arrowShort, icon: <MoveRight className="w-4 h-4" /> },
    { id: 'pass', label: t.toolbar.pass, shortLabel: t.toolbar.passShort, icon: <Split className="w-4 h-4" /> },
    { id: 'curve', label: t.toolbar.curve, shortLabel: t.toolbar.curveShort, icon: <CornerUpRight className="w-4 h-4" /> },
    { id: 'zone', label: t.toolbar.zone, shortLabel: t.toolbar.zoneShort, icon: <Square className="w-4 h-4" /> },
    { id: 'erase', label: t.toolbar.erase, shortLabel: t.toolbar.eraseShort, icon: <Eraser className="w-4 h-4" /> },
  ];

  return (
    <div className="absolute top-4 left-4 z-30 flex flex-col gap-2 pointer-events-auto select-none">
      {/* Tool Palette */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-1.5 shadow-2xl flex flex-col gap-1 ring-1 ring-white/10">
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-0.5">
          {t.toolbar.tools}
        </div>

        {tools.map((tItem) => {
          const isActive = activeTool === tItem.id;
          return (
            <button
              key={tItem.id}
              onClick={() => setActiveTool(tItem.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title={tItem.label}
            >
              <div className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                {tItem.icon}
              </div>
              <span className="hidden md:inline">{tItem.shortLabel}</span>
            </button>
          );
        })}

        <div className="h-px bg-slate-800 my-1" />

        {/* Clear Annotations */}
        <button
          onClick={clearAnnotations}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors group"
          title={t.toolbar.clearLinesTitle}
        >
          <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
          <span className="hidden md:inline">{t.toolbar.clearLines}</span>
        </button>
      </div>

      {/* Drawing Color Selector */}
      {(activeTool === 'arrow' || activeTool === 'pass' || activeTool === 'curve' || activeTool === 'zone') && (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-2 shadow-2xl flex flex-col gap-1.5 ring-1 ring-white/10">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
            {t.toolbar.lineColor}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c.hex}
                onClick={() => setActiveColor(c.hex)}
                className={`w-7 h-7 rounded-lg transition-transform flex items-center justify-center ${
                  activeColor === c.hex
                    ? 'ring-2 ring-white scale-110 shadow-lg'
                    : 'hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
                title={t.toolbar.colors[c.key]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
