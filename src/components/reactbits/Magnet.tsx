import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const MotionDiv = motion.div as any;

export interface MagnetProps {
  children: React.ReactNode;
  className?: string;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  className = '',
  padding = 60,
  disabled = false,
  magnetStrength = 8,
}) => {
  const [, setIsActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const x = useSpring(0, { stiffness: 250, damping: 20 });
  const y = useSpring(0, { stiffness: 250, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < width / 2 + padding) {
      setIsActive(true);
      // Normalized displacement scaled by magnetStrength
      const pullX = (distX / (width / 2 + padding)) * magnetStrength;
      const pullY = (distY / (height / 2 + padding)) * magnetStrength;
      x.set(pullX);
      y.set(pullY);
    } else {
      setIsActive(false);
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    setIsActive(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
    >
      <MotionDiv
        style={{ x, y }}
        className="inline-block"
      >
        {children}
      </MotionDiv>
    </div>
  );
};

export default Magnet;
