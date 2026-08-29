import React, { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { X, Calculator, Delete, RotateCcw } from 'lucide-react';

interface ScientificKeyboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScientificKeyboardModal: React.FC<ScientificKeyboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  if (!isOpen) return null;

  const handleInput = (val: string) => {
    setExpression((prev) => prev + val);
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  const handleDelete = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      if (!expression) return;
      // Replace symbols for JS evaluation safely
      let parsed = expression
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/g/g, '9.81')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**');

      // Security check: Only allow mathematical characters, numbers, Math functions, and operators
      if (!/^[\d+\-*/().\s|Math\.sin|Math\.cos|Math\.tan|Math\.sqrt|Math\.PI|Math\.E|9\.81|\*\*]+$/.test(parsed)) {
        setResult('Syntax Error');
        return;
      }

      // Safe math eval using Function
      const evalResult = new Function(`return ${parsed}`)();
      if (typeof evalResult === 'number' && !isNaN(evalResult)) {
        setResult(Number.isInteger(evalResult) ? evalResult.toString() : evalResult.toFixed(4));
      } else {
        setResult('Error');
      }
    } catch {
      setResult('Syntax Error');
    }
  };

  const keys = [
    { label: 'sin', val: 'sin(' },
    { label: 'cos', val: 'cos(' },
    { label: 'tan', val: 'tan(' },
    { label: '√', val: '√(' },
    { label: 'π', val: 'π' },
    { label: 'g', val: 'g' },
    { label: 'e', val: 'e' },
    { label: '^', val: '^' },
    { label: '(', val: '(' },
    { label: ')', val: ')' },
    { label: '7', val: '7' },
    { label: '8', val: '8' },
    { label: '9', val: '9' },
    { label: '÷', val: '/' },
    { label: '4', val: '4' },
    { label: '5', val: '5' },
    { label: '6', val: '6' },
    { label: '×', val: '*' },
    { label: '1', val: '1' },
    { label: '2', val: '2' },
    { label: '3', val: '3' },
    { label: '-', val: '-' },
    { label: '0', val: '0' },
    { label: '.', val: '.' },
    { label: '+', val: '+' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">
              {t('tools.scientificKeyboardTitle')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Display Screen */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 text-right font-mono space-y-1">
          <div className="text-xs text-slate-400 min-h-[20px] overflow-x-auto whitespace-nowrap">
            {expression || '0'}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-cyan-400 min-h-[32px] overflow-x-auto whitespace-nowrap">
            {result || '= 0'}
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={handleClear}
            className="flex-1 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold border border-rose-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold border border-amber-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
          >
            <Delete className="w-3.5 h-3.5" />
            <span>DEL</span>
          </button>
        </div>

        {/* Keypad Grid */}
        <div className="p-3 grid grid-cols-4 gap-2 bg-slate-900">
          {keys.map((k) => (
            <button
              key={k.label}
              onClick={() => handleInput(k.val)}
              className="py-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-mono font-bold text-sm rounded-xl border border-slate-700/60 transition-colors cursor-pointer min-h-[48px] flex items-center justify-center shadow-sm"
            >
              {k.label}
            </button>
          ))}
          <button
            onClick={handleCalculate}
            className="col-span-2 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-base rounded-xl transition-colors cursor-pointer min-h-[48px] flex items-center justify-center shadow-lg shadow-cyan-600/30"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};
