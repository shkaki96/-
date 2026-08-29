import { Experiment } from '../types/experiment';
import { ISimulationEngine } from '../types/simulation';
import { PendulumEngine } from './engines/pendulumEngine';
import { ThermodynamicsEngine } from './engines/thermodynamicsEngine';
import { WaveEngine } from './engines/waveEngine';
import { ElectricEngine } from './engines/electricEngine';
import { OpticsEngine } from './engines/opticsEngine';
import { GenericSimulationEngine } from './engines/genericEngine';

export class SimulationEngineFactory {
  public static createEngine(
    experiment: Experiment,
    initialParams: Record<string, number>
  ): ISimulationEngine<Record<string, number>, Record<string, unknown>> {
    const category = experiment.category;
    const id = experiment.id.toLowerCase();

    if (id.includes('pendulum') || id.includes('harmonic')) {
      return new PendulumEngine({
        length: initialParams.length ?? 1.0,
        gravity: initialParams.gravity ?? 9.81,
        mass: initialParams.mass ?? 1.0,
        initialAngle: initialParams.initialAngle ?? 15,
        ...initialParams,
      }) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;
    }

    if (category === 'thermodynamics' || id.includes('heat') || id.includes('thermo') || id.includes('gas')) {
      return new ThermodynamicsEngine(initialParams) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;
    }

    if (category === 'waves' || id.includes('wave') || id.includes('sound') || id.includes('oscillation')) {
      return new WaveEngine(initialParams) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;
    }

    if (category === 'electricity' || id.includes('circuit') || id.includes('ohm') || id.includes('current') || id.includes('charge')) {
      return new ElectricEngine(initialParams) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;
    }

    if (category === 'optics' || id.includes('optics') || id.includes('refraction') || id.includes('lens') || id.includes('light')) {
      return new OpticsEngine(initialParams) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;
    }

    return new GenericSimulationEngine(initialParams) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;
  }
}
