import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const MotionDiv = motion.div as any;

export interface TiltedCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  maxTilt?: number;
  scaleOnHover?: number;
  perspective?: number;
}

export const TiltedCard: React.FC<TiltedCardProps> = ({
  children,
  className = '',
  containerClassName = '',
  maxTilt = 4,
  scaleOnHover = 1.015,
  perspective = 1000,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 280, damping: 25 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 280, damping: 25 });
  const scale = useSpring(useMotionValue(1), { stiffness: 280, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = (e.clientX - rect.left) / width;
    const mouseY = (e.clientY - rect.top) / height;

    const rX = (mouseY - 0.5) * -maxTilt * 2;
    const rY = (mouseX - 0.5) * maxTilt * 2;

    rotateX.set(rX);
    rotateY.set(rY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(scaleOnHover);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`[perspective:${perspective}px] ${containerClassName}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <MotionDiv
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className={`w-full h-full will-change-transform ${className}`}
      >
        {children}
      </MotionDiv>
    </div>
  );
};

export default TiltedCard;
