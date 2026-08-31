import React, { useEffect, useRef } from 'react';
import { Experiment } from '../../../types/experiment';

export interface GenericPhysicsCanvasProps {
  experiment: Experiment;
  params: Record<string, number>;
  isRunning?: boolean;
  onOutputsUpdate?: (outputs: Record<string, number>) => void;
}

export const GenericPhysicsCanvas: React.FC<GenericPhysicsCanvasProps> = ({
  experiment,
  params,
  isRunning = true,
  onOutputsUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const trajectoryRef = useRef<Array<{ x: number; y: number }>>([]);
  const lastOutputsJsonRef = useRef('');
  const onOutputsUpdateRef = useRef(onOutputsUpdate);
  useEffect(() => {
    onOutputsUpdateRef.current = onOutputsUpdate;
  }, [onOutputsUpdate]);

  const getParam = (names: string[], def: number): number => {
    for (const name of names) {
      if (params[name] !== undefined && !isNaN(params[name])) {
        return params[name];
      }
    }
    return def;
  };

  // Perform physical parameter calculations
  useEffect(() => {
    const outputs: Record<string, number> = {};

    const v0 = getParam(['v0', 'velocity', 'speed', 'var1', 'primary'], 20);
    const angle = getParam(['angle', 'theta', 'var2'], 45);
    const mass = getParam(['mass', 'm', 'var3'], 2.0);

    const rad = (angle * Math.PI) / 180;
    const vx = v0 * Math.cos(rad);
    const vy = v0 * Math.sin(rad);
    const kineticEnergy = 0.5 * mass * v0 * v0;
    const momentum = mass * v0;

    outputs.velocity = v0;
    outputs.kineticEnergy = Number(kineticEnergy.toFixed(2));
    outputs.momentum = Number(momentum.toFixed(2));
    outputs.vx = Number(vx.toFixed(2));
    outputs.vy = Number(vy.toFixed(2));

    const json = JSON.stringify(outputs);
    if (json !== lastOutputsJsonRef.current) {
      lastOutputsJsonRef.current = json;
      onOutputsUpdateRef.current?.(outputs);
    }
  }, [params]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 450);

      // Dark coordinate background
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, width, height);

      // Coordinate Grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
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

      if (isRunning) {
        timeRef.current += 0.016;
      }
      const t = timeRef.current;

      const v0 = getParam(['v0', 'velocity', 'speed', 'var1', 'primary'], 20);
      const angle = getParam(['angle', 'theta', 'var2'], 45);
      const mass = getParam(['mass', 'm', 'var3'], 2.0);

      const rad = (angle * Math.PI) / 180;
      const originX = 120;
      const originY = height - 100;

      // Coordinate axes
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // X Axis
      ctx.moveTo(originX - 40, originY);
      ctx.lineTo(width - 40, originY);
      // Y Axis
      ctx.moveTo(originX, originY + 40);
      ctx.lineTo(originX, 40);
      ctx.stroke();

      // Axis Labels
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('+X (m)', width - 35, originY + 20);
      ctx.fillText('+Y (m)', originX - 35, 35);

      // Moving Particle along harmonic / kinematic path
      const scale = 3.5;
      const omega = 1.2;
      const currentX = originX + (Math.sin(omega * t) * 0.5 + 0.5) * (width - 280);
      const currentY = originY - (Math.abs(Math.sin(omega * t * 2)) * 140 * Math.sin(rad));

      // Record Trajectory
      if (isRunning) {
        trajectoryRef.current.push({ x: currentX, y: currentY });
        if (trajectoryRef.current.length > 120) {
          trajectoryRef.current.shift();
        }
      }

      // Draw Trajectory Trace
      if (trajectoryRef.current.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.moveTo(trajectoryRef.current[0].x, trajectoryRef.current[0].y);
        for (let i = 1; i < trajectoryRef.current.length; i++) {
          ctx.lineTo(trajectoryRef.current[i].x, trajectoryRef.current[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Velocity Vector (Green)
      const vx = Math.cos(omega * t) * (v0 * scale);
      const vy = -Math.sin(omega * t * 2) * (v0 * scale * Math.sin(rad));

      ctx.strokeStyle = '#10B981';
      ctx.fillStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(currentX, currentY);
      ctx.lineTo(currentX + vx, currentY + vy);
      ctx.stroke();

      // Vector Arrow Head
      const vLen = Math.hypot(vx, vy);
      if (vLen > 5) {
        const arrowAngle = Math.atan2(vy, vx);
        ctx.beginPath();
        ctx.moveTo(currentX + vx, currentY + vy);
        ctx.lineTo(
          currentX + vx - 10 * Math.cos(arrowAngle - Math.PI / 6),
          currentY + vy - 10 * Math.sin(arrowAngle - Math.PI / 6)
        );
        ctx.lineTo(
          currentX + vx - 10 * Math.cos(arrowAngle + Math.PI / 6),
          currentY + vy - 10 * Math.sin(arrowAngle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      }

      // Acceleration / Force Vector (Red)
      const ax = -Math.sin(omega * t) * 45;
      const ay = -Math.cos(omega * t * 2) * 45;
      ctx.strokeStyle = '#EF4444';
      ctx.fillStyle = '#EF4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(currentX, currentY);
      ctx.lineTo(currentX + ax, currentY + ay);
      ctx.stroke();

      // Draw Particle
      const grad = ctx.createRadialGradient(currentX, currentY, 2, currentX, currentY, 18);
      grad.addColorStop(0, '#38BDF8');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(currentX, currentY, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#E0F2FE';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Physics HUD Card
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(20, 20, 320, 90, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`2D Vector Kinematics & Motion`, 35, 42);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#E2E8F0';
      ctx.fillText(`Law: ${experiment.physicalLaw || 'F = m · a'}`, 35, 62);
      ctx.fillStyle = '#10B981';
      ctx.fillText(`Velocity Vector: |v| = ${v0} m/s (Green)`, 35, 80);
      ctx.fillStyle = '#EF4444';
      ctx.fillText(`Force/Acceleration Vector (Red)`, 35, 96);

      if (isRunning) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [experiment, params, isRunning]);

  return (
    <div className="relative w-full h-full min-h-[360px] bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800/80 flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default GenericPhysicsCanvas;
