import React, { useState, useMemo } from 'react';
import { Experiment } from '../../types/experiment';

// Category Engines
import { OpticsEngine } from './engines/OpticsEngine';
import { MechanicsEngine } from './engines/MechanicsEngine';
import { ThermodynamicsEngine } from './engines/ThermodynamicsEngine';
import { CircuitsEngine } from './engines/CircuitsEngine';
import { DopplerWaveEngine } from './engines/DopplerWaveEngine';
import { ModernPhysicsEngine } from './engines/ModernPhysicsEngine';

// Specialized Dedicated Simulations
import { OpticsEyeglassesSimulation } from './simulations/OpticsEyeglassesSimulation';
import { CircuitOhmLawSimulation } from './simulations/CircuitOhmLawSimulation';
import { SimplePendulumSimulation } from './simulations/SimplePendulumSimulation';
import { ThermodynamicsPistonSimulation } from './simulations/ThermodynamicsPistonSimulation';

export interface SimulationCanvasProps {
  experiment: Experiment;
  params?: Record<string, number>;
  parameters?: Record<string, number>;
  isRunning?: boolean;
  onOutputsUpdate?: (outputs: Record<string, number>) => void;
  className?: string;
  engine?: any;
}

/**
 * Polymorphic Dispatcher & Simulation Canvas Router for TAQ Virtual Physics Lab (70 Experiments).
 * Strictly routes every experiment code (1–70) to its verified dedicated simulation engine.
 * No generic Bohr Atom fallbacks. Includes domain-specific interactive quick-toggles.
 */
