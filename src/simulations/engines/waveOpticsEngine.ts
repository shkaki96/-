import { BaseSimulationEngine } from '../core/BaseSimulationEngine';
import { SmartLabelSystem, AnnotationPriority } from '../core/AnnotationSystem';

export interface WaveOpticsParams extends Record<string, number> {
  wavelength?: number; // nm
  slitDistance?: number; // um
  screenDistance?: number; // m
  analyzerAngle?: number; // deg
  red?: number;
  green?: number;
  blue?: number;
  mode?: number; // 30 = Double Slit, 17 = Malus, 18 = Rayleigh, 41 = RGB
  [key: string]: number | undefined;
}

export class WaveOpticsEngine extends BaseSimulationEngine<WaveOpticsParams> {
  constructor(initialParams: WaveOpticsParams = {}) {
    super(
      {
        wavelength: initialParams.wavelength ?? 532, // Green laser 532nm
        slitDistance: initialParams.slitDistance ?? 50, // 50 um
        screenDistance: initialParams.screenDistance ?? 1.5, // 1.5 m
        analyzerAngle: initialParams.analyzerAngle ?? 45, // 45 deg
        red: initialParams.red ?? 255,
        green: initialParams.green ?? 128,
        blue: initialParams.blue ?? 64,
        mode: initialParams.mode ?? 30,
        ...initialParams,
      },
      {
        fringeSpacing: 1.6, // mm
        transmittedIntensity: 50.0, // %
        firstOrderAngle: 0.61, // deg
      }
    );
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

  public step(_deltaTime: number): void {
    this.calculateMetrics();
  }

  private calculateMetrics(): void {
    const lambdaNm = this.params.wavelength ?? this.params.var1 ?? 532;
    const dUm = this.params.slitDistance ?? this.params.var2 ?? 50;
    const LMet = this.params.screenDistance ?? this.params.var3 ?? 1.5;
    const thetaDeg = this.params.analyzerAngle ?? this.params.var1 ?? 45;

    // Young Double Slit: Delta Y = (lambda * L) / d
    const lambdaM = lambdaNm * 1e-9;
    const dM = Math.max(dUm * 1e-6, 1e-7);
    const deltaYM = (lambdaM * LMet) / dM;
    const deltaYMm = Number((deltaYM * 1000).toFixed(2));

    // Malus Law: I = I_0 * cos^2(theta)
    const thetaRad = (thetaDeg * Math.PI) / 180;
    const malusIntensityPct = Number((100 * Math.pow(Math.cos(thetaRad), 2)).toFixed(1));

    // Rayleigh scattering: I proportional to 1 / lambda^4
    const rayleighRel = Number((Math.pow(700 / Math.max(lambdaNm, 350), 4)).toFixed(2));

    this.state.fringeSpacing = deltaYMm;
    this.state.fringeSpacingMm = deltaYMm;
    this.state.transmittedIntensity = malusIntensityPct;
    this.state.rayleighScattering = rayleighRel;
    this.state.firstOrderAngle = Number(((Math.asin(Math.min(lambdaM / dM, 1)) * 180) / Math.PI).toFixed(2));

    this.state.out1 = deltaYMm;
    this.state.out2 = malusIntensityPct;
  }

  protected render(): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);

    const mode = this.params.mode ?? 30;

