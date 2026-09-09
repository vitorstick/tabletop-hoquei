import React from 'react';
import { X, Compass, User, Hash, Shield, CircleDot } from 'lucide-react';
import { useTacticsStore } from '../../store/useTacticsStore';
import { PlayerRole } from '../../types/tactics';
import { useTranslation } from '../../i18n/useTranslation';

export const PlayerInspector: React.FC = () => {
  const selectedTokenId = useTacticsStore((s) => s.selectedTokenId);
  const setSelectedTokenId = useTacticsStore((s) => s.setSelectedTokenId);
  const metadata = useTacticsStore((s) => selectedTokenId ? s.playersMetadata[selectedTokenId] : null);
  const setPlayerInfo = useTacticsStore((s) => s.setPlayerInfo);
  const setPlayerRotation = useTacticsStore((s) => s.setPlayerRotation);
  const setBallAttachedPlayer = useTacticsStore((s) => s.setBallAttachedPlayer);
  
  const currentStep = useTacticsStore((s) => s.steps[s.currentStepIndex]);
  const playerPos = selectedTokenId && currentStep?.players[selectedTokenId] ? currentStep.players[selectedTokenId] : null;
  const hasBall = selectedTokenId ? currentStep?.ballAttachedTo === selectedTokenId : false;

  const { t } = useTranslation();

  if (!selectedTokenId || !metadata || !playerPos) return null;

  const isHome = metadata.team === 'home';
  const rotationDeg = Math.round(((playerPos.rotation * 180) / Math.PI + 360) % 360);

  const handleRotationChange = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    setPlayerRotation(selectedTokenId, rad);
  };

  const snaps = [
    { label: t.inspector.snapEast, val: 0 },
    { label: t.inspector.snapSouth, val: 90 },
    { label: t.inspector.snapWest, val: 180 },
    { label: t.inspector.snapNorth, val: 270 },
  ];

  return (
    <div className="absolute top-16 right-4 z-40 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl p-3.5 shadow-2xl ring-1 ring-white/10 select-none animate-in fade-in slide-in-from-right-3 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-full border border-white/30 ${
              isHome ? 'bg-red-500 shadow-sm shadow-red-500/50' : 'bg-blue-600 shadow-sm shadow-blue-500/50'
            }`}
          />
          <span className="font-bold text-xs text-white">
            {isHome ? t.common.homePlayer : t.common.awayPlayer} ({selectedTokenId})
          </span>
        </div>
        <button
          onClick={() => setSelectedTokenId(null)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Attributes Form */}
      <div className="flex flex-col gap-3">
        {/* Name input */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase text-slate-400 flex items-center gap-1">
            <User className="w-3 h-3 text-slate-400" /> {t.inspector.playerNameRole}
          </label>
          <input
            type="text"
            value={metadata.name}
            onChange={(e) => setPlayerInfo(selectedTokenId, { name: e.target.value })}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Number & Role Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase text-slate-400 flex items-center gap-1">
              <Hash className="w-3 h-3 text-slate-400" /> {t.inspector.number}
            </label>
            <input
              type="number"
              min={1}
              max={99}
              value={metadata.number}
              onChange={(e) => setPlayerInfo(selectedTokenId, { number: parseInt(e.target.value) || 1 })}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase text-slate-400 flex items-center gap-1">
              <Shield className="w-3 h-3 text-slate-400" /> {t.inspector.position}
            </label>
            <select
              value={metadata.role}
              onChange={(e) => setPlayerInfo(selectedTokenId, { role: e.target.value as PlayerRole })}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option value="GK">{t.inspector.positionGK}</option>
              <option value="FP">{t.inspector.positionFP}</option>
            </select>
          </div>
        </div>

        {/* Facing Rotation */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase text-slate-400">
            <span className="flex items-center gap-1">
              <Compass className="w-3 h-3 text-slate-400" /> {t.inspector.facingAngle}
            </span>
            <span className="font-mono text-amber-400">{rotationDeg}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={359}
            value={rotationDeg}
            onChange={(e) => handleRotationChange(parseInt(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          {/* Quick Facing Snaps */}
          <div className="grid grid-cols-4 gap-1">
            {snaps.map((snap) => (
              <button
                key={snap.val}
                onClick={() => handleRotationChange(snap.val)}
                className="px-1.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 transition-colors"
              >
                {snap.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ball Possession Toggle */}
        <button
          onClick={() => setBallAttachedPlayer(hasBall ? null : selectedTokenId)}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            hasBall
              ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
          }`}
        >
          <CircleDot className={`w-3.5 h-3.5 ${hasBall ? 'text-amber-400' : 'text-slate-400'}`} />
          <span>{hasBall ? t.inspector.releaseBall : t.inspector.giveBall}</span>
        </button>

        {/* Coordinate details */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>X: {playerPos.x.toFixed(2)}m</span>
          <span>Z: {playerPos.z.toFixed(2)}m</span>
        </div>
      </div>
    </div>
  );
};
