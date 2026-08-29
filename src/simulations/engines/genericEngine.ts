import { BaseSimulationEngine } from '../core/BaseSimulationEngine';
import { SmartLabelSystem, AnnotationPriority } from '../core/AnnotationSystem';

export class GenericSimulationEngine extends BaseSimulationEngine<Record<string, number>> {
  private particles: { x: number; y: number; vx: number; vy: number; hue: number }[] = [];

  constructor(initialParams: Record<string, number>) {
    super(initialParams, {
      energy: 100,
      systemResponse: 0,
    });
  }

  protected onInit(): void {
    this.initParticles();
    this.calculateMetrics();
  }

  private initParticles(): void {
    this.particles = [];
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        hue: (i * 9) % 360,
      });
    }
  }

  protected onParamsUpdated(): void {
    this.calculateMetrics();
  }

  protected onReset(): void {
    this.initParticles();
    this.calculateMetrics();
  }

  private calculateMetrics(): void {
    const primary = Object.values(this.params)[0] ?? 50;
    const secondary = Object.values(this.params)[1] ?? 10;
    this.state.energy = Number((primary * 2.5).toFixed(1));
    this.state.systemResponse = Number((primary * secondary * 0.1).toFixed(2));
  }

  public step(deltaTime: number): void {
    const paramVal = Object.values(this.params)[0] ?? 50;
    const speed = (paramVal / 50) * 1.2;

    for (const p of this.particles) {
      p.x += p.vx * deltaTime * speed;
      p.y += p.vy * deltaTime * speed;

      if (p.x < 0) { p.x = 1; }
      if (p.x > 1) { p.x = 0; }
      if (p.y < 0) { p.y = 1; }
      if (p.y > 1) { p.y = 0; }
    }

    const primary = Object.values(this.params)[0] ?? 50;
    const secondary = Object.values(this.params)[1] ?? 10;
    this.state.energy = Number((primary * 2.5 * (1 + 0.05 * Math.sin(this.time * 2))).toFixed(1));
    this.state.systemResponse = Number((primary * secondary * 0.1 * (1 + 0.02 * Math.cos(this.time))).toFixed(2));
  }

  protected render(): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);

    // Initialize Smart Annotation System
    const labelSystem = new SmartLabelSystem(ctx, width, height, 12);

    // Dynamic Background Field Grid
    const paramVal = Object.values(this.params)[0] ?? 50;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;

    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Connect Neighbor Particles with Force Lines
    for (let i = 0; i < this.particles.length; i++) {
      const p1 = this.particles[i];
      const x1 = p1.x * width;
      const y1 = p1.y * height;

      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const x2 = p2.x * width;
        const y2 = p2.y * height;

        const dist = Math.hypot(x2 - x1, y2 - y1);
        if (dist < 100) {
          ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / 100) * 0.4})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      // Draw Particle Node
      ctx.fillStyle = `hsl(${p1.hue}, 80%, 60%)`;
      ctx.beginPath();
      ctx.arc(x1, y1, 4 + (paramVal / 50) * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Register Smart Annotations
    labelSystem.renderAnnotations([
      {
        id: 'system-energy',
        anchorX: width * 0.25,
        anchorY: 30,
        text: `System Energy: ${this.state.energy} J`,
        compactText: `E = ${this.state.energy} J`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#38bdf8',
        borderColor: '#0284c7',
      },
      {
        id: 'system-response',
        anchorX: width * 0.75,
        anchorY: 30,
        text: `System Response: ${this.state.systemResponse}`,
        compactText: `Resp = ${this.state.systemResponse}`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#10b981',
        borderColor: '#059669',
      },
    ]);
  }
}
