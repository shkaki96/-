import { BaseSimulationEngine } from '../core/BaseSimulationEngine';
import { SmartLabelSystem, AnnotationPriority } from '../core/AnnotationSystem';

export interface ThermodynamicsParams extends Record<string, number> {
  temperature?: number; // K or °C
  volume?: number; // L or m³
  pressure?: number; // kPa
  heatInput?: number; // J
  [key: string]: number;
}

interface Molecule {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export class ThermodynamicsEngine extends BaseSimulationEngine<ThermodynamicsParams> {
  private molecules: Molecule[] = [];

  constructor(initialParams: ThermodynamicsParams) {
    super(initialParams, {
      workDone: 0,
      internalEnergy: 0,
      pressure: 101.3,
    });
  }

  protected onInit(): void {
    this.initMolecules();
    this.calculateMetrics();
  }

  private initMolecules(): void {
    this.molecules = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      this.molecules.push({
        x: Math.random() * 0.8 + 0.1, // normalized 0..1 inside cylinder
        y: Math.random() * 0.8 + 0.1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 4,
      });
    }
  }

  protected onParamsUpdated(): void {
    this.calculateMetrics();
  }

  protected onReset(): void {
    this.initMolecules();
    this.calculateMetrics();
  }

  private calculateMetrics(): void {
    const temp = this.params.temperature ?? this.params.var1 ?? 300;
    const vol = this.params.volume ?? 10;
    // Ideal gas law P = nRT / V
    const p = Number(((8.314 * temp) / vol).toFixed(1));
    const internalE = Number((1.5 * 8.314 * temp).toFixed(1));

    this.state.temperature = temp;
    this.state.volume = vol;
    this.state.pressure = p;
    this.state.internalEnergy = internalE;
    this.state.workDone = Number((p * vol * 0.01 * (1 - Math.exp(-this.time * 0.2))).toFixed(2));
  }

  public step(deltaTime: number): void {
    const temp = this.params.temperature ?? this.params.var1 ?? 300;
    const vol = this.params.volume ?? 10;
    const speedMultiplier = Math.sqrt(temp / 300) * 1.5;

    // Update gas molecules positions inside cylinder bounds
    for (const m of this.molecules) {
      m.x += m.vx * deltaTime * speedMultiplier;
      m.y += m.vy * deltaTime * speedMultiplier;

      // Bounce off walls
      if (m.x < 0.05) { m.x = 0.05; m.vx *= -1; }
      if (m.x > 0.95) { m.x = 0.95; m.vx *= -1; }
      if (m.y < 0.05) { m.y = 0.05; m.vy *= -1; }
      if (m.y > 0.95) { m.y = 0.95; m.vy *= -1; }
    }

    const p = Number(this.state.pressure ?? 100);
    this.state.workDone = Number((p * vol * 0.01 * (1 - Math.exp(-this.time * 0.2))).toFixed(2));
  }

  protected render(): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);

    // Initialize Smart Annotation System
    const labelSystem = new SmartLabelSystem(ctx, width, height, 12);

    // Cylinder boundaries
    const cylLeft = width * 0.2;
    const cylRight = width * 0.8;
    const cylWidth = cylRight - cylLeft;
    const cylBottom = height * 0.85;
    const cylTop = height * 0.15;
    const cylHeight = cylBottom - cylTop;

    // Piston position based on volume parameter
    const vol = this.params.volume ?? 10;
    const normVol = Math.min(Math.max((vol - 1) / 20, 0.2), 0.9);
    const pistonY = cylBottom - cylHeight * normVol;
    const temp = this.params.temperature ?? this.params.var1 ?? 300;

    // Register Obstacles
    labelSystem.addObstacle({ type: 'box', x: cylLeft - 10, y: pistonY - 15, width: cylWidth + 20, height: 20 });
    labelSystem.addObstacle({ type: 'box', x: width / 2 - 10, y: cylTop, width: 20, height: pistonY - cylTop });
    labelSystem.addObstacle({ type: 'line', x1: cylLeft, y1: cylTop, x2: cylLeft, y2: cylBottom, padding: 8 });
    labelSystem.addObstacle({ type: 'line', x1: cylRight, y1: cylTop, x2: cylRight, y2: cylBottom, padding: 8 });

    // 1. Draw Heat Source / Flames at Bottom
    if (temp > 250) {
      const flameGradient = ctx.createLinearGradient(0, cylBottom, 0, cylBottom + 30);
      flameGradient.addColorStop(0, '#f97316');
      flameGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = flameGradient;
      ctx.fillRect(cylLeft, cylBottom, cylWidth, 30);
    }

    // 2. Draw Gas Cylinder Background
    const bgGrad = ctx.createLinearGradient(0, pistonY, 0, cylBottom);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(cylLeft, pistonY, cylWidth, cylBottom - pistonY);

    // 3. Draw Bouncing Gas Molecules
    for (const m of this.molecules) {
      const mx = cylLeft + m.x * cylWidth;
      const my = pistonY + m.y * (cylBottom - pistonY);

      ctx.fillStyle = temp > 400 ? '#f43f5e' : temp > 300 ? '#38bdf8' : '#818cf8';
      ctx.beginPath();
      ctx.arc(mx, my, m.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Draw Piston Head & Rod
    ctx.fillStyle = '#475569';
    ctx.fillRect(cylLeft - 5, pistonY - 12, cylWidth + 10, 14);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(cylLeft - 5, pistonY - 12, cylWidth + 10, 14);

    // Piston Rod
    ctx.fillStyle = '#64748b';
    ctx.fillRect(width / 2 - 8, cylTop, 16, pistonY - 12 - cylTop);

    // 5. Draw Cylinder Glass Walls
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cylLeft, cylTop);
    ctx.lineTo(cylLeft, cylBottom);
    ctx.lineTo(cylRight, cylBottom);
    ctx.lineTo(cylRight, cylTop);
    ctx.stroke();

    // Register Smart Annotations
    labelSystem.renderAnnotations([
      {
        id: 'pressure-metric',
        anchorX: cylLeft + 20,
        anchorY: Math.min(height - 40, pistonY + (cylBottom - pistonY) / 2),
        text: `Pressure (P) = ${this.state.pressure} kPa`,
        compactText: `P = ${this.state.pressure} kPa`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#38bdf8',
        borderColor: '#0284c7',
      },
      {
        id: 'temperature-metric',
        anchorX: width / 2,
        anchorY: cylBottom + 10,
        text: `Temp (T) = ${temp} K`,
        compactText: `T = ${temp} K`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#f97316',
        borderColor: '#ea580c',
      },
      {
        id: 'volume-metric',
        anchorX: cylRight - 20,
        anchorY: Math.min(height - 40, pistonY + (cylBottom - pistonY) / 2),
        text: `Volume (V) = ${vol} L`,
        compactText: `V = ${vol} L`,
        priority: AnnotationPriority.MEASUREMENT,
        color: '#10b981',
        borderColor: '#059669',
      },
      {
        id: 'piston-label',
        anchorX: cylLeft + 10,
        anchorY: pistonY - 10,
        text: 'Piston Head',
        compactText: 'Piston',
        priority: AnnotationPriority.OBJECT_NAME,
        color: '#e2e8f0',
        borderColor: '#64748b',
      },
    ]);
  }
}