    if (mode === 17) {
      this.renderMalusLaw(ctx, width, height);
    } else {
      this.renderYoungDoubleSlit(ctx, width, height);
    }
  }

  private renderYoungDoubleSlit(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const lambdaNm = this.params.wavelength ?? 532;
    const dUm = this.params.slitDistance ?? 50;
    const deltaYMm = Number(this.state.fringeSpacing || 1.6);

    const laserColor = `hsl(${Math.max(0, Math.min(300, (700 - lambdaNm) * 0.8))}, 95%, 60%)`;
    const labelSystem = new SmartLabelSystem(ctx, width, height, 11);

    // 1. Left Laser Source
    const sourceX = 40;
    const sourceY = height / 2;
    ctx.fillStyle = laserColor;
    ctx.beginPath();
    ctx.arc(sourceX, sourceY, 8, 0, Math.PI * 2);
    ctx.fill();

    // 2. Double Slit Barrier
    const barrierX = width * 0.35;
    const slitGap = Math.min(Math.max(dUm * 0.4, 8), 35);
    ctx.fillStyle = '#334155';
    // Top barrier
    ctx.fillRect(barrierX - 4, 20, 8, sourceY - slitGap / 2 - 20);
    // Center block
    ctx.fillRect(barrierX - 4, sourceY - slitGap / 6, 8, slitGap / 3);
    // Bottom barrier
    ctx.fillRect(barrierX - 4, sourceY + slitGap / 2, 8, height - sourceY - slitGap / 2 - 20);

    // Laser incoming beam
    ctx.strokeStyle = laserColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(sourceX, sourceY);
    ctx.lineTo(barrierX, sourceY);
    ctx.stroke();

    // 3. Screen on Right
    const screenX = width - 80;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(screenX, 20, 50, height - 40);
    ctx.strokeStyle = '#475569';
    ctx.strokeRect(screenX, 20, 50, height - 40);

    // 4. Interference Fringes Pattern on Screen
    const fringeScale = Math.max(deltaYMm * 8, 4);
    for (let y = 30; y < height - 30; y++) {
      const distFromCenter = y - sourceY;
      const intensity = Math.pow(Math.cos((distFromCenter / fringeScale) * Math.PI), 2);
      ctx.fillStyle = laserColor;
      ctx.globalAlpha = Math.max(intensity * 0.9, 0.03);
      ctx.fillRect(screenX + 2, y, 46, 1);
    }
    ctx.globalAlpha = 1.0;

    // Intensity profile curve next to screen
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let y = 30; y < height - 30; y += 2) {
      const distFromCenter = y - sourceY;
      const intensity = Math.pow(Math.cos((distFromCenter / fringeScale) * Math.PI), 2);
      const curveX = screenX - 10 - intensity * 50;
      if (y === 30) ctx.moveTo(curveX, y);
      else ctx.lineTo(curveX, y);
    }
    ctx.stroke();

    // Annotations
    labelSystem.renderAnnotations([
      {
        id: 'interference-title',
        anchorX: width / 2,
        anchorY: 28,
        text: `Double Slit Interference: Δy = λ·L/d = ${deltaYMm} mm (λ=${lambdaNm}nm, d=${dUm}μm)`,
        compactText: `Δy = ${deltaYMm}mm`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#38bdf8',
        borderColor: '#0284c7',
      },
      {
        id: 'slit-barrier',
        anchorX: barrierX,
        anchorY: sourceY - slitGap - 15,
        text: `Double Slits (d = ${dUm} μm)`,
        compactText: `d = ${dUm}μm`,
        priority: AnnotationPriority.OBJECT_NAME,
        color: '#93c5fd',
        borderColor: '#3b82f6',
      },
      {
        id: 'screen-fringes',
        anchorX: screenX - 25,
        anchorY: sourceY,
        text: 'Interference Fringes & Intensity',
        compactText: 'Fringes',
        priority: AnnotationPriority.MEASUREMENT,
        color: '#4ade80',
        borderColor: '#16a34a',
      },
    ]);
  }

  private renderMalusLaw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const thetaDeg = this.params.analyzerAngle ?? 45;
    const intensity = Number(this.state.transmittedIntensity || 50);

    const midX = width / 2;
    const midY = height / 2;

    // Draw Polarizer 1 (Fixed Vertical at 0 deg)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.strokeRect(midX - 100, midY - 60, 40, 120);
    // Vertical grid lines inside Polarizer 1
    for (let x = midX - 95; x < midX - 60; x += 6) {
      ctx.beginPath();
      ctx.moveTo(x, midY - 55);
      ctx.lineTo(x, midY + 55);
      ctx.stroke();
    }

    // Draw Polarizer 2 / Analyzer (Rotated at thetaDeg)
    ctx.strokeStyle = '#a855f7';
    ctx.strokeRect(midX + 60, midY - 60, 40, 120);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Malus Law: I = I₀ · cos²(${thetaDeg}°) = ${intensity}%`, midX, 35);
  }
}
