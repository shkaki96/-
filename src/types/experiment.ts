import { LocalizedText, LocalizedTextArray } from './language';

export type CategoryType = 
  | 'mechanics'
  | 'electricity'
  | 'waves'
  | 'thermodynamics'
  | 'optics'
  | 'modern_physics';

export interface PhysicsParameter {
  id: string;
  label: LocalizedText;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface PhysicsOutput {
  id: string;
  label: LocalizedText;
  unit: string;
  symbol: string;
}

/**
 * Unified Experiment Interface.
 * Employs a language map structure to provide a single schema for all 4 supported languages.
 */
export interface Experiment {
  id: string;
  codeNumber: number;
  category: CategoryType;
  title: LocalizedText;
  description: LocalizedText;
  howItWorks: LocalizedText;
  whatHappened: LocalizedText;
  result: LocalizedText;
  inputs: LocalizedTextArray;
  outputs: LocalizedTextArray;
  explanation: LocalizedText;
  procedure: LocalizedTextArray;
  physicalLaw: string;
  parameters: PhysicsParameter[];
  outputMetrics: PhysicsOutput[];
  supportedRenderers: ('canvas2d' | 'webgl' | 'svg')[];
}

export type ExperimentSchema = Experiment;
export type ParameterSchema = PhysicsParameter;
