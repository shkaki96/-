import React, { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { X, Compass, Search } from 'lucide-react';

interface FormulasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormulaItem {
  id: string;
  name: string;
  formula: string;
  variables: string;
  category: string;
}

const FORMULAS: FormulaItem[] = [
  // Mechanics
  { id: 'f1', name: 'Simple Pendulum Period', formula: 'T = 2π √(L / g)', variables: 'T = Period (s), L = Length (m), g = Gravity (m/s²)', category: 'Mechanics' },
  { id: 'f2', name: "Hooke's Law & Spring Period", formula: 'F = -k x , T = 2π √(m / k)', variables: 'F = Force, k = Spring constant, x = Displacement, m = Mass', category: 'Mechanics' },
  { id: 'f3', name: "Newton's Second Law", formula: 'F = m · a', variables: 'F = Force (N), m = Mass (kg), a = Acceleration (m/s²)', category: 'Mechanics' },
  { id: 'f4', name: 'Kinetic & Potential Energy', formula: 'E_k = ½ m v² , E_p = m g h', variables: 'E_k = Kinetic Energy (J), E_p = Potential Energy (J), v = Velocity', category: 'Mechanics' },
  { id: 'f5', name: 'Centripetal Force', formula: 'F_c = m v² / r', variables: 'F_c = Centripetal Force (N), v = Tangential Speed, r = Radius', category: 'Mechanics' },

  // Electricity
  { id: 'f6', name: "Ohm's Law", formula: 'V = I · R', variables: 'V = Voltage (V), I = Current (A), R = Resistance (Ω)', category: 'Electricity' },
  { id: 'f7', name: "Coulomb's Law", formula: 'F = k_e (q₁ q₂ / r²)', variables: 'F = Electrostatic Force, q₁,q₂ = Charges (C), r = Distance (m)', category: 'Electricity' },
  { id: 'f8', name: 'Electrical Power', formula: 'P = V · I = I² R = V² / R', variables: 'P = Power (W), V = Voltage (V), I = Current (A)', category: 'Electricity' },

  // Waves
  { id: 'f9', name: 'Wave Speed Equation', formula: 'v = f · λ', variables: 'v = Wave Speed (m/s), f = Frequency (Hz), λ = Wavelength (m)', category: 'Waves' },
  { id: 'f10', name: 'Doppler Effect Frequency', formula: 'f_obs = f_src (v ± v_obs) / (v ∓ v_src)', variables: 'f = Frequency, v = Speed of sound, v_obs = Observer velocity', category: 'Waves' },

  // Thermodynamics
  { id: 'f11', name: 'Ideal Gas Law', formula: 'P V = n R T', variables: 'P = Pressure, V = Volume, n = Moles, R = Gas constant, T = Temp (K)', category: 'Thermodynamics' },
  { id: 'f12', name: 'Heat Transfer Equation', formula: 'Q = m c ΔT', variables: 'Q = Heat energy (J), m = Mass, c = Specific heat, ΔT = Temp diff', category: 'Thermodynamics' },

  // Optics
  { id: 'f13', name: "Snell's Law of Refraction", formula: 'n₁ sin(θ₁) = n₂ sin(θ₂)', variables: 'n = Refractive Index, θ = Angle of Incidence/Refraction', category: 'Optics' },
  { id: 'f14', name: 'Thin Lens Equation', formula: '1/f = 1/d_o + 1/d_i', variables: 'f = Focal length, d_o = Object distance, d_i = Image distance', category: 'Optics' },

  // Modern Physics
  { id: 'f15', name: 'Mass-Energy Equivalence', formula: 'E = m c²', variables: 'E = Energy (J), m = Mass (kg), c = Speed of light', category: 'Modern Physics' },
  { id: 'f16', name: 'Photoelectric Effect', formula: 'E_{photon} = h f = Φ + K_{max}', variables: 'h = Planck constant, f = Frequency, Φ = Work function', category: 'Modern Physics' },
];

export const FormulasModal: React.FC<FormulasModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = FORMULAS.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.formula.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-slate-100">{t('tools.formulasTitle')}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 bg-slate-900 border-b border-slate-800">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('tools.searchFormulas')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 min-h-[44px]"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-950/50">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 hover:border-rose-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">{item.name}</span>
                <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  {item.category}
                </span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-sm sm:text-base font-bold text-cyan-400 text-center">
                {item.formula}
              </div>
              <div className="text-[11px] text-slate-400">{item.variables}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
