import { BaseSimulationEngine } from '../core/BaseSimulationEngine';
import { SmartLabelSystem, AnnotationPriority } from '../core/AnnotationSystem';

export interface WaveParams extends Record<string, number> {
  frequency?: number; // Hz
  wavelength?: number; // m
  amplitude?: number; // m
  [key: string]: number;
}

export class WaveEngine extends BaseSimulationEngine<WaveParams> {
  constructor(initialParams: WaveParams) {
    super(initialParams, {
      waveSpeed: 0,
      period: 0,
    });
  }

  protected onInit(): void {
    this.calculateMetrics();
  }

  protected onParamsUpdated(): void {
    this.calculateMetrics();
  }

  protected onReset(): void {
    this.calculateMetrics();
  }

  private calculateMetrics(): void {
    const f = this.params.frequency ?? this.params.var1 ?? 2;
    const lambda = this.params.wavelength ?? 1.5;
    const amp = this.params.amplitude ?? 40;
    const v = Number((f * lambda).toFixed(2));
    const T = f > 0 ? Number((1 / f).toFixed(3)) : 0;

    this.state.frequency = f;
    this.state.wavelength = lambda;
    this.state.amplitude = amp;
    this.state.waveSpeed = v;
    this.state.period = T;
    this.state.angularFrequency = Number((2 * Math.PI * f).toFixed(2));
    this.state.waveNumber = Number(((2 * Math.PI) / lambda).toFixed(2));
  }

  public step(_deltaTime: number): void {
    // Animation continuously progresses via this.time in BaseSimulationEngine
  }

  protected render(): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);

    // Initialize Smart Annotation System
    const labelSystem = new SmartLabelSystem(ctx, width, height, 12);

    const freq = this.params.frequency ?? this.params.var1 ?? 2;
    const lambda = this.params.wavelength ?? 1.5;
    const amp = this.params.amplitude ?? 40;

    const centerY = height / 2;

    // Register Baseline obstacle
    labelSystem.addObstacle({ type: 'line', x1: 0, y1: centerY, x2: width, y2: centerY, padding: 12 });

    // Draw Equilibrium Baseline Grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Continuous Sine Wave
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const k = (2 * Math.PI) / (lambda * 100); // Wave vector
    const omega = 2 * Math.PI * freq; // Angular frequency

    for (let x = 0; x <= width; x += 2) {
      const y = centerY + amp * Math.sin(k * x - omega * this.time);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw Oscillating Grid Particles along the wave
    const particleSpacing = 30;
    for (let x = 20; x < width; x += particleSpacing) {
      const y = centerY + amp * Math.sin(k * x - omega * this.time);

      // Particle vertical connector
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Particle Bob
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Register Smart Annotations
    labelSystem.renderAnnotations([
      {
        id: 'wave-speed',
        anchorX: width * 0.25,
        anchorY: Math.max(20, centerY - amp - 15),
        text: `v = f · λ = ${this.state.waveSpeed} m/s`,
        compactText: `v = ${this.state.waveSpeed} m/s`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#22d3ee',
        borderColor: '#0891b2',
      },
      {
        id: 'wave-frequency',
        anchorX: width * 0.75,
        anchorY: Math.max(20, centerY - amp - 15),
        text: `f = ${freq} Hz | T = ${this.state.period} s`,
        compactText: `f = ${freq} Hz`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#f43f5e',
        borderColor: '#e11d48',
      },
      {
        id: 'wavelength-measure',
        anchorX: width * 0.5,
        anchorY: Math.min(height - 20, centerY + amp + 15),
        text: `Wavelength (λ) = ${lambda} m`,
        compactText: `λ = ${lambda} m`,
        priority: AnnotationPriority.MEASUREMENT,
        color: '#a855f7',
        borderColor: '#9333ea',
      },
      {
        id: 'amplitude-measure',
        anchorX: width * 0.1,
        anchorY: centerY - amp / 2,
        text: `Amplitude (A) = ${amp} px`,
        compactText: `A = ${amp}`,
        priority: AnnotationPriority.MEASUREMENT,
        color: '#eab308',
        borderColor: '#ca8a04',
      },
    ]);
  }
}
