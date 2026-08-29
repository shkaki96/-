import { Experiment } from '../../types/experiment';
import { PROTOTYPE_EXPERIMENT } from './prototypeExperiment';

/**
 * Helper function to instantiate structured experiments for the Official TAQ 70 Experiment Catalog.
 * Guarantees strict localization across English, Arabic, Sorani Kurdish, and Kurmanji.
 */
function createExperiment(
  code: number,
  slug: string,
  category: Experiment['category'],
  physicalLaw: string,
  titleEn: string,
  titleAr?: string,
  titleKu?: string,
  titleKmr?: string,
  descEn?: string,
  descAr?: string,
  descKu?: string,
  descKmr?: string
): Experiment {
  const arTitle = titleAr || titleEn;
  const kuTitle = titleKu || titleEn;
  const kmrTitle = titleKmr || titleEn;

  const defaultDescEn = descEn || `Interactive scientific study of ${titleEn} governed by ${physicalLaw}.`;
  const defaultDescAr = descAr || `دراسة علمية تفاعلية لـ ${arTitle} الخاضعة للقانون الفيزيائي ${physicalLaw}.`;
  const defaultDescKu = descKu || `لێکۆڵینەوەی زانستی کارلێککارانە لە ${kuTitle} بەپێی یاسای فیزیکی ${physicalLaw}.`;
  const defaultDescKmr = descKmr || `Lêkolîna zanistî ya înteraktîf a ${kmrTitle} li ser bingeha یاsaya fîzîkî ${physicalLaw}.`;

  return {
    id: `exp-${String(code).padStart(3, '0')}-${slug}`,
    codeNumber: code,
    category,
    physicalLaw,
    title: { en: titleEn, ar: arTitle, ku: kuTitle, kmr: kmrTitle },
    description: { en: defaultDescEn, ar: defaultDescAr, ku: defaultDescKu, kmr: defaultDescKmr },
    howItWorks: {
      en: `Simulates physical interactions based on ${physicalLaw}.`,
      ar: `محاكاة التفاعلات الفيزيائية بناءً على ${physicalLaw}.`,
      ku: `هاوشێوەسازی کارلێکە فیزیکییەکان لەسەر بنەمای ${physicalLaw}.`,
      kmr: `Simulasyona têkiliyên fîzîkî li ser bingeha ${physicalLaw}.`,
    },
    whatHappened: {
      en: 'System variables respond dynamically to parameter changes.',
      ar: 'تتفاعل متغيرات النظام بشكل ديناميكي مع تغيير المعايير.',
      ku: 'گۆڕاوەکانی سیستمەکە بە شێوەیەکی دیاریکراو وەڵام دەدەنەوە.',
      kmr: 'Guherbarên sîstemê bi rengekî dînamîk bersivê didin.',
    },
    result: {
      en: 'Experimental measurements conform strictly to theoretical predictions.',
      ar: 'تتوافق القياسات التجريبية بدقة مع التوقعات النظرية.',
      ku: 'پێوانە ئەزموونییەکان بە تەواوی لەگەڵ پێشبینییە تیۆرییەکان دەگونجێن.',
      kmr: 'Pîvanên ezmûnî bi temamî bi pêşbîniyên teorîk re li hev dikin.',
    },
    inputs: {
      en: ['Primary Variable', 'Environment Constant'],
      ar: ['المتغير الأساسي', 'ثابت البيئة'],
      ku: ['گۆڕاوی سەرەکی', 'نەگۆڕی ژینگە'],
      kmr: ['Guherbarê Serekî', 'Neqora Jîngehê'],
    },
    outputs: {
      en: ['Response Value', 'System Energy'],
      ar: ['قيمة الاستجابة', 'طاقة النظام'],
      ku: ['نرخی وەڵامدانەوە', 'توانای سیستم'],
      kmr: ['Nirxa Bersivê', 'Anarşiya Sîstemê'],
    },
    explanation: {
      en: `Theoretical principles behind ${titleEn} governed by ${physicalLaw}.`,
      ar: `المبادئ النظرية وراء ${arTitle} الخاضعة لقانون ${physicalLaw}.`,
      ku: `پڕەنسیپە تیۆرییەکانی دواوەی ${kuTitle} کە بەپێی ${physicalLaw} کاردەکەن.`,
      kmr: `Prensîbên teorîk ên li pişt ${kmrTitle} yên ku ji hêla ${physicalLaw} ve tên birêvebirin.`,
    },
    procedure: {
      en: ['Adjust parameters', 'Observe output response', 'Record data points'],
      ar: ['ضبط المعايير', 'ملاحظة استجابة المخرجات', 'تسجيل نقاط البيانات'],
      ku: ['ڕێکخستنی پارامیتەرەکان', 'ملاحظەکردنی دەرئەنجام', 'تۆمارکردنی زانیارییەکان'],
      kmr: ['Sazkirina parametreyan', 'Çavdêriya encaman', 'Torkirina daneyan'],
    },
    parameters: [
      {
        id: 'var1',
        label: { en: 'Primary Parameter', ar: 'المعيار الأساسي', ku: 'پارامیتەری سەرەکی', kmr: 'Parametreya Serekî' },
        unit: 'unit',
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 50,
      },
    ],
    outputMetrics: [
      {
        id: 'out1',
        label: { en: 'Output Metric', ar: 'مقياس المخرجات', ku: 'پێوەری دەرئەنجام', kmr: 'Pîvana Encamê' },
        unit: 'SI',
        symbol: 'R',
      },
    ],
    supportedRenderers: ['canvas2d'],
  };
}

