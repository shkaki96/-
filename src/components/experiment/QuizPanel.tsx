import React, { useState, useMemo } from 'react';
import { Experiment } from '../../types/experiment';
import { useTranslation } from '../../i18n/useTranslation';
import {
  Brain,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface QuizPanelProps {
  experiment: Experiment;
}

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QuizPanel: React.FC<QuizPanelProps> = ({ experiment }) => {
  const { language } = useTranslation();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [answersHistory, setAnswersHistory] = useState<
    { selected: number; isCorrect: boolean }[]
  >([]);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  // Robust multi-language resolver helper
  const loc = (texts: { ar: string; en: string; ku: string; kmr: string; bad: string }): string => {
    if (language === 'bad') return texts.bad;
    if (language === 'ku') return texts.ku;
    if (language === 'kmr') return texts.kmr;
    if (language === 'ar') return texts.ar;
    return texts.en;
  };

  // Generate physics quiz questions dynamically based on experiment characteristics
  const questions: Question[] = useMemo(() => {
    const id = experiment.id.toLowerCase();
    const cat = experiment.category;

    // 1. Simple Harmonic Motion / Pendulum
    if (id.includes('pendulum') || id.includes('harmonic')) {
      return [
        {
          id: 1,
          questionText: loc({
            ar: 'على ماذا يعتمد الزمن الدوري (T) للبندول البسيط في حالة الإزاحات الصغيرة؟',
            bad: 'ل سەر چی دەمێ خۆلا تەمام (T) یا پەندۆلێ سادە د گۆشەیێن بچووک دا د راوەستیت؟',
            ku: 'کاتی خولی تەواو (T) بۆ پاندۆڵی سادە لە گۆشە بچووکەکاندا بەستراوە بە چییەوە؟',
            kmr: 'Dema dora temam (T) ji bo pendula sade di goşeyên piçûk de bi çi ve girêdayî ye?',
            en: 'What determines the period (T) of a simple pendulum at small angle displacements?',
          }),
          options: [
            loc({
              ar: 'طول الخيط وتسارع الجاذبية فقط',
              bad: 'ب تنێ درێژیا بەندی و تاودانا کێشکرنا عەردی',
              ku: 'تەنها درێژیی پەت و تاودانی کێشکردنی زەوی',
              kmr: 'Tenê dirêjahiya ben û lezkirina kêşana erdê',
              en: 'String length and local gravitational acceleration only',
            }),
            loc({
              ar: 'كتلة الثقل المعلق وسعة الاهتزاز',
              bad: 'بارستەیا تۆپکا هەلاویستی و فراوانیا هەژانێ',
              ku: 'بارستایی تۆپەکە و فراوانی لەرینەوە',
              kmr: 'Masa giranîyê û firehiya hejandinê',
              en: 'Mass of the bob and initial amplitude',
            }),
            loc({
              ar: 'لون الخيط ومادته الصانعة',
              bad: 'رەنگێ بەندی و ماددێ چێکەرێ وێ',
              ku: 'ڕەنگی پەت و جۆری ماددەکەی',
              kmr: 'Rengê ben û cureyê madeyê',
              en: 'Color and material of the string',
            }),
            loc({
              ar: 'مساحة سطح غرفة التجربة',
              bad: 'رووبەرێ ژوورا تاقیکرنێ',
              ku: 'ڕووبەری ژووری تاقیکردنەوە',
              kmr: 'Rûbera odeya ceribandinê',
              en: 'Surface area of the room',
            }),
          ],
          correctIndex: 0,
          explanation: loc({
            ar: 'الزمن الدوري للبندول T = 2π√(L/g) يعتمد حصرياً على طول الخيط (L) والجاذبية (g) ومستقل تماماً عن الكتلة والسعة.',
            bad: 'دەمێ خۆلا تەمام T = 2π√(L/g) ب تنێ ب درێژیا بەندی (L) و کێشکرنا عەردی (g) ڤە گرێدایە و ژ بارستەیێ سەربەخۆیە.',
            ku: 'کاتی خولی پاندۆڵ T = 2π√(L/g) تەنها بەستراوە بە درێژی پەت (L) و هێزی کێشکردن (g) و سەربەخۆیە لە بارستایی.',
            kmr: 'Dema dorê T = 2π√(L/g) tenê bi dirêjahiya ben û kêşanê ve girêdayî ye.',
            en: 'Pendulum period T = 2π√(L/g) depends solely on string length (L) and gravity (g), and is mass-independent.',
          }),
        },
        {
          id: 2,
          questionText: loc({
            ar: 'إذا قمنا بمضاعفة طول خيط البندول أربع مرات (4L)، فكم يصبح الزمن الدوري (T)؟',
            bad: 'ئەگەر درێژیا بەندێ پەندۆلی (L) چوار جاران بهێتە زێدەکرن (4L)، دەمێ خۆلێ (T) چ لێ دهێت؟',
            ku: 'ئەگەر درێژی پەتی پاندۆڵەکە چوار هێندە زیاد بکەین (4L)، کاتی خول (T) چۆن دەگۆڕێت؟',
            kmr: 'Heke em dirêjahiya benê pendulê çar qat zêde bikin (4L), dema dorê (T) çi dibe?',
            en: 'If the pendulum length is increased 4 times (4L), what happens to its period (T)?',
          }),
          options: [
            loc({
              ar: 'يتضاعف مرتين فقط (2T)',
              bad: 'دوو جاران زێدە دبیت (2T)',
              ku: 'دوو هێندە زیاد دەکات (2T)',
              kmr: 'Du qat zêde dibe (2T)',
              en: 'Doubles (2T)',
            }),
            loc({
              ar: 'يتضاعف أربع مرات (4T)',
              bad: 'چوار جاران زێدە دبیت (4T)',
              ku: 'چوار هێندە زیاد دەکات (4T)',
              kmr: 'Çar qat zêde dibe (4T)',
              en: 'Quadruples (4T)',
            }),
            loc({
              ar: 'يقل إلى النصف (0.5T)',
              bad: 'کێم دبیت بۆ نیڤێ (0.5T)',
              ku: 'کەم دەکات بۆ نیوە (0.5T)',
              kmr: 'Dadikeve nîvî (0.5T)',
              en: 'Halves (0.5T)',
            }),
            loc({
              ar: 'يبقى ثابتاً دون تغير',
              bad: 'بێ گوهۆڕین دمینیت',
              ku: 'بە جێگیری دەمێنێتەوە',
              kmr: 'Wek xwe dimîne',
              en: 'Remains unchanged',
            }),
          ],
          correctIndex: 0,
          explanation: loc({
            ar: 'الزمن الدوري يتناسب طردياً مع جذر الطول: √4 = 2، وبالتالي يتضاعف الزمن الدوري مرتين.',
            bad: 'دەمێ خۆلێ ب شێوەیێ راستەوانە دگەل رەگێ دووجایێ درێژیێ دگۆهۆڕیت: √4 = 2، لەوما دەمێ خۆلێ دوو جاران زێدە دبیت.',
            ku: 'کاتی خول بەشێوەی ڕاستەوانە لەگەڵ ڕەگی دووجای درێژی دەگۆڕێت: √4 = 2، کەواتە کاتی خول دوو هێندە دەبێت.',
            kmr: 'Dema dorê bi koka çargoşeyê ya dirêjahiyê ve têkildar e: √4 = 2.',
            en: 'Periodic time scales with the square root of length: √4 = 2, so the period doubles.',
          }),
        },
        {
          id: 3,
          questionText: loc({
            ar: 'ما هو تأثير زيادة كتلة الثقل (m) على الزمن الدوري للبندول؟',
            bad: 'کارتێکرنا زێدەکرنا بارستەیا تەنی (m) ل سەر دەمێ خۆلا پەندۆلی چییە؟',
            ku: 'کاریگەری زیادکردنی بارستایی تەن (m) لەسەر کاتی خولی پاندۆڵ چییە؟',
            kmr: 'Bandora zêdekirina barsteyê (m) li ser dema dora pendulê çi ye?',
            en: 'What effect does increasing bob mass (m) have on pendulum period (T)?',
          }),
          options: [
            loc({
              ar: 'لا يؤثر إطلاقاً ويبقى الزمن الدوري ثابتاً',
              bad: 'چ کارتێکرنێ ناکەت و دەمێ خۆلێ ناگوهۆڕیت',
              ku: 'هیچ کاریگەرییەکی نییە و کاتی خول بە نەگۆڕی دەمێنێتەوە',
              kmr: 'Tu bandorê nake û dema dorê wek xwe dimîne',
              en: 'No effect whatsoever; period remains constant',
            }),
            loc({
              ar: 'يزداد الزمن الدوري بنسبة خطية',
              bad: 'دەمێ خۆلێ ب شێوەیەکێ هێڵی زێدە دبیت',
              ku: 'کاتی خول بەشێوەی هێڵی زیاد دەکات',
              kmr: 'Dema dorê bi awayekî xêzî zêde dibe',
              en: 'Period increases linearly',
            }),
            loc({
              ar: 'يقل الزمن الدوري للنصف',
              bad: 'دەمێ خۆلێ کێم دبیت بۆ نیڤێ',
              ku: 'کاتی خول کەم دەبێتەوە بۆ نیوە',
              kmr: 'Dema dorê dadikeve nîvî',
              en: 'Period decreases by half',
            }),
            loc({
              ar: 'يتوقف البندول عن الحركة',
              bad: 'پەندۆل ژ لڤینێ د راوەستیت',
              ku: 'پاندۆڵەکە لە جووڵە دەوەستێت',
              kmr: 'Pendul ji tevgerê radiweste',
              en: 'Pendulum ceases motion',
            }),
          ],
          correctIndex: 0,
          explanation: loc({
            ar: 'الكتلة تزيد القصور الذاتي وقوة الجاذبية بنفس المقدار فيلغي كل منهما أثر الآخر تماماً.',
            bad: 'بارستە تەوژمێ مانێ و هێزا کێشکرنێ ب هەمان رێژە زێدە دکەت، لەوما چ کارتێکرنەکێ ل سەر دەمێ خۆلێ ناکەت.',
            ku: 'بارستایی سستی و هێزی کێشکردن بە هەمان بڕ زیاد دەکات، بۆیە یەکتری بێکاریگەر دەکەن و کاتی خول ناگۆڕێت.',
            kmr: 'Barste hêza giraniyê û leza bergiriyê bi heman rêjeyê zêde dike, lewma bandorê nake.',
            en: 'Inertia and gravitational force increase equally with mass, cancelling out mass dependence.',
          }),
        },
      ];
    }

    // 2. Optics / Refraction / Snell's Law
    if (cat === 'optics' || id.includes('optics') || id.includes('refraction')) {
      return [
        {
          id: 1,
          questionText: loc({
            ar: 'عند انتقال شعاع ضوئي من الهواء (n₁ = 1.0) إلى الزجاج (n₂ = 1.5)، ماذا يحدث لسرعة الضوء وزاوية الانكسار؟',
            bad: 'دەمێ تیشکەکا رووناهیێ ژ هەوای (n₁ = 1.0) دەرباز دبیت بۆ شوشەی (n₂ = 1.5)، چ ل گۆشەیا شکەستنێ (θ₂) و لەزاتیا رووناهیێ دهێت؟',
            ku: 'کاتی تێپەڕبوونی تیشکی ڕووناکی لە هەواوە (n₁ = 1.0) بۆ شوشە (n₂ = 1.5)، چی بەسەر خێرایی و گۆشەی شکانەوەدا دێت؟',
            kmr: 'Dema tîrêja ronahiyê ji hewayê derbasî camê dibe, lez û goşeya şikestinê çi dibin?',
            en: 'When light travels from air (n₁ = 1.0) into glass (n₂ = 1.5), what happens to speed and refraction angle?',
          }),
          options: [
            loc({
              ar: 'تقل سرعة الضوء وينكسر الشعاع مقترباً من العمود (θ₂ < θ₁)',
              bad: 'لەزاتی کێم دبیت و تیشک بەرەڤ هێلا ستوونی دچەمیت (θ₂ < θ₁)',
              ku: 'خێرایی کەم دەکات و تیشکەکە نزیک دەبێتەوە لە هێڵی ستوون (θ₂ < θ₁)',
              kmr: 'Lez kêm dibe û tîrêj nêzîkî xeta stûnî dibe (θ₂ < θ₁)',
              en: 'Light slows down and bends toward normal (θ₂ < θ₁)',
            }),
            loc({
              ar: 'تزداد سرعة الضوء وينكسر مبتعداً عن العمود',
              bad: 'لەزاتی زێدە دبیت و تیشک ژ هێلا ستوونی دویر دکەڤیت',
              ku: 'خێرایی زیاد دەکات و تیشکەکە لە هێڵی ستوون دوور دەکەوێتەوە',
              kmr: 'Lez zêde dibe û tîrêj ji xeta stûnî dûr dikeve',
              en: 'Light accelerates and bends away from normal',
            }),
            loc({
              ar: 'تبقى السرعة والزاوية ثابتتين دون تغير',
              bad: 'لەزاتی و ئاراستە چ ناگوهۆڕن',
              ku: 'خێرایی و گۆشە بە جێگیری دەمێننەوە',
              kmr: 'Lez û goşe wek xwe dimînin',
              en: 'Speed and angle remain entirely unchanged',
            }),
            loc({
              ar: 'ينعكس الشعاع كلياً بشكل فوري',
              bad: 'رووناهی ب تەمامی دزڤڕیتە ڤە',
              ku: 'تیشکەکە دەستبەجێ بە تەواوەتی دەداتەوە',
              kmr: 'Tîrêj bi tevahî vedigere',
              en: 'Light instantly undergoes total reflection',
            }),
          ],
          correctIndex: 0,
          explanation: loc({
            ar: 'الزجاج وسط ذو كثافة بصرية أعلى (معامل انكسار أكبر)، مما يبطئ سرعة انتشار الضوء ويحرفه باتجاه العمود المقام.',
            bad: 'شوشە ناڤەندەکا چڕترە ژ هەوای، لەوما لەزاتیا رووناهیێ کێم دبیت و تیشک بەرەڤ هێلا ستوونی دچەمیت.',
            ku: 'شوشە چڕیی بینایی زیاترە و خێرایی ڕووناکی کەم دەکاتەوە، بۆیە تیشکەکە دەچەمێتەوە بەرەو هێڵی ستوون.',
            kmr: 'Cam navgîneke çڕtir e, loma leza ronahiyê kêm dibe û tîrêj nêzîkî stûnê dibe.',
            en: 'Glass has a higher refractive index, reducing light speed (v = c/n) and bending the ray toward the normal.',
          }),
        },
        {
          id: 2,
          questionText: loc({
            ar: 'ما هو الشرط الأساسي لحدوث ظاهرة الانعكاس الكلي الداخلي (Total Internal Reflection)؟',
            bad: 'مەرجێ سەرەکی یێ رویدانا ڤەگەڕیانا تەمام یا ناڤخۆیی (Total Internal Reflection) چییە؟',
            ku: 'مەرجی سەرەکی بۆ ڕوودانی دانەوەی تەواوەتی ناوەکی (Total Internal Reflection) چییە؟',
            kmr: 'Mercê sereke yê vegera tam a hundirîn çi ye?',
            en: 'What is the required condition for Total Internal Reflection to occur?',
          }),
          options: [
            loc({
              ar: 'الانتقال من وسط أكبر كثافة لوسط أقل بزاوية سقوط أكبر من الزاوية الحرجة (θ₁ > θc)',
              bad: 'دەربازبوون ژ ناڤەندەکا چڕتر بۆ یا کێمچڕتر و گۆشەیا لێدانێ مەزنتر بیت ژ یا کریتیک (θ₁ > θc)',
              ku: 'چوون لە ناVendی چڕترەوە بۆ کەمچڕتر بە گۆشەیەک کە گەورەتر بێت لە گۆشەی مۆڵەقە (θ₁ > θc)',
              kmr: 'Derbasbûn ji navgîna çڕ ber bi kêmçڕ ve bi goşeya ji ya krîtîk mezintir (θ₁ > θc)',
              en: 'Moving from higher to lower index medium at incident angle greater than critical angle (θ₁ > θc)',
            }),
            loc({
              ar: 'السقوط بزاوية عمودية تماماً (θ₁ = 0°)',
              bad: 'لێدان ب گۆشەیەکا ستوونی (θ₁ = 0°)',
              ku: 'لێدان بە گۆشەی ستوونی تەواو (θ₁ = 0°)',
              kmr: 'Lêdan bi awayekî stûnî (θ₁ = 0°)',
              en: 'Incidence at normal angle (θ₁ = 0°)',
            }),
            loc({
              ar: 'الانتقال من وسط أقل كثافة لوسط أكبر كثافة',
              bad: 'دەربازبوون ژ ناڤەندەکا کێمچڕ بۆ یا چڕتر',
              ku: 'گواستنەوە لە ناVendی کەمچڕەوە بۆ چڕتر',
              kmr: 'Derbasbûn ji navgîna kêmçڕ ber bi ya çڕ ve',
              en: 'Moving from lower to higher refractive index',
            }),
            loc({
              ar: 'استخدام ضوء أبيض حصرياً',
              bad: 'بکارئینانا رووناهیا سپی ب تنێ',
              ku: 'بەکارهێنانی تەنها ڕووناکی سپی',
              kmr: 'Bikaranîna ronahiya spî tenê',
              en: 'Using white light exclusively',
            }),
          ],
          correctIndex: 0,
          explanation: loc({
            ar: 'شرطا الانعكاس الكلي الداخلي: الانتقال من وسط أكبر معامل انكسار لوسط أقل، وأن تتجاوز زاوية السقوط الزاوية الحرجة sin(θc) = n₂/n₁.',
            bad: 'ڤەگەڕیانا تەمام یا ناڤخۆیی پێدڤی ب دەربازبوونێ هەیە ژ ناڤەندەکا چڕتر بۆ یا کێمچڕتر و گۆشەیا لێدانێ مەزنتر بیت ژ گۆشەیا کریتیک sin(θc) = n₂/n₁.',
            ku: 'مەرجەکانی دانەوەی تەواوەتی: چوون لە ناVendی چڕترەوە بۆ کەمچڕتر، و گۆشەی لێدان گەورەتر بێت لە گۆشەی مۆڵەقە sin(θc) = n₂/n₁.',
            kmr: 'Mercê vegera tam: derbasbûn ji navgîna çڕ ber bi kêmçڕ ve bi goşeya ji ya krîtîk mezintir.',
            en: 'Total internal reflection requires moving from higher to lower index medium at θ₁ > θc where sin(θc) = n₂/n₁.',
          }),
        },
        {
          id: 3,
          questionText: loc({
            ar: 'ما هي وحدة قياس معامل الانكسار (n)؟',
            bad: 'ئێکەیا پێڤانا هاوکۆلکێ شکەستنێ (n) چییە؟',
            ku: 'یەکەی پێوانەی هاوکۆڵکەی شکانەوە (n) چییە؟',
            kmr: 'Yekeya hevkêşana şikestinê (n) çi ye?',
            en: 'What is the unit of measure for refractive index (n)?',
          }),
          options: [
            loc({
              ar: 'بدون وحدة قياس (كمية غير بعدية)',
              bad: 'بێ ئێکەیە (بڕەکێ بێ ئێکە)',
              ku: 'بێ یەکەی پێوانەیە (بڕێکی بێ یەکە)',
              kmr: 'Bê yeke ye (kodans)',
              en: 'Dimensionless (no unit)',
            }),
            loc({
              ar: 'متر / ثانية',
              bad: 'مەتر / چرکە',
              ku: 'مەتر / چرکە',
              kmr: 'Metre / çirke',
              en: 'Meters / second',
            }),
            loc({
              ar: 'درجة قوسية °',
              bad: 'پلەیا گۆشەیی °',
              ku: 'پلەی گۆشەیی °',
              kmr: 'Pileyên goşeyî °',
              en: 'Degrees °',
            }),
            loc({
              ar: 'راديان',
              bad: 'رادیان',
              ku: 'ڕادیان',
              kmr: 'Radyan',
              en: 'Radians',
            }),
          ],
          correctIndex: 0,
          explanation: loc({
            ar: 'معامل الانكسار نسبة بين سرعتين n = c/v، لذا فهو كمية عددية مجردة بدون وحدة.',
            bad: 'هاوکۆلکێ شکەستنێ رێژەیا د ناڤبەرا دوو لەزاتیایە n = c/v، لەوما بڕەکێ بێ ئێکەیە.',
            ku: 'هاوکۆڵکەی شکانەوە بریتییە لە ڕێژەی نێوان دوو خێرایی n = c/v، بۆیە بڕێکی بێ یەکەیە.',
            kmr: 'Hevkêşana şikestinê rêjeya navbera du lezan e n = c/v, lewma bê yeke ye.',
            en: 'Refractive index is a speed ratio n = c/v, making it a dimensionless unitless quantity.',
          }),
        },
      ];
    }

    // 3. Electricity / Ohm's Law
    if (cat === 'electricity' || id.includes('circuit') || id.includes('ohm')) {
      return [
        {
          id: 1,
          questionText: loc({
            ar: 'طبقاً لقانون أوم (V = I × R)، إذا تضاعفت المقاومة الكهربائية (R) لمرتين مع ثبات فرق الجهد (V)، فماذا يحدث لشدة التيار (I)؟',
            bad: 'ل دووڤ یاسایا ئۆمی (V = I × R)، ئەگەر بەرگریا کارەبایی (R) دوو جاران بهێتە زێدەکرن د دەمێ نەگوهۆڕینا ڤۆڵتیێ دا، توندیا تەزووی (I) چ لێ دهێت؟',
            ku: 'بەپێی یاسای ئۆم (V = I × R)، ئەگەر بەرگری کارەبایی (R) دوو هێندە زیاد بکات لەکاتی جێگیری ڤۆڵتیە (V)، چی بەسەر توندی تەزوو (I) دێت؟',
            kmr: 'Li gorî zagona Ohm (V = I × R), heke bergirî (R) du qat bibe di voltaja sabît de, herikîn (I) çi dibe?',
            en: 'According to Ohm’s Law (V = I × R), if resistance (R) doubles while voltage (V) remains constant, current (I) will:',
          }),
          options: [
            loc({
              ar: 'تنخفض إلى النصف (0.5 I)',
              bad: 'کێم دبیت بۆ نیڤێ (0.5 I)',
              ku: 'کەم دەبێتەوە بۆ نیوە (0.5 I)',
              kmr: 'Dadikeve nîvî (0.5 I)',
              en: 'Halve (0.5 I)',
            }),
            loc({
              ar: 'تتضاعف مرتين (2 I)',
              bad: 'دوو جاران زێدە دبیت (2 I)',
              ku: 'دوو هێندە زیاد دەکات (2 I)',
              kmr: 'Du qat dibe (2 I)',
              en: 'Double (2 I)',
            }),
            loc({
              ar: 'تتضاعف أربعة أضعاف',
              bad: 'چوار جاران زێدە دبیت',
              ku: 'چوار هێندە زیاد دەکات',
              kmr: 'Çar qat dibe',
              en: 'Quadruple',
            }),
            loc({
              ar: 'تبقى ثابتاً دون تغير',
              bad: 'بێ گوهۆڕین دمینیت',
              ku: 'بێ گۆڕان دەمێنێتەوە',
              kmr: 'Wek xwe dimîne',
              en: 'Remain unchanged',
            }),
          ],
          correctIndex: 0,
          explanation: loc({
            ar: 'التيار I = V / R يتناسب عكسياً مع المقاومة R، لذا فإن مضاعفة المقاومة تقلل التيار للنصف.',
            bad: 'تەزوو I = V / R ب شێوەیەکێ پێچەوانە دگەل بەرگریێ دگۆهۆڕیت، لەوما دووبارەکرنا بەرگریێ تەزووی دکەتە نیڤ.',
            ku: 'تەزوو I = V / R پێچەوانە دەگۆڕێت لەگەڵ بەرگری R، بۆیە دوو هێندەکردنی بەرگری تەزوو دەکاتە نیوە.',
            kmr: 'Herikîn I = V / R bi bergiriyê re berevajî ye, loma bergirî zêde bibe herikîn kêm dibe.',
            en: 'Current I = V / R is inversely proportional to resistance R, so doubling resistance halves current.',
          }),
        },
        {
          id: 2,
          questionText: loc({
            ar: 'ما هي وحدة قياس القدرة الكهربائية المتبددة (P) في الموصل؟',
            bad: 'ئێکەیا پێڤانا شیانا کارەبایی (P) چییە؟',
            ku: 'یەکەی پێوانەی توانای کارەبایی (P) چییە؟',
            kmr: 'Yekeya pîvana hêza elektrîkî (P) çi ye?',
            en: 'What is the SI unit for electric power (P)?',
          }),
          options: ['Watt (واط / وات)', 'Volt (فولت / ڤۆڵت)', 'Ampere (أمبير / ئەمپێر)', 'Ohm (أوم / ئۆم)'],
          correctIndex: 0,
          explanation: loc({
            ar: 'تقاس القدرة الكهربائية بوحدة الواط (Watt) وتساوي جُول لكل ثانية (P = V × I).',
            bad: 'شیانا کارەبایی ب یەکا وات (Watt) دهێتە پێڤان کو دکەتە جوول د ئێک چرکے دا (P = V × I).',
            ku: 'توانای کارەبایی بە یەکەی وات (Watt) دەپێورێت کە دەکاتە جووڵ بۆ هەر چرکەیەک (P = V × I).',
            kmr: 'Hêza elektrîkê bi Watt tê pîvandin (Joule/çirke).',
            en: 'Electric power is measured in Watts (W), representing energy consumed per second (P = V × I).',
          }),
        },
        {
          id: 3,
          questionText: loc({
            ar: 'ماذا يحدث للقدرة المتبددة حرارياً (P = I² R) عند مضاعفة شدة التيار المار مرتين (2I)؟',
            bad: 'چی ب سەر شیانا بەلاڤبوویا گەرمی (P = I² R) دهێت ئەگەر توندیا تەزووی دوو جاران زێدە ببیت (2I)؟',
            ku: 'چی بەسەر توانای بەفیڕۆچووی گەرمی (P = I² R) دێت ئەگەر توندی تەزوو دوو هێندە زیاد بکرێت (2I)؟',
            kmr: 'Heke herikîna elektrîkê du qat bibe (2I), hêza germî (P = I² R) çi dibe?',
            en: 'What happens to dissipated thermal power (P = I² R) if current (I) is doubled?',
          }),
          options: [
            loc({
              ar: 'تزداد أربعة أضعاف (4P)',
              bad: 'چوار جاران زێدە دبیت (4P)',
              ku: 'چوار هێندە زیاد دەکات (4P)',
              kmr: 'Çar qat zêde dibe (4P)',
              en: 'Quadruples (4P)',
            }),
            loc({
              ar: 'تتضاعف مرتين فقط (2P)',
              bad: 'دوو جاران زێدە دبیت (2P)',
              ku: 'تەنها دوو هێندە زیاد دەکات (2P)',
              kmr: 'Du qat dibe (2P)',
              en: 'Doubles only (2P)',
            }),
            loc({
              ar: 'تقل للنصف',
              bad: 'کێم دبیت بۆ نیڤێ',
              ku: 'کەم دەبێتەوە بۆ نیوە',
              kmr: 'Dadikeve nîvî',
              en: 'Halves (0.5P)',
            }),
            loc({
              ar: 'لا تتغير',
              bad: 'ناگوهۆڕیت',
              ku: 'ناگۆڕێت',
              kmr: 'Naguhere',
              en: 'Remains unchanged',
            }),
          ],
          correctIndex: 0,
          explanation: loc({
            ar: 'القدرة تتناسب مع مربع شدة التيار (I²). مربع 2 هو 4، فتتضاعف القدرة 4 مرات.',
            bad: 'شیان ب دووجایا توندیا تەزووی ڤە گرێدایە (I²)، دووجایا 2 دکەتە 4، لەوما شیان 4 جاران زێدە دبیت.',
            ku: 'توانا بەستراوەتەوە بە دووجای توندی تەزوو (I²). دووجای ٢ دەکاتە ٤، کەواتە توانا چوار هێندە زیاد دەکات.',
            kmr: 'Hêz bi çargoşeya herikînê (I²) re têkildar e. (2)² = 4.',
            en: 'Power depends on the square of current (I²). (2)² = 4, so power quadruples.',
          }),
        },
      ];
    }

    // 4. Thermodynamics / Ideal Gas Law
    if (cat === 'thermodynamics' || id.includes('gas') || id.includes('thermo')) {
      return [
        {
          id: 1,
          questionText: loc({
            ar: 'في قانون الغاز المثالي (P × V = n × R × T)، إذا انخفض حجم الإناء (V) إلى النصف مع ثبات درجة الحرارة، ماذا يحدث للضغط (P)؟',
            bad: 'د یاسایا گازا نموونەییدا (P × V = n × R × T)، ئەگەر قەبارەیا دەفری (V) بۆ نیڤێ کێم ببیت د پلەیا گەرمیا نەگوهۆڕدا، پەستان (P) چ لێ دهێت؟',
            ku: 'لە یاسای گازی نموونەییدا (P × V = n × R × T)، ئەگەر قەبارەی دەفر (V) بۆ نیوە کەم بکات لە پلەی گەرمی نەگۆڕدا، چی بەسەر پەستاندا (P) دێت؟',
            kmr: 'Di zagona gaza nimûneyî de, heke qebare dakeve nîvî di germahiya sabît de, pestan çi dibe?',
            en: 'In the Ideal Gas Law (P × V = n × R × T), if volume (V) decreases by half at constant temperature, pressure (P) will:',
          }),
          options: [
            loc({
              ar: 'يتضاعف مرتين (2P)',
              bad: 'دوو جاران زێدە دبیت (2P)',
              ku: 'دوو هێندە زیاد دەکات (2P)',
              kmr: 'Du qat zêde dibe (2P)',
              en: 'Double (2P)',
            }),
            loc({
              ar: 'ينخفض إلى النصف',
              bad: 'کێم دبیت بۆ نیڤێ',
              ku: 'کەم دەبێتەوە بۆ نیوە',
              kmr: 'Dadikeve nîvî',
              en: 'Halve',
            }),
            loc({
              ar: 'يبقى ثابتاً',
              bad: 'ب نەگوهۆڕی دمینیت',
              ku: 'بە جێگیری دەمێنێتەوە',
              kmr: 'Wek xwe dimîne',
              en: 'Remain constant',
            }),
            loc({
              ar: 'ينعدم الضغط',
              bad: 'پەستان نابیت',
              ku: 'پەستان نابێت',
              kmr: 'Dibe sifir',
              en: 'Become zero',
            }),
          ],
          correctIndex: 0,
          explanation: loc({
            ar: 'طبقاً لقانون بويل، يتناسب الضغط عكسياً مع الحجم (P ∝ 1/V) عند ثبات درجة الحرارة.',
            bad: 'ل دووڤ یاسایا بۆیلی، پەستان ب شێوەیەکێ پێچەوانە دگەل قەبارەی دگۆهۆڕیت (P ∝ 1/V) د پلەیا گەرمیا نەگوهۆڕدا.',
            ku: 'بەپێی یاسای بۆیل، پەستان پێچەوانە دەگۆڕێت لەگەڵ قەبارەدا (P ∝ 1/V) لەکاتی جێگیری پلەی گەرمیدا.',
            kmr: 'Li gorî zagona Boyle, pestan bi qebareyê re berevajî ye (P ∝ 1/V).',
            en: 'According to Boyle’s Law, pressure is inversely proportional to volume (P ∝ 1/V) at constant temperature.',
          }),
        },
        {
          id: 2,
          questionText: loc({
            ar: 'ما هي وحدة قياس درجة الحرارة المطلقة الواجب استخدامها في قوانين الغازات؟',
            bad: 'ئێکەیا پێڤانا پلەیا گەرمیا رەها یا پێدڤی د یاسایێن گازاندا چییە؟',
            ku: 'یەکەی پێوانەی پلەی گەرمی ڕەها کە دەبێت لە یاساکانی گازدا بەکاربێت چییە؟',
            kmr: 'Yekeya pîvana germahiya mutleq di zagonên gazê de çi ye?',
            en: 'What unit of absolute temperature must be used in gas laws?',
          }),
          options: ['Kelvin (K / کێلڤن)', 'Celsius (°C / سیلیزی)', 'Fahrenheit (°F)', 'Joule (J / جوول)'],
          correctIndex: 0,
          explanation: loc({
            ar: 'تستخدم درجة الحرارة المطلقة بوحدة الكلفن (K = °C + 273.15) في جميع معادلات الديناميكا الحرارية.',
            bad: 'پلەیا گەرمیا رەها ب یەکا کێلڤن (K = °C + 273.15) د هەمی هاوکێشەیێن دینامیکا گەرمی دا دهێتە بکارئینان.',
            ku: 'پلەی گەرمی ڕەها بە یەکەی کێلڤن (K = °C + 273.15) لە هەموو هاوکێشە گەرمییەکاندا بەکاردێت.',
            kmr: 'Germahiya mutleq bi Kelvin (K = °C + 273.15) tê bikaranîn.',
            en: 'Absolute temperature in Kelvin (K = °C + 273.15) is strictly required for thermodynamic equations.',
          }),
        },
      ];
    }

    // Default Fallback Questions generated from parameters and explanation
    return [
      {
        id: 1,
        questionText: loc({
          ar: 'ما القانون أو المبدأ الفيزيائي الأساسي الذي تحاكيه هذه التجربة؟',
          bad: 'یاسا یان بنەمایێ فیزیکی یێ سەرەکی کو ئەڤ تاقیکرنە نیشان ددەت چییە؟',
          ku: 'یاسا یان بنەمای فیزیکی سەرەکی کە ئەم تاقیکردنەوەیە دەری دەخات چییە؟',
          kmr: 'Zagon an prensîba sereke ya vê ceribandinê çi ye?',
          en: 'What primary physical law governs this simulation?',
        }),
        options: [
          experiment.physicalLaw || loc({
            ar: 'قانون الحفظ الفيزيائي',
            bad: 'یاسایا پاراستنا فیزیکی',
            ku: 'یاسای پاراستنی فیزیکی',
            kmr: 'Zagona parastina fîzîkî',
            en: 'Physical Conservation Law',
          }),
          loc({
            ar: 'قانون كبلر الثالث',
            bad: 'یاسایا سێیێ یا کێپلەری',
            ku: 'یاسای سێیەمی کێپلەر',
            kmr: 'Zagona sêyem a Kepler',
            en: 'Kepler’s Third Law',
          }),
          loc({
            ar: 'مبدأ أرخميدس للطفو',
            bad: 'بنەمایێ ئارخیمیدسی بۆ سەرئئاڤکەفتنێ',
            ku: 'بنەمای ئارخیمیدس بۆ سەرئاوکەوتن',
            kmr: 'Prensîba Arşîmed',
            en: 'Archimedes Principle',
          }),
          loc({
            ar: 'قانون كولوم الشحني',
            bad: 'یاسایا کۆلۆمی بۆ بارگان',
            ku: 'یاسای کوڵۆم بۆ بارگەکان',
            kmr: 'Zagona Coulomb',
            en: 'Coulomb’s Law',
          }),
        ],
        correctIndex: 0,
        explanation: loc({
          ar: `القانون الفيزيائي الرئيسي لهذه التجربة هو: ${experiment.physicalLaw}.`,
          bad: `یاسایا فیزیکی یا سەرەکی بۆ ئەڤێ تاقیکرنێ بریتییە ژ: ${experiment.physicalLaw}.`,
          ku: `یاسای فیزیکی سەرەکی بۆ ئەم تاقیکردنەوەیە بریتییە لە: ${experiment.physicalLaw}.`,
          kmr: `Zagona sereke ya vê ceribandinê: ${experiment.physicalLaw}.`,
          en: `The governing physical principle for this experiment is ${experiment.physicalLaw}.`,
        }),
      },
      {
        id: 2,
        questionText: loc({
          ar: 'ما الهدف الأساسي من تعديل المعاملات والمدخلات في المحاكاة؟',
          bad: 'ئارمانجا سەرەکی ژ دەستکاریکرنا پێوەر و گوهۆڕۆکان د ئەڤێ سیمیولەیشنێ دا چییە؟',
          ku: 'ئامانجی سەرەکی لە دەستکاریکردنی پێوەر و گۆڕاوەکان لەم شبیهسازییەدا چییە؟',
          kmr: 'Armanca sereke ya guhertina parametreyan di vê simulasyonê de çi ye?',
          en: 'What is the primary purpose of adjusting input parameters in this simulation?',
        }),
        options: [
          loc({
            ar: 'ملاحظة واستنتاج العلاقات الفيزيائية بين المتغيرات حياً',
            bad: 'دیتن و دەرئەنجام وەرگرتن ژ پەیوەندیێن فیزیکی ب شێوەیەکێ راستەوخۆ',
            ku: 'بینین و دەرئەنجام وەرگرتن لە پەیوەندییە فیزیکییەکان بە شێوەی ڕاستەوخۆ',
            kmr: 'Dîtin û têgihîştina têkiliyên fîzîkî yên navbera guhêrbaran',
            en: 'To observe and infer physical relationships between variables in real-time',
          }),
          loc({
            ar: 'تغيير القوانين الفيزيائية للكون',
            bad: 'گوهۆڕینا یاسایێن فیزیکی یێن گەردوونی',
            ku: 'گۆڕینی یاسا فیزیکییەکانی گەردوون',
            kmr: 'Guhertina zagonên gerdûnê',
            en: 'To alter universal laws of physics',
          }),
          loc({
            ar: 'إيقاف المحاكاة بشكل دائم',
            bad: 'راوەستاندنا هەمیشەیی یا سیمیولەیشنێ',
            ku: 'ڕاگرتنی هەمیشەیی شبیهسازییەکە',
            kmr: 'Rawestandina ceribandinê',
            en: 'To permanently stop the simulation',
          }),
          loc({
            ar: 'لا يطرق أي تغيير على المخرجات',
            bad: 'چ گوهۆڕین د دەرئەنجاماندا روینادەت',
            ku: 'هیچ گۆڕانێک ڕوونادات لە دەرئەنجامەکاندا',
            kmr: 'Tu guhertin çênabe',
            en: 'No output changes occur',
          }),
        ],
        correctIndex: 0,
        explanation: loc({
          ar: 'تتيح المحاكاة التفاعلية دراسة التأثير المباشر لكل متغير مدخل على المخرجات المقاسة.',
          bad: 'سیمیولەیشنا کارلێککەر رێکێ ددەت کارتێکرنا راستەوخۆ یا گوهۆڕۆکان ل سەر دەرئەنجامان ببینی.',
          ku: 'ئەم شبیهسازییە کارلێککارە ڕێگە دەدات کاریگەری ڕاستەوخۆی گۆڕاوەکان لەسەر دەرئەنجامەکان ببینیت.',
          kmr: 'Simulasyon dihêle ku hûn bandora rasterast a guhêrbaran li ser encaman bibînin.',
          en: 'Interactive simulation lets students discover how tweaking input parameters affects measured physical outputs.',
        }),
      },
    ];
  }, [experiment, language]);

  const currentQuestion = questions[currentIndex] || questions[0];

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setIsSubmitted(true);
    setAnswersHistory((prev) => [...prev, { selected: selectedOption, isCorrect }]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsQuizFinished(true);
    }
  };

  const handleRetryQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setAnswersHistory([]);
    setIsQuizFinished(false);
  };

  const scoreCount = answersHistory.filter((a) => a.isCorrect).length;
  const scorePercent = Math.round((scoreCount / questions.length) * 100);

  const titleText = loc({
    ar: 'اختبار واستيعاب المفاهيم',
    bad: 'تاقیکرن و تێگەهشتنا چەمکان',
    ku: 'تاقیکردنەوە و تێگەیشتنی چەمکەکان',
    kmr: 'Taqîkirin û Têgihîştina Çemkan',
    en: 'Learning Check & Concept Quiz',
  });

  const subtitleQuestions = loc({
    ar: `أسئلة تفاعلية (${questions.length} أسئلة)`,
    bad: `پسیارێن کارلێککەر (${questions.length} پسیار)`,
    ku: `پرسیاری کارلێککار (${questions.length} پرسیار)`,
    kmr: `Pirsên Înteraktîf (${questions.length} Pirs)`,
    en: `Interactive Quiz (${questions.length} Questions)`,
  });

  const collapseLabel = loc({
    ar: 'طَيّ',
    bad: 'نڤیسینگەهـ / کۆمکرن',
    ku: 'کۆکردنەوە',
    kmr: 'Nihandin',
    en: 'Collapse',
  });

  const expandLabel = loc({
    ar: 'توسيع',
    bad: 'بەرفرەهـ کرن',
    ku: 'فراوانکردن',
    kmr: 'Berfirehkirin',
    en: 'Expand',
  });

  const questionProgressText = loc({
    ar: `السؤال ${currentIndex + 1} من ${questions.length}`,
    bad: `پسیارا ${currentIndex + 1} ژ ${questions.length}`,
    ku: `پرسیاری ${currentIndex + 1} لە ${questions.length}`,
    kmr: `Pirsa ${currentIndex + 1} ji ${questions.length}`,
    en: `Question ${currentIndex + 1} of ${questions.length}`,
  });

  const confirmAnswerLabel = loc({
    ar: 'تأكيد الإجابة',
    bad: 'پشتراستکرنا بەرسڤێ',
    ku: 'پشتڕاستکردنەوەی وەڵام',
    kmr: 'Piştrastkirina Bersivê',
    en: 'Check Answer',
  });

  const correctBadge = loc({
    ar: 'إجابة صحيحة! أحسنت',
    bad: 'بەرسڤا دروستە! دەستخۆش',
    ku: 'وەڵامی دروستە! دەستخۆش',
    kmr: 'Bersiva rast! Destxweş',
    en: 'Correct Answer! Well done.',
  });

  const incorrectBadge = loc({
    ar: 'إجابة خاطئة',
    bad: 'بەرسڤا شاشە',
    ku: 'وەڵامی هەڵەیە',
    kmr: 'Bersiva şaş',
    en: 'Incorrect Answer.',
  });

  const nextQuestionBtn = loc({
    ar: 'السؤال التالي',
    bad: 'پسیارا دیتر',
    ku: 'پرسیاری دواتر',
    kmr: 'Pirsa Paşê',
    en: 'Next Question',
  });

  const viewFinalScoreBtn = loc({
    ar: 'عرض النتيجة النهائية',
    bad: 'نیشاندانا ئەنجامێ دووماهیێ',
    ku: 'پیشاندانی ئەنجامی کۆتایی',
    kmr: 'Nîşandana Encamê',
    en: 'View Final Score',
  });

  const quizCompletedTitle = loc({
    ar: 'اكتمل الاختبار العلمي!',
    bad: 'تاقیکرنا زانستی تەمام بوو!',
    ku: 'تاقیکردنەوەی زانستی تەواو بوو!',
    kmr: 'Taqîkirina Zanistî Temam Bû!',
    en: 'Quiz Completed!',
  });

  const quizCompletedSub = loc({
    ar: 'نتيجتك النهائية في استيعاب مفاهيم التجربة:',
    bad: 'ئەنجامێ تە یێ دووماهیێ د تێگەهشتنا چەمکێن تاقیکرنێ دا:',
    ku: 'ئەنجامی کۆتاییت لە تێگەیشتنی چەمکەکانی تاقیکردنەوە:',
    kmr: 'Encama we ya dawî di têgihîştina ceribandinê de:',
    en: 'Your final score in understanding this experiment:',
  });

  const retryQuizLabel = loc({
    ar: 'إعادة الاختبار',
    bad: 'دووبارەکرنا تاقیکرنێ',
    ku: 'دووبارەکردنەوەی تاقیکردنەوە',
    kmr: 'Dîsa Taqîkirin',
    en: 'Retry Quiz',
  });

  const scoreEvaluation =
    scorePercent >= 80
      ? loc({
          ar: 'ممتاز!',
          bad: 'گەلەک باش و نایاب!',
          ku: 'ناوازەیە!',
          kmr: 'Gelek baş!',
          en: 'Excellent!',
        })
      : scorePercent >= 50
      ? loc({
          ar: 'جيد جداً',
          bad: 'باشە',
          ku: 'زۆر باش',
          kmr: 'Baş',
          en: 'Good Job',
        })
      : loc({
          ar: 'راجع النظرية وحاول مجدداً',
          bad: 'سەحکە بیردۆزێ و جارەکا دی تاقی بکە',
          ku: 'سەیری تیۆرییەکە بکەوە و دووبارە تاقی بکەرەوە',
          kmr: 'Teoriyê kontrol bike û dîsa biceribîne',
          en: 'Review Theory & Try Again',
        });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-900/80 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <span>{titleText}</span>
            </h2>
            <span className="text-xs text-purple-400 font-semibold block mt-0.5">
              {subtitleQuestions}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
          aria-label="Toggle Quiz Panel"
        >
          <span className="hidden sm:inline">
            {isExpanded ? collapseLabel : expandLabel}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-purple-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-purple-400" />
          )}
        </button>
      </div>

      {/* Main Quiz Body */}
      {isExpanded && (
        <div className="p-4 sm:p-6 bg-slate-950/40 space-y-5">
          {!isQuizFinished ? (
            <div className="space-y-4">
              {/* Progress Header */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>{questionProgressText}</span>
                <span className="text-purple-400 font-mono font-bold">
                  {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question Text */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-100 leading-relaxed">
                  {currentQuestion.questionText}
                </h3>
              </div>

              {/* Options List */}
              <div className="space-y-2">
                {currentQuestion.options.map((optionText, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = idx === currentQuestion.correctIndex;

                  let buttonStyle =
                    'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80';

                  if (isSubmitted) {
                    if (isCorrectAnswer) {
                      buttonStyle =
                        'bg-emerald-950/60 text-emerald-200 border-emerald-500/60 font-semibold';
                    } else if (isSelected && !isCorrectAnswer) {
                      buttonStyle =
                        'bg-rose-950/60 text-rose-200 border-rose-500/60 font-semibold';
                    } else {
                      buttonStyle = 'bg-slate-900/40 text-slate-500 border-slate-800/60 opacity-60';
                    }
                  } else if (isSelected) {
                    buttonStyle =
                      'bg-purple-950/60 text-purple-200 border-purple-500/80 shadow-md font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isSubmitted}
                      className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm text-start transition-all cursor-pointer flex items-center justify-between gap-3 ${buttonStyle}`}
                    >
                      <span className="flex-1 leading-relaxed">{optionText}</span>
                      <div className="shrink-0">
                        {isSubmitted ? (
                          isCorrectAnswer ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : isSelected ? (
                            <XCircle className="w-5 h-5 text-rose-400" />
                          ) : null
                        ) : (
                          <div
                            className={`w-4 h-4 rounded-full border ${
                              isSelected
                                ? 'border-purple-400 bg-purple-500'
                                : 'border-slate-600'
                            }`}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Submit & Explanation Box */}
              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 disabled:hover:bg-purple-600 transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{confirmAnswerLabel}</span>
                </button>
              ) : (
                <div className="space-y-3 pt-2">
                  {/* Scientific Explanation Box */}
                  <div
                    className={`p-4 rounded-xl border space-y-1.5 ${
                      selectedOption === currentQuestion.correctIndex
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                      {selectedOption === currentQuestion.correctIndex ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{correctBadge}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>{incorrectBadge}</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans pt-1">
                      {currentQuestion.explanation}
                    </p>
                  </div>

                  {/* Next Question Button */}
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-100 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>
                      {currentIndex < questions.length - 1
                        ? nextQuestionBtn
                        : viewFinalScoreBtn}
                    </span>
                    {language === 'ar' || language === 'ku' || language === 'bad' ? (
                      <ChevronLeft className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed Summary Card */
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-100">
                  {quizCompletedTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  {quizCompletedSub}
                </p>
              </div>

              {/* Score Metric Display */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 inline-block min-w-[200px]">
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">
                  {scoreCount} / {questions.length}
                </div>
                <div className="text-xs font-bold text-slate-400 mt-1">
                  {scorePercent}% {scoreEvaluation}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRetryQuiz}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{retryQuizLabel}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
