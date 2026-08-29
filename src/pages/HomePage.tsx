import React, { useState, useMemo } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { ExperimentRegistry } from '../data/experiments/registry';
import { CategoryType } from '../types/experiment';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Atom, Layers, Shield, Languages, Play, ArrowRight, ArrowLeft, Search, Filter } from 'lucide-react';

interface HomePageProps {
  onNavigateToExperiment: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToExperiment }) => {
  const { language, direction, isRTL, t, getLocalizedText } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');

  const categories: { id: CategoryType | 'all'; labelKey: string }[] = [
    { id: 'all', labelKey: 'experiment.allExperiments' },
    { id: 'mechanics', labelKey: 'categories.mechanics' },
    { id: 'electricity', labelKey: 'categories.electricity' },
    { id: 'waves', labelKey: 'categories.waves' },
    { id: 'thermodynamics', labelKey: 'categories.thermodynamics' },
    { id: 'optics', labelKey: 'categories.optics' },
    { id: 'modern_physics', labelKey: 'categories.modern_physics' },
  ];

  const filteredExperiments = useMemo(() => {
    let list = ExperimentRegistry.search(searchQuery, language);
    if (selectedCategory !== 'all') {
      list = list.filter((exp) => exp.category === selectedCategory);
    }
    return list;
  }, [searchQuery, selectedCategory, language]);

  const prototype = ExperimentRegistry.getAll()[0];

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 sm:p-10 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <Atom className="w-4 h-4" />
            <span>{t('app.title')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-50 tracking-tight leading-tight">
            {t('app.title')}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t('app.tagline')}
          </p>

          {prototype && (
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigateToExperiment(prototype.id)}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t('experiment.runSimulation')}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Architectural Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Language & Orientation Card */}
        <Card variant="default" padding="md" className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Languages className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('common.language')}</h3>
          <p className="text-lg font-bold text-slate-100 uppercase">{language} ({direction})</p>
          <span className="text-xs text-slate-400 block">AR, EN, KU, KMR</span>
        </Card>

        {/* Experiment Registry Capacity */}
        <Card variant="default" padding="md" className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('nav.experiments')}</h3>
          <p className="text-lg font-bold text-slate-100">{ExperimentRegistry.getCount()}</p>
          <span className="text-xs text-slate-400 block">{t('experiment.allExperiments')}</span>
        </Card>

        {/* Security Foundation Status */}
        <Card variant="default" padding="md" className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('common.securityNotice')}</h3>
          <p className="text-lg font-bold text-emerald-400">Hardened</p>
          <span className="text-xs text-slate-400 block">Client-side Sandbox</span>
        </Card>

        {/* Modular Lifecycle Engine */}
        <Card variant="default" padding="md" className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Atom className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('simulation.controls')}</h3>
          <p className="text-lg font-bold text-slate-100">Pure TS RAF</p>
          <span className="text-xs text-slate-400 block">60 FPS Responsive</span>
        </Card>
      </section>

      {/* Filter and Search Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`${t('nav.experiments')}...`}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[44px]"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-cyan-400 shrink-0 mr-1 hidden lg:block" />
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer min-h-[44px] ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {t(cat.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Experiment Grid */}
        {filteredExperiments.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium bg-slate-900/40 rounded-2xl border border-slate-800/60">
            {t('common.noResults')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExperiments.map((exp) => (
              <Card
                key={exp.id}
                variant="bordered"
                padding="md"
                onClick={() => onNavigateToExperiment(exp.id)}
                className="cursor-pointer group space-y-3 min-h-[120px] flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="cyan">
                      EXP-{String(exp.codeNumber).padStart(3, '0')}
                    </Badge>
                    <span className="text-[11px] text-cyan-400/80 font-mono bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                      {exp.physicalLaw}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                    {getLocalizedText(exp.title)}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {getLocalizedText(exp.description)}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span className="capitalize">{t(`categories.${exp.category}`)}</span>
                  <span className="group-hover:text-cyan-400 transition-colors font-medium flex items-center gap-1">
                    <span>{t('experiment.runSimulation')}</span>
                    {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
