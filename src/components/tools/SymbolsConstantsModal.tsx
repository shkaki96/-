import React, { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { X, Binary, Search } from 'lucide-react';

interface SymbolsConstantsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LocalizedConstantItem {
  symbol: string;
  name: Record<string, string>;
  value: string;
  unit: string;
  category: Record<string, string>;
}

const CONSTANTS: LocalizedConstantItem[] = [
  {
    symbol: 'g',
    name: {
      en: 'Standard Acceleration of Gravity',
      ar: 'تسارع الجاذبية الأرضية القياسي',
      ku: 'تاودانی کێشکردنی زەوی ستاندارد',
      kmr: 'Lezîna kêşana erdê ya pîvanî',
      bad: 'تاودانا کێشکرنا ئەردی یا پێڤایی',
    },
    value: '9.80665',
    unit: 'm/s²',
    category: {
      en: 'Mechanics',
      ar: 'الميكانيكا',
      ku: 'میکانیک',
      kmr: 'Mîkanîk',
      bad: 'میکانیک',
    },
  },
  {
    symbol: 'c',
    name: {
      en: 'Speed of Light in Vacuum',
      ar: 'سرعة الضوء في الفراغ',
      ku: 'خێرایی ڕووناکی لە بۆشاییدا',
      kmr: 'Leza şewqê di valahiyê de',
      bad: 'لەزاتیا رووناهییێ د بۆشاییێ دا',
    },
    value: '2.99792 × 10⁸',
    unit: 'm/s',
    category: {
      en: 'Optics & Relativity',
      ar: 'البصريات والنسبية',
      ku: 'ڕووناکی و ڕێژەیی',
      kmr: 'Şewq û Fîzîka Nûjen',
      bad: 'بینایی و فیزیکا سەردەم',
    },
  },
  {
    symbol: 'h',
    name: {
      en: "Planck's Constant",
      ar: 'ثابت بلانك الكمي',
      ku: 'نەگۆڕی کوانتەمی پلانک',
      kmr: 'Xweciha Plank a kuantemî',
      bad: 'نەگۆڕێ کوانتەمی یێ پلانک',
    },
    value: '6.62607 × 10⁻³⁴',
    unit: 'J·s',
    category: {
      en: 'Quantum Physics',
      ar: 'فيزياء الكم',
      ku: 'فیزیکی کوانتەم',
      kmr: 'Fîzîka Kuantemî',
      bad: 'فیزیکا کوانتەم',
    },
  },
  {
    symbol: 'G',
    name: {
      en: 'Newtonian Constant of Gravitation',
      ar: 'ثابت الجذب الكوني العام لنيوتن',
      ku: 'نەگۆڕی ڕاکێشانی گەردوونی نیوتن',
      kmr: 'Xweciha hevkêşana gerdûnî ya Niyoton',
      bad: 'نەگۆڕێ کێشکرنا گەردوونی یێ نیوتن',
    },
    value: '6.67430 × 10⁻¹¹',
    unit: 'N·m²/kg²',
    category: {
      en: 'Mechanics',
      ar: 'الميكانيكا',
      ku: 'میکانیک',
      kmr: 'Mîkanîk',
      bad: 'میکانیک',
    },
  },
  {
    symbol: 'k_e',
    name: {
      en: "Coulomb's Constant",
      ar: 'ثابت كولوم الكهروستاتيكي',
      ku: 'نەگۆڕی کارۆڕاکێشانی کوڵۆم',
      kmr: 'Xweciha Coulomb a elektrostasîkî',
      bad: 'نەگۆڕێ کۆلۆم یێ کارۆسەکەن',
    },
    value: '8.98755 × 10⁹',
    unit: 'N·m²/C²',
    category: {
      en: 'Electricity',
      ar: 'الكهرباء',
      ku: 'کارەبا',
      kmr: 'Elektrîk û Magnetîk',
      bad: 'کارەب و موگناتیسی',
    },
  },
  {
    symbol: 'e',
    name: {
      en: 'Elementary Charge',
      ar: 'الشحنة الكهربائية الأولية',
      ku: 'بارگەی سەرەتایی ئەلیکترۆن',
      kmr: 'Bara bingehîn a elektronê',
      bad: 'بارگەیێ سەرەتایی یێ ئەلیکترۆنی',
    },
    value: '1.60218 × 10⁻¹⁹',
    unit: 'C',
    category: {
      en: 'Electricity',
      ar: 'الكهرباء',
      ku: 'کارەبا',
      kmr: 'Elektrîk û Magnetîk',
      bad: 'کارەب و موگناتیسی',
    },
  },
  {
    symbol: 'N_A',
    name: {
      en: 'Avogadro Constant',
      ar: 'عدد وثابت أفوغادرو',
      ku: 'نەگۆڕی ئەڤۆگادرۆ',
      kmr: 'Xweciha Avogadro',
      bad: 'نەگۆڕێ ئەڤۆگادرۆ',
    },
    value: '6.02214 × 10²³',
    unit: 'mol⁻¹',
    category: {
      en: 'Thermodynamics',
      ar: 'الديناميكا الحرارية',
      ku: 'داینامیکی گەرمی',
      kmr: 'Termodînamîk',
      bad: 'تێرمۆدینامیک',
    },
  },
  {
    symbol: 'R',
    name: {
      en: 'Molar Gas Constant',
      ar: 'الثابت العام للغازات المثالية',
      ku: 'نەگۆڕی گشتی گازەکان',
      kmr: 'Xweciha giştî ya gaza nimûneyî',
      bad: 'نەگۆڕێ گشتی یێ گازا نموونەیی',
    },
    value: '8.31446',
    unit: 'J/(mol·K)',
    category: {
      en: 'Thermodynamics',
      ar: 'الديناميكا الحرارية',
      ku: 'داینامیکی گەرمی',
      kmr: 'Termodînamîk',
      bad: 'تێرمۆدینامیک',
    },
  },
  {
    symbol: 'k_B',
    name: {
      en: 'Boltzmann Constant',
      ar: 'ثابت بولتزمان الإحصائي',
      ku: 'نەگۆڕی بۆڵتزمان',
      kmr: 'Xweciha Boltzmann',
      bad: 'نەگۆڕێ بۆڵتزمان',
    },
    value: '1.38064 × 10⁻²³',
    unit: 'J/K',
    category: {
      en: 'Thermodynamics',
      ar: 'الديناميكا الحرارية',
      ku: 'داینامیکی گەرمی',
      kmr: 'Termodînamîk',
      bad: 'تێرمۆدینامیک',
    },
  },
  {
    symbol: 'ε_0',
    name: {
      en: 'Vacuum Electric Permittivity',
      ar: 'سماحية الفراغ الكهربائية',
      ku: 'ڕێپێدانی کارەبایی بۆشایی',
      kmr: 'Têhilandina elektrîkî ya valahiyê',
      bad: 'رێپێدانا کارەبایی یا بۆشاییێ',
    },
    value: '8.85419 × 10⁻¹²',
    unit: 'F/m',
    category: {
      en: 'Electricity',
      ar: 'الكهرباء',
      ku: 'کارەبا',
      kmr: 'Elektrîk û Magnetîk',
      bad: 'کارەب و موگناتیسی',
    },
  },
  {
    symbol: 'μ_0',
    name: {
      en: 'Vacuum Magnetic Permeability',
      ar: 'النفاذية المغناطيسية للفراغ',
      ku: 'تێپەڕپێدانی موگناتیسی بۆشایی',
      kmr: 'Derbaskirina magnetîkî ya valahiyê',
      bad: 'تێپەڕپێدانا موگناتیسی یا بۆشاییێ',
    },
    value: '1.25664 × 10⁻⁶',
    unit: 'H/m',
    category: {
      en: 'Electricity',
      ar: 'الكهرباء',
      ku: 'کارەبا',
      kmr: 'Elektrîk û Magnetîk',
      bad: 'کارەب و موگناتیسی',
    },
  },
  {
    symbol: 'm_e',
    name: {
      en: 'Electron Rest Mass',
      ar: 'كتلة سكون الإلكترون',
      ku: 'بارستەی سەکۆنی ئەلیکترۆن',
      kmr: 'Senga elektrona bêliv',
      bad: 'بارستایا سەکۆن یا ئەلیکترۆنی',
    },
    value: '9.10938 × 10⁻³¹',
    unit: 'kg',
    category: {
      en: 'Quantum Physics',
      ar: 'فيزياء الكم',
      ku: 'فیزیکی کوانتەم',
      kmr: 'Fîzîka Kuantemî',
      bad: 'فیزیکا کوانتەم',
    },
  },
  {
    symbol: 'm_p',
    name: {
      en: 'Proton Rest Mass',
      ar: 'كتلة سكون البروتون',
      ku: 'بارستەی سەکۆنی پرۆتۆن',
      kmr: 'Senga protona bêliv',
      bad: 'بارستایا سەکۆن یا پرۆتۆنی',
    },
    value: '1.67262 × 10⁻²⁷',
    unit: 'kg',
    category: {
      en: 'Quantum Physics',
      ar: 'فيزياء الكم',
      ku: 'فیزیکی کوانتەم',
      kmr: 'Fîzîka Kuantemî',
      bad: 'فیزیکا کوانتەم',
    },
  },
  {
    symbol: 'σ',
    name: {
      en: 'Stefan-Boltzmann Constant',
      ar: 'ثابت ستيفان-بولتزمان الإشعاعي',
      ku: 'نەگۆڕی ستیفان-بۆڵتزمان',
      kmr: 'Xweciha Stefan-Boltzmann a tîrêjdanê',
      bad: 'نەگۆڕێ ستیفان-بۆڵتزمان یێ تیشکدانێ',
    },
    value: '5.67037 × 10⁻⁸',
    unit: 'W/(m²·K⁴)',
    category: {
      en: 'Thermodynamics',
      ar: 'الديناميكا الحرارية',
      ku: 'داینامیکی گەرمی',
      kmr: 'Termodînamîk',
      bad: 'تێرمۆدینامیک',
    },
  },
];

export const SymbolsConstantsModal: React.FC<SymbolsConstantsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, language } = useTranslation();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const currentLang = language || 'kmr';

  const filtered = CONSTANTS.filter((item) => {
    const name = item.name[currentLang] || item.name['kmr'] || item.name['ku'] || item.name['en'] || '';
    const cat = item.category[currentLang] || item.category['kmr'] || item.category['ku'] || item.category['en'] || '';
    const q = search.toLowerCase();

    return (
      item.symbol.toLowerCase().includes(q) ||
      name.toLowerCase().includes(q) ||
      cat.toLowerCase().includes(q)
    );
  });

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
            {filtered.map((c) => {
              const name = c.name[currentLang] || c.name['kmr'] || c.name['ku'] || c.name['en'];
              const cat = c.category[currentLang] || c.category['kmr'] || c.category['ku'] || c.category['en'];

              return (
                <div
                  key={c.symbol}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3 hover:border-blue-500/40 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800" dir="ltr">
                        {c.symbol}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {cat}
                      </span>
                    </div>
                    <div className="text-xs text-slate-200 font-medium">{name}</div>
                  </div>

                  <div className="text-right font-mono shrink-0" dir="ltr">
                    <div className="text-xs font-bold text-blue-400">{c.value}</div>
                    <div className="text-[10px] text-slate-400">{c.unit}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
