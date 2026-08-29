import { Language } from '../types/language';

export interface UITranslationSchema {
  app: {
    title: string;
    subtitle: string;
    tagline: string;
    version: string;
  };
  nav: {
    home: string;
    experiments: string;
    categories: string;
    search: string;
    favorites: string;
    settings: string;
    about: string;
  };
  simulation: {
    controls: string;
    start: string;
    pause: string;
    reset: string;
    parameters: string;
    results: string;
    realTimeMetrics: string;
    fullscreen: string;
    stateReady: string;
    stateRunning: string;
    statePaused: string;
  };
  experiment: {
    details: string;
    theory: string;
    howItWorks: string;
    whatHappened: string;
    result: string;
    procedure: string;
    physicalLaw: string;
    inputs: string;
    outputs: string;
    runSimulation: string;
    next: string;
    previous: string;
    allExperiments: string;
  };
  categories: {
    mechanics: string;
    electricity: string;
    waves: string;
    thermodynamics: string;
    optics: string;
    modern_physics: string;
  };
  common: {
    language: string;
    selectLanguage: string;
    theme: string;
    securityNotice: string;
    loading: string;
    error: string;
    noResults: string;
  };
  ads: {
    sponsored: string;
    educationalPartner: string;
    close: string;
    nonIntrusiveNotice: string;
  };
  drawer: {
    science: string;
    physics: string;
    futureSubjects: string;
    chemistry: string;
    mathematics: string;
    astronomy: string;
    comingSoon: string;
    tools: string;
    scientificKeyboard: string;
    labNotebook: string;
    tests: string;
    symbolsAndConstants: string;
    formulas: string;
  };
  theoryModal: {
    title: string;
    objective: string;
    whatHappened: string;
    theoreticalExplanation: string;
    howItWorks: string;
    physicalLaw: string;
    observations: string;
    obtainedResults: string;
    conclusion: string;
  };
  tools: {
    scientificKeyboardTitle: string;
    labNotebookTitle: string;
    testsTitle: string;
    symbolsTitle: string;
    formulasTitle: string;
    typeNoteHere: string;
    saveNote: string;
    clearNotes: string;
    recordDataPoint: string;
    searchConstants: string;
    searchFormulas: string;
    score: string;
    question: string;
    nextQuestion: string;
    checkAnswer: string;
    correct: string;
    incorrect: string;
    explanation: string;
  };
}

