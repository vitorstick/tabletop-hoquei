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

const COLOR_PALETTE = [
  { name: 'Red', hex: '#ef233c' },
  { name: 'Yellow', hex: '#fbbf24' },
  { name: 'Blue', hex: '#0284c7' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Orange', hex: '#ff7b00' },
  { name: 'White', hex: '#ffffff' },
];

export const Toolbar: React.FC = () => {
  const activeTool = useTacticsStore((s) => s.activeTool);
  const setActiveTool = useTacticsStore((s) => s.setActiveTool);
  const activeColor = useTacticsStore((s) => s.activeColor);
  const setActiveColor = useTacticsStore((s) => s.setActiveColor);
  const clearAnnotations = useTacticsStore((s) => s.clearAnnotations);

  const tools: Array<{ id: ToolMode; label: string; icon: React.ReactNode }> = [
    { id: 'select', label: 'Select / Move Tokens', icon: <MousePointer2 className="w-4 h-4" /> },
    { id: 'arrow', label: 'Skate Route (Solid Arrow)', icon: <MoveRight className="w-4 h-4" /> },
    { id: 'pass', label: 'Pass Vector (Dashed Line)', icon: <Split className="w-4 h-4" /> },
    { id: 'curve', label: 'Curved Cut / Skating Arc', icon: <CornerUpRight className="w-4 h-4" /> },
    { id: 'zone', label: 'Tactical Highlight Zone', icon: <Square className="w-4 h-4" /> },
    { id: 'erase', label: 'Erase Annotation', icon: <Eraser className="w-4 h-4" /> },
  ];

  return (
    <div className="absolute top-4 left-4 z-30 flex flex-col gap-2 pointer-events-auto select-none">
      {/* Tool Palette */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-1.5 shadow-2xl flex flex-col gap-1 ring-1 ring-white/10">
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-0.5">
          Tools
        </div>

        {tools.map((t) => {
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title={t.label}
            >
              <div className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                {t.icon}
              </div>
              <span className="hidden md:inline">{t.label.split('(')[0]}</span>
            </button>
          );
        })}

        <div className="h-px bg-slate-800 my-1" />

        {/* Clear Annotations */}
        <button
          onClick={clearAnnotations}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors group"
          title="Clear all drawings in this step"
        >
          <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
          <span className="hidden md:inline">Clear Lines</span>
        </button>
      </div>

      {/* Drawing Color Selector */}
      {(activeTool === 'arrow' || activeTool === 'pass' || activeTool === 'curve' || activeTool === 'zone') && (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-2 shadow-2xl flex flex-col gap-1.5 ring-1 ring-white/10">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
            Line Color
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
                title={c.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
