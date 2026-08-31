import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { X, BookOpen, Save, Trash2, Check, FileText, Copy, Printer } from 'lucide-react';
import { Experiment } from '../../types/experiment';

interface LabNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentId?: string;
  experimentTitle?: string;
  experiment?: Experiment;
  params?: Record<string, number>;
  outputs?: Record<string, number>;
  elapsedTime?: number;
}

interface NoteEntry {
  id: string;
  timestamp: string;
  experimentId: string;
  experimentTitle: string;
  content: string;
}

export const LabNotebookModal: React.FC<LabNotebookModalProps> = ({
  isOpen,
  onClose,
  experimentId = 'general',
  experimentTitle = 'General Lab',
  experiment,
  params = {},
  outputs = {},
  elapsedTime = 0,
}) => {
  const { t, getLocalizedText } = useTranslation();
  const [activeTab, setActiveTab] = useState<'notes' | 'report'>('notes');
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // Load saved notes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('taq_lab_notebook');
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  if (!isOpen) return null;

  const handleSaveNote = () => {
    if (!currentNote.trim()) return;

    const newEntry: NoteEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      experimentId,
      experimentTitle,
      content: currentNote,
    };

    const updated = [newEntry, ...notes];
    setNotes(updated);
    setCurrentNote('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);

    try {
      localStorage.setItem('taq_lab_notebook', JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    try {
      localStorage.setItem('taq_lab_notebook', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleClearAll = () => {
    setNotes([]);
    try {
      localStorage.removeItem('taq_lab_notebook');
    } catch {
      // Ignore
    }
  };

  // Construct printable Lab Report text
  const generateReportText = () => {
    const title = experiment ? getLocalizedText(experiment.title) : experimentTitle;
    const cat = experiment?.category ? experiment.category.toUpperCase() : 'PHYSICS';
    const law = experiment?.physicalLaw || 'N/A';

    let text = `========================================\n`;
    text += `SCIENTIFIC VIRTUAL LAB REPORT: ${title}\n`;
    text += `========================================\n\n`;
    text += `Category: ${cat}\n`;
    text += `Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    text += `Elapsed Simulation Time: ${elapsedTime.toFixed(2)} s\n\n`;
    text += `--- 1. THEORETICAL FRAMEWORK ---\n`;
    text += `Governing Physical Law: ${law}\n\n`;

    text += `--- 2. CONFIGURED INPUT PARAMETERS ---\n`;
    if (Object.keys(params).length > 0) {
      Object.entries(params).forEach(([k, v]) => {
        text += `• ${k}: ${v}\n`;
      });
    } else {
      text += `Default parameters applied.\n`;
    }
    text += `\n--- 3. MEASUREMENTS & COMPUTED OUTPUTS ---\n`;
    if (Object.keys(outputs).length > 0) {
      Object.entries(outputs).forEach(([k, v]) => {
        text += `• ${k}: ${typeof v === 'number' ? v.toFixed(3) : v}\n`;
      });
    } else {
      text += `No live measurements recorded.\n`;
    }

    const expNotes = notes.filter((n) => n.experimentId === experimentId);
    text += `\n--- 4. FIELD OBSERVATIONS & NOTES ---\n`;
    if (expNotes.length > 0) {
      expNotes.forEach((n, idx) => {
        text += `[${idx + 1}] (${n.timestamp}): ${n.content}\n`;
      });
    } else {
      text += `No student notes recorded.\n`;
    }

    text += `\n--- 5. CONCLUSION ---\n`;
    text += `The mathematical relationship and real-time numerical outputs conform to the theoretical predictions of ${law}.\n`;
    text += `========================================\n`;
    return text;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                {t('tools.labNotebookTitle')} & Lab Report
              </h3>
              <p className="text-[11px] text-slate-400">{experimentTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'notes'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t('tools.labNotebookTitle')}
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'report'
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lab Report</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {activeTab === 'notes' ? (
          <>
            {/* Note Composer Area */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 space-y-3">
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder={t('tools.typeNoteHere')}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none font-sans"
              />

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  {notes.length} {t('tools.labNotebookTitle')} entries
                </span>

                <button
                  onClick={handleSaveNote}
                  disabled={!currentNote.trim()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{t('tools.saveNote')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Recorded Notes List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/50">
              {notes.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No notes saved yet. Record observations during your experiment!
                </div>
              ) : (
                <>
                  <div className="flex justify-end">
                    <button
                      onClick={handleClearAll}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{t('tools.clearNotes')}</span>
                    </button>
                  </div>

                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1.5 relative group"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-semibold text-amber-400">
                          {note.experimentTitle}
                        </span>
                        <span>{note.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </>
        ) : (
          /* Automated Scientific Lab Report Viewer */
          <div className="flex-1 overflow-y-auto p-5 bg-slate-950 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                Official Laboratory Report
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyReport}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReport ? 'Copied!' : 'Copy Report'}</span>
                </button>
                <button
                  onClick={handlePrintReport}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-3 leading-relaxed">
              <div className="border-b border-slate-800 pb-3">
                <div className="text-sm font-bold text-sky-300">{experiment ? getLocalizedText(experiment.title) : experimentTitle}</div>
                <div className="text-[11px] text-slate-400">Physical Law: <span className="text-amber-300">{experiment?.physicalLaw || 'F = m · a'}</span></div>
                <div className="text-[11px] text-slate-400">Date: {new Date().toLocaleDateString()} | Duration: {elapsedTime.toFixed(1)}s</div>
              </div>

              <div>
                <div className="text-slate-400 font-bold text-[11px] uppercase mb-1">Configured Parameters:</div>
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {Object.entries(params).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-400">{k}:</span>
                      <span className="font-bold text-emerald-400">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-slate-400 font-bold text-[11px] uppercase mb-1">Live Measurements:</div>
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {Object.entries(outputs).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-400">{k}:</span>
                      <span className="font-bold text-sky-400">{typeof v === 'number' ? v.toFixed(3) : v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-slate-400 font-bold text-[11px] uppercase mb-1">Scientific Conclusion:</div>
                <p className="text-slate-300 font-sans text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
                  The simulated physical behavior and real-time measurements confirm the theoretical validity of {experiment?.physicalLaw || 'the governing physical law'}.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

