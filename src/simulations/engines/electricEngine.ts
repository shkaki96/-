import { BaseSimulationEngine } from '../core/BaseSimulationEngine';
import { SmartLabelSystem, AnnotationPriority } from '../core/AnnotationSystem';

export interface ElectricParams extends Record<string, number> {
  voltage?: number; // V
  resistance?: number; // Ω
  [key: string]: number;
}

interface Electron {
  progress: number; // 0..1 around loop
}

export class ElectricEngine extends BaseSimulationEngine<ElectricParams> {
  private electrons: Electron[] = [];

  constructor(initialParams: ElectricParams) {
    super(initialParams, {
      current: 0,
      power: 0,
    });
  }

  protected onInit(): void {
    this.initElectrons();
    this.calculateMetrics();
  }

  private initElectrons(): void {
    this.electrons = [];
    const count = 30;
    for (let i = 0; i < count; i++) {
      this.electrons.push({
        progress: i / count,
      });
    }
  }

  protected onParamsUpdated(): void {
    this.calculateMetrics();
  }

  protected onReset(): void {
    this.initElectrons();
    this.calculateMetrics();
  }

  private calculateMetrics(): void {
    const v = this.params.voltage ?? this.params.var1 ?? 12;
    const r = this.params.resistance ?? 10;
    const i = Number((v / r).toFixed(2));
    const p = Number((v * i).toFixed(2));

    this.state.voltage = v;
    this.state.resistance = r;
    this.state.current = i;
    this.state.power = p;
    this.state.chargeTransferred = Number((i * this.time).toFixed(2));
    this.state.energyDissipated = Number((p * this.time).toFixed(2));
  }

  public step(deltaTime: number): void {
    const current = (this.state.current as number) || 1;
    const speed = current * 0.15;

    for (const e of this.electrons) {
      e.progress = (e.progress + speed * deltaTime) % 1;
    }

    const i = Number(this.state.current ?? 0);
    const p = Number(this.state.power ?? 0);
    this.state.chargeTransferred = Number((i * this.time).toFixed(2));
    this.state.energyDissipated = Number((p * this.time).toFixed(2));
  }

  protected render(): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);

    // Initialize Smart Annotation System
    const labelSystem = new SmartLabelSystem(ctx, width, height, 12);

    // Circuit Layout Rectangle
    const left = width * 0.18;
    const right = width * 0.82;
    const top = height * 0.22;
    const bottom = height * 0.78;
    const totalLength = 2 * (right - left) + 2 * (bottom - top);

    const midY = (top + bottom) / 2;
    const midX = (left + right) / 2;

    // Obstacles: Wires, Battery, Resistor
    labelSystem.addObstacle({ type: 'line', x1: left, y1: top, x2: right, y2: top, padding: 8 });
    labelSystem.addObstacle({ type: 'line', x1: left, y1: bottom, x2: right, y2: bottom, padding: 8 });
    labelSystem.addObstacle({ type: 'line', x1: left, y1: top, x2: left, y2: bottom, padding: 8 });
    labelSystem.addObstacle({ type: 'line', x1: right, y1: top, x2: right, y2: bottom, padding: 8 });
    labelSystem.addObstacle({ type: 'box', x: left - 15, y: midY - 30, width: 30, height: 60 });
    labelSystem.addObstacle({ type: 'box', x: right - 15, y: midY - 35, width: 30, height: 70 });

    // Helper to map progress (0..1) to 2D circuit coordinates
    const getPoint = (p: number) => {
      const d = p * totalLength;
      const w = right - left;
      const h = bottom - top;

      if (d < w) return { x: left + d, y: top }; // Top segment ->
      if (d < w + h) return { x: right, y: top + (d - w) }; // Right segment v
      if (d < 2 * w + h) return { x: right - (d - (w + h)), y: bottom }; // Bottom segment <-
      return { x: left, y: bottom - (d - (2 * w + h)) }; // Left segment ^
    };

    // 1. Draw Wires
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.strokeRect(left, top, right - left, bottom - top);

    // 2. Draw Battery Source (Left Wire)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(left - 12, midY - 25, 24, 50);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(left - 12, midY - 25, 24, 50);

    // Battery Symbols (+ and -)
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('+', left - 4, midY - 10);
    ctx.fillText('-', left - 3, midY + 18);

    // 3. Draw Resistor Load (Right Wire)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(right - 12, midY - 30, 24, 60);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(right - 12, midY - 30, 24, 60);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('R', right - 4, midY + 4);

    // 4. Draw Flowing Electrons
    for (const e of this.electrons) {
      const pt = getPoint(e.progress);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Register Smart Annotations
    const voltage = this.params.voltage ?? this.params.var1 ?? 12;
    const resistance = this.params.resistance ?? 10;

    labelSystem.renderAnnotations([
      {
        id: 'circuit-current',
        anchorX: midX,
        anchorY: top,
        text: `I = V / R = ${this.state.current} A`,
        compactText: `I = ${this.state.current} A`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#10b981',
        borderColor: '#059669',
      },
      {
        id: 'battery-source',
        anchorX: left,
        anchorY: midY,
        text: `DC Battery: ${voltage} V`,
        compactText: `V = ${voltage} V`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#f59e0b',
        borderColor: '#d97706',
      },
      {
        id: 'resistor-load',
        anchorX: right,
        anchorY: midY,
        text: `Resistor Load: ${resistance} Ω`,
        compactText: `R = ${resistance} Ω`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#ef4444',
        borderColor: '#dc2626',
      },
      {
        id: 'circuit-power',
        anchorX: midX,
        anchorY: bottom,
        text: `Power (P) = ${this.state.power} W`,
        compactText: `P = ${this.state.power} W`,
        priority: AnnotationPriority.SECONDARY_INFO,
        color: '#38bdf8',
        borderColor: '#0284c7',
      },
    ]);
  }
}
