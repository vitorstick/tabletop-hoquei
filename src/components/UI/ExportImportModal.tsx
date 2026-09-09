import React, { useState } from 'react';
import { X, Copy, Check, Download, Upload, AlertCircle, FileJson } from 'lucide-react';
import { useTacticsStore } from '../../store/useTacticsStore';
import { useTranslation } from '../../i18n/useTranslation';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({ isOpen, onClose }) => {
  const exportStateJSON = useTacticsStore((s) => s.exportStateJSON);
  const importStateJSON = useTacticsStore((s) => s.importStateJSON);

  const { t } = useTranslation();

  const [mode, setMode] = useState<'export' | 'import'>('export');
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentJSON = exportStateJSON();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentJSON);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([currentJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roller-hockey-tactic-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!importText.trim()) {
      setErrorMsg(t.modal.errEmpty);
      return;
    }

    const success = importStateJSON(importText);
    if (success) {
      setSuccessMsg(t.modal.successLoaded);
      setTimeout(() => {
        onClose();
      }, 900);
    } else {
      setErrorMsg(t.modal.errInvalid);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setImportText(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <FileJson className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">{t.modal.modalTitle}</h2>
              <p className="text-xs text-slate-400">{t.modal.modalSubtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-slate-800 px-5 pt-2 bg-slate-900">
          <button
            onClick={() => setMode('export')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
              mode === 'export'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.modal.tabExport}
          </button>
          <button
            onClick={() => setMode('import')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
              mode === 'import'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.modal.tabImport}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-4">
          {mode === 'export' ? (
            <>
              <div className="relative">
                <textarea
                  readOnly
                  value={currentJSON}
                  rows={10}
                  className="w-full font-mono text-xs p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none resize-none leading-relaxed select-all"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  {t.modal.exportNote}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? t.modal.copied : t.modal.copyJSON}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md shadow-red-600/30 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.modal.downloadJSON}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <textarea
                  placeholder={t.modal.importPlaceholder}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  rows={8}
                  className="w-full font-mono text-xs p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500 resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-750 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.modal.uploadFile}</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {errorMsg && (
                    <div className="flex items-center gap-1 text-xs text-rose-400">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>{successMsg}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-colors"
                >
                  {t.modal.cancel}
                </button>
                <button
                  onClick={handleImport}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md shadow-red-600/30 transition-colors"
                >
                  {t.modal.loadPlay}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