export const UI_TRANSLATIONS: Record<Language, UITranslationSchema> = {
  ar: {
    app: {
      title: 'طاق - TAQ',
      subtitle: 'مختبر الفيزياء الافتراضي المحاكي',
      tagline: 'منصة تفاعلية للمحاكاة والتجارب الفيزيائية التعليمية',
      version: 'النواة 1.0.0 (النية المعمارية)',
    },
    nav: {
      home: 'الرئيسية',
      experiments: 'التجارب',
      categories: 'الأقسام',
      search: 'بحث',
      favorites: 'المفضلة',
      settings: 'الإعدادات',
      about: 'عن المختبر',
    },
    simulation: {
      controls: 'أدوات التحكم',
      start: 'تشغيل',
      pause: 'إيقاف مؤقت',
      reset: 'إعادة ضبط',
      parameters: 'المعاملات الفيزيائية',
      results: 'النتائج الحية',
      realTimeMetrics: 'المقاييس اللحظية',
      fullscreen: 'ملء الشاشة',
      stateReady: 'جاهز (READY)',
      stateRunning: 'قيد التشغيل (RUNNING)',
      statePaused: 'موقوف مؤقتاً (PAUSED)',
    },
    experiment: {
      details: 'تفاصيل التجربة',
      theory: 'النظرية والشرح',
      howItWorks: 'كيف تعمل التجربة',
      whatHappened: 'ماذا حدث في المحاكاة',
      result: 'النتيجة والاستنتاج',
      procedure: 'خطوات العمل',
      physicalLaw: 'القانون الفيزيائي',
      inputs: 'المدخلات والمتغيرات',
      outputs: 'المخرجات والمقاييس',
      runSimulation: 'بدء المحاكاة',
      next: 'التجربة التالية',
      previous: 'التجربة السابقة',
      allExperiments: 'جميع التجارب',
    },
    categories: {
      mechanics: 'الميكانيكا التقليدية',
      electricity: 'الكهرباء والمغناطيسية',
      waves: 'الموجات والصوت',
      thermodynamics: 'الديناميكا الحرارية',
      optics: 'البصريات والضوء',
      modern_physics: 'الفيزياء الحديثة',
    },
    common: {
      language: 'اللغة',
      selectLanguage: 'اختر اللغة',
      theme: 'المظهر',
      securityNotice: 'النظام مؤمن بنسبة 100% بدون تخزين بيانات حساسة',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ غير متوقع',
      noResults: 'لم يتم العثور على نتائج',
    },
    ads: {
      sponsored: 'إعلان تعليمي',
      educationalPartner: 'شريك المعرفة والعلوم',
      close: 'إغلاق الإعلان',
      nonIntrusiveNotice: 'محتوى إعلاني غير مزعج يدعم المجانية والأكاديمية',
    },
    drawer: {
      science: 'العلوم والأقسام',
      physics: 'الفيزياء والتجارب',
      futureSubjects: 'المواد المستقبلية',
      chemistry: 'الكيمياء المحاكاة',
      mathematics: 'الرياضيات التفاعلية',
      astronomy: 'الفلك وعلوم الفضاء',
      comingSoon: 'قريباً',
      tools: 'أدوات المختبر',
      scientificKeyboard: 'لوحة مفاتيح علمية',
      labNotebook: 'دفتر ملاحظات التجارب',
      tests: 'اختبارات وتقييم',
      symbolsAndConstants: 'الرموز والثوابت الفيزيائية',
      formulas: 'دليل القوانين والمعادلات',
    },
    theoryModal: {
      title: 'الشرح العلمي والنظري للتجربة',
      objective: 'أهداف التجربة',
      whatHappened: 'ماذا يحدث في المحاكاة',
      theoreticalExplanation: 'التفسير النظري',
      howItWorks: 'آلية عمل التجربة',
      physicalLaw: 'القانون الفيزيائي الحاكم',
      observations: 'الملاحظات العلمية',
      obtainedResults: 'المخرجات والنتائج',
      conclusion: 'الخلاصة والاستنتاج',
    },
    tools: {
      scientificKeyboardTitle: 'الحاسبة واللوحة العلمية',
      labNotebookTitle: 'دفتر الملاحظات والبيانات',
      testsTitle: 'اختبار فهم القوانين',
      symbolsTitle: 'جدول الثوابت الفيزيائية العالمية',
      formulasTitle: 'دليل المعادلات والقوانين',
      typeNoteHere: 'اكتب ملاحظاتك ونتائج تجاربك هنا...',
      saveNote: 'حفظ الملاحظة',
      clearNotes: 'مسح الملاحظات',
      recordDataPoint: 'تسجيل نقطة بيانات حية',
      searchConstants: 'ابحث عن ثابت أو رمز...',
      searchFormulas: 'ابحث عن قانون أو معادلة...',
      score: 'النتيجة',
      question: 'السؤال',
      nextQuestion: 'السؤال التالي',
      checkAnswer: 'تحقق من الإجابة',
      correct: 'إجابة صحيحة!',
      incorrect: 'إجابة خاطئة، حاول مجدداً',
      explanation: 'التفسير العلمي',
    },
  },
  en: {
    app: {
      title: 'TAQ Physics Lab',
      subtitle: 'Interactive Physics Virtual Laboratory',
      tagline: 'Next-Generation Educational Physics Simulation Platform',
      version: 'Core v1.0.0 (Architectural Foundation)',
    },
    nav: {
      home: 'Home',
      experiments: 'Experiments',
      categories: 'Categories',
      search: 'Search',
      favorites: 'Favorites',
      settings: 'Settings',
      about: 'About',
    },
    simulation: {
      controls: 'Controls',
      start: 'Start',
      pause: 'Pause',
      reset: 'Reset',
      parameters: 'Physics Parameters',
      results: 'Live Results',
      realTimeMetrics: 'Real-time Metrics',
      fullscreen: 'Fullscreen',
      stateReady: 'READY',
      stateRunning: 'RUNNING',
      statePaused: 'PAUSED',
    },
    experiment: {
      details: 'Experiment Details',
      theory: 'Theory & Concept',
      howItWorks: 'How It Works',
      whatHappened: 'What Happened in Simulation',
      result: 'Result & Conclusion',
      procedure: 'Procedure Steps',
      physicalLaw: 'Physical Law',
      inputs: 'Inputs & Variables',
      outputs: 'Outputs & Metrics',
      runSimulation: 'Launch Simulation',
      next: 'Next Experiment',
      previous: 'Previous Experiment',
      allExperiments: 'All Experiments',
    },
    categories: {
      mechanics: 'Classical Mechanics',
      electricity: 'Electricity & Magnetism',
      waves: 'Waves & Acoustics',
      thermodynamics: 'Thermodynamics',
      optics: 'Optics & Light',
      modern_physics: 'Modern Physics',
    },
    common: {
      language: 'Language',
      selectLanguage: 'Select Language',
      theme: 'Theme',
      securityNotice: 'Client-side architecture hardened against vulnerabilities',
      loading: 'Loading...',
      error: 'An unexpected error occurred',
      noResults: 'No results found',
    },
    ads: {
      sponsored: 'Educational Sponsor',
      educationalPartner: 'Science & Knowledge Partner',
      close: 'Dismiss Ad',
      nonIntrusiveNotice: 'Non-intrusive advertisement supporting free physics education',
    },
    drawer: {
      science: 'Science & Disciplines',
      physics: 'Physics & Simulations',
      futureSubjects: 'Future Subjects',
      chemistry: 'Chemistry',
      mathematics: 'Mathematics',
      astronomy: 'Astronomy & Space',
      comingSoon: 'Coming Soon',
      tools: 'Laboratory Tools',
      scientificKeyboard: 'Scientific Keyboard',
      labNotebook: 'Lab Notebook',
      tests: 'Physics Tests',
      symbolsAndConstants: 'Symbols & Constants',
      formulas: 'Formulas & Equations',
    },
    theoryModal: {
      title: 'Scientific & Theoretical Explanation',
      objective: 'Experiment Objectives',
      whatHappened: 'What Happens in Simulation',
      theoreticalExplanation: 'Theoretical Concept',
      howItWorks: 'How It Works',
      physicalLaw: 'Governing Physical Law',
      observations: 'Scientific Observations',
      obtainedResults: 'Quantitative Results',
      conclusion: 'Conclusion & Takeaways',
    },
    tools: {
      scientificKeyboardTitle: 'Scientific Calculator & Keyboard',
      labNotebookTitle: 'Lab Notebook & Data Logs',
      testsTitle: 'Self-Assessment Physics Quiz',
      symbolsTitle: 'Physical Constants & Symbols',
      formulasTitle: 'Formulas & Equations Sheet',
      typeNoteHere: 'Type your experiment observations and calculations here...',
      saveNote: 'Save Note',
      clearNotes: 'Clear Notes',
      recordDataPoint: 'Record Live Data Point',
      searchConstants: 'Search constant or symbol...',
      searchFormulas: 'Search formula or equation...',
      score: 'Score',
      question: 'Question',
      nextQuestion: 'Next Question',
      checkAnswer: 'Check Answer',
      correct: 'Correct Answer!',
      incorrect: 'Incorrect. Review concept.',
      explanation: 'Scientific Explanation',
    },
  },
  ku: {
    app: {
      title: 'تاق - TAQ',
      subtitle: 'تاقیگەی فیزیاوی ئۆنلاین',
      tagline: 'پلاتفۆرمی فێرکاری ئەزموونە فیزیاوییە کارلێککارەکان',
      version: 'تەوەرەی ١.٠.٠ (بناغەی تەلارسازی)',
    },
    nav: {
      home: 'سەرەتا',
      experiments: 'ئەزموونەکان',
      categories: 'پۆلەکان',
      search: 'گەڕان',
      favorites: 'دڵخوازەکان',
      settings: 'ڕێکخستنەکان',
      about: 'دەربارە',
    },
    simulation: {
      controls: 'ئامرازەکانی کۆنتڕۆڵ',
      start: 'دەستپێکردن',
      pause: 'وەستان',
      reset: 'دووبارەکردنەوە',
      parameters: 'گۆڕاوە فیزیاوییەکان',
      results: 'ئەنجامە زووەکان',
      realTimeMetrics: 'پێوەرە خێراکان',
      fullscreen: 'شاشەی کامل',
      stateReady: 'ئامادەیە (READY)',
      stateRunning: 'لە کاردایە (RUNNING)',
      statePaused: 'وەستێنراوە (PAUSED)',
    },
    experiment: {
      details: 'وردەکاری ئەزموون',
      theory: 'تیۆری و ڕوونکردنەوە',
      howItWorks: 'چۆنیەتی کارکردنی ئەزموونەکە',
      whatHappened: 'چی ڕوویدا لە هاوشێوەسازییەکەدا',
      result: 'ئەنجام و دەرئەنجام',
      procedure: 'هەنگاوەکانی کار',
      physicalLaw: 'یاسای فیزیاوی',
      inputs: 'تێکراوەکان',
      outputs: 'دەرکراوەکان',
      runSimulation: 'دەستپێکردنی هاوشێوەسازی',
      next: 'ئەزموونی داهاتوو',
      previous: 'ئەزموونی پێشوو',
      allExperiments: 'هەموو ئەزموونەکان',
    },
    categories: {
      mechanics: 'میکانیک',
      electricity: 'کارهەبا و موگناتیس',
      waves: 'شەپۆلەکان و دەنگ',
      thermodynamics: 'گەرمادینامیک',
      optics: 'بینایی و ڕووناکی',
      modern_physics: 'فیزیاوی هاوچەرخ',
    },
    common: {
      language: 'زمان',
      selectLanguage: 'زمان هەڵبژێرە',
      theme: 'ڕووکار',
      securityNotice: 'سیستەم پارێزراوە بێ خەزنکردنی زانیاری هەستیار',
      loading: 'داگرتن...',
      error: 'هەڵەیەک ڕوویدا',
      noResults: 'هیچ ئەنجامێک نەدۆزرایەوە',
    },
    ads: {
      sponsored: 'سپۆنسەری فێرکاری',
      educationalPartner: 'هاوبەشی زانست و زانیاری',
      close: 'داخستنی ڕیکلام',
      nonIntrusiveNotice: 'ڕیکلامی ناپچڕاو بۆ پشتگیری فێرکاری فیزیاوی خۆڕایی',
    },
    drawer: {
      science: 'زانستەکان',
      physics: 'فیزیا و تاقیگەکان',
      futureSubjects: 'بابەتەکانی داهاتوو',
      chemistry: 'کیمیا',
      mathematics: 'بیرکاری',
      astronomy: 'گەردوونناسی',
      comingSoon: 'بەزوویی',
      tools: 'ئامرازەکانی تاقیگە',
      scientificKeyboard: 'کیبۆردی زانستی',
      labNotebook: 'دەفتەری تاقیگە',
      tests: 'تاقیکردنەوەی فیزیا',
      symbolsAndConstants: 'هێما و نەگۆڕەکان',
      formulas: 'ڕێبەری یاساکان',
    },
    theoryModal: {
      title: 'ڕوونکردنەوەی زانستی و تیۆری',
      objective: 'ئامانجەکانی ئەزموونەکە',
      whatHappened: 'چی لە هاوشێوەسازییەکەدا ڕوودەدات',
      theoreticalExplanation: 'تەفسيري تیۆری',
      howItWorks: 'شێوازی کارکردنی ئەزموون',
      physicalLaw: 'یاسای فیزیاوی دیاریکراو',
      observations: 'تێبینییە زانستییەکان',
      obtainedResults: 'دەرئەنجام و دەستکەوتەکان',
      conclusion: 'پوختە و ئەنجامگیری',
    },
    tools: {
      scientificKeyboardTitle: 'حاسیبە و کیبۆردی زانستی',
      labNotebookTitle: 'دەفتەری تێبینییەکان',
      testsTitle: 'تاقیکردنەوەی تێگەیشتن لە یاساکان',
      symbolsTitle: 'خشتەی نەگۆڕە فیزیاوییەکان',
      formulasTitle: 'ڕێبەری هاوکێشەکان',
      typeNoteHere: 'تێبینی و ئامارەکانی ئەزموونەکەت لێرە بنووسە...',
      saveNote: 'پاشەکەوتکردن',
      clearNotes: 'سڕینەوەی تێبینییەکان',
      recordDataPoint: 'تۆمارکردنی داتای حەیی',
      searchConstants: 'گەڕان بۆ نەگۆڕێک...',
      searchFormulas: 'گەڕان بۆ یاسایەک...',
      score: 'نمرە',
      question: 'پرسیار',
      nextQuestion: 'پرسیاری داهاتوو',
      checkAnswer: 'پشکنینی وەڵام',
      correct: 'وەڵامی ڕاستە!',
      incorrect: 'وەڵامی هەڵەیە، دووبارە هەوڵبدەرەوە',
      explanation: 'شیکردنەوەی زانستی',
    },
  },
  kmr: {
    app: {
      title: 'TAQ Ezmûngeha Fîzîkê',
      subtitle: 'Ezmûngeha Înteraktîf a Fîzîkê',
      tagline: 'Platforma Hînbûna Ezmûnên Fîzîkê yên Înteraktîf',
      version: 'Core v1.0.0 (Bingeha Avahîsaziyê)',
    },
    nav: {
      home: 'Serî',
      experiments: 'Ezmûn (Ceribandin)',
      categories: 'Beş û Pol',
      search: 'Lêgerîn',
      favorites: 'Yên Bijarte',
      settings: 'Mîheng',
      about: 'Derbarê Me',
    },
    simulation: {
      controls: 'Kontrol',
      start: 'Destpêkirin',
      pause: 'Rawestandina demkî',
      reset: 'Vegerandina rewşa destpêkê',
      parameters: 'Qaseyên fîzîkî (Parametre)',
      results: 'Encamên pîvanê',
      realTimeMetrics: 'Pîvanên zindî',
      fullscreen: 'Dîmendera tam',
      stateReady: 'AMADE YE (READY)',
      stateRunning: 'DIHERIKE (RUNNING)',
      statePaused: 'RAWESTIYAYÎ (PAUSED)',
    },
    experiment: {
      details: 'Hûrguliyên Ezmûnê',
      theory: 'Teorî û Zagon',
      howItWorks: 'Çawa Kar Dike',
      whatHappened: 'Çi Di Ezmûnê De Qewimî',
      result: 'Encam',
      procedure: 'Pêngavên Ezmûnê',
      physicalLaw: 'Zagona Fîzîkî',
      inputs: 'Qaseyên Têketinê',
      outputs: 'Encamên Derketinê',
      runSimulation: 'Ezmûnê Bide Destpêkirin',
      next: 'Ezmûna Din',
      previous: 'Ezmûna Pêşîn',
      allExperiments: 'Hemû Ezmûn',
    },
    categories: {
      mechanics: 'Mîkanîk',
      electricity: 'Elektrîk û Magnetîk',
      waves: 'Pêl û Deng',
      thermodynamics: 'Termodînamîk',
      optics: 'Şewq û Optîk',
      modern_physics: 'Fîzîka Nûjen û Nûklerî',
    },
    common: {
      language: 'Ziman',
      selectLanguage: 'Ziman Hilbijêre',
      theme: 'Mijar',
      securityNotice: 'Sîstem ji bo ewlehiyê hatiye parastin',
      loading: 'Tê barkirin...',
      error: 'Çewtiyek çêbû',
      noResults: 'Tiştek nehat dîtin',
    },
    ads: {
      sponsored: 'Sponsorê Perwerdehiyê',
      educationalPartner: 'Hevparê Zanist û Perwerdeyê',
      close: 'Reqlamê Bigire',
      nonIntrusiveNotice: 'Reqlama bêasteng ji bo piştgiriya perwerdehiya fîzîkê ya belaş',
    },
    drawer: {
      science: 'Zanist',
      physics: 'Fîzîk û Ezmûn',
      futureSubjects: 'Mijarên Pêşerojê',
      chemistry: 'Kîmya',
      mathematics: 'Bîrkarî (Matematîk)',
      astronomy: 'Astrofîzîk û Gerdûn',
      comingSoon: 'Di nêzîk de',
      tools: 'Amûrên Ezmûngehê',
      scientificKeyboard: 'Klaviyeya Zanistî',
      labNotebook: 'Deftera Ezmûngehê',
      tests: 'Taqîkirinên Zanistî (Pirs)',
      symbolsAndConstants: 'Sembol û Xwecih',
      formulas: 'Rêbera Hevkêşeyan',
    },
    theoryModal: {
      title: 'Şîroveya Zanistî û Teorî',
      objective: 'Armanca Ezmûnê',
      whatHappened: 'Di Ezmûnê de Çi Qewimî',
      theoreticalExplanation: 'Ravekirina Teorîk',
      howItWorks: 'Çawa Kar Dike',
      physicalLaw: 'Zagona Fîzîkî',
      observations: 'Têbiniyên Zanistî',
      obtainedResults: 'Encamên Pîvandî',
      conclusion: 'Encam û Derencam',
    },
    tools: {
      scientificKeyboardTitle: 'Hesabker û Klaviyeya Zanistî',
      labNotebookTitle: 'Deftera Têbiniyan',
      testsTitle: 'Taqîkirina Hînbûnê (Quiz)',
      symbolsTitle: 'Xwecihên Fîzîkî yên Gerdûnî',
      formulasTitle: 'Rêbera Hevkêşeyan',
      typeNoteHere: 'Têbiniyên xwe yên ezmûnê li vir binivîse...',
      saveNote: 'Têbinî Tomar Bike',
      clearNotes: 'Têbiniyan Paqij Bike',
      recordDataPoint: 'Tomarkirina Daneya Pîvanê',
      searchConstants: 'Li xwecihekê bigere...',
      searchFormulas: 'Li hevkêşeyekê bigere...',
      score: 'Puan',
      question: 'Pirs',
      nextQuestion: 'Pirsa Din',
      checkAnswer: 'Bersivê Kontrol Bike',
      correct: 'Bersiva Rast!',
      incorrect: 'Bersiva Şaş e, dîsa biceribîne.',
      explanation: 'Şîroveya Zanistî',
    },
  },
};

