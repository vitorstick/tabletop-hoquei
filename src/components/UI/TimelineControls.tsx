import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Plus, 
  Copy, 
  Trash2, 
  Repeat, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Edit2,
  Check
} from 'lucide-react';
import { useTacticsStore } from '../../store/useTacticsStore';
import { useTranslation } from '../../i18n/useTranslation';

const PlayheadProgressBar: React.FC = () => {
  const isPlaying = useTacticsStore((s) => s.isPlaying);
  const playbackProgress = useTacticsStore((s) => s.playbackProgress);
  const currentStepIndex = useTacticsStore((s) => s.currentStepIndex);
  const totalSteps = useTacticsStore((s) => s.steps.length);

  if (!isPlaying) return null;

  return (
    <div className="w-full bg-slate-800/80 backdrop-blur-md rounded-full h-1.5 overflow-hidden border border-slate-700/50">
      <div
        className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-red-500 transition-all duration-75 ease-linear"
        style={{
          width: `${((currentStepIndex + playbackProgress) / Math.max(1, totalSteps)) * 100}%`
        }}
      />
    </div>
  );
};

export const TimelineControls: React.FC = () => {
  const steps = useTacticsStore((s) => s.steps);
  const currentStepIndex = useTacticsStore((s) => s.currentStepIndex);
  const isPlaying = useTacticsStore((s) => s.isPlaying);
  const playbackSpeed = useTacticsStore((s) => s.playbackSpeed);
  const loopPlayback = useTacticsStore((s) => s.loopPlayback);

  const addStep = useTacticsStore((s) => s.addStep);
  const duplicateStep = useTacticsStore((s) => s.duplicateStep);
  const deleteStep = useTacticsStore((s) => s.deleteStep);
  const setStep = useTacticsStore((s) => s.setStep);
  const setStepName = useTacticsStore((s) => s.setStepName);
  const setStepDuration = useTacticsStore((s) => s.setStepDuration);
  const setIsPlaying = useTacticsStore((s) => s.setIsPlaying);
  const setPlaybackSpeed = useTacticsStore((s) => s.setPlaybackSpeed);
  const setLoopPlayback = useTacticsStore((s) => s.setLoopPlayback);

  const { t } = useTranslation();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const currentStep = steps[currentStepIndex];

  const handleStartRename = (index: number, name: string) => {
    setEditingIndex(index);
    setEditName(name);
  };

  const handleSaveRename = (index: number) => {
    if (editName.trim()) {
      setStepName(index, editName.trim());
    }
    setEditingIndex(null);
  };

  const speedOptions = [0.5, 1.0, 1.5, 2.0];

  return (
    <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-auto select-none flex flex-col gap-2">
      {/* Playhead Progress Bar (Active when Playing) */}
      <PlayheadProgressBar />

      {/* Main Timeline Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 shadow-2xl ring-1 ring-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Step Back */}
          <button
            onClick={() => setStep(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0 || isPlaying}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300 transition-colors"
            title={t.timeline.prevStep}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25 ring-2 ring-amber-400/50'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>{t.timeline.pause}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{t.timeline.playSequence}</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={() => setStep(Math.min(steps.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === steps.length - 1 || isPlaying}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300 transition-colors"
            title={t.timeline.nextStep}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Loop Toggle */}
          <button
            onClick={() => setLoopPlayback(!loopPlayback)}
            className={`p-2 rounded-xl border transition-all ${
              loopPlayback
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : 'bg-slate-800 border-slate-700/70 text-slate-400 hover:text-slate-200'
            }`}
            title={t.timeline.loopPlayback}
          >
            <Repeat className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700/70">
            {speedOptions.map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-1 text-[10px] font-mono font-bold rounded-lg transition-colors ${
                  playbackSpeed === spd
                    ? 'bg-slate-700 text-amber-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Step Sequence Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1 px-1">
          {steps.map((step, idx) => {
            const isActive = currentStepIndex === idx;
            const isEditing = editingIndex === idx;

            return (
              <div
                key={step.id}
                onClick={() => !isPlaying && setStep(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600/90 to-red-500/90 text-white border-red-400 shadow-md shadow-red-500/20 ring-1 ring-red-300/30'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/70 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {/* Step Index Badge */}
                <span className="w-4 h-4 rounded-full bg-black/30 flex items-center justify-center text-[10px] font-mono font-bold">
                  {idx + 1}
                </span>

                {/* Step Name / In-place edit */}
                {isEditing ? (
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(idx)}
                      autoFocus
                      className="w-28 px-1 py-0.5 rounded bg-black/60 text-white text-xs border border-amber-400 focus:outline-none"
                    />
                    <button onClick={() => handleSaveRename(idx)} className="text-emerald-400 hover:text-emerald-300">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="truncate max-w-[120px]">{step.name}</span>
                )}

                {/* Action buttons on active tab */}
                {isActive && !isEditing && !isPlaying && (
                  <div className="flex items-center gap-1 ml-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleStartRename(idx, step.name)}
                      className="text-white/70 hover:text-white p-0.5"
                      title={t.timeline.renameStep}
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => duplicateStep(idx)}
                      className="text-white/70 hover:text-white p-0.5"
                      title={t.timeline.duplicateStep}
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {steps.length > 1 && (
                      <button
                        onClick={() => deleteStep(idx)}
                        className="text-white/70 hover:text-red-200 p-0.5"
                        title={t.timeline.deleteStep}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Step Button */}
          {!isPlaying && (
            <button
              onClick={addStep}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-dashed border-slate-600 text-slate-300 hover:text-white text-xs font-semibold transition-all shrink-0 hover:border-red-400"
              title={t.timeline.addStep}
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.timeline.addStep}</span>
            </button>
          )}
        </div>

        {/* Step Timing & Info */}
        {currentStep && (
          <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px]">{t.timeline.phase}</span>
            <select
              value={currentStep.durationMs}
              onChange={(e) => setStepDuration(currentStepIndex, parseInt(e.target.value))}
              disabled={isPlaying}
              className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-red-500"
            >
              <option value={800}>{t.timeline.durations.fastCut}</option>
              <option value={1200}>{t.timeline.durations.standardPass}</option>
              <option value={1800}>{t.timeline.durations.rotation}</option>
              <option value={2500}>{t.timeline.durations.slowBuild}</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
