/**
 * Official TAQ Scientific Visualization & Graph Whitelist (Phase 10.6)
 * Strict reference whitelist for scientific graphs and diagrams.
 *
 * Rule: Whitelist ONLY = Render Graph / Scientific Visualization.
 * Outside Whitelist = Graph is OFF (null).
 */

export type GraphType = 'data_graph' | 'time_graph' | 'spectrum' | 'energy_diagram';

export interface WhitelistGraphConfig {
  experimentCodes: number[];
  experimentSlugs?: string[];
  type: GraphType;
  title: {
    ar: string;
    en: string;
    ku: string;
    kmr: string;
    bad: string;
  };
  xAxis: {
    label: { ar: string; en: string; ku: string; kmr: string; bad: string };
    symbol: string;
    unit: string;
    key?: string;
  };
  yAxis: {
    label: { ar: string; en: string; ku: string; kmr: string; bad: string };
    symbol: string;
    unit: string;
    key?: string;
  };
  aim: {
    ar: string;
    en: string;
    ku: string;
    kmr: string;
    bad: string;
  };
  formula?: string;
  color?: string;
}

export const SCIENTIFIC_GRAPH_WHITELIST: WhitelistGraphConfig[] = [
  // ----------------------------------------------------
  // 📈 DATA GRAPHS
  // ----------------------------------------------------
  // 1. Hooke's Law (قانون هوك) -> F vs x -> Spring Constant
  {
    experimentCodes: [25],
    experimentSlugs: ['exp-25-hookes-law-spring'],
    type: 'data_graph',
    title: {
      ar: 'منحنى قانون هوك (القوة مقابل الاستطالة)',
      en: "Hooke's Law Curve (Force vs Extension)",
      ku: 'یاسای هووک (هێز بەرامبەر درێژبوون)',
      kmr: 'Qanûna Hooke (Hêz li hember Dirêjbûnê)',
      bad: 'یاسایا هووک (هێز د دژی درێژبوونێ)',
    },
    xAxis: {
      label: { ar: 'الاستطالة / الإزاحة', en: 'Extension', ku: 'درێژبوون', kmr: 'Dirêjbûn', bad: 'درێژبوون / لادان' },
      symbol: 'x',
      unit: 'm',
      key: 'displacement',
    },
    yAxis: {
      label: { ar: 'قوة الإرجاع', en: 'Restoring Force', ku: 'هێزی گەڕێنەرەوە', kmr: 'Hêza Vegerandinê', bad: 'هێزا زڤراندنێ' },
      symbol: 'F',
      unit: 'N',
      key: 'restoringForce',
    },
    aim: {
      ar: 'استخراج وتعيين ثابت صلابة النابض (k) من ميل الخط المستقيم',
      en: 'Extract spring constant (k) from the linear slope (F = kx)',
      ku: 'دەرکردنی نەگۆڕی زەمبەرەک (k) لە لێژی هێڵەکە',
      kmr: 'Derkirina qeweta k ji meyla xetê',
      bad: 'دەرئینانا نەگۆڕێ زەمبەرەکی (k) ژ لێژیا هێڵا راست',
    },
    formula: 'F = k \\cdot x',
    color: '#38bdf8',
  },

  // 2. Ohm's Law (قانون أوم) -> V vs I -> Resistance
  {
    experimentCodes: [33, 44, 54],
    experimentSlugs: ['exp-33-electric-circuits-resistors', 'exp-44-resistance-in-a-wire', 'exp-54-circuit-construction-kit-dc-advanced'],
    type: 'data_graph',
    title: {
      ar: 'منحنى قانون أوم (فرق الجهد مقابل شدة التيار)',
      en: "Ohm's Law Curve (Voltage vs Current)",
      ku: 'یاسای ئۆم (جیاوازی پۆتانسێل بەرامبەر تەزوو)',
      kmr: "Qanûna Ohm (Volt li hember Tewjîm)",
      bad: 'یاسایا ئۆمی (جوداهیا ڤۆلتیێ د دژی تەوژمی)',
    },
    xAxis: {
      label: { ar: 'شدة التيار الكهربائي', en: 'Current', ku: 'تەزووی کارەبا', kmr: 'Tewjîma Elektrîkê', bad: 'تەوژمێ کارەبێ' },
      symbol: 'I',
      unit: 'A',
      key: 'current',
    },
    yAxis: {
      label: { ar: 'فرق الجهد الكهربائي', en: 'Voltage', ku: 'ڤۆڵتیە', kmr: 'Volt', bad: 'جوداهیا ڤۆلتیێ' },
      symbol: 'V',
      unit: 'V',
      key: 'voltage',
    },
    aim: {
      ar: 'استخراج قيمة المقاومة الكهربائية (R) من ميل المنحنى البياني',
      en: 'Extract electrical resistance (R) from the V-I slope (V = IR)',
      ku: 'دەرکردنی بەهای بەرگری کارەبایی (R) لە لێژی هێڵەکە',
      kmr: 'Derkirina berxwedana elektrîkê (R) ji meylê',
      bad: 'دەرئینانا بهایێ بەرگریا کارەبایی (R) ژ لێژیا هێڵێ',
    },
    formula: 'V = I \\cdot R',
    color: '#34d399',
  },

  // 3. Newton's 2nd Law (قوانين نيوتن والحركة) -> Force vs Acceleration
  {
    experimentCodes: [62, 10, 26],
    experimentSlugs: ['exp-62-forces-motion-basics', 'exp-10-inclined-plane-simple-machines', 'exp-26-conservation-of-momentum-collisions'],
    type: 'data_graph',
    title: {
      ar: 'العلاقة الديناميكية (القوة مقابل التسارع)',
      en: "Newton's 2nd Law (Force vs Acceleration)",
      ku: 'یاسای دووەمی نیوتن (هێز بەرامبەر تاودان)',
      kmr: "Qanûna 2emîn a Newton (Hêz li hember Lezkirinê)",
      bad: 'یاسایا دویێ یا نیوتنی (هێز د دژی تاودانێ)',
    },
    xAxis: {
      label: { ar: 'التسارع الخطي', en: 'Acceleration', ku: 'تاودان', kmr: 'Lezkirin', bad: 'تاودان' },
      symbol: 'a',
      unit: 'm/s²',
      key: 'acceleration',
    },
    yAxis: {
      label: { ar: 'محصلة القوة', en: 'Net Force', ku: 'کۆی هێز', kmr: 'Hêza Giştî', bad: 'کۆما هێزان' },
      symbol: 'F',
      unit: 'N',
      key: 'force',
    },
    aim: {
      ar: 'التحقق من قانون نيوتن الثاني واستخراج كتلة الجسم القصورِي (m = F/a)',
      en: "Verify Newton's 2nd Law and determine inertial mass (F = ma)",
      ku: 'پشتڕاستکردنەوەی یاسای دووەمی نیوتن و دەرکردنی بارستایی',
      kmr: "Piştrastkirina Qanûna 2emîn a Newton (F = ma)",
      bad: 'پشتڕاستکرنا یاسایا دویێ یا نیوتنی و دەرئینانا بارستایی',
    },
    formula: 'F = m \\cdot a',
    color: '#fbbf24',
  },

  // 4. Friction (الاحتكاك) -> Normal Force vs Friction Force
  {
    experimentCodes: [5],
    experimentSlugs: ['exp-5-ramp-friction-race'],
    type: 'data_graph',
    title: {
      ar: 'منحنى الاحتكاك (قوة الاحتكاك مقابل القوة العمودية)',
      en: 'Friction Law (Friction Force vs Normal Force)',
      ku: 'یاسای لێکخشاندن (هێزی لێکخشاندن بەرامبەر هێزی ستوونی)',
      kmr: 'Qanûna Lێکxistinê (Hêza Lێکxistinê li hember Hêza Stûnî)',
      bad: 'یاسایا لێکخشاندنێ (هێزا لێکخشاندنێ د دژی هێزا ستوونی)',
    },
    xAxis: {
      label: { ar: 'القوة العمودية', en: 'Normal Force', ku: 'هێزی ستوونی', kmr: 'Hêza Stûnî', bad: 'هێزا ستوونی' },
      symbol: 'F_N',
      unit: 'N',
      key: 'normalForce',
    },
    yAxis: {
      label: { ar: 'قوة الاحتكاك الحركي', en: 'Friction Force', ku: 'هێزی لێکخشاندن', kmr: 'Hêza Lێکxistinê', bad: 'هێزا لێکخشاندنێ' },
      symbol: 'f_k',
      unit: 'N',
      key: 'frictionForce',
    },
    aim: {
      ar: 'استخراج وتعيين معامل الاحتكاك الحركي (μ) من ميل الخط المستقيم',
      en: 'Extract kinetic friction coefficient (μ) from linear slope (f_k = μ F_N)',
      ku: 'دەرکردنی هاوکۆلکەی لێکخشاندن (μ) لە لێژی هێڵەکە',
      kmr: 'Derkirina qeweta lێکxistinê (μ)',
      bad: 'دەرئینانا هاوکۆلکێ لێکخشاندنێ (μ) ژ لێژیا هێڵێ',
    },
    formula: 'f_k = \\mu \\cdot F_N',
    color: '#f87171',
  },

  // 5. Pendulum (البندول) -> Length vs Period²
  {
    experimentCodes: [22, 23],
    experimentSlugs: ['exp-22-pendulum-energy-conservation', 'exp-23-pendulum-gravity'],
    type: 'data_graph',
    title: {
      ar: 'العلاقة التوافقية للبندول البسيط (مربع الزمن الدوري مقابل الطول)',
      en: 'Simple Pendulum Relation (Period² vs Length)',
      ku: 'پەندۆلی سادە (دووجای کاتی خول بەرامبەر درێژی)',
      kmr: 'Pendûla Sade (Çargoşeya Dema Dorê li hember Dirêjiyê)',
      bad: 'پەندۆلێ سادە (دووجایا دەمێ خولێ د دژی درێژیێ)',
    },
    xAxis: {
      label: { ar: 'طول الخيط', en: 'Length', ku: 'درێژی پەت', kmr: 'Dirêjiya Werîs', bad: 'درێژیا پەتی' },
      symbol: 'L',
      unit: 'm',
      key: 'length',
    },
    yAxis: {
      label: { ar: 'مربع الزمن الدوري', en: 'Period²', ku: 'دووجای کاتی خول', kmr: 'Dema Dorê²', bad: 'دووجایا دەمێ خولێ' },
      symbol: 'T²',
      unit: 's²',
      key: 'periodSquared',
    },
    aim: {
      ar: 'التحقق من العلاقة الخطية واستخراج تسارع الجاذبية الأرضية g = 4π²·(L/T²)',
      en: 'Verify pendulum relation and extract gravitational acceleration g = 4π²·(L/T²)',
      ku: 'پشتڕاستکردنەوەی هاوکێشە و دەرکردنی تاودانی کێشکردن (g)',
      kmr: 'Derkirina lezkirina erdê (g = 4π²·L/T²)',
      bad: 'پشتڕاستکرنا هاوکێشێ و دەرئینانا تاودانا کێشکرنێ (g)',
    },
    formula: 'T^2 = \\frac{4\\pi^2}{g} \\cdot L',
    color: '#a78bfa',
  },

  // 6. Boyle's Law (قانون بويل) -> Volume vs Pressure (or P vs 1/V)
  {
    experimentCodes: [35, 63],
    experimentSlugs: ['exp-35-ideal-gas-law', 'exp-63-gas-properties'],
    type: 'data_graph',
    title: {
      ar: 'منحنى قانون بويل (الضغط مقابل الحجم)',
      en: "Boyle's Law Curve (Pressure vs Volume)",
      ku: 'یاسای بۆیل (پەستان بەرامبەر قەبارە)',
      kmr: "Qanûna Boyle (Zext li hember Qebareyê)",
      bad: 'یاسایا بۆیلی (پەستان د دژی قەبارەی)',
    },
    xAxis: {
      label: { ar: 'حجم الغاز', en: 'Volume', ku: 'قەبارەی گاز', kmr: 'Qebareya Gazê', bad: 'قەبارەیێ گازی' },
      symbol: 'V',
      unit: 'L',
      key: 'volume',
    },
    yAxis: {
      label: { ar: 'ضغط الغاز', en: 'Pressure', ku: 'پەستانی گاز', kmr: 'Zexta Gazê', bad: 'پەستانا گازی' },
      symbol: 'P',
      unit: 'kPa',
      key: 'pressure',
    },
    aim: {
      ar: 'التحقق من العلاقة العكسية وثبات حاصل ضرب الضغط في الحجم (PV = ثابت)',
      en: "Verify inverse isothermal relationship and constancy of PV (P·V = const)",
      ku: 'پشتڕاستکردنەوەی نەگۆڕی (PV = نەگۆڕ)',
      kmr: 'Piştrastkirina PV = constant',
      bad: 'پشتڕاستکرنا هەڤبەستیا دژ و نەگۆڕیا (PV = نەگۆڕ)',
    },
    formula: 'P \\cdot V = \\text{constant}',
    color: '#38bdf8',
  },

  // 7. Charles's Law (قانون شارل) -> Temperature vs Volume
  {
    experimentCodes: [50],
    experimentSlugs: ['exp-50-states-of-matter-phase-changes'],
    type: 'data_graph',
    title: {
      ar: 'منحنى قانون شارل (الحجم مقابل درجة الحرارة)',
      en: "Charles's Law Curve (Volume vs Temperature)",
      ku: 'یاسای چارلز (قەبارە بەرامبەر پلەی گەرمی)',
      kmr: "Qanûna Charles (Qebare li hember Germiyê)",
      bad: 'یاسایا چارلزی (قەبارە د دژی پلەیا گەرماتیێ)',
    },
    xAxis: {
      label: { ar: 'درجة الحرارة المطلقة', en: 'Absolute Temperature', ku: 'پلەی گەرمی کێلڤن', kmr: 'Germiya Kelvin', bad: 'پلەیا گەرماتیێ ب کێلڤن' },
      symbol: 'T',
      unit: 'K',
      key: 'temperature',
    },
    yAxis: {
      label: { ar: 'حجم الغاز', en: 'Volume', ku: 'قەبارەی گاز', kmr: 'Qebareya Gazê', bad: 'قەبارەیێ گازی' },
      symbol: 'V',
      unit: 'L',
      key: 'volume',
    },
    aim: {
      ar: 'التحقق من التناسب الطردي عند ثبوت الضغط (V/T = ثابت) وتعيين الصفر المطلق',
      en: "Verify isobaric proportional expansion (V/T = const) and absolute zero",
      ku: 'پشتڕاستکردنەوەی (V/T = نەگۆڕ)',
      kmr: 'Piştrastkirina V/T = constant',
      bad: 'پشتڕاستکرنا رێژەیا راستەوخۆ (V/T = نەگۆڕ)',
    },
    formula: '\\frac{V}{T} = \\text{constant}',
    color: '#fb923c',
  },

  // 8. Lens Power (قوة العدسة) -> Focal Length vs Lens Power
  {
    experimentCodes: [2, 16],
    experimentSlugs: ['exp-2-medical-lenses-focal-power', 'exp-16-thin-lenses-lens-maker'],
    type: 'data_graph',
    title: {
      ar: 'منحنى قدرة العدسة (القدرة البصرية مقابل البعد البؤري)',
      en: 'Lens Power Curve (Power vs Focal Length)',
      ku: 'توانای هاوێنە (توانای بینایی بەرامبەر دووری بؤری)',
      kmr: 'Hêza Lensê (Qewet li hember Dûriya Fokal)',
      bad: 'شیانا هاوێنەی (شیانا بینایی د دژی دویریا بؤری)',
    },
    xAxis: {
      label: { ar: 'البعد البؤري', en: 'Focal Length', ku: 'دووری بؤری', kmr: 'Dûriya Boryayî', bad: 'دویریا بؤری' },
      symbol: 'f',
      unit: 'm',
      key: 'focalLength',
    },
    yAxis: {
      label: { ar: 'القدرة البصرية للعدسة', en: 'Lens Power', ku: 'توانای هاوێنە', kmr: 'Hêza Lensê', bad: 'شیانا هاوێنەی' },
      symbol: 'P',
      unit: 'D (ديوبتر)',
      key: 'lensPower',
    },
    aim: {
      ar: 'التحقق من العلاقة العكسية وتحديد قدرة العدسة بالديوبتر (P = 1/f)',
      en: 'Verify inverse focal relationship and determine power in Diopters (P = 1/f)',
      ku: 'پشتڕاستکردنەوەی (P = 1/f)',
      kmr: 'Piştrastkirina P = 1/f',
      bad: 'پشتڕاستکرنا یاسایا شیانا هاوێنەی (P = 1/f)',
    },
    formula: 'P = \\frac{1}{f}',
    color: '#818cf8',
  },

  // 9. Fourier's Law (قانون فورييه) -> Temp Gradient vs Heat Flow
  {
    experimentCodes: [6],
    experimentSlugs: ['exp-6-thermal-conduction-fourier'],
    type: 'data_graph',
    title: {
      ar: 'منحنى قانون فورييه (معدل تدفق الحرارة مقابل التدرج الحراري)',
      en: "Fourier's Conduction (Heat Flow vs Temp Gradient)",
      ku: 'یاسای فۆریێ (گەیشتنی گەرمی بەرامبەر لێژی گەرمی)',
      kmr: "Qanûna Fourier (Herikîna Germiyê li hember Germiyê)",
      bad: 'یاسایا فۆریێ (مەزاختنا گەرمییێ د دژی پلەیا گەرماتیێ)',
    },
    xAxis: {
      label: { ar: 'التدرج الحراري', en: 'Temp Gradient (ΔT/L)', ku: 'لێژی گەرمی', kmr: 'Meyla Germiyê', bad: 'تەدرەجا گەرمیێ' },
      symbol: 'ΔT/L',
      unit: 'K/m',
      key: 'tempGradient',
    },
    yAxis: {
      label: { ar: 'معدل انتقال الحرارة', en: 'Heat Flow Rate (q)', ku: 'تەزووی گەرمی', kmr: 'Herikîna Germiyê', bad: 'تەوژمێ گەرماتیێ' },
      symbol: 'q',
      unit: 'W/m²',
      key: 'heatFlux',
    },
    aim: {
      ar: 'استخراج وتعيين معامل التوصيل الحراري للمادة (k) من ميل الخط المستقيم',
      en: 'Extract thermal conductivity (k) from linear slope (q = -k·dT/dx)',
      ku: 'دەرکردنی هاوکۆلکەی گەیاندنی گەرمی (k)',
      kmr: 'Derkirina gihandina germiyê (k)',
      bad: 'دەرئینانا هاوکۆلکێ گەهاندنا گەرمییێ (k)',
    },
    formula: 'q = -k \\cdot \\frac{\\Delta T}{L}',
    color: '#f43f5e',
  },

  // ----------------------------------------------------
  // 📉 TIME GRAPHS
  // ----------------------------------------------------
  // 10. Free Fall Kinematics (السقوط الحر) -> Time vs Velocity
  {
    experimentCodes: [27],
    experimentSlugs: ['exp-27-free-fall-kinematics'],
    type: 'time_graph',
    title: {
      ar: 'منحنى السقوط الحر (السرعة اللحظية مقابل الزمن)',
      en: 'Free Fall Kinematics (Velocity vs Time)',
      ku: 'کەوتنی ئازاد (خێرایی کاتی بەرامبەر کات)',
      kmr: 'Ketina Azad (Lez li hember Demê)',
      bad: 'کەفتنا سەربەست (لەزاتی د دژی دەمی)',
    },
    xAxis: {
      label: { ar: 'الزمن المنقضي', en: 'Time', ku: 'کات', kmr: 'Dem', bad: 'دەم' },
      symbol: 't',
      unit: 's',
      key: 'time',
    },
    yAxis: {
      label: { ar: 'السرعة الرأسية المتجهة', en: 'Velocity', ku: 'خێرایی', kmr: 'Lez', bad: 'لەزاتی' },
      symbol: 'v',
      unit: 'm/s',
      key: 'velocity',
    },
    aim: {
      ar: 'تحليل التسارع اللحظي واستخراج تسارع السقوط الحر من ميل المنحنى (a = g)',
      en: 'Analyze gravitational acceleration from v-t slope (v = gt)',
      ku: 'شیکردنەوەی تاودان لە لێژی (v-t)',
      kmr: 'Analîzkirina lezkirinê (v = gt)',
      bad: 'شیکاریا تاودانێ ژ لێژیا (v-t)',
    },
    formula: 'v(t) = g \\cdot t',
    color: '#06b6d4',
  },

  // 11. Thermal Conduction Time Curve (التوصيل والتوازن الحراري) -> Time vs Temperature
  {
    experimentCodes: [70, 1],
    experimentSlugs: ['exp-70-calorimetry-thermal-equilibrium', 'exp-1-work-heat-first-law-thermodynamics'],
    type: 'time_graph',
    title: {
      ar: 'منحنى التبادل والتوازن الحراري (درجة الحرارة مقابل الزمن)',
      en: 'Thermal Equilibrium Curve (Temperature vs Time)',
      ku: 'هاوسەنگی گەرمی (پلەی گەرمی بەرامبەر کات)',
      kmr: 'Hevsengiya Germiyê (Germî li hember Demê)',
      bad: 'هەڤسەنگیا گەرمیێ (پلەیا گەرماتیێ د دژی دەمی)',
    },
    xAxis: {
      label: { ar: 'الزمن', en: 'Time', ku: 'کات', kmr: 'Dem', bad: 'دەم' },
      symbol: 't',
      unit: 's',
      key: 'time',
    },
    yAxis: {
      label: { ar: 'درجة حرارة النظام', en: 'Temperature', ku: 'پلەی گەرمی', kmr: 'Germî', bad: 'پلەیا گەرماتیێ' },
      symbol: 'T',
      unit: '°C',
      key: 'temperature',
    },
    aim: {
      ar: 'تحليل ديناميكية انتقال الحرارة بالزمن وبلوغ نقطة الاتزان الحراري النهائي',
      en: 'Analyze thermal transfer dynamics over time approaching thermal equilibrium',
      ku: 'شیکردنەوەی گەیشتن بە هاوسەنگی گەرمی بە تێپەڕبوونی کات',
      kmr: 'Analîzkirina gihîştina hevsengiyê di demê de',
      bad: 'شیکاریا گەهشتنێ ب هەڤسەنگیا گەرماتیێ ب دەمی ڤە',
    },
    formula: 'T(t) = T_{eq} + (T_0 - T_{eq}) e^{-t/\\tau}',
    color: '#f97316',
  },

  // 12. Electromagnetic Induction (التحريض الكهرومغناطيسي وفاراداي) -> Time vs Induced EMF
  {
    experimentCodes: [8, 55, 67],
    experimentSlugs: ['exp-8-electromagnetic-induction-faraday', 'exp-55-generator-faraday', 'exp-67-transformers-mutual-inductance'],
    type: 'time_graph',
    title: {
      ar: 'منحنى فاراداي (القوة الدافعة الكهربائية الحثية مقابل الزمن)',
      en: "Faraday's Induction (Induced EMF vs Time)",
      ku: 'هاندانی کارۆموگناتیسی (هێزی هاندەری کارەبایی بەرامبەر کات)',
      kmr: 'Handana Elektromanyetîk (EMF li hember Demê)',
      bad: 'هاندانا کارۆموگناتیسی (EMF د دژی دەمی)',
    },
    xAxis: {
      label: { ar: 'الزمن', en: 'Time', ku: 'کات', kmr: 'Dem', bad: 'دەم' },
      symbol: 't',
      unit: 's',
      key: 'time',
    },
    yAxis: {
      label: { ar: 'القوة الدافعة الحثية (EMF)', en: 'Induced EMF', ku: 'هێزی هاندەر (EMF)', kmr: 'EMF ya Handayî', bad: 'هێزا هاندەر (EMF)' },
      symbol: 'ℰ',
      unit: 'V',
      key: 'inducedEmf',
    },
    aim: {
      ar: 'تحليل التغير الزمني للتدفق المغناطيسي وتوليد الجهد المتردد الحثي',
      en: 'Analyze time rate of magnetic flux change producing AC induced EMF (ℰ = -dΦ/dt)',
      ku: 'شیکردنەوەی گۆڕانی کاتی لێشاوی موگناتیسی (ℰ = -dΦ/dt)',
      kmr: 'Analîza guherîna qada manyetîk bi demê re',
      bad: 'شیکاریا گوهۆڕینا دەمی یا لەهیێ موگناتیسی',
    },
    formula: '\\mathcal{E}(t) = -N \\frac{d\\Phi_B}{dt}',
    color: '#38bdf8',
  },

  // 13. Capacitor RC Charging/Discharging (شحن وتفريغ المكثف) -> Time vs Voltage
  {
    experimentCodes: [42],
    experimentSlugs: ['exp-42-capacitor-lab-energy'],
    type: 'time_graph',
    title: {
      ar: 'منحنى شحن وتفريغ المكثف (جهد المكثف مقابل الزمن)',
      en: 'RC Circuit Transient (Capacitor Voltage vs Time)',
      ku: 'بارگاویکردنی بارگەگر (ڤۆڵتیەی بارگەگر بەرامبەر کات)',
      kmr: 'Barkirina Kondansatorê (Volt li hember Demê)',
      bad: 'بارگەکرنا بارگەگری (ڤۆلتییا بارگەگری د دژی دەمی)',
    },
    xAxis: {
      label: { ar: 'الزمن المنقضي', en: 'Time', ku: 'کات', kmr: 'Dem', bad: 'دەم' },
      symbol: 't',
      unit: 's',
      key: 'time',
    },
    yAxis: {
      label: { ar: 'جهد المكثف', en: 'Capacitor Voltage', ku: 'ڤۆڵتیەی بارگەگر', kmr: 'Voltaja Kondansatorê', bad: 'ڤۆلتییا بارگەگری' },
      symbol: 'V_C',
      unit: 'V',
      key: 'capacitorVoltage',
    },
    aim: {
      ar: 'دراسة المنحنى الأسي لشحن وتفريغ المكثف وتعيين ثابت الزمن RC (τ = RC)',
      en: 'Study exponential RC charging/discharging curve and extract time constant (τ = RC)',
      ku: 'لێکۆڵینەوەی ڕێڕەوی بارگاویکردن و دەرکردنی نەگۆڕی کات (τ = RC)',
      kmr: 'Lêkolîna şarjkirina RC û derxistina τ = RC',
      bad: 'ڤەکۆلینا بارگەکرنا RC و دەرئینانا نەگۆڕێ دەمی (τ = RC)',
    },
    formula: 'V(t) = V_0 \\left(1 - e^{-t/RC}\\right)',
    color: '#10b981',
  },

  // 14. Radioactive Decay (الاضمحلال الإشعاعي وعمر النصف) -> Time vs Remaining Nuclei / Activity
  {
    experimentCodes: [69],
    experimentSlugs: ['exp-69-radioactive-decay-half-life'],
    type: 'time_graph',
    title: {
      ar: 'منحنى التحلل الإشعاعي (الأنوية المتبقية مقابل الزمن)',
      en: 'Radioactive Decay Law (Remaining Nuclei vs Time)',
      ku: 'تێکشکانی تیشکدەر (ناوکە ماوەکان بەرامبەر کات)',
      kmr: 'Helweşîna Tîrêjdanî (Navokên Mayî li hember Demê)',
      bad: 'هەلوەشینا تیشکدەر (ناڤۆکێن ماین د دژی دەمی)',
    },
    xAxis: {
      label: { ar: 'الزمن / عدد أعمار النصف', en: 'Time (t)', ku: 'کات', kmr: 'Dem', bad: 'دەم' },
      symbol: 't',
      unit: 's',
      key: 'time',
    },
    yAxis: {
      label: { ar: 'عدد الأنوية المشعة المتبقية', en: 'Remaining Nuclei', ku: 'ناوکە ماوەکان', kmr: 'Navokên Mayî', bad: 'ناڤۆکێن ماین' },
      symbol: 'N(t)',
      unit: 'nuclei',
      key: 'remainingNuclei',
    },
    aim: {
      ar: 'التحقق من قانون التحلل الأسي الإشعاعي وحساب عمر النصف t₁/₂ = ln(2)/λ',
      en: 'Verify exponential decay law and determine half-life period t₁/₂ = ln(2)/λ',
      ku: 'پشتڕاستکردنەوەی یاسای تێکشکانی بەرەبەرە و دۆزینەوەی نیوەژین',
      kmr: 'Piştrastkirina qanûna hilweşînê û dîtina nîv-temenê',
      bad: 'پشتڕاستکرنا یاسایا هەلوەشینا نەرم و دیارکرنا نیڤەژینێ',
    },
    formula: 'N(t) = N_0 \\cdot e^{-\\lambda t} = N_0 \\cdot \\left(\\frac{1}{2}\\right)^{t / t_{1/2}}',
    color: '#e11d48',
  },

  // ----------------------------------------------------
  // 🔬 SPECTRUM & ENERGY-LEVEL VISUALIZATIONS
  // ----------------------------------------------------
  // 15. Atomic Emission Spectra (الطيف الذري وانبعاثات بور) -> Wavelength vs Intensity
  {
    experimentCodes: [32, 65],
    experimentSlugs: ['exp-32-atomic-emission-spectra-quantum-jumps', 'exp-65-blackbody-spectrum-planck'],
    type: 'spectrum',
    title: {
      ar: 'شريط الطيف الانبعاثي الذري (الشدة مقابل الطول الموجي)',
      en: 'Atomic Emission Spectrum (Intensity vs Wavelength)',
      ku: 'شریتی شەبەنگی دەرهاویشتن (چڕی بەرامبەر درێژی شەپۆل)',
      kmr: 'Spektruma Tîrêjdanê (Çirî li hember Dirêjiya Pêlê)',
      bad: 'شریتێ شەبەنگێ دەرهاڤێتنێ (تیراتی د دژی درێژیا پێلێ)',
    },
    xAxis: {
      label: { ar: 'الطول الموجي للضوء المنبعث', en: 'Wavelength', ku: 'درێژی شەپۆل', kmr: 'Dirêjiya Pêlê', bad: 'درێژیا پێلێ' },
      symbol: 'λ',
      unit: 'nm',
      key: 'wavelength',
    },
    yAxis: {
      label: { ar: 'الشدة الإشعاعية النسبية', en: 'Spectral Intensity', ku: 'چڕی شەبەنگ', kmr: 'Tewjîma Tîrêjê', bad: 'تیراتیا شەبەنگی' },
      symbol: 'I(λ)',
      unit: 'a.u.',
      key: 'intensity',
    },
    aim: {
      ar: 'دراسة خطوط انبعاث بور (سلسلة بالمر) وتحديد أطوال موجات فوتونات القفز الكمي',
      en: 'Study quantized Balmer emission lines and identify quantum transition wavelengths',
      ku: 'لێکۆڵینەوەی هێڵەکانی شەبەنگی هایدرۆجین و دەرکردنی درێژی شەپۆلەکان',
      kmr: 'Analîza xetên Balmer û dîtina dirêjiya pêlan',
      bad: 'ڤەکۆلینا هێڵێن بالمر و دەستنیشانکرنا درێژیا پێلێن کوانتەمی',
    },
    formula: '\\frac{1}{\\lambda} = R_H \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right)',
    color: '#8b5cf6',
  },

  // 16. Bohr Model & Energy Levels (نموذج بور ومستويات الطاقة)
  {
    experimentCodes: [53],
    experimentSlugs: ['exp-53-models-of-the-hydrogen-atom-bohr'],
    type: 'energy_diagram',
    title: {
      ar: 'مخطط مستويات الطاقة لذرة الهيدروجين (نموذج بور)',
      en: 'Hydrogen Energy-Level Diagram (Bohr Quantum Model)',
      ku: 'هێڵکاری ئاستەکانی وزە (مۆدێلی بۆر)',
      kmr: 'Diagrama Astên Enerjiyê (Modela Bohr)',
      bad: 'هێڵکاریا ئاستێن وزێ (مۆدێلێ بۆری)',
    },
    xAxis: {
      label: { ar: 'المدار الكمي الرئيسي', en: 'Principal Quantum Number', ku: 'ژمارەی کوانتەمی سەرەکی', kmr: 'Hejmara Kwantûmê', bad: 'هژمارا کوانتەمی یا سەرەکی' },
      symbol: 'n',
      unit: '',
      key: 'quantumNumber',
    },
    yAxis: {
      label: { ar: 'طاقة المستوى', en: 'Energy Level', ku: 'ئاستی وزە', kmr: 'Asta Enerjiyê', bad: 'ئاستێ وزێ' },
      symbol: 'E_n',
      unit: 'eV',
      key: 'energyLevel',
    },
    aim: {
      ar: 'تمثيل مستويات طاقة الإلكترون المكممة E_n = -13.6/n² وانتقالات الامتصاص والانبعاث',
      en: 'Visualize quantized energy levels E_n = -13.6/n² and photon transition jumps',
      ku: 'نیشاندانی ئاستەکانی وزەی کوانتەمکراو و گواستنەوەی فۆتۆنەکان',
      kmr: 'Nîşandana astên enerjiyê yên E_n = -13.6/n²',
      bad: 'نیشاندانا ئاستێن وزێ یێن کوانتەمکری E_n = -13.6/n²',
    },
    formula: 'E_n = -\\frac{13.6\\text{ eV}}{n^2}',
    color: '#6366f1',
  },
];

/**
 * Check if an experiment is on the Scientific Visualization Whitelist.
 * Returns the matched config or null if outside whitelist.
 */
export function getExperimentGraphWhitelistConfig(
  experimentIdOrCode: number | string
): WhitelistGraphConfig | null {
  const code = typeof experimentIdOrCode === 'number' ? experimentIdOrCode : parseInt(experimentIdOrCode, 10);
  const slug = typeof experimentIdOrCode === 'string' ? experimentIdOrCode.toLowerCase() : '';

  for (const item of SCIENTIFIC_GRAPH_WHITELIST) {
    if (!isNaN(code) && item.experimentCodes.includes(code)) {
      return item;
    }
    if (slug) {
      if (item.experimentSlugs && item.experimentSlugs.some((s) => slug.includes(s) || s.includes(slug))) {
        return item;
      }
    }
  }

  return null;
}
