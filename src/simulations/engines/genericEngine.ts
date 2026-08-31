import { BaseSimulationEngine } from '../core/BaseSimulationEngine';
import { ISimulationEngine, SimulationState } from '../../types/simulation';
import { Experiment } from '../../types/experiment';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  phase: number;
}

export class GenericSimulationEngine extends BaseSimulationEngine<Record<string, number>> implements ISimulationEngine<Record<string, number>> {
  private experiment: Experiment;
  private isRunningState: boolean = false;
  private particles: Particle[] = [];

  constructor(experiment: Experiment, initialParams: Record<string, number> = {}) {
    // Default initial params extraction
    const defaultParams = (experiment.parameters || []).reduce((acc, param) => {
      acc[param.id] = param.defaultValue;
      return acc;
    }, {} as Record<string, number>);

    const merged = { ...defaultParams, ...initialParams };
    super(merged, {
      response: 0,
      energy: 100,
      phase: 0,
      rate: 1.0,
    });

    this.experiment = experiment;
    this.initParticles();
  }

  // --- Direct Lifecycle methods matching User Specification ---
  public start(): void {
    this.isRunningState = true;
    super.start();
  }

  public pause(): void {
    this.isRunningState = false;
    super.pause();
  }

  public reset(): void {
    this.time = 0;
    this.isRunningState = false;
    super.reset();
  }

  public update(deltaTime: number): void {
    if (this.isRunningState || this.status === 'running') {
      this.time += deltaTime;
      this.step(deltaTime);
    }
  }

  public updateParams(newParams: Partial<Record<string, number>>): void {
    super.updateParams(newParams);
    this.calculateMetrics();
  }

  protected onInit(): void {
    this.initParticles();
    this.calculateMetrics();
  }

  protected onParamsUpdated(): void {
    this.calculateMetrics();
  }

  protected onReset(): void {
    this.initParticles();
    this.calculateMetrics();
  }

