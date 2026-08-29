import React, { useEffect, useRef } from 'react';
import { ISimulationEngine } from '../../types/simulation';

interface SimulationCanvasProps<TParams = Record<string, number>> {
  engine: ISimulationEngine<TParams>;
  parameters: TParams;
  className?: string;
}

export const SimulationCanvas = <TParams extends Record<string, number>>({
  engine,
  parameters,
  className = '',
}: SimulationCanvasProps<TParams>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize engine & handle ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    engine.init(canvas, parameters);

    const resizeObserver = new ResizeObserver(() => {
      if (canvas && container) {
        engine.resize();
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      engine.destroy();
    };
  }, [engine]);

  // Sync parameter updates to engine in real time
  useEffect(() => {
    engine.updateParams(parameters);
  }, [engine, parameters]);

  return (
    <div ref={containerRef} className={`relative w-full h-full min-h-[300px] bg-slate-900 rounded-xl overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full touch-none" />
    </div>
  );
};
