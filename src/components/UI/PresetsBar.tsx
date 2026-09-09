import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Sparkles, Shield, Swords, Goal } from 'lucide-react';
import { FORMATIONS } from '../../constants/formations';
import { useTacticsStore } from '../../store/useTacticsStore';
import { useTranslation } from '../../i18n/useTranslation';

export const PresetsBar: React.FC = () => {
  const applyFormation = useTacticsStore((s) => s.applyFormation);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Offensive': return <Swords className="w-3.5 h-3.5 text-red-400" />;
      case 'Defensive': return <Shield className="w-3.5 h-3.5 text-blue-400" />;
      case 'Set Piece': return <Goal className="w-3.5 h-3.5 text-amber-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'Offensive': return t.formations.categories.offensive;
      case 'Defensive': return t.formations.categories.defensive;
      case 'Set Piece': return t.formations.categories.setPiece;
      case 'Special Teams': return t.formations.categories.specialTeams;
      default: return cat;
    }
  };

  return (
    <div className="absolute top-4 right-4 z-30 pointer-events-auto select-none flex flex-col items-end">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-slate-200 text-xs font-semibold shadow-2xl hover:bg-slate-800 transition-all ring-1 ring-white/10"
      >
        <Layers className="w-4 h-4 text-amber-400" />
        <span>{t.formations.buttonTitle}</span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="mt-2 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl p-3 shadow-2xl ring-1 ring-white/10 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t.formations.menuHeader}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{t.formations.playersCount}</span>
          </div>

          <div className="flex flex-col gap-1.5 max-h-[380px] overflow-y-auto pr-1">
            {Object.entries(FORMATIONS).map(([key, f]) => {
              const localizedItem = t.formations.items[key];
              const name = localizedItem?.name || f.name;
              const description = localizedItem?.description || f.description;
              const categoryLabel = getCategoryLabel(f.category);

              return (
                <button
                  key={key}
                  onClick={() => {
                    applyFormation(key);
                    setIsOpen(false);
                  }}
                  className="flex flex-col gap-1 text-left p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-amber-500/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {getCategoryIcon(f.category)}
                      <span className="text-xs font-bold text-slate-100 group-hover:text-amber-300">
                        {name}
                      </span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-300 font-mono">
                      {categoryLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