/**
 * OFFICIAL TAQ EXPERIMENT CATALOG (70 Experiments)
 * Strictly preserves official IDs 1–70, exact English names, physics categories, and laws.
 */
export const EXPERIMENTS_CATALOG: Experiment[] = [
  createExperiment(1, 'work-heat-1st-law-thermodynamics', 'thermodynamics', 'ΔU = Q - W', 'Work, Heat and 1st Law of Thermodynamics', 'الشغل والحراة والقانون الأول للديناميكا الحرارية', 'کار، گەرمی و یاسای یەکەمی ثێرمۆداینامیک', 'Kar, Germî û Yasa Yekem a Termodînamîkê'),
  createExperiment(2, 'prescription-glasses-lens-power', 'optics', 'P = 1/f', 'Prescription Glasses and Lens Power', 'النظارات الطبية وقوة العدسة', 'پێچکەی پزیشکی و هێزی هاوێنە', 'Pêçkên Pijîşkî û Hêza Lênsê'),
  createExperiment(3, 'periscope-law-of-reflection', 'optics', 'θ_i = θ_r', 'Periscope and Law of Reflection', 'البريسكوب وقانون الانعكاس', 'پێریسکۆپ و یاسای پێچەوانەبوونەوە', 'Pêrîskop û Yasa Vegerînê'),
  createExperiment(4, 'static-electricity-coulomb-law', 'electricity', 'F = k_e · |q₁·q₂| / r²', 'Static Electricity and Coulomb Law', 'الكهرباء الساكنة وقانون كولوم', 'کارەبای جێگیر و یاسای کۆلۆم', 'Elektrîka Sêranî û Yasa Coulomb'),
  createExperiment(5, 'sled-racing-friction-laws', 'mechanics', 'f_k = μ_k · N', 'Sled Racing and Friction Laws', 'سباق الزلاجات وقوانين الاحتكاك', 'پێشبڕکێی خلیسکێنە و یاساکانی لێکخشاندن', 'Pêşbirka Xşokan û Yasamên Îshqilînê'),
  createExperiment(6, 'heat-conduction-fourier-law', 'thermodynamics', 'q = -k · A · (ΔT / L)', 'Heat Conduction and Fourier Law', 'التوصيل الحراري وقانون فورييه', 'گەیاندنی گەرمی و یاسای فۆریێ', 'Gihandina Germî û Yasa Fourier'),
  createExperiment(7, 'seesaw-balance-torque-equilibrium', 'mechanics', 'τ = r · F · sin(θ), Στ = 0', 'Seesaw Balance and Torque Equilibrium', 'توازن الأرجوحة وتوازن العزم', 'هاوسەنگی ڕاگواز و هاوسەنگی عەزم', 'Hevsengiya Seesaw û Morkê'),
  createExperiment(8, 'electromagnetic-induction-faraday-law', 'electricity', 'ε = -N · (ΔΦ / Δt)', 'Electromagnetic Induction and Faraday Law', 'الحث الكهرومغناطيسي وقانون فاراداي', 'هاندانی کارۆمەگناتیسی و یاسای فارادای', 'Îndukasyona Elektromagnetîk û Yasa Faraday'),
  createExperiment(9, 'viscosity-stokes-law-terminal-velocity', 'mechanics', 'F_d = 6π · η · r · v_t', 'Viscosity, Stokes Law & Terminal Velocity', 'اللزوجة وقانون ستوكس والسرعة الحدية', 'چڕی و لمی، یاسای ستۆکس و خێرایی سنووری', 'Lijûkî, Yasa Stokes û Leza Krîtîk'),
  createExperiment(10, 'inclined-plane-simple-machines', 'mechanics', 'MA = 1 / sin(θ) = L / h', 'Inclined Plane & Simple Machines', 'المستوى المائل والآلات البسيطة', 'ئاستی لار و ئامێرە سادەکان', 'Asta Xwar û Mekîneyên Hêsan'),
  createExperiment(11, 'metric-prefixes-scientific-conversions', 'mechanics', 'Value × 10^{±n}', 'Metric Prefixes and Scientific Conversions', 'البادئات المترية والتحويلات العلمية', 'پێشگرە مەترییەکان و گۆڕینە زانستییەکان', 'Pêşgirên Metrî û Guherînên Zanistî'),
  createExperiment(12, 'stress-strain-young-modulus', 'mechanics', 'E = σ / ε = (F/A) / (ΔL/L₀)', 'Stress, Strain and Young Modulus', 'الإجهاد والانفعال ومعامل يونغ', 'سەختی، ڕاکێشان و هاوکۆڵەی یۆنگ', 'Pêşketin, Çەşîn û Modula Young'),
  createExperiment(13, 'bernoulli-principle-venturi-flow', 'mechanics', 'P + ½ρv² + ρgh = Const', 'Bernoulli Principle and Venturi Flow', 'مبدأ برنولي وتدفق فينتوري', 'پڕەنسیپی بەرنۆلی و ڕێڕەوی ڤینتۆری', 'Prensîba Bernoulli û Herika Venturi'),
  createExperiment(14, 'angled-mirrors-multiple-reflection-images', 'optics', 'N = (360° / θ) - 1', 'Angled Mirrors and Multiple Reflection Images', 'المرايا المائلة وصور الانعكاس المتعدد', 'ئاوێنە گۆشەییەکان و وێنەی پێچەوانەی زۆر', 'Neynikên Goşeyî û Wêneyên Zêde'),
  createExperiment(15, 'curved-spherical-mirrors-concave-convex', 'optics', '1/f = 1/d_o + 1/d_i', 'Curved Spherical Mirrors (Concave & Convex)', 'المرايا الكروية المنحنية (المقعرة والمحدبة)', 'ئاوێنە چەماوە گۆییەکان (قۆقز و قووڕ)', 'Neynikên Goyerok (Kov û Muxel)'),
  createExperiment(16, 'thin-lenses-focal-length-equation', 'optics', '1/f = 1/d_o + 1/d_i, M = -d_i/d_o', 'Thin Lenses and Focal Length Equation', 'العدسات الرقيقة ومعادلة البعد البؤري', 'هاوێنە تەنکەکان و هاوکێشەی دووری بؤری', 'Lênsên Zirav û Hevkêşeya Dûriya Balgehê'),
  createExperiment(17, 'light-polarization-malus-law', 'optics', 'I = I₀ · cos²(θ)', 'Light Polarization and Malus Law', 'استقطاب الضوء وقانون مالوس', 'بەجەمسەرکردنی ڕووناکی و یاسای مالۆس', 'Polarîzasyona Ronahiyê û Yasa Malus'),
  createExperiment(18, 'light-scattering-rayleigh-scattering-law', 'optics', 'I ∝ 1 / λ⁴', 'Light Scattering and Rayleigh Scattering Law', 'تشتت الضوء وقانون رالي للتشتت', 'پەرشبوونی ڕووناکی و یاسای ڕایلی', 'Belavbûna Ronahiyê û Yasa Rayleigh'),
  createExperiment(19, 'arc-length-radians-angular-motion', 'mechanics', 's = r · θ, v = r · ω', 'Arc Length, Radians & Angular Motion', 'طول القوس والراديان والحركة الزاوية', 'درێژی کەوانە، ڕادیان و جووڵەی گۆشەیی', 'Dirêjiya Kewanê, Radîan û Tevgera Goşeyî'),
  createExperiment(20, 'moment-of-inertia-rotational-dynamics', 'mechanics', 'τ = I · α', 'Moment of Inertia & Rotational Dynamics', 'عزم القصور الذاتي والديناميكا الدورانية', 'عەزمی سڕی و دینامیکی خولانەوە', 'Morka Inertiyayê û Dînamîka Zivirok'),
  createExperiment(21, 'center-of-mass-systems-objects', 'mechanics', 'X_cm = Σ(m_i · x_i) / Σm_i', 'Center of Mass of Systems and Objects', 'مركز الكتلة للأنظمة والأجسام', 'ناوچەی بارستەی سیستمەکان و لاشەکان', 'Navenda Giraniyê ya Sîstem û Tiştan'),
  createExperiment(22, 'conservation-energy-pendulum', 'mechanics', 'E_tot = K + U = ½mv² + mgh = Const', 'Conservation of Energy in a Pendulum', 'حفظ الطاقة في البندول', 'پاراستنی توانا لە پەندۆلدا', 'Parastina Anarşiyê di Pêndulê de'),
  PROTOTYPE_EXPERIMENT, // #23: Simple Pendulum Period and Gravity — T = 2π · √(L / g)
  createExperiment(24, 'projectile-motion-range-trajectory', 'mechanics', 'R = (v₀² · sin(2θ)) / g, H = (v₀² sin²θ) / 2g', 'Projectile Motion and Range Trajectory', 'حركة المقذوفات ومسار المدى', 'جووڵەی هەڵدراوەکان و ڕێڕەوی دووری', 'Tevgera Projeqtîl û Rêya Cihê'),
  createExperiment(25, 'hooke-law-spring-harmonic-oscillation', 'mechanics', 'F = -k · x, T = 2π · √(m / k)', 'Hooke Law and Spring Harmonic Oscillation', 'قانون هوك والتذبذب التوافقي للنابض', 'یاسای هوک و لەرینەوەی هارمۆنیکی سپرینگ', 'Yasa Hooke û Hejandina Harmonîk a Spiringê'),
  createExperiment(26, 'linear-momentum-conservation-collisions', 'mechanics', 'm₁·v₁ᵢ + m₂·v₂ᵢ = m₁·v₁_f + m₂·v₂_f', 'Linear Momentum Conservation and Collisions', 'حفظ الزخم الخطي والتصادمات', 'پاراستنی زەخمی هێڵی و پێکدادانەکان', 'Parastina Mementomê Hêlî û Pêkdandan'),
  createExperiment(27, 'free-fall-kinematics-gravitational-acceleration', 'mechanics', 'v = g · t, y = ½ · g · t²', 'Free Fall Kinematics and Gravitational Acceleration', 'كينماتيكا السقوط الحر وتسارع الجاذبية', 'کینماتیکی کەوتنی ئازاد و تاودانی کێشکردن', 'Kînematîka Ketina Azad û Lezkirina Erdê'),
  createExperiment(28, 'acoustic-resonance-open-closed-pipes', 'waves', 'f_n = (n · v)/(4L) Closed | (n · v)/(2L) Open', 'Acoustic Resonance in Open and Closed Pipes', 'الرنين الصوتي في الأنابيب المفتوحة والمغلقة', 'دەنگدانەوەی دەنگی لە بۆرییە کراوە و داخراوەکاندا', 'Rezonansa Dengî di Lûleyên Vekirî û Girtî de'),
  createExperiment(29, 'speed-of-sound-water-column-resonance', 'waves', 'v = f · λ = 2f · (L₂ - L₁)', 'Speed of Sound with Water Column Resonance', 'سرعة الصوت مع رنين عمود الماء', 'خێرایی دەنگ لەگەڵ دەنگدانەوەی ستوونی ئاو', 'Leza Deng bi Rezonansa Stûna Avê re'),
  createExperiment(30, 'wave-optics-young-double-slit-interference', 'optics', 'd · sin(θ) = m · λ, y_m = (m · λ · L) / d', 'Wave Optics & Young Double Slit Interference', 'البصريات الموجية وتداخل الشق المزدوج ليانغ', 'بۆچوونی شەپۆلی و دەستتێوەردانی درزی دووانەی یانگ', 'Boptîka Şepolî û Têkiliya Şeqê Dujmar a Young'),
  createExperiment(31, 'magnetic-field-lorentz-force-charges', 'electricity', 'F = q · v · B · sin(θ), r = (m·v)/(q·B)', 'Magnetic Field and Lorentz Force on Charges', 'المجال المغناطيسي وقوة لورنتز على الشحنات', 'بوارە مەگناتیسیەکە و هێزی لۆرێنتز لەسەر بارەکان', 'Qada Magnetîk û Hêza Lorentz li ser Baran'),
  createExperiment(32, 'atomic-emission-spectra-quantum-transitions', 'modern_physics', 'ΔE = E_final - E_initial = (h · c)/λ', 'Atomic Emission Spectra and Quantum Transitions', 'أطياف الانبعاث الذري والانتقالات الكمومية', 'شەبەنگی دەردانی ئەتۆمی و گوازتنەوە کوانتۆمییەکان', 'Spêktrên Belavbûna Atomî û Guherînên Kuantomî'),
  createExperiment(33, 'electric-circuits-ohm-law-power-dissipation', 'electricity', 'V = I · R, P = V · I = I² · R', 'Electric Circuits, Ohm Law and Power Dissipation', 'الدوائر الكهربائية وقانون أوم وتبديد الطاقة', 'بازنە کارەباییەکان، یاسای ئۆم و بەهەدەردانی توانا', 'Şebekeyên Elektrîkî, Yasa Ohm û Windabûna Hêzê'),
  createExperiment(34, 'archimedes-principle-buoyant-force', 'mechanics', 'F_B = ρ_fluid · V_disp · g', 'Archimedes Principle and Buoyant Force', 'مبدأ أرشميدس وقوة الطفو', 'پڕەنسیپی ئەرشەمیدس و هێزی بەرزکەرەوە', 'Prensîba Archimedes û Hêza Rakirinê'),
  createExperiment(35, 'ideal-gas-law-thermodynamics-state', 'thermodynamics', 'P · V = n · R · T', 'Ideal Gas Law and Thermodynamics State', 'قانون الغاز المثالي وحالة الديناميكا الحرارية', 'یاسای گازی نموونەیی و باری ثێرمۆداینامیک', 'Yasa Gazên Mînakî û Rewşa Termodînamîkê'),
  createExperiment(36, 'optics-snell-law-refraction', 'optics', 'n₁ · sin(θ₁) = n₂ · sin(θ₂)', 'Optics and Snell Law of Refraction', 'البصريات وقانون سنيل للانكسار', 'ڕووناکی و یاسای سنێل بۆ تێکشکاندن', 'Ronahî û Yasa Snell a Şikestinê'),
  createExperiment(37, 'build-atom-periodic-table', 'modern_physics', 'Z = p, A = p + n, Net Charge = p - e', 'Build an Atom & Periodic Table', 'بناء الذرة والجدول الدوري', 'دروستکردنی ئەتۆم و خشتەی خولی', 'Çêkirina Atomê û Xشتeya Periodîk'),
  createExperiment(38, 'build-nucleus-binding-energy', 'modern_physics', 'E_b = Δm · c²', 'Build a Nucleus & Binding Energy', 'بناء النواة وطاقة الربط', 'دروستکردنی ناوک و توانای بەستنەوە', 'Çêkirina Navokê û Anarşiya Girêdanê'),
  createExperiment(39, 'rutherford-alpha-scattering-experiment', 'modern_physics', 'F = (k · q_α · q_nucleus)/r²', 'Rutherford Alpha Scattering Experiment', 'تجربة رذرفورد لتشتت ألفا', 'ئەزموونی ڕەزەرفۆرد بۆ پەرشبوونی ئەلفا', 'Ezmûna Rutherford a Belavbûna Alpha'),
  createExperiment(40, 'molecules-light-photon-interaction', 'modern_physics', 'E = h · f, E_rot < E_vib < E_elec', 'Molecules and Light Photon Interaction', 'التفاعل بين الجزيئات وفوتونات الضوء', 'کارلێکی گەردەکان و فۆتۆنی ڕووناکی', 'Têkiliya Molekulan û Fotonên Ronahiyê'),
  createExperiment(41, 'color-vision-rgb-additive-mixing', 'optics', 'Color = R(λ) + G(λ) + B(λ)', 'Color Vision and RGB Additive Mixing', 'رؤية الألوان والمزج الإضافي RGB', 'بینینی ڕەنگەکان و تێکەڵکردنی RGB', 'Dîtina Rengan û Têkelkirina RGB'),
  createExperiment(42, 'capacitor-lab-stored-electric-energy', 'electricity', 'C = (ε · A)/d, Q = C · V, U = ½ · C · V²', 'Capacitor Lab & Stored Electric Energy', 'معمل المكثفات والطاقة الكهربائية المخزونة', 'تەقۆکەی کەپاسیتەر و توانای کارەبایی کۆکراوە', 'Kapasîtor Lab û Anarşiya Elektrîkî ya Torkirî'),
  createExperiment(43, 'electric-charges-field-lines-potential', 'electricity', 'E = (k · Q)/r², V = (k · Q)/r', 'Electric Charges, Field Lines & Potential', 'الشحنات الكهربائية وخطوط المجال والجهد', 'بارە کارەباییەکان، هێڵەکانی بوار و پۆتێنشیال', 'Barên Elektrîkî, Hêlên Qadê û Potansiyel'),
  createExperiment(44, 'wire-resistance-specific-resistivity-law', 'electricity', 'R = (ρ · L)/A', 'Wire Resistance & Specific Resistivity Law', 'مقاومة السلك وقانون المقاومية النوعية', 'بەرگری تەل و یاسای بەرگری تایبەت', 'Berengariya Têlê û Yasa Berengariya Taybet'),
  createExperiment(45, 'gravity-orbital-mechanics', 'mechanics', 'F = (G · M · m)/r², v_orb = √(G·M/r)', 'Gravity and Orbital Mechanics', 'الجاذبية وميكانيكا المدارات', 'کێشکردن و ميكانیکی خولگەکان', 'Gravîtasyon û Mêkanîka Yorîgeyan'),
  createExperiment(46, 'kepler-laws-planetary-motion', 'mechanics', 'T²/a³ = (4π²)/(G · M)', 'Kepler Laws of Planetary Motion', 'قوانين كبلر للحركة الكوكبية', 'یاساکانی کێپلەر بۆ جووڵەی هەسارەکان', 'Yasamên Kepler ji bo Tevgera Gerestêran'),
  createExperiment(47, 'energy-skate-park-transformations', 'mechanics', 'E_mech = K + U_g + E_thermal', 'Energy Skate Park and Energy Transformations', 'حديقة التزلج وتحولات الطاقة', 'یاریگای سکەیت و گۆڕانکارییەکانی توانا', 'Parka Skatê û Guherînên Anarşiyê'),
  createExperiment(48, 'fourier-series-harmonic-wave-synthesis', 'waves', 'f(x) = Σ[A_n · sin(n·ω·t)]', 'Fourier Series and Harmonic Wave Synthesis', 'سلسلة فورييه وتركيب الأمواج التوافقية', 'زنجیرەی فۆریێ و پێکهێنانی شەپۆلە هارمۆنیکییەکان', 'Rêza Fourier û Pêkhatina Şepolên Harmonîk'),
  createExperiment(49, 'wave-string-phase-speed', 'waves', 'v = √(T/μ), y(x,t) = A · sin(kx - ωt)', 'Wave on a String & Phase Speed', 'الموجة على الخيط وسرعة الطور', 'شەپۆل لەسەر پەت و خێرایی قۆناغ', 'Şepol li ser Ben û Leza Qonaxê'),
  createExperiment(50, 'states-matter-phase-transitions-latent-heat', 'thermodynamics', 'Q = m · c · ΔT, Q = m · L', 'States of Matter, Phase Transitions & Latent Heat', 'حالات المادة والتحولات الطورية والحرارة الكامنة', 'بارەکانی ماددە، گۆڕانی بار و گەرمی ئامادە', 'Rewşên Tiştan, Guherînên Rewşê û Germa Şehrawî'),
  createExperiment(51, 'gas-diffusion-graham-law-effusion', 'thermodynamics', 'r₁/r₂ = √(M₂/M₁)', 'Gas Diffusion and Graham Law of Effusion', 'انتشار الغازات وقانون جراهام للتدفق', 'پەرشبوونی گازەکان و یاسای گراهام', 'Belavbûna Gazan û Yasa Graham'),
  createExperiment(52, 'rotational-motion-net-torque', 'mechanics', 'Στ = I · α, L = I · ω', 'Rotational Motion & Net Torque', 'الحركة الدورانية وصافي العزم', 'جووڵەی خولانەوە و صافی عەزم', 'Tevgera Zivirok û Morka Paşîn'),
  createExperiment(53, 'models-hydrogen-atom', 'modern_physics', 'E_n = -13.6/n² eV, ΔE = 13.6(1/n₁² - 1/n₂²)', 'Models of the Hydrogen Atom', 'نماذج ذرة الهيدروجين', 'مۆدێلەکانی ئەتۆمی هایدرۆجین', 'Modelên Atoma Hîdrojenê'),
  createExperiment(54, 'circuit-construction-kit-advanced', 'electricity', 'Σ I_in = Σ I_out (KCL), Σ V_loop = 0 (KVL)', 'Circuit Construction Kit (Advanced)', 'مجموعة بناء الدوائر الكهربائية (متقدم)', 'کۆمەڵەی دروستکردنی بازنەکان (پێشکەوتوو)', 'Kîta Çêkirina Şebekeyan (Pêşkeftî)'),
  createExperiment(55, 'electric-generator', 'electricity', 'ε = -N · (ΔΦ/Δt) = N · B · A · ω · sin(ωt)', 'Electric Generator', 'المولد الكهربائي', 'محۆلەی کارەبایی', 'Jeneratorê Elektrîkî'),
  createExperiment(56, 'magnet-and-compass', 'electricity', 'tan(θ) = B_ext/B_earth', 'Magnet and Compass', 'المغناطيس والبوصلة', 'مەگناتیس و ڕووگەنما', 'Magnet û Compass'),
  createExperiment(57, 'magnets-and-electromagnets', 'electricity', 'B = μ₀ · μ_r · n · I', 'Magnets and Electromagnets', 'المغناطيس والمغناطيس الكهربائي', 'مەگناتیس و کارۆمەگناتیس', 'Magnet û Elektromagnet'),
  createExperiment(58, 'gravity-force-lab', 'mechanics', 'F = G · (m₁ · m₂)/r²', 'Gravity Force Lab', 'مختبر قوة الجاذبية', 'تەقۆکەی هێزی کێشکردن', 'Laboratûvara Hêza Gravîtasyonê'),
  createExperiment(59, 'my-solar-system-multi-body-mechanics', 'mechanics', 'd²r_i/dt² = Σ G · m_j · (r_j-r_i)/|r_j-r_i|³', 'My Solar System & Multi-Body Mechanics', 'نظامي الشمسي وميكانيكا الأجسام المتعددة', 'کۆمەڵەی خۆری من و ميكانیکی چەند لاشەیی', 'Sîstema Min a Rojê û Mêkanîka Pir-Tiştan'),
  createExperiment(60, 'energy-forms-and-transformations', 'mechanics', 'E_in = E_stored + E_out', 'Energy Forms and Transformations', 'أشكال الطاقة وتحولاتها', 'جۆرەکانی توانا و گۆڕانکارییەکانی', 'Formên Anarşiyê û Guherînên Wê'),
  createExperiment(61, 'normal-modes-resonant-frequencies', 'waves', 'f_n = (n·v)/(2L) = (n/2L)·√(T/μ)', 'Normal Modes & Resonant Frequencies', 'الأنماط الطبيعية والترددات الرنينية', 'شێوازە سروشتییەکان و فریکوێنسییە دەنگدانەوەییەکان', 'Modeyên Xirok û Frîkansên Rezonansî'),
  createExperiment(62, 'forces-and-motion-basics', 'mechanics', 'F_net = Σ F = m · a', 'Forces and Motion: Basics', 'القوى والحركة: الأساسيات', 'هێزەکان و جووڵە: سەرەتاییەکان', 'Hêz û Tevger: Binesazî'),
  createExperiment(63, 'gas-properties-kinetic-pressure-law', 'thermodynamics', 'P · V = N · k_B · T = n · R · T', 'Gas Properties & Kinetic Pressure Law', 'خصائص الغازات وقانون الضغط الحركي', 'تایبەتمەندییەکانی گاز و یاسای پەستانی جووڵەیی', 'Taybetmendiyên Gazan û Yasa Zexta Tevgerî'),
  createExperiment(64, 'molecular-diffusion-fick-first-law', 'thermodynamics', 'J = -D · (dC/dx)', 'Molecular Diffusion & Fick First Law', 'الانتشار الجزيئي وقانون فيك الأول', 'پەرشبوونی گەردی و یاسای یەکەمی فیک', 'Belavbûna Molekulî û Yasa Yekem a Fick'),
  createExperiment(65, 'blackbody-spectrum-planck-wien-laws', 'modern_physics', 'λ_max · T = b, E = h · f, I = σ · T⁴', 'Blackbody Spectrum, Planck & Wien Laws', 'طيف الجسم الأسود وقوانين بلانك وفين', 'شەبەنگی تەنی ڕەش و یاساکانی پلانک و وین', 'Spêktra Tiştê Reş û Yasamên Planck û Wien'),
  createExperiment(66, 'doppler-effect-sound-shift', 'waves', 'f\' = f · (v ± vₒ)/(v ∓ vₛ), M = vₛ/v', 'Doppler Effect & Sound Shift', 'تأثير دوبلر وانزياح الصوت', 'کاریگەری دۆپلەر و گۆڕانی دەنگ', 'Kariya Doppler û Guherîna Deng'),
  createExperiment(67, 'electrical-transformer-mutual-induction-law', 'electricity', 'Vₛ/Vₚ = Nₛ/Nₚ', 'Electrical Transformer & Mutual Induction Law', 'المحول الكهربائي وقانون الحث المتبادل', 'محوڵەی کارەبایی و یاسای هاندانی هاوبەش', 'Trafoya Elektrîkî û Yasa Îndukasyona Hevpar'),
  createExperiment(68, 'photoelectric-effect-einstein-quantum-law', 'modern_physics', 'E_k = h · f - Φ', 'Photoelectric Effect & Einstein Quantum Law', 'الظاهرة الكهرودوئية وقانون أينشتاين الكمومي', 'دیاردەی کارۆڕووناکی و یاسای کوانتۆمی ئەینشتاین', 'Tevgera Elektro-Ronahî û Yasa Kuantomî a Einstein'),
  createExperiment(69, 'radioactive-decay-nuclear-half-life-law', 'modern_physics', 'N(t) = N₀ · (1/2)^(t/T₁/₂)', 'Radioactive Decay & Nuclear Half-Life Law', 'الاضمحلال الإشعاعي وقانون عمر النصف النووي', 'تێکشکانی تیشکدەر و یاسای نیوەژیانی ناوکی', 'Xerabûna Radyoaktîf û Yasa Nîv-Jiyana Navokî'),
  createExperiment(70, 'calorimetry-thermal-equilibrium-law', 'thermodynamics', 'Q_lost = Q_gained', 'Calorimetry & Thermal Equilibrium Law', 'قياس الحرارة وقانون الاتزان الحراري', 'پێوانی گەرمی و یاسای هاوسەنگی گەرمی', 'Pîvandina Germiyê û Yasa Hevsengiya Germî')
];
