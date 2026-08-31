import { BaseSimulationEngine } from '../core/BaseSimulationEngine';
import { SmartLabelSystem, AnnotationPriority } from '../core/AnnotationSystem';

export interface MechanicsParams extends Record<string, number> {
  mass?: number; // kg
  mass1?: number;
  mass2?: number;
  frictionCoeff?: number; // mu
  springConstant?: number; // N/m
  displacement?: number; // m
  force?: number; // N
  fluidDensity?: number; // kg/m^3
  objectVolume?: number; // m^3
  angle?: number; // deg
  velocity?: number; // m/s
  codeNumber?: number;
  [key: string]: number | undefined;
}

export class MechanicsEngine extends BaseSimulationEngine<MechanicsParams> {
  private pos: number = 0;
  private vel: number = 0;
  private oscAngle: number = 0;

  constructor(initialParams: MechanicsParams = {}) {
    super(
      {
        mass: initialParams.mass ?? 5,
        mass1: initialParams.mass1 ?? 10,
        mass2: initialParams.mass2 ?? 10,
        frictionCoeff: initialParams.frictionCoeff ?? 0.25,
        springConstant: initialParams.springConstant ?? 50,
        displacement: initialParams.displacement ?? 0.2,
        force: initialParams.force ?? 20,
        fluidDensity: initialParams.fluidDensity ?? 1000,
        objectVolume: initialParams.objectVolume ?? 0.002,
        angle: initialParams.angle ?? 30,
        velocity: initialParams.velocity ?? 0,
        ...initialParams,
      },
      {
        normalForce: 49.0,
        frictionForce: 12.25,
        netForce: 7.75,
        acceleration: 1.55,
        velocity: 0.0,
        period: 1.99,
        frequency: 0.5,
        buoyantForce: 19.6,
        apparentWeight: 29.4,
      }
    );
  }

  protected onInit(): void {
    this.pos = 0;
    this.vel = 0;
    this.calculateMetrics();
  }

  protected onParamsUpdated(): void {
    this.calculateMetrics();
  }

  protected onReset(): void {
    this.pos = 0;
    this.vel = 0;
    this.time = 0;
    this.calculateMetrics();
  }

  public step(deltaTime: number): void {
    const code = this.params.codeNumber ?? 5;

    if (code === 25) {
      // Spring harmonic motion: F = -kx - b v
      const k = this.params.springConstant ?? this.params.var1 ?? 50;
      const m = Math.max(this.params.mass ?? this.params.var2 ?? 2, 0.1);
      const omega = Math.sqrt(k / m);
      this.oscAngle += omega * deltaTime;
      const amp = this.params.displacement ?? 0.2;
      this.pos = amp * Math.cos(this.oscAngle);
      this.vel = -amp * omega * Math.sin(this.oscAngle);
    } else if (code === 5 || code === 62 || code === 10) {
      // Friction / Incline / Newton F = ma
      const m = Math.max(this.params.mass ?? this.params.var1 ?? 5, 0.1);
      const mu = this.params.frictionCoeff ?? this.params.var2 ?? 0.25;
      const appliedF = this.params.force ?? this.params.var3 ?? 25;
      const g = 9.81;

      const normal = m * g;
      const friction = mu * normal;
      const netF = Math.max(appliedF - friction, 0);
      const a = netF / m;

      this.vel += a * deltaTime;
      this.pos += this.vel * deltaTime;
      if (this.pos > 10) this.pos = 0; // Wrap around track
    } else {
      this.pos += deltaTime;
    }

    this.calculateMetrics();
  }

  private calculateMetrics(): void {
    const code = this.params.codeNumber ?? 5;
    const m = Math.max(this.params.mass ?? this.params.var1 ?? 5, 0.1);
    const g = 9.81;

    if (code === 25) {
      // Hooke's Law: F = -k x, T = 2pi sqrt(m/k)
      const k = this.params.springConstant ?? this.params.var1 ?? 50;
      const x = this.pos || (this.params.displacement ?? 0.2);
      const restoringForce = Number((-k * x).toFixed(2));
      const period = Number((2 * Math.PI * Math.sqrt(m / k)).toFixed(2));
      const freq = Number((1 / (period || 1)).toFixed(2));
      const potEnergy = Number((0.5 * k * x * x).toFixed(2));

      this.state.restoringForce = restoringForce;
      this.state.period = period;
      this.state.frequency = freq;
      this.state.potentialEnergy = potEnergy;
      this.state.position = Number(x.toFixed(3));
      this.state.velocity = Number(this.vel.toFixed(2));

      this.state.out1 = restoringForce;
      this.state.out2 = period;
    } else if (code === 34) {
      // Archimedes Principle: F_B = rho * V * g
      const rho = this.params.fluidDensity ?? this.params.var1 ?? 1000;
      const V = this.params.objectVolume ?? this.params.var2 ?? 0.003;
      const weight = m * g;
      const buoyantF = Number((rho * V * g).toFixed(2));
      const appWeight = Number(Math.max(weight - buoyantF, 0).toFixed(2));

      this.state.buoyantForce = buoyantF;
      this.state.actualWeight = Number(weight.toFixed(2));
      this.state.apparentWeight = appWeight;
      this.state.isFloating = buoyantF >= weight;

      this.state.out1 = buoyantF;
      this.state.out2 = appWeight;
    } else if (code === 7) {
      // Seesaw Torque: tau = r * F
      const m1 = this.params.mass1 ?? 10;
      const m2 = this.params.mass2 ?? 10;
      const r1 = this.params.var1 ?? 2.0;
      const r2 = this.params.var2 ?? 2.0;
      const tau1 = Number((m1 * g * r1).toFixed(2));
      const tau2 = Number((m2 * g * r2).toFixed(2));
      const netTau = Number((tau1 - tau2).toFixed(2));

      this.state.torque1 = tau1;
      this.state.torque2 = tau2;
      this.state.netTorque = netTau;
      this.state.isEquilibrium = Math.abs(netTau) < 0.1;

      this.state.out1 = netTau;
    } else {
      // Sled / Friction / Newton
      const mu = this.params.frictionCoeff ?? this.params.var2 ?? 0.25;
      const appliedF = this.params.force ?? this.params.var3 ?? 25;
      const normal = Number((m * g).toFixed(2));
      const friction = Number((mu * normal).toFixed(2));
      const netF = Number(Math.max(appliedF - friction, 0).toFixed(2));
      const a = Number((netF / m).toFixed(2));

      this.state.normalForce = normal;
      this.state.frictionForce = friction;
      this.state.netForce = netF;
      this.state.acceleration = a;
      this.state.velocity = Number(this.vel.toFixed(2));

      this.state.out1 = friction;
      this.state.out2 = a;
    }
  }

