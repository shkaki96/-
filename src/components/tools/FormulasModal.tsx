import React, { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { X, Compass, Search } from 'lucide-react';

interface FormulasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LocalizedFormulaItem {
  id: string;
  name: Record<string, string>;
  formula: string;
  variables: Record<string, string>;
  category: Record<string, string>;
}

const FORMULAS: LocalizedFormulaItem[] = [
  // Mechanics
  {
    id: 'f1',
    name: {
      en: 'Simple Pendulum Period',
      ar: 'الزمن الدوري للبندول البسيط',
      ku: 'ماوەی خولیی پەندۆلی سادە',
      kmr: 'Dema dewranî ya pendola xwerû',
    },
    formula: 'T = 2π √(L / g)',
    variables: {
      en: 'T = Period (s), L = Length (m), g = Gravity (m/s²)',
      ar: 'T = الزمن الدوري (ث)، L = طول الخيط (م)، g = تسارع الجاذبية (م/ث²)',
      ku: 'T = کاتی خولی (چ)، L = درێژی پەت (م)، g = تاودانی کێشکردن (م/چ²)',
      kmr: 'T = Dema dewranî (s), L = Dirêjahiya werîs (m), g = Lezîna kêşana erdê (m/s²)',
    },
    category: {
      en: 'Mechanics',
      ar: 'الميكانيكا',
      ku: 'میکانیک',
      kmr: 'Mîkanîk',
    },
  },
  {
    id: 'f2',
    name: {
      en: "Hooke's Law & Spring Period",
      ar: 'قانون هوك والزمن الدوري للزنبرك',
      ku: 'یاسای هۆک و ماوەی خولیی سپرینگ',
      kmr: 'Zagona Hok û dema dewranî ya rastekê',
    },
    formula: 'F = -k x , T = 2π √(m / k)',
    variables: {
      en: 'F = Force, k = Spring constant, x = Displacement, m = Mass',
      ar: 'F = القوة المسترجعة، k = ثابت الزنبرك، x = الإزاحة، m = الكتلة',
      ku: 'F = هێز، k = نەگۆڕی سپرینگ، x = لادان، m = بارستە',
      kmr: 'F = Hêza vegerîner, k = Xweciha rastekê, x = Elongasyon / Dirêjbûn, m = Seng',
    },
    category: {
      en: 'Mechanics',
      ar: 'الميكانيكا',
      ku: 'میکانیک',
      kmr: 'Mîkanîk',
    },
  },
  {
    id: 'f3',
    name: {
      en: "Newton's Second Law",
      ar: 'قانون نيوتن الثاني للحركة',
      ku: 'یاسای دووەمی نیوتن بۆ جووڵە',
      kmr: 'Zagona duyem a Niyoton ji bo tevgerê',
    },
    formula: 'F = m · a',
    variables: {
      en: 'F = Force (N), m = Mass (kg), a = Acceleration (m/s²)',
      ar: 'F = القوة المحصلة (نيوتن)، m = الكتلة (كغ)، a = التسارع (م/ث²)',
      ku: 'F = هێز (نیوتن)، m = بارستە (کگم)، a = تاودان (م/چ²)',
      kmr: 'F = Hêza giştî (N), m = Seng (kg), a = Lezîn (m/s²)',
    },
    category: {
      en: 'Mechanics',
      ar: 'الميكانيكا',
      ku: 'میکانیک',
      kmr: 'Mîkanîk',
    },
  },
  {
    id: 'f4',
    name: {
      en: 'Kinetic & Potential Energy',
      ar: 'الطاقة الحركية وطاقة الوضع الكامنة',
      ku: 'وزەی جووڵە و وزەی شاراوە',
      kmr: 'Enerjiya tevgerî û enerjiya embarkirî',
    },
    formula: 'E_k = ½ m v² , E_p = m g h',
    variables: {
      en: 'E_k = Kinetic Energy (J), E_p = Potential Energy (J), v = Velocity',
      ar: 'E_k = الطاقة الحركية (جول)، E_p = طاقة الوضع (جول)، v = السرعة المتجهة',
      ku: 'E_k = وزەی جووڵە (ژوول)، E_p = وزەی شاراوە (ژوول)، v = خێرایی',
      kmr: 'E_k = Enerjiya tevgerî (J), E_p = Enerjiya embarkirî (J), v = Lez',
    },
    category: {
      en: 'Mechanics',
      ar: 'الميكانيكا',
      ku: 'میکانیک',
      kmr: 'Mîkanîk',
    },
  },
  {
    id: 'f5',
    name: {
      en: 'Centripetal Force',
      ar: 'القوة المركزية الجاذبة',
      ku: 'هێزی ناوەندە ڕاکێش',
      kmr: 'Hêza navendger',
    },
    formula: 'F_c = m v² / r',
    variables: {
      en: 'F_c = Centripetal Force (N), v = Tangential Speed, r = Radius',
      ar: 'F_c = القوة المركزية (نيوتن)، v = السرعة المماسية، r = نصف القطر',
      ku: 'F_c = هێزی ناوەندە ڕاکێش (نیوتن)، v = خێرایی لێوارە، r = نیوەتیرە',
      kmr: 'F_c = Hêza navendger (N), v = Leza tîrikî, r = Nîvqutir',
    },
    category: {
      en: 'Mechanics',
      ar: 'الميكانيكا',
      ku: 'میکانیک',
      kmr: 'Mîkanîk',
    },
  },

  // Electricity
  {
    id: 'f6',
    name: {
      en: "Ohm's Law",
      ar: 'قانون أوم للمقاومة الكهربائية',
      ku: 'یاسای ئۆم بۆ بەرگری کارەبایی',
      kmr: 'Zagona Ohm ji bo bergiriya elektrîkê',
    },
    formula: 'V = I · R',
    variables: {
      en: 'V = Voltage (V), I = Current (A), R = Resistance (Ω)',
      ar: 'V = فرق الجهد (فولت)، I = شدة التيار (أمبير)، R = المقاومة (أوم)',
      ku: 'V = جیاوازی پۆتانسێل (ڤۆڵت)، I = تەزووی کارەبا (ئەمپێر)، R = بەرگری (ئۆم)',
      kmr: 'V = Voltaja elektrîkî (V), I = Tewjîna elektrîkî (A), R = Bergirî (Ω)',
    },
    category: {
      en: 'Electricity',
      ar: 'الكهرباء والمغناطيسية',
      ku: 'کارەبا و موگناتیس',
      kmr: 'Elektrîk û Magnetîk',
    },
  },
  {
    id: 'f7',
    name: {
      en: "Coulomb's Law",
      ar: 'قانون كولوم للقوى الكهروستاتيكية',
      ku: 'یاسای کوڵۆم بۆ هێزی کارۆڕاکێشان',
      kmr: 'Zagona Coulomb ji bo hêzên elektrostasîkî',
    },
    formula: 'F = k_e (q₁ q₂ / r²)',
    variables: {
      en: 'F = Electrostatic Force, q₁,q₂ = Charges (C), r = Distance (m)',
      ar: 'F = القوة الكهربائية (نيوتن)، q = الشحنة الكهربائية (كولوم)، r = المسافة (م)',
      ku: 'F = هێزی کارەبایی (نیوتن)، q = بارگەی کارەبایی (کوڵۆم)، r = دووری (م)',
      kmr: 'F = Hêza elektrîkî (N), q = Bara elektrîkî (C), r = Dûrî (m)',
    },
    category: {
      en: 'Electricity',
      ar: 'الكهرباء والمغناطيسية',
      ku: 'کارەبا و موگناتیس',
      kmr: 'Elektrîk û Magnetîk',
    },
  },
  {
    id: 'f8',
    name: {
      en: 'Electrical Power',
      ar: 'القدرة الكهربائية المستهلكة',
      ku: 'توانای کارەبایی',
      kmr: 'Hêza elektrîkî (Twan)',
    },
    formula: 'P = V · I = I² R = V² / R',
    variables: {
      en: 'P = Power (W), V = Voltage (V), I = Current (A)',
      ar: 'P = القدرة (واط)، V = الجهد (فولت)، I = شدة التيار (أمبير)',
      ku: 'P = توانا (وات)، V = ڤۆڵتیە (ڤۆڵت)، I = تەزوو (ئەمپێر)',
      kmr: 'P = Hêza elektrîkî (W), V = Voltaja elektrîkî (V), I = Tewjîn (A)',
    },
    category: {
      en: 'Electricity',
      ar: 'الكهرباء والمغناطيسية',
      ku: 'کارەبا و موگناتیس',
      kmr: 'Elektrîk û Magnetîk',
    },
  },

  // Waves
  {
    id: 'f9',
    name: {
      en: 'Wave Speed Equation',
      ar: 'معادلة انتشار سرعة الموجة',
      ku: 'هاوکێشەی خێرایی شەپۆل',
      kmr: 'Hevkêşeya leza pêlê',
    },
    formula: 'v = f · λ',
    variables: {
      en: 'v = Wave Speed (m/s), f = Frequency (Hz), λ = Wavelength (m)',
      ar: 'v = سرعة الموجة (م/ث)، f = التردد (هرتز)، λ = الطول الموجي (م)',
      ku: 'v = خێرایی شەپۆل (م/چ)، f = فریکوێنسی (هێرتز)، λ = درێژی شەپۆل (م)',
      kmr: 'v = Leza pêlê (m/s), f = Pêldan / Frekans (Hz), λ = Dirêjahiya pêlê (m)',
    },
    category: {
      en: 'Waves',
      ar: 'الأمواج والصوت',
      ku: 'شەپۆل و دەنگ',
      kmr: 'Pêl û Deng',
    },
  },
  {
    id: 'f10',
    name: {
      en: 'Doppler Effect Frequency',
      ar: 'تأثير دوبلر في التردد المسموع',
      ku: 'کاریگەری دۆپلەر لە فریکوێنسی دەنگدا',
      kmr: 'Bandora Dopler di frekansa bihîstî de',
    },
    formula: 'f_obs = f_src (v ± v_obs) / (v ∓ v_src)',
    variables: {
      en: 'f = Frequency, v = Speed of sound, v_obs = Observer velocity',
      ar: 'f = التردد المقاس، v = سرعة الصوت، v_obs = سرعة المراقب',
      ku: 'f = فریکوێنسی بینراو، v = خێرایی دەنگ، v_obs = خێرایی بینەر',
      kmr: 'f = Frekansa bihîstî, v = Leza deng, v_obs = Leza bihîser',
    },
    category: {
      en: 'Waves',
      ar: 'الأمواج والصوت',
      ku: 'شەپۆل و دەنگ',
      kmr: 'Pêl û Deng',
    },
  },

  // Thermodynamics
  {
    id: 'f11',
    name: {
      en: 'Ideal Gas Law',
      ar: 'معادلة الحالة للغاز المثالي',
      ku: 'هاوکێشەی باری گازی نموونەیی',
      kmr: 'Hevkêşeya rewşa gaza nimûneyî',
    },
    formula: 'P V = n R T',
    variables: {
      en: 'P = Pressure, V = Volume, n = Moles, R = Gas constant, T = Temp (K)',
      ar: 'P = الضغط (باسكال)، V = الحجم (م³)، n = عدد المولات، T = درجة الحرارة المطلقة (كلفن)',
      ku: 'P = پەستان (پاسکاڵ)، V = قەبارە (م³)، n = ژمارەی مۆڵەکان، T = پلەی گەرمی ڕەها (کەلڤن)',
      kmr: 'P = Dewisîn / Pestan (Pa), V = Qebare (m³), n = Hejmara molan, T = Pileya germahiyê (K)',
    },
    category: {
      en: 'Thermodynamics',
      ar: 'الديناميكا الحرارية',
      ku: 'داینامیکی گەرمی',
      kmr: 'Termodînamîk',
    },
  },
  {
    id: 'f12',
    name: {
      en: 'Heat Transfer Equation',
      ar: 'معادلة التبادل والكمية الحرارية',
      ku: 'هاوکێشەی گواستنەوەی گەرمی',
      kmr: 'Hevkêşeya guhestina germiyê',
    },
    formula: 'Q = m c ΔT',
    variables: {
      en: 'Q = Heat energy (J), m = Mass, c = Specific heat, ΔT = Temp diff',
      ar: 'Q = الطاقة الحرارية المكتسبة (جول)، m = الكتلة، c = الحرارة النوعية، ΔT = فرق درجات الحرارة',
      ku: 'Q = وزەی گەرمی (ژوول)، m = بارستە، c = گەرمی جۆری، ΔT = گۆڕانی پلەی گەرمی',
      kmr: 'Q = Enerjiya germiyê (J), m = Seng, c = Germiya taybet, ΔT = Guherîna germiyê',
    },
    category: {
      en: 'Thermodynamics',
      ar: 'الديناميكا الحرارية',
      ku: 'داینامیکی گەرمی',
      kmr: 'Termodînamîk',
    },
  },

  // Optics
  {
    id: 'f13',
    name: {
      en: "Snell's Law of Refraction",
      ar: 'قانون سنيل في انكسار الضوء',
      ku: 'یاسای سنێڵ بۆ شکانی ڕووناکی',
      kmr: 'Zagona Snell ji bo şikestina şewqê',
    },
    formula: 'n₁ sin(θ₁) = n₂ sin(θ₂)',
    variables: {
      en: 'n = Refractive Index, θ = Angle of Incidence/Refraction',
      ar: 'n = معامل الانكسار، θ = زاوية السقوط أو الانكسار',
      ku: 'n = هاوکۆلکەی شکان، θ = گۆشەی کەوتن یان شکان',
      kmr: 'n = Nîşandera şikestinê, θ = Goşeya ketinê an şikestinê',
    },
    category: {
      en: 'Optics',
      ar: 'البصريات والضوء',
      ku: 'ڕووناکیزانی و بینین',
      kmr: 'Şewq û Optîk',
    },
  },
  {
    id: 'f14',
    name: {
      en: 'Thin Lens Equation',
      ar: 'معادلة العدسات الرقيقة والمرايا',
      ku: 'هاوکێشەی هاوێنە تەنکەکان',
      kmr: 'Hevkêşeya rûyên şikêner ên tenik (Lens)',
    },
    formula: '1/f = 1/d_o + 1/d_i',
    variables: {
      en: 'f = Focal length, d_o = Object distance, d_i = Image distance',
      ar: 'f = البعد البؤري، d_o = بعد الجسم، d_i = بعد الصورة المتكونة',
      ku: 'f = دووری تیشکۆیی، d_o = دووری تەسم، d_i = دووری وێنە',
      kmr: 'f = Dûriya tîrêjgehê, d_o = Dûriya cismê, d_i = Dûriya sûretê',
    },
    category: {
      en: 'Optics',
      ar: 'البصريات والضوء',
      ku: 'ڕووناکیزانی و بینین',
      kmr: 'Şewq û Optîk',
    },
  },

  // Modern Physics
  {
    id: 'f15',
    name: {
      en: 'Mass-Energy Equivalence',
      ar: 'تكافؤ الكتلة والطاقة لأينشتاين',
      ku: 'هاوتایی بارستە و وزە (ئاینشتاین)',
      kmr: 'Hevkêşeya wekheviya seng û enerjiyê (Einstein)',
    },
    formula: 'E = m c²',
    variables: {
      en: 'E = Energy (J), m = Mass (kg), c = Speed of light',
      ar: 'E = الطاقة المكافئة (جول)، m = الكتلة المتحولة (كغ)، c = سرعة الضوء (م/ث)',
      ku: 'E = وزە (ژوول)، m = بارستە (کگم)، c = خێرایی ڕووناکی',
      kmr: 'E = Enerjî (J), m = Seng (kg), c = Leza şewqê di valahiyê de (m/s)',
    },
    category: {
      en: 'Modern Physics',
      ar: 'الفيزياء الحديثة والنووية',
      ku: 'فیزیکی نوێ و ئەتۆمی',
      kmr: 'Fîzîka Nûjen û Nûklerî',
    },
  },
  {
    id: 'f16',
    name: {
      en: 'Photoelectric Effect',
      ar: 'معادلة الظاهرة الكهروضوئية',
      ku: 'دیاردەی کارۆڕووناکی',
      kmr: 'Bandora fotoelektrîkî',
    },
    formula: 'E_{photon} = h f = Φ + K_{max}',
    variables: {
      en: 'h = Planck constant, f = Frequency, Φ = Work function',
      ar: 'h = ثابت بلانك، f = تردد الفوتون الساقط، Φ = دالة الشغل لسطح المعدن',
      ku: 'h = نەگۆڕی پلانک، f = فریکوێنسی فۆتۆن، Φ = نەخشەی ئیش',
      kmr: 'h = Xweciha Plank, f = Frekansa fotonê, Φ = Fonksiyona kar',
    },
    category: {
      en: 'Modern Physics',
      ar: 'الفيزياء الحديثة والنووية',
      ku: 'فیزیکی نوێ و ئەتۆمی',
      kmr: 'Fîzîka Nûjen û Nûklerî',
    },
  },
];

export const FormulasModal: React.FC<FormulasModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useTranslation();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const currentLang = language || 'kmr';

  const filtered = FORMULAS.filter((item) => {
    const name = item.name[currentLang] || item.name['kmr'] || item.name['ku'] || item.name['en'] || '';
    const cat = item.category[currentLang] || item.category['kmr'] || item.category['ku'] || item.category['en'] || '';
    const vars = item.variables[currentLang] || item.variables['kmr'] || item.variables['ku'] || item.variables['en'] || '';
    const q = search.toLowerCase();

    return (
      name.toLowerCase().includes(q) ||
      item.formula.toLowerCase().includes(q) ||
      cat.toLowerCase().includes(q) ||
      vars.toLowerCase().includes(q)
    );
  });

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
          {filtered.map((item) => {
            const name = item.name[currentLang] || item.name['kmr'] || item.name['ku'] || item.name['en'];
            const cat = item.category[currentLang] || item.category['kmr'] || item.category['ku'] || item.category['en'];
            const vars = item.variables[currentLang] || item.variables['kmr'] || item.variables['ku'] || item.variables['en'];

            return (
              <div
                key={item.id}
                className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 hover:border-rose-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">{name}</span>
                  <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    {cat}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-sm sm:text-base font-bold text-cyan-400 text-center" dir="ltr">
                  {item.formula}
                </div>
                <div className="text-[11px] text-slate-400">{vars}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
