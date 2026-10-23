'use client';

import { useEffect, useRef } from 'react';

type FlickeringGridProps = {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  maxOpacity?: number;
  className?: string;
};

// Adapted from Magic UI's flickering-grid, without the cn/clsx dependency.
export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = '113, 113, 122',
  maxOpacity = 0.3,
  className
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !canvas.parentElement) return;

    const parent = canvas.parentElement;
    const step = squareSize + gridGap;
    let cols = 0;
    let rows = 0;
    let squares = new Float32Array(0);
    let dpr = 1;
    let frame = 0;
    let last = performance.now();
    let visible = true;

    const setup = () => {
      dpr = window.devicePixelRatio || 1;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      cols = Math.ceil(width / step);
      rows = Math.ceil(height / step);
      squares = Float32Array.from({ length: cols * rows }, () =>
        Math.random() * maxOpacity
      );
    };

    const draw = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      if (visible) {
        for (let i = 0; i < squares.length; i++) {
          if (Math.random() < flickerChance * delta) {
            squares[i] = Math.random() * maxOpacity;
          }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            ctx.fillStyle = `rgba(${color}, ${squares[c * rows + r]})`;
            ctx.fillRect(
              c * step * dpr,
              r * step * dpr,
              squareSize * dpr,
              squareSize * dpr
            );
          }
        }
      }
      frame = requestAnimationFrame(draw);
    };

    setup();
    const resize = new ResizeObserver(setup);
    resize.observe(parent);
    const intersect = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersect.observe(canvas);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersect.disconnect();
    };
  }, [squareSize, gridGap, flickerChance, color, maxOpacity]);

  return <canvas ref={canvasRef} className={className} />;
}