  protected render(): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);

    const code = this.params.codeNumber ?? 5;

    if (code === 25) {
      this.renderSpringHarmonic(ctx, width, height);
    } else if (code === 34) {
      this.renderArchimedes(ctx, width, height);
    } else {
      this.renderFrictionSled(ctx, width, height);
    }
  }

  private renderSpringHarmonic(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const midX = width / 2;
    const topY = 40;
    const restLen = height * 0.45;
    const xPix = (this.pos || 0) * 300;
    const massY = topY + restLen + xPix;

    const labelSystem = new SmartLabelSystem(ctx, width, height, 11);

    // Ceiling support
    ctx.fillStyle = '#334155';
    ctx.fillRect(midX - 50, topY - 10, 100, 10);

    // Spring coils
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(midX, topY);
    const coils = 14;
    const coilHeight = (massY - topY) / coils;
    for (let i = 0; i < coils; i++) {
      const cy = topY + (i + 0.5) * coilHeight;
      const cx = midX + (i % 2 === 0 ? 18 : -18);
      ctx.lineTo(cx, cy);
    }
    ctx.lineTo(midX, massY);
    ctx.stroke();

    // Oscillating Mass
    const massSize = 40;
    ctx.fillStyle = '#f43f5e';
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 2;
    ctx.fillRect(midX - massSize / 2, massY, massSize, massSize);
    ctx.strokeRect(midX - massSize / 2, massY, massSize, massSize);

    labelSystem.renderAnnotations([
      {
        id: 'spring-law',
        anchorX: midX,
        anchorY: 25,
        text: `Hooke's Law: F = -k·x = ${this.state.restoringForce} N (T = ${this.state.period} s)`,
        compactText: `F = ${this.state.restoringForce}N`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#38bdf8',
        borderColor: '#0284c7',
      },
      {
        id: 'mass-node',
        anchorX: midX + massSize / 2 + 10,
        anchorY: massY + massSize / 2,
        text: `Mass m = ${this.params.mass ?? 2} kg`,
        compactText: `${this.params.mass ?? 2}kg`,
        priority: AnnotationPriority.OBJECT_NAME,
        color: '#fca5a5',
        borderColor: '#f43f5e',
      },
    ]);
  }

  private renderArchimedes(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const midX = width / 2;
    const beakerW = 180;
    const beakerH = 200;
    const beakerX = midX - beakerW / 2;
    const beakerY = height / 2 - 50;

    // Beaker
    ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.fillRect(beakerX, beakerY + 40, beakerW, beakerH - 40);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.strokeRect(beakerX, beakerY, beakerW, beakerH);

    // Floating/Submerged Object
    const objSize = 50;
    const isFloating = this.state.isFloating;
    const objY = isFloating ? beakerY + 30 : beakerY + beakerH - objSize - 10;

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(midX - objSize / 2, objY, objSize, objSize);

    // Buoyancy force arrow pointing up
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(midX, objY + objSize / 2);
    ctx.lineTo(midX, objY - 30);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Buoyant Force: F_B = ρ·V·g = ${this.state.buoyantForce} N`, midX, 30);
  }

  private renderFrictionSled(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const groundY = height * 0.68;
    const sledW = 70;
    const sledH = 35;
    const sledX = 80 + (this.pos * 35) % (width - 200);

    // Ground line
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(20, groundY);
    ctx.lineTo(width - 20, groundY);
    ctx.stroke();

    // Sled Box
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(sledX, groundY - sledH, sledW, sledH);
    ctx.strokeStyle = '#fda4af';
    ctx.strokeRect(sledX, groundY - sledH, sledW, sledH);

    // Friction arrow (pointing left)
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(sledX, groundY - 5);
    ctx.lineTo(sledX - 40, groundY - 5);
    ctx.stroke();

    // Applied Force arrow (pointing right)
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(sledX + sledW, groundY - sledH / 2);
    ctx.lineTo(sledX + sledW + 50, groundY - sledH / 2);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Friction: f_k = μ_k · N = ${this.state.frictionForce} N | a = ${this.state.acceleration} m/s²`, width / 2, 35);
  }
}
