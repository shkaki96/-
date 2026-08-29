import { ISimulationEngine, SimulationState, SimulationStatus } from '../../types/simulation';

/**
 * Base Abstract Simulation Engine
 * Encapsulates animation loop execution, high-DPI canvas setup, delta-time clamping, and cleanup lifecycle.
 */
export abstract class BaseSimulationEngine<
  TParams extends Record<string, number> = Record<string, number>,
  TState extends Record<string, unknown> = Record<string, unknown>
> implements ISimulationEngine<TParams, TState> {
  protected canvas: HTMLCanvasElement | null = null;
  protected ctx: CanvasRenderingContext2D | null = null;
  protected params: TParams;
  protected state: TState;
  protected status: SimulationStatus = 'idle';
  protected time: number = 0;

  private animFrameId: number | null = null;
  private lastTimeStamp: number = 0;
  private maxDeltaTime: number = 0.1; // Max 100ms delta to prevent physics explosions on tab switch

  constructor(initialParams: TParams, initialState: TState) {
    this.params = { ...initialParams };
    this.state = { ...initialState };
  }

  public init(canvas: HTMLCanvasElement, initialParams: TParams): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.params = { ...initialParams };
    this.time = 0;
    this.status = 'idle';
    
    this.setupCanvasDPI();
    this.onInit();
    this.render();
  }

  public resize(): void {
    if (!this.canvas) return;
    this.setupCanvasDPI();
    this.onResize();
    this.render();
  }

  protected setupCanvasDPI(): void {
    if (!this.canvas || !this.ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width || 300;
    const height = rect.height || 300;

    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    
    // Explicitly set transform matrix to avoid compound scaling on re-render/resize
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  public updateParams(newParams: Partial<TParams>): void {
    this.params = { ...this.params, ...newParams };
    this.onParamsUpdated();
    if (this.status === 'idle' || this.status === 'paused') {
      this.render();
    }
  }

  public start(): void {
    if (this.status === 'running') return;
    this.status = 'running';
    this.lastTimeStamp = performance.now();
    this.loop(this.lastTimeStamp);
  }

  public pause(): void {
    this.status = 'paused';
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public reset(): void {
    this.pause();
    this.status = 'reset';
    this.time = 0;
    this.onReset();
    this.status = 'idle';
    this.render();
  }

  private loop = (timestamp: number): void => {
    if (this.status !== 'running') return;

    const rawDelta = (timestamp - this.lastTimeStamp) / 1000;
    this.lastTimeStamp = timestamp;

    // Clamp delta time to avoid large physics jumps
    const dt = Math.min(Math.max(rawDelta, 0), this.maxDeltaTime);

    this.time += dt;
    this.step(dt);
    this.render();

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  public abstract step(deltaTime: number): void;
  protected abstract render(): void;
  protected abstract onInit(): void;
  protected abstract onParamsUpdated(): void;
  protected abstract onReset(): void;
  protected onResize(): void {}
  protected onDestroy(): void {}

  public getState(): SimulationState<TState> {
    return {
      status: this.status,
      time: this.time,
      data: this.state,
    };
  }

  public destroy(): void {
    this.pause();
    this.onDestroy();
    if (this.canvas) {
      this.canvas = null;
      this.ctx = null;
    }
  }
}
