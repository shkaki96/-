import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { X, BookOpen, Save, Trash2, Plus, Check } from 'lucide-react';

interface LabNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentId?: string;
  experimentTitle?: string;
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
}) => {
  const { t } = useTranslation();
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                {t('tools.labNotebookTitle')}
              </h3>
              <p className="text-[11px] text-slate-400">{experimentTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

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
      </div>
    </div>
  );
};