  private initParticles(): void {
    this.particles = [];
    const count = 30;
    const category = this.experiment.category || 'mechanics';

    for (let i = 0; i < count; i++) {
      let color = '#38bdf8';
      if (category === 'electricity') color = i % 2 === 0 ? '#38bdf8' : '#f43f5e';
      else if (category === 'thermodynamics') color = i % 3 === 0 ? '#f97316' : '#38bdf8';
      else if (category === 'optics') color = `hsl(${(i * 30) % 360}, 85%, 65%)`;
      else if (category === 'modern_physics') color = '#a855f7';
      else if (category === 'waves') color = '#06b6d4';

      this.particles.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 3 + Math.random() * 3,
        color,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  private calculateMetrics(): void {
    const keys = Object.keys(this.params);
    const p1 = this.params[keys[0]] ?? 1;
    const p2 = this.params[keys[1]] ?? 9.81;

    // Process output metrics in real-time
    if (this.experiment.outputMetrics && this.experiment.outputMetrics.length > 0) {
      this.experiment.outputMetrics.forEach((metric) => {
        if (metric.id.includes('period') || metric.symbol === 'T') {
          this.state[metric.id] = Number((2 * Math.PI * Math.sqrt(Math.abs(p1 / (p2 || 1)))).toFixed(2));
        } else if (metric.id.includes('frequency') || metric.symbol === 'f') {
          const period = 2 * Math.PI * Math.sqrt(Math.abs(p1 / (p2 || 1)));
          this.state[metric.id] = Number((1 / (period || 1)).toFixed(2));
        } else if (metric.id.includes('energy') || metric.symbol === 'E') {
          this.state[metric.id] = Number((p1 * p2 * 0.5 * (1 + 0.1 * Math.sin(this.time * 2))).toFixed(2));
        } else if (metric.id.includes('force') || metric.symbol === 'F') {
          this.state[metric.id] = Number((p1 * p2).toFixed(2));
        } else if (metric.id.includes('velocity') || metric.id.includes('speed') || metric.symbol === 'v') {
          this.state[metric.id] = Number((Math.abs(p1 * Math.cos(this.time * 2))).toFixed(2));
        } else {
          this.state[metric.id] = Number((p1 * Math.sin(this.time * 2)).toFixed(2));
        }
      });
    }

    this.state.response = this.state.response ?? Number((p1 * Math.sin(this.time * 2)).toFixed(2));
    this.state.energy = this.state.energy ?? Number((p1 * 2.5).toFixed(1));
  }

  public step(deltaTime: number): void {
    const keys = Object.keys(this.params);
    const p1 = keys.length > 0 ? (this.params[keys[0]] ?? 50) : 50;
    const speed = (p1 / 50) * 1.0;

    for (const p of this.particles) {
      p.x += p.vx * deltaTime * speed;
      p.y += p.vy * deltaTime * speed;

      if (p.x < 0) p.x = 1;
      if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1;
      if (p.y > 1) p.y = 0;
    }

    this.calculateMetrics();
  }

  public getState(): SimulationState<Record<string, unknown>> {
    const outputs: Record<string, number> = {};
    const keys = Object.keys(this.params);
    const p1 = this.params[keys[0]] ?? 1;
    const p2 = this.params[keys[1]] ?? 9.81;

    if (this.experiment.outputMetrics && this.experiment.outputMetrics.length > 0) {
      this.experiment.outputMetrics.forEach((metric) => {
        if (metric.id.includes('period') || metric.symbol === 'T') {
          outputs[metric.id] = Number((2 * Math.PI * Math.sqrt(Math.abs(p1 / (p2 || 1)))).toFixed(2));
        } else if (metric.id.includes('frequency') || metric.symbol === 'f') {
          const period = 2 * Math.PI * Math.sqrt(Math.abs(p1 / (p2 || 1)));
          outputs[metric.id] = Number((1 / (period || 1)).toFixed(2));
        } else {
          outputs[metric.id] = Number((p1 * Math.sin(this.time)).toFixed(2));
        }
      });
    }

    return {
      status: this.status,
      time: this.time,
      data: {
        ...this.state,
        isRunning: this.isRunningState || this.status === 'running',
        parameters: this.params,
        outputs,
      },
    };
  }

  // --- 60 FPS Dynamic Rendering Pipeline ---
  public render(ctxParam?: CanvasRenderingContext2D, widthParam?: number, heightParam?: number): void {
    const ctx = ctxParam || this.ctx;
    if (!ctx) return;

    const width = widthParam || (this.canvas ? this.canvas.width / (window.devicePixelRatio || 1) : 600);
    const height = heightParam || (this.canvas ? this.canvas.height / (window.devicePixelRatio || 1) : 400);

    ctx.clearRect(0, 0, width, height);

    // 1. Grid Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Title & Law Metadata Overlay
    const titleText = this.experiment.title?.en || this.experiment.title?.ar || 'Physics Experiment';
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`Exp #${this.experiment.codeNumber}: ${titleText}`, 20, 35);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px monospace';
    ctx.fillText(`Law: ${this.experiment.physicalLaw || 'General Physical Relationship'}`, 20, 60);

    // 3. Dynamic Wave & Particle Physics Simulation
    const val1 = Object.values(this.params)[0] || 1;
    const val2 = Object.values(this.params)[1] || 10;

    const centerY = height / 2;
    const amp = Math.min(Math.max(val1 * 12, 15), height / 4);
    const freq = Math.min(Math.max(val2 * 0.015, 0.005), 0.08);

    // Render Ambient Particles
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x * width, p.y * height, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render Primary Physics Wave
    ctx.beginPath();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    for (let x = 0; x < width; x++) {
      const y = centerY + Math.sin(x * freq + this.time * 4) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Harmonic Secondary Wave
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    for (let x = 0; x < width; x += 2) {
      const y = centerY + Math.cos(x * freq * 1.5 - this.time * 3) * (amp * 0.6);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Oscillating Motion Particle
    const px = (this.time * 60) % width;
    const py = centerY + Math.sin(px * freq + this.time * 4) * amp;

    // Glowing Particle
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(px, py, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Velocity Vector
    const vy = Math.cos(px * freq + this.time * 4) * amp * freq * 10;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px, py - vy);
    ctx.stroke();

    // 5. HUD Status Corner Tag
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(width - 160, 15, 140, 32);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(width - 160, 15, 140, 32);
    ctx.fillStyle = '#10b981';
    ctx.font = '12px monospace';
    ctx.fillText(`60 FPS • t=${this.time.toFixed(1)}s`, width - 145, 36);
  }
}
