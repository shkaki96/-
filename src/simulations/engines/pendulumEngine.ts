import { validateNumericInput } from '../../utils/security';
import { BaseSimulationEngine } from '../core/BaseSimulationEngine';
import { SmartLabelSystem, AnnotationPriority } from '../core/AnnotationSystem';

export interface PendulumParams extends Record<string, number> {
  length: number; // m
  gravity: number; // m/s²
  mass: number; // kg
  initialAngle: number; // deg
}

export interface PendulumState extends Record<string, unknown> {
  angle: number; // rad
  angularVelocity: number; // rad/s
  period: number; // s
  frequency: number; // Hz
}

export class PendulumEngine extends BaseSimulationEngine<PendulumParams, PendulumState> {
  constructor(initialParams: PendulumParams) {
    super(initialParams, {
      angle: (initialParams.initialAngle * Math.PI) / 180,
      angularVelocity: 0,
      period: 0,
      frequency: 0,
    });
  }

  protected onInit(): void {
    this.calculateMetrics();
  }

  protected onParamsUpdated(): void {
    // Sanitize and validate numeric inputs against boundary bounds
    this.params.length = validateNumericInput(this.params.length, 0.1, 10.0, 1.0);
    this.params.gravity = validateNumericInput(this.params.gravity, 0.1, 30.0, 9.81);
    this.params.mass = validateNumericInput(this.params.mass, 0.1, 50.0, 1.0);
    this.params.initialAngle = validateNumericInput(this.params.initialAngle, 1, 60, 15);

    this.calculateMetrics();
  }

  protected onReset(): void {
    const L = this.params.length;
    const g = this.params.gravity;
    const m = this.params.mass;
    const theta0 = (this.params.initialAngle * Math.PI) / 180;

    this.state.angle = theta0;
    this.state.angleDeg = Number(this.params.initialAngle.toFixed(1));
    this.state.angularVelocity = 0;
    this.state.linearVelocity = 0;
    this.state.kineticEnergy = 0;
    this.state.potentialEnergy = Number((m * g * L * (1 - Math.cos(theta0))).toFixed(2));
    this.calculateMetrics();
  }

  private calculateMetrics(): void {
    const L = this.params.length;
    const g = this.params.gravity;
    const m = this.params.mass;
    
    // Theoretical period calculation T = 2π √(L / g)
    const T = 2 * Math.PI * Math.sqrt(L / g);
    const f = 1 / T;

    this.state.period = Number(T.toFixed(3));
    this.state.frequency = Number(f.toFixed(3));

    if (this.state.angle === undefined) {
      const theta0 = (this.params.initialAngle * Math.PI) / 180;
      this.state.angle = theta0;
      this.state.angleDeg = Number(this.params.initialAngle.toFixed(1));
      this.state.angularVelocity = 0;
      this.state.linearVelocity = 0;
      this.state.kineticEnergy = 0;
      this.state.potentialEnergy = Number((m * g * L * (1 - Math.cos(theta0))).toFixed(2));
    }
  }

  public step(deltaTime: number): void {
    const L = this.params.length;
    const g = this.params.gravity;
    const m = this.params.mass;
    const omega = Math.sqrt(g / L);
    const theta0 = (this.params.initialAngle * Math.PI) / 180;

    // Harmonic equation: θ(t) = θ0 * cos(ω * t)
    const angleRad = theta0 * Math.cos(omega * this.time);
    const angVel = -theta0 * omega * Math.sin(omega * this.time);
    const linVel = L * angVel;
    const ek = 0.5 * m * linVel * linVel;
    const ep = m * g * L * (1 - Math.cos(angleRad));

    this.state.angle = angleRad;
    this.state.angleDeg = Number(((angleRad * 180) / Math.PI).toFixed(1));
    this.state.angularVelocity = Number(angVel.toFixed(2));
    this.state.linearVelocity = Number(linVel.toFixed(2));
    this.state.kineticEnergy = Number(ek.toFixed(2));
    this.state.potentialEnergy = Number(ep.toFixed(2));
  }

  protected render(): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);

    // Initialize Smart Annotation System
    const labelSystem = new SmartLabelSystem(ctx, width, height, 12);

    // Canvas center & scaling
    const pivotX = width / 2;
    const pivotY = height * 0.15;
    const maxPixelLength = height * 0.65;
    const pixelLength = (this.params.length / 5.0) * maxPixelLength;

    const angle = this.state.angle;
    const bobX = pivotX + pixelLength * Math.sin(angle);
    const bobY = pivotY + pixelLength * Math.cos(angle);

    // Register Obstacles
    labelSystem.addObstacle({ type: 'box', x: pivotX - 35, y: pivotY - 10, width: 70, height: 20 });
    labelSystem.addObstacle({ type: 'line', x1: pivotX, y1: pivotY, x2: bobX, y2: bobY, padding: 10 });

    const radius = Math.min(Math.max(8 + this.params.mass * 3, 10), 24);
    labelSystem.addObstacle({ type: 'circle', x: bobX, y: bobY, radius: radius + 8 });

    // Draw Pivot Base
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(pivotX - 30, pivotY);
    ctx.lineTo(pivotX + 30, pivotY);
    ctx.stroke();

    // Draw String
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Draw Bob Mass
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(bobX, bobY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pivot Pin
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Register Smart Annotations
    const stringMidX = (pivotX + bobX) / 2;
    const stringMidY = (pivotY + bobY) / 2;
    const currentAngleDeg = Number(((angle * 180) / Math.PI).toFixed(1));

    labelSystem.renderAnnotations([
      {
        id: 'bob-mass',
        anchorX: bobX,
        anchorY: bobY,
        text: `m = ${this.params.mass} kg | θ = ${currentAngleDeg}°`,
        compactText: `${this.params.mass} kg | ${currentAngleDeg}°`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#f0f9ff',
        borderColor: '#38bdf8',
      },
      {
        id: 'string-length',
        anchorX: stringMidX,
        anchorY: stringMidY,
        text: `L = ${this.params.length.toFixed(2)} m`,
        compactText: `L: ${this.params.length.toFixed(2)} m`,
        priority: AnnotationPriority.MEASUREMENT,
        color: '#38bdf8',
        borderColor: '#0284c7',
      },
      {
        id: 'period-metrics',
        anchorX: pivotX,
        anchorY: pivotY + 25,
        text: `T = ${this.state.period} s | f = ${this.state.frequency} Hz`,
        compactText: `T = ${this.state.period} s`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#10b981',
        borderColor: '#059669',
      },
      {
        id: 'pivot-label',
        anchorX: pivotX,
        anchorY: Math.max(15, pivotY - 15),
        text: 'Fixed Pivot',
        compactText: 'Pivot',
        priority: AnnotationPriority.OBJECT_NAME,
        color: '#94a3b8',
        borderColor: '#475569',
      },
    ]);
  }
}
