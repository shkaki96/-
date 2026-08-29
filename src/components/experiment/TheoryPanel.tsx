import React, { useState } from 'react';
import { Experiment } from '../../types/experiment';
import { useTranslation } from '../../i18n/useTranslation';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Sliders,
  HelpCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface TheoryPanelProps {
  experiment: Experiment;
}

interface VariableInfo {
  symbol: string;
  name: string;
  unit: string;
  type: 'input' | 'output' | 'constant';
  description?: string;
}

interface RelationshipInfo {
  cause: string;
  effect: string;
  type: 'direct' | 'inverse' | 'proportional';
  explanation: string;
}

interface ExperimentTheoryData {
  concept: string;
  principle: string;
  equation: string;
  variables: VariableInfo[];
  relationships: RelationshipInfo[];
}

export const TheoryPanel: React.FC<TheoryPanelProps> = ({ experiment }) => {
  const { language, getLocalizedText } = useTranslation();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Robust multi-language resolver helper
  const loc = (texts: { ar: string; en: string; ku: string; kmr: string; bad: string }): string => {
    if (language === 'bad') return texts.bad;
    if (language === 'ku') return texts.ku;
    if (language === 'kmr') return texts.kmr;
    if (language === 'ar') return texts.ar;
    return texts.en;
  };

  // Generate physics theory data based on experiment category & physical law
  const getTheoryData = (): ExperimentTheoryData => {
    const id = experiment.id.toLowerCase();
    const category = experiment.category;

    // 1. Simple Harmonic Motion / Pendulum
    if (id.includes('pendulum') || id.includes('harmonic')) {
      return {
        concept: loc({
          ar: 'دراسة الحركة التوافقية البسيطة للبندول البسيط والتأثير الدوري للجاذبية وطول الخيط.',
          bad: 'لێکۆلیناڤا ل سەر لەڤینا هارمۆنیک یا سادە یا پەندۆلی و کارتێکرنا دەورەیی یا کێشکرنێ و درێژیا بەندی.',
          ku: 'لێکۆڵینەوە لە جووڵەی هاوسەنگی سادەی پاندۆڵ و کاریگەری هێزی کێشکردن و درێژی پەت.',
          kmr: 'Lêkolîna tevgera hevseng a sade ya pendulê û bandora kişandina erdê.',
          en: 'Study of Simple Harmonic Motion (SHM) in a simple pendulum under gravitational restoring forces.',
        }),
        principle: loc({
          ar: 'يتذبذب البندول البسيط حول موضع الاتزان نتيجة قوة الإعادة الناتجة عن مرشح مركب الوزن. بالنسبة للزوايا الصغيرة (θ < 15°)، يكون الزمن الدوري مستقلاً عن الكتلة وسعة الاهتزاز ويعتمد فقط على طول الخيط وتسارع الجاذبية الأرضية.',
          bad: 'پەندۆلێ سادە ل دۆر جهێ هەڤسەنگیێ دهەژیت ژ ئەگەرێ هێزا زڤڕینەر. بۆ گۆشەیێن بچووک (θ < 15°)، دەمێ خۆلێ سەربەخۆیە ژ بارستەی و ب تنێ ب درێژیا بەندی و تاودانا کێشکرنا عەردی ڤە گرێدایە.',
          ku: 'پاندۆڵ لە دەوری شوێنی هاوسەنگی دەسوڕێتەوە بەهۆی هێزی گەڕێنەرەوە. بۆ گۆشە بچووکەکان (θ < 15°)، کاتی خول سەربەخۆیە لە قورسایی و تەنها بەستراوە بە درێژی پەت و هێزی کێشکردن.',
          kmr: 'Pendul li dora cihê hevsengiyê diheje. Ji bo goşeyên piçûk, dema dorê serbixwe ye ji giraniyê.',
          en: 'A simple pendulum oscillates around equilibrium due to gravitational restoring force. For small angles (θ < 15°), the periodic time is independent of mass and amplitude, relying only on string length and gravitational acceleration.',
        }),
        equation: 'T = 2π × √(L / g)',
        variables: [
          {
            symbol: 'T',
            name: loc({
              ar: 'زمن الدورة الكاملة',
              bad: 'دەمێ خۆلا تەمام',
              ku: 'کاتی خولی تەواو',
              kmr: 'Dema dora temam',
              en: 'Period Time',
            }),
            unit: 's',
            type: 'output',
            description: loc({
              ar: 'الزمن المستغرق لإكمال اهتزازة واحدة كاملة',
              bad: 'دەمێ پێدڤی بۆ ب دووماهیک ئینانا ئێک لەرینا تەمام',
              ku: 'کاتی پێویست بۆ تەواوکردنی یەک لەرینەوەی تەواو',
              kmr: 'Dema pêwîst ji bo temamkirina hejandinekê',
              en: 'Time for one full oscillation',
            }),
          },
          {
            symbol: 'L',
            name: loc({
              ar: 'طول الخيط',
              bad: 'درێژیا بەندی / پەتی',
              ku: 'درێژیی پەت',
              kmr: 'Dirêjahiya ben',
              en: 'String Length',
            }),
            unit: 'm',
            type: 'input',
            description: loc({
              ar: 'المسافة من نقطة التعليق إلى مركز كتلة الثقل',
              bad: 'دویراتی ژ خالێ هەلاویستنێ هەتا سەنتەرێ بارستەیا تەنی',
              ku: 'دووری لە خاڵی هەڵواسینەوە تا چەقی بارستایی تەن',
              kmr: 'Dûriya ji cihê daleqandinê heta navenda barsteyê',
              en: 'Distance from pivot to center of mass',
            }),
          },
          {
            symbol: 'g',
            name: loc({
              ar: 'تسارع الجاذبية الأرضية',
              bad: 'تاودانا کێشکرنا عەردی',
              ku: 'تاودانی کێشکردنی زەوی',
              kmr: 'Lezkirina kêşana erdê',
              en: 'Gravitational Acceleration',
            }),
            unit: 'm/s²',
            type: 'input',
            description: loc({
              ar: 'شريطة البيئة المحيطة (9.81 m/s² على الأرض)',
              bad: 'هێزا کێشکرنا جهی (9.81 m/s² ل سەر عەردی)',
              ku: 'بڕی تاودانی کێشکردن (9.81 m/s² لەسەر زەوی)',
              kmr: 'Hêza qada kêşana erdê (9.81 m/s²)',
              en: 'Local gravitational field strength',
            }),
          },
          {
            symbol: 'θ',
            name: loc({
              ar: 'زاوية الإزاحة الابتدائية',
              bad: 'گۆشەیا لادانا دەستپێکی',
              ku: 'گۆشەی لادانی سەرەتایی',
              kmr: 'Goşeya lادana destpêkê',
              en: 'Initial Displacement Angle',
            }),
            unit: '°',
            type: 'input',
            description: loc({
              ar: 'سعة الاهتزازة الابتدائية',
              bad: 'فراوانیا لەرینا دەستپێکی',
              ku: 'فراوانی لەرینەوەی سەرەتایی',
              kmr: 'Firehiya hejandina destpêkê',
              en: 'Initial release angle',
            }),
          },
          {
            symbol: 'm',
            name: loc({
              ar: 'كتلة الثقل',
              bad: 'بارستەیا تەنی',
              ku: 'بارستایی تەن',
              kmr: 'Masa giranîyê',
              en: 'Bob Mass',
            }),
            unit: 'kg',
            type: 'input',
            description: loc({
              ar: 'كتلة الكرة المعلقة (لا تؤثر على الزمن الدوري)',
              bad: 'بارستەیا تۆپکا هەلاویستی (کارتێکرنێ ل سەر دەمێ خۆلێ ناکەت)',
              ku: 'بارستایی تۆپە هەڵواسراوەکە (کاریگەری لەسەر کاتی خول نییە)',
              kmr: 'Masa topê (bandorê li dema dorê nake)',
              en: 'Mass of suspended bob (does not affect T)',
            }),
          },
        ],
        relationships: [
          {
            cause: loc({
              ar: 'L ↑ (زيادة الطول)',
              bad: 'L ↑ (زێدەکرنا درێژیێ)',
              ku: 'L ↑ (زیادکردنی درێژی)',
              kmr: 'L ↑ (Zêdekirina dirêjahiyê)',
              en: 'L ↑ (Length increase)',
            }),
            effect: loc({
              ar: 'T ↑ (زيادة زمن الدورة)',
              bad: 'T ↑ (زێدەبوونا دەمێ خۆلێ)',
              ku: 'T ↑ (زیادبوونی کاتی خول)',
              kmr: 'T ↑ (Zêdebûna dema dorê)',
              en: 'T ↑ (Period increase)',
            }),
            type: 'direct',
            explanation: loc({
              ar: 'زيادة طول الخيط يزيد المسار المقطوع ويتناسب الزمن الدوري طرديًا مع جذر الطول (√L).',
              bad: 'زێدەکرنا درێژیا بەندی دەمێ خۆلێ زێدە دکەت، دەمێ خۆلێ ب شێوەیێ راستەوانە دگەل رەگێ دووجایێ درێژیێ دگۆهۆڕیت (√L).',
              ku: 'زیادکردنی درێژی پەت کاتی خول زیاد دەکات، کاتی خول بەشێوەی ڕاستەوانە لەگەڵ ڕەگی دووجای درێژی دەگۆڕێت (√L).',
              kmr: 'Zêdekirina dirêjahiya ben dibe sedema zêdebûna dema dorê.',
              en: 'Period increases proportionally to the square root of string length (√L).',
            }),
          },
          {
            cause: loc({
              ar: 'g ↑ (زيادة الجاذبية)',
              bad: 'g ↑ (زێدەکرنا کێشکرنێ)',
              ku: 'g ↑ (زیادکردنی کێشکردن)',
              kmr: 'g ↑ (Zêdekirina kêşanê)',
              en: 'g ↑ (Gravity increase)',
            }),
            effect: loc({
              ar: 'T ↓ (تناقص زمن الدورة)',
              bad: 'T ↓ (کێمبوونا دەمێ خۆلێ)',
              ku: 'T ↓ (کەمبوونی کاتی خول)',
              kmr: 'T ↓ (Kêmbûna dema dorê)',
              en: 'T ↓ (Period decrease)',
            }),
            type: 'inverse',
            explanation: loc({
              ar: 'زيادة الجاذبية تزيد قوة الإعادة مما يسرع التذبذب ويقلل الزمن الدوري.',
              bad: 'زێدەبوونا کێشکرنێ هێزا زڤڕینەر ب هێزتر دکەت و لەزاتیا هەژانێ زێدە دکەت، لەوما دەمێ خۆلێ کێم دبیت.',
              ku: 'زیادبوونی کێشکردن هێزی گەڕێنەرەوە بەهێزتر دەکات و دەبێتە هۆی کەمبوونەوەی کاتی خول.',
              kmr: 'Zêdebûna kêşanê dibe sedema lezkirina hejandinê û kêmkirina dema dorê.',
              en: 'Higher gravity increases restoring force, accelerating oscillation and decreasing period T.',
            }),
          },
          {
            cause: loc({
              ar: 'm ↑ (زيادة الكتلة)',
              bad: 'm ↑ (زێدەکرنا بارستەی)',
              ku: 'm ↑ (زیادکردنی بارستایی)',
              kmr: 'm ↑ (Zêdekirina barsteyê)',
              en: 'm ↑ (Mass increase)',
            }),
            effect: loc({
              ar: 'T = ثبات الزمن الدوري',
              bad: 'T = نەگوهۆڕینا دەمێ خۆلێ',
              ku: 'T = نەگۆڕانی کاتی خول',
              kmr: 'T = Neguherîna dema dorê',
              en: 'T = Unchanged',
            }),
            type: 'proportional',
            explanation: loc({
              ar: 'الكتلة تزيد القصور الذاتي وقوة الجاذبية بنسبة متساوية تمامًا، فلا يتغير الزمن الدوري.',
              bad: 'بارستە تەوژمێ مانێ و هێزا کێشکرنێ ب هەمان رێژە زێدە دکەت، لەوما دەمێ خۆلێ چ ناگوهۆڕیت.',
              ku: 'بارستایی سستی و هێزی کێشکردن بەهەمان ڕێژە زیاد دەکات، بۆیە کاتی خول ناگۆڕێت.',
              kmr: 'Giranî bandorê li dema dorê nake.',
              en: 'Mass increases inertia and gravity equally, leaving period T unchanged.',
            }),
          },
        ],
      };
    }

    // 2. Optics / Refraction / Snell's Law
    if (category === 'optics' || id.includes('optics') || id.includes('refraction')) {
      return {
        concept: loc({
          ar: 'انكسار الضوء وتغير سرعته واتجاهه عند الانتقال بين وسطين شفافين مختلفين في الكثافة الضوئية.',
          bad: 'شکەستنا رووناهیێ و گوهۆڕینا لەزاتی و ئاراستەیێ وێ دەمێ دەرباز دبیت د ناڤبەرا دوو ناڤەندێن روون دا کو د چڕیا بینینێ دا جیاوازن.',
          ku: 'شکانەوەی ڕووناکی و گۆڕانی خێرایی و ئاراستەکەی لەکاتی تێپەڕبوون لە نێوان دوو ناVendorی ڕوونی جیاوازدا.',
          kmr: 'Şikestina ronahiyê û guherîna lez û arasteya wê di navbera du hawirdorên zelal de.',
          en: 'Light refraction and speed change when passing between media with different refractive indices.',
        }),
        principle: loc({
          ar: 'ينحرف الشعاع الضوئي عن مساره عند الانتقال بين وسطين ضوئيين مختلفين نتيجة تغير سرعة انتشار الضوء. يخضع الانكسار لقانون سنيل، حيث تظل نسبة جيب زاوية السقوط إلى جيب زاوية الانكسار ثابتاً يساوي نسبة معامل الانكسار.',
          bad: 'تیشکێ رووناهیێ ژ رێڕەوێ خۆ لاددەت دەمێ دەرباز دبیت د ناڤبەرا دوو ناڤەندێن جیاواز دا ژ ئەگەرێ گوهۆڕینا لەزاتیا رووناهیێ. شکەستن ل دووڤ یاسایا سنێل دهێتە رێڤەبرن.',
          ku: 'تیشکی ڕووناکی لە ڕێڕەوەکەی لادەدات لەکاتی گواستنەوەی لە نێوان دوو ناVendی جیاواز بەهۆی گۆڕانی خێرایی ڕووناکی. شکانەوە پەیڕەوی یاسای سنێل دەکات.',
          kmr: 'Tîrêja ronahiyê dema derbasî navgînek din dibe ditewe. Şikestin li gorî zagona Snell pêk tê.',
          en: 'Light bends at boundaries between different optical media due to speed variation. According to Snell’s Law, the ratio of sines of incidence and refraction angles equals the ratio of refractive indices.',
        }),
        equation: 'n₁ × sin(θ₁) = n₂ × sin(θ₂)',
        variables: [
          {
            symbol: 'n₁',
            name: loc({
              ar: 'معامل انكسار الوسط الأول',
              bad: 'هاوکۆلکێ شکەستنا ناڤەندێ ئێکێ',
              ku: 'هاوکۆلکەی شکانەوەی ناVendorی یەکەم',
              kmr: 'Hevkêşeya şikestinê ya navgîna yekem',
              en: 'Refractive Index Medium 1',
            }),
            unit: 'dimensionless',
            type: 'input',
            description: loc({
              ar: 'مقياس الكثافة الضوئية للوسط الأول',
              bad: 'پێڤەرێ چڕیا بینینێ یا ناڤەندێ ئێکێ',
              ku: 'پێوەری چڕیی بینایی ناVendی یەکەم',
              kmr: 'Pîvana çڕiya ronahiyê ya navgîna yekem',
              en: 'Optical density measure of medium 1',
            }),
          },
          {
            symbol: 'θ₁',
            name: loc({
              ar: 'زاوية السقوط',
              bad: 'گۆشەیا لێدانێ',
              ku: 'گۆشەی لێدان',
              kmr: 'Goşeya lêdanê',
              en: 'Incident Angle',
            }),
            unit: '°',
            type: 'input',
            description: loc({
              ar: 'الزاوية بين الشعاع الساقط والعمود المقاوم',
              bad: 'گۆشەیا د ناڤبەرا تیشکێ لێدەر و هێلا ستوونی دا',
              ku: 'گۆشەی نێوان تیشکی لێدەر و هێڵی ستوون',
              kmr: 'Goşeya navbera tîrêja ketî û xeta stûnî',
              en: 'Angle between ray and surface normal',
            }),
          },
          {
            symbol: 'n₂',
            name: loc({
              ar: 'معامل انكسار الوسط الثاني',
              bad: 'هاوکۆلکێ شکەستنا ناڤەندێ دووێ',
              ku: 'هاوکۆلکەی شکانەوەی ناVendی دووەم',
              kmr: 'Hevkêşeya şikestinê ya navgîna duyem',
              en: 'Refractive Index Medium 2',
            }),
            unit: 'dimensionless',
            type: 'input',
            description: loc({
              ar: 'مقياس الكثافة الضوئية للوسط الثاني',
              bad: 'پێڤەرێ چڕیا بینینێ یا ناڤەندێ دووێ',
              ku: 'پێوەری چڕیی بینایی ناVendی دووەم',
              kmr: 'Pîvana çڕiya ronahiyê ya navgîna duyem',
              en: 'Optical density measure of medium 2',
            }),
          },
          {
            symbol: 'θ₂',
            name: loc({
              ar: 'زاوية الانكسار',
              bad: 'گۆشەیا شکەستنێ',
              ku: 'گۆشەی شکانەوە',
              kmr: 'Goşeya şikestinê',
              en: 'Refracted Angle',
            }),
            unit: '°',
            type: 'output',
            description: loc({
              ar: 'الزاوية بين الشعاع المنكسر والعمود المقاوم',
              bad: 'گۆشەیا د ناڤبەرا تیشکێ شکەستی و هێلا ستوونی دا',
              ku: 'گۆشەی نێوان تیشکی شکاوه و هێڵی ستوون',
              kmr: 'Goşeya navbera tîrêja şikestî û xeta stûnî',
              en: 'Angle of refracted ray to normal',
            }),
          },
          {
            symbol: 'θc',
            name: loc({
              ar: 'الزاوية الحرجة',
              bad: 'گۆشەیا کریتیک (بێهۆش)',
              ku: 'گۆشەی مۆڵەقە (Critical Angle)',
              kmr: 'Goşeya krîtîk',
              en: 'Critical Angle',
            }),
            unit: '°',
            type: 'output',
            description: loc({
              ar: 'زاوية السقوط التي تقابلها زاوية انكسار 90° (عند n₁ > n₂)',
              bad: 'گۆشەیا لێدانێ یا کو گۆشەیا شکەستنا وێ دبیتە 90 پلە',
              ku: 'ئەو گۆشەی لێدانەیە کە گۆشەی شکانەوەکەی دەبێتە 90 پلە',
              kmr: 'Goşeya lêdanê ya ku goşeya şikestinê dibe 90°',
              en: 'Incidence angle for θ₂ = 90°',
            }),
          },
        ],
        relationships: [
          {
            cause: loc({
              ar: 'n₂ > n₁ (انتقال لوسط أثقل ضوئيًا)',
              bad: 'n₂ > n₁ (دەربازبوون بۆ ناڤەندەکا چڕتر)',
              ku: 'n₂ > n₁ (چوون بۆ ناVendێکی چڕتر)',
              kmr: 'n₂ > n₁ (Derbasbûna navgîna çڕtir)',
              en: 'n₂ > n₁ (Denser medium)',
            }),
            effect: loc({
              ar: 'θ₂ < θ₁ (ينكسر الشعاع مقتربًا من العمود)',
              bad: 'θ₂ < θ₁ (تیشک بەرەڤ هێلا ستوونی دچەمیت)',
              ku: 'θ₂ < θ₁ (تیشکەکە لە هێڵی ستوون نزیک دەبێتەوە)',
              kmr: 'θ₂ < θ₁ (Tîrêj nêzîkî xeta stûnî dibe)',
              en: 'θ₂ < θ₁ (Bends towards normal)',
            }),
            type: 'inverse',
            explanation: loc({
              ar: 'تقل سرعة الضوء في الوسط الثاني الأكثف، فيتحرف الشعاع باتجاه العمود المقاوم.',
              bad: 'لەزاتیا رووناهیێ د ناڤەندا چڕتر دا کێم دبیت، لەوما تیشک بەرەڤ هێلا ستوونی دچەمیت.',
              ku: 'خێرایی ڕووناکی لە ناVendە چڕەکەدا کەم دەبێتەوە، بۆیە تیشکەکە نزیک دەبێتەوە لە هێڵی ستوون.',
              kmr: 'Leza ronahiyê kêm dibe û tîrêj nêzîkî xeta stûnî dibe.',
              en: 'Light slows down in higher refractive index media, bending towards the normal.',
            }),
          },
          {
            cause: loc({
              ar: 'θ₁ > θc (سقوط بزاوية أكبر من الحرجة)',
              bad: 'θ₁ > θc (لێدان ب گۆشەیەکا مەزنتر ژ یا کریتیک)',
              ku: 'θ₁ > θc (لێدان بە گۆشەی گەورەتر لە مۆڵەقە)',
              kmr: 'θ₁ > θc (Lêdan bi goşeya ji ya krîtîk mezintir)',
              en: 'θ₁ > θc (Greater than critical)',
            }),
            effect: loc({
              ar: 'انعكاس كلي داخلي (Total Reflection)',
              bad: 'ڤەگەڕیانا تەمام یا ناڤخۆیی (Total Reflection)',
              ku: 'دانەوەی تەواوەتی ناوەکی (Total Reflection)',
              kmr: 'Vegera tam a hundirîn',
              en: 'Total internal reflection',
            }),
            type: 'direct',
            explanation: loc({
              ar: 'عند الانتقال من وسط أكبر كثافة لوسط أقل بزاوية أكبر من الزاوية الحرجة ينعكس الشعاع كليًا داخل الوسط الأول.',
              bad: 'دەمێ رووناهی ژ ناڤەندەکا چڕتر دەرباز دبیت بۆ یا کێمچڕتر ب گۆشەیەکا مەزنتر ژ یا کریتیک، ب تەمامی دزڤڕیتە ناڤ ناڤەندێ ئێکێ.',
              ku: 'لەکاتی تێپەڕبوون لە ناVendی چڕترەوە بۆ کەمچڕتر بە گۆشەی گەورەتر لە مۆڵەقە، تیشکەکە بەتەواوی دەداتەوە ناو ناVendی یەکەم.',
              kmr: 'Ronahî bi tevahî vedigere nav navgîna yekem.',
              en: 'When light travels from higher to lower index at θ₁ > θc, total internal reflection occurs.',
            }),
          },
        ],
      };
    }

    // 3. Electricity / Ohm's Law
    if (category === 'electricity' || id.includes('circuit') || id.includes('ohm')) {
      return {
        concept: loc({
          ar: 'دراسة العلاقة المباشرة بين فرق الجهد الكهربائي وشدة التيار والمقاومة الكهربائية في الدارات المغلقة.',
          bad: 'لێکۆلیناڤا ل سەر پەیوەندیا راستەوخۆ یا د ناڤبەرا جوداهیا ئەرکی (ڤۆڵتیە)، توندیا تەزووی و بەرگریا کارەبایی د بازنێن کارەبایی یێن گرتیدا.',
          ku: 'لێکۆڵینەوە لە پەیوەندی نێوان جیاوازی ئەڕک (ڤۆڵتیە)، توندی تەزووی کارەبا و بەرگری کارەبایی لە سووڕی کارەبادا.',
          kmr: 'Lêkolîna têkiliya navbera voltaj, herikîna elektrîkê û bergiriyê di çerxên elektrîkê de.',
          en: 'Direct relation between electric potential, current intensity, and electrical resistance in closed circuits.',
        }),
        principle: loc({
          ar: 'ينص قانون أوم على أن شدة التيار الكهربائي المار في موصل معدني تتناسب طرديًا مع فرق الجهد بين طرفيه عند ثبات درجة الحرارة، وتتناسب عكسيًا مع مقداره المادي المقاوم.',
          bad: 'یاسایا ئۆمی دیار دکەت کو توندیا تەزوویێ کارەبایی ب شێوەیەکێ راستەوانە دگەل جوداهیا ئەرکی ل سەر دوو سەرێن گەهێنەری دگۆهۆڕیت د پلەیا گەرمیا نەگوهۆڕدا، و پێچەوانە دگەل بەرگریێ.',
          ku: 'یاسای ئۆم دەڵێت توندی تەزووی کارەبایی ڕاستەوانە دەگۆڕێت لەگەڵ جیاوازی ئەڕکی نێوان دوو سەرەکە لە پلەی گەرمی نەگۆڕدا، و پێچەوانە دەگۆڕێت لەگەڵ بەرگریدا.',
          kmr: 'Zagona Ohm dibêje ku herikîna elektrîkê rasterast bi voltajê re û berevajî bi bergiriyê re têkildar e.',
          en: 'Ohm’s Law states that electric current through a conductor between two points is directly proportional to voltage across the points and inversely proportional to resistance.',
        }),
        equation: 'V = I × R   =>   I = V / R',
        variables: [
          {
            symbol: 'V',
            name: loc({
              ar: 'فرق الجهد الكهربائي',
              bad: 'جوداهیا ئەرکی (ڤۆڵتیە)',
              ku: 'جیاوازیی ئەڕک (ڤۆڵتیە)',
              kmr: 'Cudahiya potansiyelê (Voltaj)',
              en: 'Voltage / Potential Difference',
            }),
            unit: 'V',
            type: 'input',
            description: loc({
              ar: 'القوة الدافعة الكهربائية بين طرفي الدارة',
              bad: 'هێزا پالنەرا کارەبایی د ناڤبەرا دوو جەمسەرێن بازنێ دا',
              ku: 'هێزی پاڵنەری کارەبایی لە نێوان دوو جەمسەری سووڕەکە',
              kmr: 'Hêza ajoker a elektrîkê',
              en: 'Electromotive force across circuit',
            }),
          },
          {
            symbol: 'R',
            name: loc({
              ar: 'المقاومة الكهربائية',
              bad: 'بەرگریا کارەبایی',
              ku: 'بەرگریی کارەبایی',
              kmr: 'Bergiriya elektrîkî',
              en: 'Resistance',
            }),
            unit: 'Ω',
            type: 'input',
            description: loc({
              ar: 'ممانعة الموصل لتدفق الشحنات الكهربائية',
              bad: 'رێگری و بەرهنگاریا گەهێنەری دژی لڤینا بارگان',
              ku: 'ڕێگری و بەرەنگاری گەیەنەر دژی جووڵەی بارگەکان',
              kmr: 'Astengiya li dijî herikîna baran',
              en: 'Opposition to flow of electric charge',
            }),
          },
          {
            symbol: 'I',
            name: loc({
              ar: 'شدة التيار الكهربائي',
              bad: 'توندیا تەزوویا کارەبایی',
              ku: 'توندیی تەزووی کارەبا',
              kmr: 'Hêza herikîna elektrîkê',
              en: 'Electric Current',
            }),
            unit: 'A',
            type: 'output',
            description: loc({
              ar: 'معدل تدفق الشحنات الكهربائية عبر المقطع',
              bad: 'تێکڕایێ دەربازبوونا بارگێن کارەبایی د برینێ تێلێ دا د ئێک چرکے دا',
              ku: 'تێکڕای تێپەڕبوونی بارگە کارەباییەکان بەناو بڕگەی تەلەکەدا',
              kmr: 'Rêjeya derbasbûna barên elektrîkê di çirkekê de',
              en: 'Rate of electric charge flow',
            }),
          },
          {
            symbol: 'P',
            name: loc({
              ar: 'القدرة المتبددة',
              bad: 'شیانا بەلاڤبووی (توانا)',
              ku: 'توانای کارەبایی',
              kmr: 'Hêza elektrîkî',
              en: 'Power Dissipation',
            }),
            unit: 'W',
            type: 'output',
            description: loc({
              ar: 'الطاقة المستهلكة في الموصل حراريًا (P = V × I = I²R)',
              bad: 'وزەیا کارەبایی یا بکارئیاتی د چرکی دا (P = V × I = I²R)',
              ku: 'وزەی کارەبایی بەکارهاتوو لە چرکەیەکدا (P = V × I = I²R)',
              kmr: 'Wizaya xerckirî di çirkekê de',
              en: 'Electrical power converted to heat per second',
            }),
          },
        ],
        relationships: [
          {
            cause: loc({
              ar: 'V ↑ (زيادة فرق الجهد)',
              bad: 'V ↑ (زێدەکرنا ڤۆڵتیێ)',
              ku: 'V ↑ (زیادکردنی ڤۆڵتیە)',
              kmr: 'V ↑ (Zêdekirina voltajê)',
              en: 'V ↑ (Voltage increase)',
            }),
            effect: loc({
              ar: 'I ↑ (زيادة شدة التيار)',
              bad: 'I ↑ (زێدەبوونا توندیا تەزووی)',
              ku: 'I ↑ (زیادبوونی توندی تەزوو)',
              kmr: 'I ↑ (Zêdebûna herikînê)',
              en: 'I ↑ (Current increase)',
            }),
            type: 'direct',
            explanation: loc({
              ar: 'زيادة الجهد توفر طاقة أكبر لدفع الشحنات مما يرفع شدة التيار بنسبة طردية خطية.',
              bad: 'زێدەکرنا جوداهیا ئەرکی هێزەکا زێدەتر ددەت بۆ پالپێڤەنانا بارگان و تەزووی راستەوانە زێدە دکەت.',
              ku: 'زیادکردنی جیاوازی ئەڕک وزەی زیاتر دەدات بۆ جووڵاندنی بارگەکان و تەزوو ڕاستەوانە بەرز دەکاتەوە.',
              kmr: 'Zêdekirina voltajê dibe sedema zêdebûna herikîna elektrîkê.',
              en: 'Higher voltage exerts greater potential force, increasing current proportionally.',
            }),
          },
          {
            cause: loc({
              ar: 'R ↑ (زيادة المقاومة)',
              bad: 'R ↑ (زێدەکرنا بەرگریێ)',
              ku: 'R ↑ (زیادکردنی بەرگری)',
              kmr: 'R ↑ (Zêdekirina bergiriyê)',
              en: 'R ↑ (Resistance increase)',
            }),
            effect: loc({
              ar: 'I ↓ (تناقص شدة التيار)',
              bad: 'I ↓ (کێمبوونا توندیا تەزووی)',
              ku: 'I ↓ (کەمبوونی توندی تەزوو)',
              kmr: 'I ↓ (Kêmbûna herikînê)',
              en: 'I ↓ (Current decrease)',
            }),
            type: 'inverse',
            explanation: loc({
              ar: 'المقاومة تعيق حركة الإلكترونات الحرة، فزيادتها تقلل معدل الشحنات المارة ثانيةً.',
              bad: 'بەرگری رێگریێ ل لڤینا ئەلیکترۆنان دکەت، زێدەبوونا وێ دەربازبوونا بارگان کێم دکەت.',
              ku: 'بەرگری ڕێگری لە جووڵەی ئەلیکترۆنەکان دەکات، زیادبوونی دەبێتە هۆی کەمبوونەوەی تەزووی کارەبا.',
              kmr: 'Bergirî rê li ber herikîna elektrîkê digire.',
              en: 'Greater resistance restricts electron movement, reducing total current flow rate.',
            }),
          },
        ],
      };
    }

    // 4. Thermodynamics / Ideal Gas Law
    if (category === 'thermodynamics' || id.includes('gas') || id.includes('heat') || id.includes('thermo')) {
      return {
        concept: loc({
          ar: 'دراسة سلوك الغازات المثالية والعلاقة بين الضغط والحجم ودرجة الحرارة المطلقة.',
          bad: 'لێکۆلیناڤا ل سەر رەفتارا گازێن نموونەیی و پەیوەندیا د ناڤبەرا پەستان، قەبارە و پلەیا گەرمیا رەهادا.',
          ku: 'لێکۆڵینەوە لە ڕەفتاری گازە نموونەییەکان و پەیوەندی نێوان پەستان، قەبارە و پلەی گەرمی ڕەها.',
          kmr: 'Lêkolîna reftara gazên nimûneyî û têkiliya navbera pestan, qebare û germahiyê.',
          en: 'Behavior of ideal gases relating pressure, volume, and absolute temperature.',
        }),
        principle: loc({
          ar: 'تصف معادلة الحالة للغاز المثالي العلاقة الحركية بين ضغط الغاز وحجمه ودرجة حرارته المطلقة. يزداد ضغط الغاز بتصادم جزيئاته المسرعة مع جدران الإناء المعتمدة على الطاقة الحركية الحرارية.',
          bad: 'هاوکێشەیا بارێ گازا نموونەیی پەیوەندیا بزاڤی د ناڤبەرا پەستان، قەبارە و پلەیا گەرمیا رەهادا شڕۆڤە دکەت.',
          ku: 'هاوکێشەی باری گازی نموونەیی پەیوەندی جووڵە لە نێوان پەستانی گاز، قەبارەکەی و پلەی گەرمی ڕەهای ڕوون دەکاتەوە.',
          kmr: 'Hevkêşeya rewşa gaza nimûneyî têkiliya navbera pestan, qebare û pileya germahiya mutleq nîşan dide.',
          en: 'The ideal gas state equation relates pressure, volume, and absolute temperature. Pressure stems from molecular kinetic collisions against container walls.',
        }),
        equation: 'P × V = n × R × T',
        variables: [
          {
            symbol: 'P',
            name: loc({
              ar: 'ضغط الغاز',
              bad: 'پەستانا گازێ',
              ku: 'پەستانی گاز',
              kmr: 'Pestana gazê',
              en: 'Gas Pressure',
            }),
            unit: 'kPa',
            type: 'output',
            description: loc({
              ar: 'القوة الكلية الناتجة عن تصادمات الجزيئات لكل وحدة مساحة',
              bad: 'کۆما هێزا لێکدانا گەردان ل سەر ئێکەیا رووبەری',
              ku: 'کۆی هێزی بەریەککەوتنی گەردەکان بۆ سەر یەکەی ڕووبەر',
              kmr: 'Hêza giştî ya li ser rûberê',
              en: 'Total force per unit area from collisions',
            }),
          },
          {
            symbol: 'V',
            name: loc({
              ar: 'حجم الإناء',
              bad: 'قەبارەیا دەفری',
              ku: 'قەبارەی دەفر',
              kmr: 'Qebareya firaqê',
              en: 'Volume',
            }),
            unit: 'L',
            type: 'input',
            description: loc({
              ar: 'الحجم المتاح لحركة جزيئات الغاز',
              bad: 'ئەو قەبارەیا بەردەست بۆ لڤینا گەردێن گازێ',
              ku: 'ئەو قەبارەیەی بۆ جووڵەی گەردەکانی گاز بەردەستە',
              kmr: 'Qebareya berdest ji bo gerdenên gazê',
              en: 'Volume available for gas molecules',
            }),
          },
          {
            symbol: 'T',
            name: loc({
              ar: 'درجة الحرارة المطلقة',
              bad: 'پلەیا گەرمیا رەها',
              ku: 'پلەی گەرمی ڕەها',
              kmr: 'Germahiya mutleq',
              en: 'Absolute Temperature',
            }),
            unit: 'K',
            type: 'input',
            description: loc({
              ar: 'مقياس متوسط الطاقة الحركية لجزيئات الغاز',
              bad: 'پێڤەرێ تێکڕایێ وزەیا بزاڤێ یا گەردێن گازێ',
              ku: 'پێوەری تێکڕای جووڵەوزەی گەردەکانی گاز',
              kmr: 'Pîvana navîniya wizeya tevgerê ya gerdenan',
              en: 'Measure of average molecular kinetic energy',
            }),
          },
          {
            symbol: 'U',
            name: loc({
              ar: 'الطاقة الداخلية',
              bad: 'وزەیا ناڤخۆیی',
              ku: 'وزەی ناوەکی',
              kmr: 'Wizeya navxweyî',
              en: 'Internal Energy',
            }),
            unit: 'J',
            type: 'output',
            description: loc({
              ar: 'مجموع الطاقات الحركية الميكروسكوبية للجزيئات (U = 1.5 nRT)',
              bad: 'کۆما وزەیا بزاڤێ یا مایکڕۆسکۆپی یا گەردان (U = 1.5 nRT)',
              ku: 'کۆی جووڵەوزەی مایکڕۆسکۆپی گەردەکان (U = 1.5 nRT)',
              kmr: 'Koma wizeya tevgerê ya gerdenan',
              en: 'Sum of microscopic kinetic energies',
            }),
          },
        ],
        relationships: [
          {
            cause: loc({
              ar: 'T ↑ (رفع درجة الحرارة)',
              bad: 'T ↑ (بلندکرنا پلەیا گەرمیێ)',
              ku: 'T ↑ (بەرزکردنەوەی پلەی گەرمی)',
              kmr: 'T ↑ (Bilindkirina germahiyê)',
              en: 'T ↑ (Temperature increase)',
            }),
            effect: loc({
              ar: 'P ↑ (زيادة الضغط عند ثبوت الحجم)',
              bad: 'P ↑ (زێدەبوونا پەستانێ د قەبارەیا نەگوهۆڕدا)',
              ku: 'P ↑ (زیادبوونی پەستان لە قەبارەی نەگۆڕدا)',
              kmr: 'P ↑ (Zêdebûna pestanê)',
              en: 'P ↑ (Pressure increase)',
            }),
            type: 'direct',
            explanation: loc({
              ar: 'ارتفاع الحرارة يزيد سرعة الجزيئات وقوة تصادمها مع جدار الإناء مما يرفع الضغط (قانون غاي-لوساك).',
              bad: 'بلندبوونا پلەیا گەرمیێ لەزاتیا گەردان و لێکدانا وان دگەل دیوارێ دەفری زێدە دکەت کو دبیتە ئەگەرێ بلندبوونا پەستانێ.',
              ku: 'بەرزبوونەوەی پلەی گەرمی خێرایی گەردەکان و بەریەککەوتنیان لەگەڵ دیواری دەفرەکە زیاد دەکات کە دەبێتە هۆی بەرزبوونەوەی پەستان.',
              kmr: 'Bilindbûna germahiyê leza gerdenan zêde dike û pestan bilind dibe.',
              en: 'Higher temperature boosts kinetic velocity, driving more energetic wall collisions.',
            }),
          },
          {
            cause: loc({
              ar: 'V ↓ (تقليل الحجم)',
              bad: 'V ↓ (کێمکرنا قەبارەی)',
              ku: 'V ↓ (کەمکردنەوەی قەبارە)',
              kmr: 'V ↓ (Kêmkirina qebareyê)',
              en: 'V ↓ (Volume decrease)',
            }),
            effect: loc({
              ar: 'P ↑ (زيادة الضغط عند ثبوت الحرارة)',
              bad: 'P ↑ (زێدەبوونا پەستانێ د پلەیا گەرمیا نەگوهۆڕدا)',
              ku: 'P ↑ (زیادبوونی پەستان لە پلەی گەرمی نەگۆڕدا)',
              kmr: 'P ↑ (Zêdebûna pestanê)',
              en: 'P ↑ (Pressure increase)',
            }),
            type: 'inverse',
            explanation: loc({
              ar: 'تراكم الجزيئات في حجم أصغر يرفع معدل التصادمات مع السطح فيزداد الضغط (قانون بويل).',
              bad: 'کۆمبوونا گەردان د قەبارەیەکێ بچویکتر دا رێژەیا لێکدانان دگەل رووبەری زێدە دکەت لەوما پەستان بلند دبیت.',
              ku: 'کۆبوونەوەی گەردەکان لە قەبارەیەکی بچووکتردا تێکڕای بەریەککەوتنەکان لەگەڵ ڕووبەر زیاد دەکات و پەستان بەرز دەبێتەوە.',
              kmr: 'Kêmkirina qebareyê hejmara lihevketina gerdenan zêde dike.',
              en: 'Decreasing container volume increases collision frequency per unit area.',
            }),
          },
        ],
      };
    }

    // 5. Waves / Wave Equation
    if (category === 'waves' || id.includes('wave') || id.includes('sound')) {
      return {
        concept: loc({
          ar: 'خصائص انتشار الموجات الميكانيكية والعلاقة بين السرعة والتردد والطول الموجي.',
          bad: 'تایبەتمەندیێن بەلاڤبوونا پێلێن میکانیکی و پەیوەندیا د ناڤبەرا لەزاتی، فرێکوێنس و درێژیا پێلێدا.',
          ku: 'تایبەتمەندییەکانی بڵاوبوونەوەی شەپۆلە میکانیکییەکان و پەیوەندی نێوان خێرایی، فرێکوێنس و درێژی شەپۆل.',
          kmr: 'Taybetmendiyên belavbûna pêlên mekanîkî û têkiliya lez, frekans û dirêjahiya pêlê.',
          en: 'Mechanical wave propagation relating velocity, frequency, and wavelength.',
        }),
        principle: loc({
          ar: 'تنتشر الاضطرابات الموجية عبر الوسط بنقل الطاقة دون نقل المادة. تتحدد سرعة الموجة بخواص الوسط الفيزيائية وتساوي حاصل ضرب التردد في الطول الموجي.',
          bad: 'پێل ب رێکا ناڤەندی وزەیێ دگوهێزن بێی گوهێزتنا ماددەی. لەزاتیا پێلێ ب تایبەتمەندیێن فیزیکی یێن ناڤەندی ڤە گرێدایە.',
          ku: 'شەپۆلەکان بەناو ناVendorدا بە گواستنەوەی وزە بەبێ گواستنەوەی ماددە بڵاودەبنەوە. خێرایی شەپۆل بەستراوە بە تایبەتمەندییە فیزیکییەکانی ناVendorەکەوە.',
          kmr: 'Pêl bêyî veguhastina madeyê wizeyê vediguhêzin.',
          en: 'Wave disturbances propagate energy through a medium without mass transport. Wave speed depends on medium properties and equals frequency times wavelength.',
        }),
        equation: 'v = f × λ   ,   T = 1 / f',
        variables: [
          {
            symbol: 'v',
            name: loc({
              ar: 'سرعة انتشار الموجة',
              bad: 'لەزاتیا بەلاڤبوونا پێلێ',
              ku: 'خێرایی بڵاوبوونەوەی شەپۆل',
              kmr: 'Leza belavbûna pêlê',
              en: 'Wave Speed',
            }),
            unit: 'm/s',
            type: 'output',
            description: loc({
              ar: 'المسافة التي تقطعها قمة الموجة في الثانية',
              bad: 'ئەو دویراتیا کو لویتکەیا پێلێ د ئێک چرکے دا دبڕیت',
              ku: 'ئەو دوورییەی لوتکەی شەپۆل لە یەک چرکەدا دەیبڕێت',
              kmr: 'Dûriya ku lûtkeya pêlê di çirkekê de dibire',
              en: 'Distance wave crest travels per second',
            }),
          },
          {
            symbol: 'f',
            name: loc({
              ar: 'تردد الموجة',
              bad: 'فرێکوێنس (لەرەلەر)',
              ku: 'فرێکوێنسی (لەرەلەر)',
              kmr: 'Frekans',
              en: 'Frequency',
            }),
            unit: 'Hz',
            type: 'input',
            description: loc({
              ar: 'عدد الاهتزازات الكاملة في الثانية الواحدة',
              bad: 'هژمارا لەرینێن تەمام د ئێک چرکے دا',
              ku: 'ژمارەی لەرینەوە تەواوەکان لە یەک چرکەدا',
              kmr: 'Hejmara hejandinên temam di çirkekê de',
              en: 'Number of oscillations per second',
            }),
          },
          {
            symbol: 'λ',
            name: loc({
              ar: 'الطول الموجي',
              bad: 'درێژیا پێلێ',
              ku: 'درێژیی شەپۆل',
              kmr: 'Dirêjahiya pêlê',
              en: 'Wavelength',
            }),
            unit: 'm',
            type: 'input',
            description: loc({
              ar: 'المسافة بين قمتين متتاليتين أو قاعين متتاليين',
              bad: 'دویراتیا د ناڤبەرا دوو لویتکەیێن ل دووڤ ئێک یان دوو بنیێن ل دووڤ ئێک',
              ku: 'دووری نێوان دوو لوتکەی یەک لەدوای یەک یان دوو بنکەی یەک لەدوای یەک',
              kmr: 'Dûriya navbera du lûtkeyên li pey hev',
              en: 'Distance between consecutive crests',
            }),
          },
          {
            symbol: 'T',
            name: loc({
              ar: 'زمن الدورة',
              bad: 'دەمێ خۆلێ',
              ku: 'کاتی خول',
              kmr: 'Dema dorê',
              en: 'Period',
            }),
            unit: 's',
            type: 'output',
            description: loc({
              ar: 'زمن مرار قمة موجية كاملة عبر نقطة ثابتة',
              bad: 'دەمێ پێدڤی بۆ دەربازبوونا پێلەکا تەمام ب سەر خالەکا جێگیر را',
              ku: 'کاتی پێویست بۆ تێپەڕبوونی شەپۆلێکی تەواو بەسەر خاڵێکی جێگیردا',
              kmr: 'Dema derbasbûna pêleke temam',
              en: 'Time for one complete wave to pass',
            }),
          },
        ],
        relationships: [
          {
            cause: loc({
              ar: 'f ↑ (زيادة التردد)',
              bad: 'f ↑ (زێدەکرنا فرێکوێنسی)',
              ku: 'f ↑ (زیادکردنی فرێکوێنس)',
              kmr: 'f ↑ (Zêdekirina frekansê)',
              en: 'f ↑ (Frequency increase)',
            }),
            effect: loc({
              ar: 'λ ↓ (تناقص الطول الموجي عند ثبوت السرعة)',
              bad: 'λ ↓ (کێمبوونا درێژیا پێلێ د لەزاتیا نەگوهۆڕدا)',
              ku: 'λ ↓ (کەمبوونی درێژی شەپۆل لە خێرایی نەگۆڕدا)',
              kmr: 'λ ↓ (Kêmbûna dirêjahiya pêlê)',
              en: 'λ ↓ (Wavelength decrease)',
            }),
            type: 'inverse',
            explanation: loc({
              ar: 'عند انتشار الموجة في نفس الوسط تكون السرعة ثابتة، فيؤدي زيادة التردد لتقارب القمم وانخفاض الطول الموجي.',
              bad: 'دەمێ بەلاڤبوونا پێلێ د هەمان ناڤەندیدا لەزاتی نەگوهۆڕە، زێدەبوونا فرێکوێنسی دبیتە ئەگەرێ کورتبوونا درێژیا پێلێ.',
              ku: 'لەکاتی بڵاوبوونەوەی شەپۆل لە هەمان ناVendorدا خێرایی نەگۆڕە، زیادبوونی فرێکوێنس دەبێتە هۆی کەمبوونەوەی درێژی شەپۆل.',
              kmr: 'Dema lez sabît be, zêdebûna frekansê dibe sedema kurtbûna dirêjahiya pêlê.',
              en: 'In a fixed medium, velocity stays constant; higher frequency shortens wavelength.',
            }),
          },
        ],
      };
    }

    // Fallback Generic Experiment Theory Structure
    return {
      concept: getLocalizedText(experiment.description),
      principle: getLocalizedText(experiment.explanation),
      equation: experiment.physicalLaw || 'F = f(x, y, z)',
      variables: [
        ...(experiment.parameters || []).map((p) => ({
          symbol: p.id,
          name: getLocalizedText(p.label),
          unit: p.unit || '',
          type: 'input' as const,
        })),
        ...(experiment.outputMetrics || []).map((o) => ({
          symbol: o.symbol || o.id,
          name: getLocalizedText(o.label),
          unit: o.unit || '',
          type: 'output' as const,
        })),
      ],
      relationships: [
        {
          cause: loc({
            ar: 'تعديل المعاملات الابتدائية',
            bad: 'دەستکاریکرنا پێوەرێن دەستپێکی',
            ku: 'دەستکاریکردنی پێوەرە سەرەتاییەکان',
            kmr: 'Guhertina pîvanên destpêkê',
            en: 'Adjusting Input Parameters',
          }),
          effect: loc({
            ar: 'تغير النتائج والمخرجات المحسوبة',
            bad: 'گوهۆڕینا ئەنجام و بڕێن هژمارکری',
            ku: 'گۆڕانی دەرئەنجام و بڕە هەژمارکراوەکان',
            kmr: 'Guhertina encamên hesibandî',
            en: 'Dynamically alters system output metrics',
          }),
          type: 'direct',
          explanation: getLocalizedText(experiment.whatHappened),
        },
      ],
    };
  };

  const theory = getTheoryData();

  const titleText = loc({
    ar: 'الشرح العلمي والنظرية الفيزيائية',
    bad: 'شڕۆڤەکرنا زانستی و بیردۆزا فیزیکی',
    ku: 'ڕوونکردنەوەی زانستی و تیۆری فیزیکی',
    kmr: 'Şîroveya Zanistî û Teoriya Fîzîkî',
    en: 'Theory & Physics Explanation',
  });

  const conceptHeader = loc({
    ar: 'المفهوم والمبدأ الفيزيائي',
    bad: 'چەمک و پرەنسیپێ فیزیکی',
    ku: 'چەمک و بنەمای فیزیکی',
    kmr: 'Têgîn û Prensîba Fîzîkî',
    en: 'Concept & Physical Principle',
  });

  const mainEquationHeader = loc({
    ar: 'المعادلة الرئيسية والقانون',
    bad: 'هاوکێشەیا سەرەکی و یاسای',
    ku: 'هاوکێشەی سەرەکی و یاسای زانستی',
    kmr: 'Hevkêşeya Sereke û Zagon',
    en: 'Main Governing Equation',
  });

  const variablesHeader = loc({
    ar: 'رموز ومعاملات التجربة',
    bad: 'هێما و گوهۆڕۆکێن تاقیکرنێ',
    ku: 'هێما و گۆڕاوەکانی تاقیکردنەوە',
    kmr: 'Hêma û Guhêrbarên Ceribandinê',
    en: 'Experiment Variables & Symbols',
  });

  const relationshipsHeader = loc({
    ar: 'العلاقات والتأثيرات المباشرة',
    bad: 'پەیوەندیێن فیزیکی و کارتێکرن',
    ku: 'پەیوەندییە فیزیکییەکان و کاریگەرییەکان',
    kmr: 'Têkiliyên Fîzîkî û Bandor',
    en: 'Physical Relationships & Effects',
  });

  const collapseText = loc({
    ar: 'طَيّ',
    bad: 'نڤیسینگەهـ / کۆمکرن',
    ku: 'کۆکردنەوە',
    kmr: 'Nihandin',
    en: 'Collapse',
  });

  const expandText = loc({
    ar: 'توسيع',
    bad: 'بەرفرەهـ کرن',
    ku: 'فراوانکردن',
    kmr: 'Berfirehkirin',
    en: 'Expand',
  });

  const formulaCaption = loc({
    ar: 'الصيغة الرياضية الأساسية الحاكمة للمحاكاة الحية',
    bad: 'شێوازێ بیرکاری یێ سەرەکی رێبەریکەرێ سیمیولەیشنێ',
    ku: 'شێوازی بیرکارییانەی سەرەکی ڕێبەریکەری هاوشێوەسازی',
    kmr: 'Formûla bîrkarî ya sereke ya simulasyonê',
    en: 'Governing mathematical formula driving the simulation',
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
      {/* Collapsible Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-900/80 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <span>{titleText}</span>
            </h2>
            <span className="text-xs font-mono text-cyan-400 font-semibold block mt-0.5">
              {experiment.physicalLaw}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
          aria-label="Toggle Theory Section"
        >
          <span className="hidden sm:inline">
            {isExpanded ? collapseText : expandText}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-cyan-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-cyan-400" />
          )}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6 bg-slate-950/40 divide-y divide-slate-800/60">
          {/* Section 1: Concept & Physical Principle */}
          <div className="space-y-3 pt-1">
            <h3 className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span>{conceptHeader}</span>
            </h3>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {theory.concept}
              </p>
              <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-sans pt-2 border-t border-slate-800/60">
                {theory.principle}
              </p>
            </div>
          </div>

          {/* Section 2: Main Governing Equation Card */}
          <div className="space-y-3 pt-5">
            <h3 className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span>{mainEquationHeader}</span>
            </h3>
            <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30 text-center shadow-inner space-y-2">
              <div
                dir="ltr"
                className="font-mono text-base sm:text-xl font-extrabold text-cyan-300 tracking-wider overflow-x-auto py-1"
              >
                {theory.equation}
              </div>
              <span className="text-[11px] text-slate-400 block font-sans">
                {formulaCaption}
              </span>
            </div>
          </div>

          {/* Section 3: Variables & Symbols Table */}
          <div className="space-y-3 pt-5">
            <h3 className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>{variablesHeader}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {theory.variables.map((v, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col justify-between space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span
                      dir="ltr"
                      className="font-mono font-black text-sm text-cyan-300 px-2 py-0.5 rounded bg-slate-950 border border-slate-800"
                    >
                      {v.symbol}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        v.type === 'input'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : v.type === 'output'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {v.unit ? v.unit : 'SI'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">
                      {v.name}
                    </span>
                    {v.description && (
                      <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                        {v.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Physical Relationships & Effects */}
          <div className="space-y-3 pt-5">
            <h3 className="text-xs sm:text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>{relationshipsHeader}</span>
            </h3>
            <div className="space-y-2">
              {theory.relationships.map((rel, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-200">
                    <span className="text-sky-300 px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                      {rel.cause}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0 rtl:rotate-180" />
                    <span className="text-emerald-300 px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                      {rel.effect}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {rel.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
