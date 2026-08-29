import React, { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { X, Binary, Search } from 'lucide-react';

interface SymbolsConstantsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ConstantItem {
  symbol: string;
  nameKey: string;
  value: string;
  unit: string;
  category: string;
}

const CONSTANTS: ConstantItem[] = [
  { symbol: 'g', nameKey: 'Standard Acceleration of Gravity', value: '9.80665', unit: 'm/s²', category: 'Mechanics' },
  { symbol: 'c', nameKey: 'Speed of Light in Vacuum', value: '2.99792 × 10⁸', unit: 'm/s', category: 'Modern Physics' },
  { symbol: 'h', nameKey: "Planck's Constant", value: '6.62607 × 10⁻³⁴', unit: 'J·s', category: 'Quantum Physics' },
  { symbol: 'G', nameKey: 'Newtonian Constant of Gravitation', value: '6.67430 × 10⁻¹¹', unit: 'N·m²/kg²', category: 'Mechanics' },
  { symbol: 'k_e', nameKey: "Coulomb's Constant", value: '8.98755 × 10⁹', unit: 'N·m²/C²', category: 'Electricity' },
  { symbol: 'e', nameKey: 'Elementary Charge', value: '1.60218 × 10⁻¹⁹', unit: 'C', category: 'Electricity' },
  { symbol: 'N_A', nameKey: 'Avogadro Constant', value: '6.02214 × 10²³', unit: 'mol⁻¹', category: 'Thermodynamics' },
  { symbol: 'R', nameKey: 'Molar Gas Constant', value: '8.31446', unit: 'J/(mol·K)', category: 'Thermodynamics' },
  { symbol: 'k_B', nameKey: 'Boltzmann Constant', value: '1.38064 × 10⁻²³', unit: 'J/K', category: 'Thermodynamics' },
  { symbol: 'ε_0', nameKey: 'Vacuum Electric Permittivity', value: '8.85419 × 10⁻¹²', unit: 'F/m', category: 'Electricity' },
  { symbol: 'μ_0', nameKey: 'Vacuum Magnetic Permeability', value: '1.25664 × 10⁻⁶', unit: 'H/m', category: 'Electricity' },
  { symbol: 'm_e', nameKey: 'Electron Rest Mass', value: '9.10938 × 10⁻³¹', unit: 'kg', category: 'Quantum Physics' },
  { symbol: 'm_p', nameKey: 'Proton Rest Mass', value: '1.67262 × 10⁻²⁷', unit: 'kg', category: 'Quantum Physics' },
  { symbol: 'σ', nameKey: 'Stefan-Boltzmann Constant', value: '5.67037 × 10⁻⁸', unit: 'W/(m²·K⁴)', category: 'Thermodynamics' },
];

export const SymbolsConstantsModal: React.FC<SymbolsConstantsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = CONSTANTS.filter(
    (item) =>
      item.symbol.toLowerCase().includes(search.toLowerCase()) ||
      item.nameKey.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Binary className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-100">
              {t('tools.symbolsTitle')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 bg-slate-900 border-b border-slate-800">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('tools.searchConstants')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[44px]"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-950/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filtered.map((c) => (
              <div
                key={c.symbol}
                className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3 hover:border-blue-500/40 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {c.symbol}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {c.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-200 font-medium">{c.nameKey}</div>
                </div>

                <div className="text-right font-mono shrink-0">
                  <div className="text-xs font-bold text-blue-400">{c.value}</div>
                  <div className="text-[10px] text-slate-400">{c.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
