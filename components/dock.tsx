'use client';

import { createContext, useContext, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue
} from 'framer-motion';

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;

type DockConfig = {
  mouseX: MotionValue<number>;
  size: number;
  magnification: number;
  distance: number;
};

const DockContext = createContext<DockConfig | null>(null);

type DockProps = {
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  iconDistance?: number;
  children: React.ReactNode;
};

// Adapted from Magic UI's dock, without the cn/cva dependencies.
export function Dock({
  className = '',
  iconSize = DEFAULT_SIZE,
  iconMagnification = DEFAULT_MAGNIFICATION,
  iconDistance = DEFAULT_DISTANCE,
  children
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <DockContext.Provider
      value={{
        mouseX,
        size: iconSize,
        magnification: iconMagnification,
        distance: iconDistance
      }}
    >
      <motion.div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={`flex h-[58px] w-max items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-2 backdrop-blur-md ${className}`}
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
};

export function DockIcon({ className = '', children }: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const config = useContext(DockContext);
  const fallbackMouseX = useMotionValue(Infinity);

  const mouseX = config?.mouseX ?? fallbackMouseX;
  const size = config?.size ?? DEFAULT_SIZE;
  const magnification = config?.magnification ?? DEFAULT_MAGNIFICATION;
  const distance = config?.distance ?? DEFAULT_DISTANCE;
  const padding = Math.max(6, size * 0.2);

  const distanceCalc = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeTransform = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [size, magnification, size]
  );

  const scaleSize = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  });

  return (
    <motion.div
      ref={ref}
      style={{ width: scaleSize, height: scaleSize, padding }}
      className={`flex aspect-square cursor-pointer items-center justify-center rounded-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