export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  experiment,
  params,
  parameters,
  isRunning = true,
  onOutputsUpdate,
  className = '',
}) => {
  const baseParams = params || parameters || {};
  const code = experiment?.codeNumber || 0;
  const slug = (experiment?.id || '').toLowerCase();

  // Local state for domain-specific experiment toggles
  const [domainSettings, setDomainSettings] = useState<Record<string, number>>({});

  // Memoize effectiveParams so object reference remains stable across re-renders
  const effectiveParams: Record<string, number> = useMemo(() => {
    return {
      ...baseParams,
      ...domainSettings,
    };
  }, [baseParams, domainSettings]);

  if (!experiment) return null;

  const updateDomainSetting = (key: string, value: number) => {
    setDomainSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Render simulation engine based on explicit experiment code (1–70)
  const renderEngine = () => {
    switch (code) {
      // ==========================================
      // Category A: Optics & Wave Phenomena
      // ==========================================
      case 2: // Prescription Glasses & Lens Power
        return (
          <OpticsEyeglassesSimulation
            params={effectiveParams}
            isRunning={isRunning}
            onOutputsUpdate={onOutputsUpdate}
          />
        );

      case 3: // Periscope & Law of Reflection
      case 14: // Angled Mirrors & Multiple Reflections
      case 15: // Spherical Mirrors (Convex & Concave)
      case 16: // Thin Lenses & Lens Equation
      case 17: // Polarization of Light & Malus' Law
      case 18: // Light Scattering & Rayleigh Law
      case 30: // Young's Double-Slit Interference
      case 36: // Snell's Law & Refraction
      case 41: // Color Vision & Additive RGB Mixing
        return (
          <OpticsEngine
            experiment={experiment}
            params={effectiveParams}
            isRunning={isRunning}
            onOutputsUpdate={onOutputsUpdate}
          />
        );

      // ==========================================
      // Category B: Acoustics, Waves & Oscillations
      // ==========================================
      case 28: // Resonance in Open and Closed Pipes
      case 29: // Speed of Sound & Water Column Resonance
      case 48: // Fourier Series & Harmonic Wave Synthesis
      case 49: // Wave on a String & Phase Velocity
      case 61: // Natural Normal Modes & Standing Waves
      case 66: // Doppler Effect & Acoustic Frequency Shift
        return (
          <DopplerWaveEngine
            experiment={experiment}
            params={effectiveParams}
            isRunning={isRunning}
            onOutputsUpdate={onOutputsUpdate}
          />
        );

      // ==========================================
      // Category C: Electricity, Magnetism & Circuits
      // ==========================================
      case 33: // Ohm's Law & Circuit Power Dissipation
        return (
          <CircuitOhmLawSimulation
            params={effectiveParams}
            isRunning={isRunning}
            onOutputsUpdate={onOutputsUpdate}
          />
        );

      case 4: // Static Electricity & Coulomb's Law
      case 8: // Electromagnetic Induction & Faraday's Law
      case 31: // Magnetic Fields & Lorentz Force on Charges
      case 42: // Capacitor Lab & Stored Electric Energy
      case 43: // Charges and Fields & Equipotentials
      case 44: // Resistance in a Wire & Resistivity
      case 54: // Circuit Construction Kit (Advanced DC)
      case 55: // Generator & Dynamo
      case 56: // Magnets and Compass
      case 57: // Magnets and Electromagnets
      case 67: // Transformer & Mutual Induction
        return (
          <CircuitsEngine
            experiment={experiment}
            params={effectiveParams}
            isRunning={isRunning}
            onOutputsUpdate={onOutputsUpdate}
          />
        );

      // ==========================================
      // Category D: Classical Mechanics, Kinematics & Gravity
      // ==========================================
      case 22: // Conservation of Energy in Pendulum
      case 23: // Pendulum Period & Gravity Acceleration
        return (
          <SimplePendulumSimulation
            params={effectiveParams}
            isRunning={isRunning}
            onOutputsUpdate={onOutputsUpdate}
          />
        );

      case 5: // Sled Race & Friction Laws
      case 7: // Torque Equilibrium & Seesaw
      case 9: // Stokes' Law, Viscosity & Terminal Velocity
      case 10: // Inclined Plane & Simple Machines
      case 11: // Metric Prefixes & Dimensional Conversion
      case 12: // Young's Modulus, Stress & Strain
      case 13: // Bernoulli's Principle & Venturi Tube
      case 19: // Circular Motion & Angular Kinematics
      case 20: // Moment of Inertia & Rotational Dynamics
      case 21: // Center of Mass & Multi-body Systems
      case 24: // Projectile Motion & Range
      case 25: // Hooke's Law & Spring Harmonic Oscillation
      case 26: // Conservation of Linear Momentum & Collisions
      case 27: // Free Fall Kinematics & Gravity
      case 34: // Archimedes' Principle & Buoyant Force
      case 45: // Gravity & Planetary Orbital Mechanics
      case 46: // Kepler's Laws of Planetary Motion
      case 47: // Energy Skate Park
      case 52: // Rotational Motion & Angular Momentum
      case 58: // Gravity Force Lab
      case 59: // Solar System Dynamics & N-Body Mechanics
      case 62: // Forces and Motion: Basics (Newton's Laws)
        return (
          <MechanicsEngine
            experiment={experiment}
            params={effectiveParams}
            isRunning={isRunning}
            onOutputsUpdate={onOutputsUpdate}
          />
        );

      // ==========================================
      // Category E: Thermodynamics & Statistical Physics
      // ==========================================
      case 35: // Ideal Gas Law (PV = nRT)
        return (
          <ThermodynamicsPistonSimulation
            params={effectiveParams}
            isRunning={isRunning}
            onOutputsUpdate={onOutputsUpdate}
          />
        );

      case 1: // First Law of Thermodynamics
      case 6: // Thermal Conduction & Fourier's Law
      case 50: // States of Matter & Phase Transitions
      case 51: // Gas Diffusion & Graham's Law
      case 60: // Energy Forms and Changes
      case 63: // Gas Properties & Kinetic Pressure
      case 64: // Molecular Diffusion & Fick's First Law
      case 70: // Calorimetry & Thermal Equilibrium
        return (
          <ThermodynamicsEngine
            experiment={experiment}
            params={effectiveParams}
            isRunning={isRunning}
            onOutputsUpdate={onOutputsUpdate}
          />
        );

      // ==========================================
      // Category F: Modern, Quantum & Nuclear Physics
      // ==========================================
      case 32: // Atomic Emission Spectra & Bohr Transitions
      case 37: // Atom Builder & Periodic Table
      case 38: // Nuclear Structure & Binding Energy
      case 39: // Rutherford Alpha Particle Scattering
      case 40: // Molecules & Light Photon Interaction
      case 53: // Hydrogen Atom Models
      case 65: // Blackbody Radiation & Planck/Wien Laws
      case 68: // Photoelectric Effect & Einstein's Law
      case 69: // Radioactive Decay & Nuclear Half-Life
        return (
          <ModernPhysicsEngine
            experiment={experiment}
            params={effectiveParams}
            isRunning={isRunning}
            onOutputsUpdate={onOutputsUpdate}
          />
        );

      // Default case: Unmatched experiments return a clean placeholder (No fallback simulation engines)
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-slate-400 p-6 text-center">
            <p className="text-sm font-medium">Simulation engine under configuration for this experiment.</p>
          </div>
        );
    }
  };

  // Render Phase 10.9 Domain-Specific Quick Controls Bar (Under Canvas)
  const renderDomainControls = () => {
    // 1. EXP-002: Prescription Glasses (Myopia, Hyperopia, Normal Vision Presets)
    if (code === 2 || slug.includes('glasses') || slug.includes('prescription')) {
      const activeMode = domainSettings.focalLength === -25 ? 'myopia' : domainSettings.focalLength === 25 ? 'hyperopia' : 'normal';
      return (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
          <span className="font-semibold text-slate-300">Vision Mode:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                updateDomainSetting('focalLength', -25);
                updateDomainSetting('objectDistance', 50);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeMode === 'myopia'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Myopia (Concave -4.0D)
            </button>
            <button
              type="button"
              onClick={() => {
                updateDomainSetting('focalLength', 25);
                updateDomainSetting('objectDistance', 30);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeMode === 'hyperopia'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Hyperopia (Convex +4.0D)
            </button>
            <button
              type="button"
              onClick={() => {
                updateDomainSetting('focalLength', 20);
                updateDomainSetting('objectDistance', 40);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeMode === 'normal'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Standard (f = 20cm)
            </button>
          </div>
        </div>
      );
    }

    // 2. EXP-066: Doppler Effect (Subsonic / Supersonic / Stationary Source Modes)
    if (code === 66 || slug.includes('doppler')) {
      const vSource = effectiveParams.sourceSpeed ?? 60;
      return (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
          <span className="font-semibold text-slate-300">Acoustic Regime:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => updateDomainSetting('sourceSpeed', 0)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                vSource === 0 ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Stationary (v = 0)
            </button>
            <button
              type="button"
              onClick={() => updateDomainSetting('sourceSpeed', 80)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                vSource === 80 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Subsonic (Mach 0.23)
            </button>
            <button
              type="button"
              onClick={() => updateDomainSetting('sourceSpeed', 343)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                vSource >= 343 ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Sonic Boom (Mach 1.0)
            </button>
          </div>
        </div>
      );
    }

    // 3. EXP-028 / EXP-029: Pipe Acoustic Resonance (Open vs Closed Pipe)
    if (code === 28 || code === 29 || slug.includes('pipe') || slug.includes('speed-of-sound')) {
      const currentHarmonic = effectiveParams.harmonic ?? 1;
      return (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
          <span className="font-semibold text-slate-300">Harmonic Mode (n):</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => updateDomainSetting('harmonic', n)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  currentHarmonic === n ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Harmonic {n} ({n === 1 ? 'Fundamental' : `f_${n}`})
              </button>
            ))}
          </div>
        </div>
      );
    }

    // 4. EXP-068: Photoelectric Effect (Target Cathode Metal Presets)
    if (code === 68 || slug.includes('photoelectric')) {
      const currentPhi = effectiveParams.workFunction ?? 2.2;
      return (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
          <span className="font-semibold text-slate-300">Cathode Target Metal:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => updateDomainSetting('workFunction', 2.14)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                Math.abs(currentPhi - 2.14) < 0.1 ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Cesium (2.14 eV)
            </button>
            <button
              type="button"
              onClick={() => updateDomainSetting('workFunction', 2.28)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                Math.abs(currentPhi - 2.28) < 0.1 ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Sodium (2.28 eV)
            </button>
            <button
              type="button"
              onClick={() => updateDomainSetting('workFunction', 4.70)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                Math.abs(currentPhi - 4.70) < 0.1 ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Copper (4.70 eV)
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`flex flex-col gap-2.5 w-full ${className}`}>
      {/* Simulation Stage Container */}
      <div className="w-full rounded-xl overflow-hidden shadow-inner">
        {renderEngine()}
      </div>

      {/* Domain Controls Bar (Mobile-friendly, touch-optimized) */}
      {renderDomainControls()}
    </div>
  );
};

export default SimulationCanvas;
