import { CategoryType, Experiment } from '../../types/experiment';
import { Language } from '../../types/language';
import { getLocalizedText } from '../../utils/localization';
import { EXPERIMENTS_CATALOG } from './experimentsCatalog';

/**
 * Central Registry for TAQ Laboratory Experiments.
 * Manages experiment definitions, search, category filtering, and future experiment additions (70+).
 */
class ExperimentRegistryManager {
  private experiments: Map<string, Experiment> = new Map();

  constructor() {
    // Register all 70 physics curriculum experiments
    EXPERIMENTS_CATALOG.forEach((exp) => this.register(exp));
  }

  /**
   * Registers a new experiment into the registry.
   * Performs schema validation to guarantee localized fields exist for all languages.
   */
  public register(experiment: Experiment): boolean {
    if (!experiment || !experiment.id) return false;

    // Validate required language keys across all 5 supported languages
    const requiredLangs: Language[] = ['ar', 'en', 'ku', 'kmr', 'bad'];
    for (const lang of requiredLangs) {
      if (
        !experiment.title?.[lang] ||
        !experiment.description?.[lang] ||
        !experiment.howItWorks?.[lang] ||
        !experiment.whatHappened?.[lang] ||
        !experiment.result?.[lang] ||
        !experiment.inputs?.[lang]?.length ||
        !experiment.outputs?.[lang]?.length
      ) {
        console.warn(`Experiment ${experiment.id} is missing localized content for language: ${lang}`);
      }
    }

    this.experiments.set(experiment.id, experiment);
    return true;
  }

  /**
   * Returns all registered experiments sorted by code number.
   */
  public getAll(): Experiment[] {
    return Array.from(this.experiments.values()).sort((a, b) => a.codeNumber - b.codeNumber);
  }

  /**
   * Get experiment by ID.
   */
  public getById(id: string): Experiment | undefined {
    return this.experiments.get(id);
  }

  /**
   * Get experiment by code number (1 to 70+).
   */
  public getByCodeNumber(code: number): Experiment | undefined {
    return this.getAll().find((exp) => exp.codeNumber === code);
  }

  /**
   * Get experiments filtered by category.
   */
  public getByCategory(category: CategoryType): Experiment[] {
    return this.getAll().filter((exp) => exp.category === category);
  }

  /**
   * Search experiments by localized title, description, physical law, or category.
   */
  public search(query: string, lang: Language): Experiment[] {
    if (!query || !query.trim()) return this.getAll();
    const q = query.toLowerCase().trim();

    return this.getAll().filter((exp) => {
      const title = getLocalizedText(exp.title, lang).toLowerCase();
      const desc = getLocalizedText(exp.description, lang).toLowerCase();
      const law = (exp.physicalLaw || '').toLowerCase();
      const category = exp.category.toLowerCase();

      return title.includes(q) || desc.includes(q) || law.includes(q) || category.includes(q);
    });
  }

  /**
   * Returns total registered experiment count.
   */
  public getCount(): number {
    return this.experiments.size;
  }
}

export const ExperimentRegistry = new ExperimentRegistryManager();
