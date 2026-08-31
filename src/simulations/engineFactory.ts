import { Experiment } from '../types/experiment';
import { ISimulationEngine } from '../types/simulation';
import { PendulumEngine } from './engines/pendulumEngine';
import { ProjectileEngine } from './engines/projectileEngine';
import { FreeFallEngine } from './engines/freeFallEngine';
import { ElectricEngine } from './engines/electricEngine';
import { OpticsEngine } from './engines/opticsEngine';
import { LensOpticsEngine } from './engines/lensOpticsEngine';
import { ReflectionEngine } from './engines/reflectionEngine';
import { WaveOpticsEngine } from './engines/waveOpticsEngine';
import { MechanicsEngine } from './engines/mechanicsEngine';
import { ModernPhysicsEngine } from './engines/modernPhysicsEngine';
import { ThermodynamicsEngine } from './engines/thermodynamicsEngine';
import { WaveEngine } from './engines/waveEngine';

export class SimulationEngineFactory {
  public static createEngine(
    experiment: Experiment,
    initialParams?: Record<string, number>
  ): ISimulationEngine<Record<string, number>, Record<string, unknown>> {
    // Extract default values from experiment parameter definitions
    const defaultParams = (experiment.parameters || []).reduce((acc, param) => {
      acc[param.id] = param.defaultValue;
      return acc;
    }, {} as Record<string, number>);

    const mergedParams = { ...defaultParams, ...initialParams };
    const category = (experiment.category || '').toLowerCase();
    const id = (experiment.id || '').toLowerCase();

    // 1. Precise Numeric Code Routing
    switch (experiment.codeNumber) {
      case 2:
      case 15:
      case 16:
        return new LensOpticsEngine({
          lensType: experiment.codeNumber === 2 ? 1 : mergedParams.lensType ?? 1,
          focalLength: mergedParams.focalLength ?? 20,
          objectDistance: mergedParams.objectDistance ?? 40,
          objectHeight: mergedParams.objectHeight ?? 10,
          ...mergedParams,
        }) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;

      case 3:
      case 14:
        return new ReflectionEngine({
          mode: experiment.codeNumber === 3 ? 1 : 2,
          incidentAngle: mergedParams.incidentAngle ?? (experiment.codeNumber === 3 ? 45 : 90),
          mirrorAngle: mergedParams.mirrorAngle ?? 90,
          ...mergedParams,
        }) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;

      case 17:
      case 18:
      case 30:
      case 41:
        return new WaveOpticsEngine({
          mode: experiment.codeNumber,
          wavelength: mergedParams.wavelength ?? 532,
          slitDistance: mergedParams.slitDistance ?? 50,
          screenDistance: mergedParams.screenDistance ?? 1.5,
          analyzerAngle: mergedParams.analyzerAngle ?? 45,
          ...mergedParams,
        }) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;

      case 36:
        return new OpticsEngine(mergedParams) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;

      case 22:
      case 23:
        return new PendulumEngine({
          length: mergedParams.length ?? 1.0,
          gravity: mergedParams.gravity ?? 9.81,
          mass: mergedParams.mass ?? 1.0,
          initialAngle: mergedParams.initialAngle ?? 15,
          ...mergedParams,
        }) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;

      case 24:
        return new ProjectileEngine(mergedParams) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;

      case 27:
        return new FreeFallEngine(mergedParams) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;

      case 5:
      case 7:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 19:
      case 20:
      case 21:
      case 25:
      case 26:
      case 34:
      case 45:
      case 46:
      case 47:
      case 52:
      case 58:
      case 59:
      case 60:
      case 62:
        return new MechanicsEngine({
          codeNumber: experiment.codeNumber,
          mass: mergedParams.mass ?? 5,
          frictionCoeff: mergedParams.frictionCoeff ?? 0.25,
          springConstant: mergedParams.springConstant ?? 50,
          displacement: mergedParams.displacement ?? 0.2,
          fluidDensity: mergedParams.fluidDensity ?? 1000,
          objectVolume: mergedParams.objectVolume ?? 0.002,
          ...mergedParams,
        }) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;

      case 4:
      case 8:
      case 31:
      case 33:
      case 42:
      case 43:
      case 44:
      case 54:
      case 55:
      case 56:
      case 57:
      case 67:
        return new ElectricEngine(mergedParams) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;

      case 1:
      case 6:
      case 35:
      case 50:
      case 51:
      case 63:
      case 64:
      case 70:
        return new ThermodynamicsEngine(mergedParams) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;

      case 28:
      case 29:
      case 48:
      case 49:
      case 61:
      case 66:
        return new WaveEngine(mergedParams) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;

      case 32:
      case 37:
      case 38:
      case 39:
      case 40:
      case 53:
      case 65:
      case 68:
      case 69:
        return new ModernPhysicsEngine({
          codeNumber: experiment.codeNumber,
          photonEnergy: mergedParams.photonEnergy ?? 4.5,
          workFunction: mergedParams.workFunction ?? 2.3,
          wavelength: mergedParams.wavelength ?? 275,
          halfLife: mergedParams.halfLife ?? 5.0,
          ...mergedParams,
        }) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;

      default:
        // 2. Strict Category-Based Physical Engine Dispatcher (NO Generic Fallback)
        if (category.includes('optics') || id.includes('lens') || id.includes('mirror') || id.includes('snell') || id.includes('refract')) {
          return new OpticsEngine(mergedParams) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;
        }
        if (category.includes('wave') || category.includes('sound') || id.includes('doppler') || id.includes('resonance')) {
          return new WaveEngine(mergedParams) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;
        }
        if (category.includes('thermo') || id.includes('heat') || id.includes('gas') || id.includes('piston')) {
          return new ThermodynamicsEngine(mergedParams) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;
        }
        if (category.includes('electric') || category.includes('circuit') || id.includes('ohm') || id.includes('current')) {
          return new ElectricEngine(mergedParams) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;
        }
        if (category.includes('quantum') || category.includes('modern') || category.includes('nuclear') || id.includes('bohr') || id.includes('photoelectric')) {
          return new ModernPhysicsEngine({
            codeNumber: experiment.codeNumber || 68,
            ...mergedParams,
          }) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;
        }
        if (id.includes('pendulum')) {
          return new PendulumEngine({
            length: mergedParams.length ?? 1.0,
            gravity: mergedParams.gravity ?? 9.81,
            mass: mergedParams.mass ?? 1.0,
            initialAngle: mergedParams.initialAngle ?? 15,
            ...mergedParams,
          }) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;
        }
        if (id.includes('projectile')) {
          return new ProjectileEngine(mergedParams) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;
        }
        if (id.includes('free-fall') || id.includes('freefall')) {
          return new FreeFallEngine(mergedParams) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;
        }
        // Universal physical mechanics simulation engine with authentic Newton/Hooke dynamics
        return new MechanicsEngine({
          codeNumber: experiment.codeNumber || 5,
          mass: mergedParams.mass ?? 5,
          frictionCoeff: mergedParams.frictionCoeff ?? 0.25,
          springConstant: mergedParams.springConstant ?? 50,
          displacement: mergedParams.displacement ?? 0.2,
          fluidDensity: mergedParams.fluidDensity ?? 1000,
          objectVolume: mergedParams.objectVolume ?? 0.002,
          ...mergedParams,
        }) as unknown as ISimulationEngine<Record<string, number>, Record<string, unknown>>;
    }
  }
}

