/**
 * Simulation Lifecycle Engine Interface & State Contracts
 */

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'reset' | 'error';

export interface SimulationState<TState = Record<string, unknown>> {
  status: SimulationStatus;
  time: number;
  data: TState;
  errorMessage?: string;
}

export interface SimulationCanvasConfig {
  width: number;
  height: number;
  devicePixelRatio: number;
}

/**
 * Standard Contract for all Physics Simulation Engines.
 * Separates physical mathematics and rendering execution from React state management.
 */
export interface ISimulationEngine<TParams = Record<string, number>, TState = Record<string, unknown>> {
  /** Initialize canvas context and engine state */
  init(canvas: HTMLCanvasElement, initialParams: TParams): void;

  /** Update canvas resolution on resize without resetting engine state */
  resize(): void;

  /** Update physics parameters in real time without tearing engine state */
  updateParams(params: Partial<TParams>): void;

  /** Controls */
  start(): void;
  pause(): void;
  reset(): void;

  /** Discrete physics step execution */
  step(deltaTime: number): void;

  /** Retrieve active state for rendering or metric outputs */
  getState(): SimulationState<TState>;

  /** Clean up animation loops, event listeners, and memory allocation */
  destroy(): void;
}
