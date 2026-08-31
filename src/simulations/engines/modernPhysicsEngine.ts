import { BaseSimulationEngine } from '../core/BaseSimulationEngine';
import { SmartLabelSystem, AnnotationPriority } from '../core/AnnotationSystem';

export interface ModernPhysicsParams extends Record<string, number> {
  photonEnergy?: number; // eV
  workFunction?: number; // eV
  wavelength?: number; // nm
  halfLife?: number; // s
  initialNuclei?: number;
  temperature?: number; // K
  quantumN?: number;
  codeNumber?: number;
  [key: string]: number | undefined;
}

export class ModernPhysicsEngine extends BaseSimulationEngine<ModernPhysicsParams> {
  constructor(initialParams: ModernPhysicsParams = {}) {
    super(
      {
        photonEnergy: initialParams.photonEnergy ?? 4.5,
        workFunction: initialParams.workFunction ?? 2.3, // Sodium ~2.3 eV
        wavelength: initialParams.wavelength ?? 275, // nm UV/Blue
        halfLife: initialParams.halfLife ?? 5.0,
        initialNuclei: initialParams.initialNuclei ?? 200,
        temperature: initialParams.temperature ?? 5800, // Sun ~5800 K
        quantumN: initialParams.quantumN ?? 1,
        ...initialParams,
      },
      {
        kineticEnergy: 2.2,
        stoppingVoltage: 2.2,
        cutoffWavelength: 539,
        remainingNuclei: 200,
        decayFraction: 1.0,
        peakWavelength: 500,
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

  public step(deltaTime: number): void {
    this.time += deltaTime;
    this.calculateMetrics();
  }

  private calculateMetrics(): void {
    const code = this.params.codeNumber ?? 68;

    if (code === 68) {
      // Photoelectric effect: E_k = hf - Phi = 1240 / lambda(nm) - Phi
      const lambdaNm = this.params.wavelength ?? this.params.var1 ?? 275;
      const phiEv = this.params.workFunction ?? this.params.var2 ?? 2.3;
      const photonEv = 1240 / Math.max(lambdaNm, 50);
      const ekEv = Math.max(photonEv - phiEv, 0);
      const cutoffNm = Number((1240 / phiEv).toFixed(1));

      this.state.photonEnergy = Number(photonEv.toFixed(2));
      this.state.kineticEnergy = Number(ekEv.toFixed(2));
      this.state.stoppingVoltage = Number(ekEv.toFixed(2));
      this.state.cutoffWavelength = cutoffNm;
      this.state.hasEmission = photonEv > phiEv;

      this.state.out1 = Number(ekEv.toFixed(2));
      this.state.out2 = Number(photonEv.toFixed(2));
    } else if (code === 69) {
      // Radioactive Decay: N(t) = N_0 * (1/2)^(t / T_half)
      const n0 = this.params.initialNuclei ?? this.params.var1 ?? 200;
      const tHalf = Math.max(this.params.halfLife ?? this.params.var2 ?? 5, 0.5);
      const elapsedHalves = this.time / tHalf;
      const nRem = Math.round(n0 * Math.pow(0.5, elapsedHalves));
      const fraction = Math.pow(0.5, elapsedHalves);

      this.state.remainingNuclei = nRem;
      this.state.decayedNuclei = n0 - nRem;
      this.state.decayFraction = Number(fraction.toFixed(3));
      this.state.elapsedHalfLives = Number(elapsedHalves.toFixed(2));

      this.state.out1 = nRem;
      this.state.out2 = Number((fraction * 100).toFixed(1));
    } else if (code === 65) {
      // Blackbody: Wien's Law lambda_max = 2.898e6 / T (nm)
      const tK = this.params.temperature ?? this.params.var1 ?? 5800;
      const lambdaMaxNm = Math.round(2898000 / Math.max(tK, 100));
      const totalIntensity = Number((5.67e-8 * Math.pow(tK, 4) / 1e6).toFixed(2)); // MW/m^2

      this.state.peakWavelength = lambdaMaxNm;
      this.state.totalIntensity = totalIntensity;

      this.state.out1 = lambdaMaxNm;
      this.state.out2 = totalIntensity;
    } else {
      // Bohr model: E_n = -13.6 / n^2
      const n = this.params.quantumN ?? this.params.var1 ?? 1;
      const energyEv = Number((-13.6 / (n * n)).toFixed(2));
      const radiusPm = Number((52.9 * n * n).toFixed(1));

      this.state.energyLevel = energyEv;
      this.state.bohrRadius = radiusPm;

      this.state.out1 = energyEv;
      this.state.out2 = radiusPm;
    }
  }

  protected render(): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);

    const code = this.params.codeNumber ?? 68;

    if (code === 68) {
      this.renderPhotoelectric(ctx, width, height);
    } else if (code === 69) {
      this.renderRadioactiveDecay(ctx, width, height);
    } else {
      this.renderBlackbodySpectrum(ctx, width, height);
    }
  }

  private renderPhotoelectric(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const midY = height / 2;
    const cathodeX = width * 0.25;
    const anodeX = width * 0.75;
    const plateH = 160;

    const labelSystem = new SmartLabelSystem(ctx, width, height, 11);

    // Cathode (Left Plate)
    ctx.fillStyle = '#475569';
    ctx.fillRect(cathodeX - 12, midY - plateH / 2, 24, plateH);
    ctx.strokeStyle = '#94a3b8';
    ctx.strokeRect(cathodeX - 12, midY - plateH / 2, 24, plateH);

    // Anode (Right Plate)
    ctx.fillStyle = '#334155';
    ctx.fillRect(anodeX - 12, midY - plateH / 2, 24, plateH);
    ctx.strokeStyle = '#64748b';
    ctx.strokeRect(anodeX - 12, midY - plateH / 2, 24, plateH);

    // Incident UV/Light Photons from top-left
    const lambdaNm = this.params.wavelength ?? 275;
    const photonColor = lambdaNm < 400 ? '#a855f7' : lambdaNm < 500 ? '#38bdf8' : '#eab308';
    ctx.strokeStyle = photonColor;
    ctx.lineWidth = 2.5;
    for (let i = -2; i <= 2; i++) {
      const startX = cathodeX - 100;
      const startY = midY + i * 25 - 60;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(cathodeX - 12, midY + i * 25);
      ctx.stroke();
    }

    // Emitted Photoelectrons (Green dots flying right)
    const hasEmission = this.state.hasEmission;
    if (hasEmission) {
      const ek = Number(this.state.kineticEnergy || 1);
      const speed = Math.min(ek * 120, 400);
      const t = Date.now() / 1000;
      ctx.fillStyle = '#22c55e';
      for (let i = 0; i < 8; i++) {
        const prog = ((t * (speed / 100) + i * 0.15) % 1);
        const ex = cathodeX + 14 + prog * (anodeX - cathodeX - 28);
        const ey = midY - 60 + ((i * 37) % 120);
        ctx.beginPath();
        ctx.arc(ex, ey, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    labelSystem.renderAnnotations([
      {
        id: 'photoelectric-law',
        anchorX: width / 2,
        anchorY: 28,
        text: `Photoelectric Effect: E_k = h·f - Φ = ${this.state.kineticEnergy} eV (V₀ = ${this.state.stoppingVoltage} V)`,
        compactText: `E_k = ${this.state.kineticEnergy}eV`,
        priority: AnnotationPriority.PRIMARY_VALUE,
        color: '#38bdf8',
        borderColor: '#0284c7',
      },
      {
        id: 'cathode-label',
        anchorX: cathodeX,
        anchorY: midY + plateH / 2 + 18,
        text: `Metal Cathode (Φ = ${this.params.workFunction ?? 2.3} eV)`,
        compactText: 'Cathode',
        priority: AnnotationPriority.OBJECT_NAME,
        color: '#93c5fd',
        borderColor: '#3b82f6',
      },
      {
        id: 'anode-label',
        anchorX: anodeX,
        anchorY: midY + plateH / 2 + 18,
        text: 'Collector Anode (+)',
        compactText: 'Anode',
        priority: AnnotationPriority.OBJECT_NAME,
        color: '#93c5fd',
        borderColor: '#3b82f6',
      },
    ]);
  }

  private renderRadioactiveDecay(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const midX = width / 2;
    const nRem = Number(this.state.remainingNuclei || 200);
    const fraction = Number(this.state.decayFraction || 1);

    // Render Nuclei Lattice
    const cols = 20;
    const rows = 10;
    const startX = midX - (cols * 16) / 2;
    const startY = height / 2 - (rows * 16) / 2;

    let index = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        index++;
        const isUndecayed = index <= nRem;
        ctx.fillStyle = isUndecayed ? '#38bdf8' : '#475569';
        ctx.beginPath();
        ctx.arc(startX + c * 16, startY + r * 16, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `Radioactive Decay: N(t) = N₀ · (1/2)^(t/T½) • Remaining: ${nRem} / 200 (${(fraction * 100).toFixed(1)}%)`,
      midX,
      35
    );
  }

  private renderBlackbodySpectrum(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const midX = width / 2;
    const tK = this.params.temperature ?? 5800;
    const peakNm = Number(this.state.peakWavelength || 500);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 60; x < width - 60; x += 3) {
      const lambda = (x - 60) * 3; // 0 to 1500 nm
      const curve = Math.pow(500 / Math.max(lambda, 50), 5) / (Math.exp((500 / Math.max(lambda, 50)) * (5800 / tK)) - 1);
      const py = height * 0.75 - Math.min(curve * 300, height * 0.5);
      if (x === 60) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Wien's Law: λ_max · T = 2.898×10⁶ nm·K | λ_peak = ${peakNm} nm (T = ${tK} K)`, midX, 35);
  }
}
