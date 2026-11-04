import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useSpring, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useMotionPreference } from '../MotionPreference';

const MotionDiv = motion.div;
const MotionSpan = motion.span;

/**
 * 1. BlurText
 * Word-by-word spring blur-in animation with proper whitespace preservation.
 */
export const BlurText = ({
  text = '',
  className = '',
  delay = 0.04,
  as: Component = 'span',
}) => {
  const { isReduced } = useMotionPreference();
  const words = text.split(' ');

  if (isReduced) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component className={`inline-block ${className}`}>
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <MotionSpan
            initial={{ opacity: 0, filter: 'blur(10px)', y: 8 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * delay,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {word}
          </MotionSpan>
          {index < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </Component>
  );
};

/**
 * 2. ScrollReveal
 * Scroll-scrubbed opacity and blur unmasking with relative positioning.
 */
export const ScrollReveal = ({
  children,
  className = '',
  as: Component = 'div',
}) => {
  const { isReduced } = useMotionPreference();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start 0.9', 'start 0.45'],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.25, 1]);
  const blurValue = useTransform(scrollYProgress, [0, 1], [6, 0]);
  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

  if (isReduced) {
    return <Component style={{ position: 'relative' }} className={`relative ${className}`}>{children}</Component>;
  }

  return (
    <Component ref={targetRef} style={{ position: 'relative' }} className={`relative ${className}`}>
      <motion.div style={{ opacity, filter }}>
        {children}
      </motion.div>
    </Component>
  );
};

/**
 * 3. MagnetButton
 * Spring-physics magnetic pull (±6px) + GlareHover specular sweep + 3-Stop Self-Illuminated Orange.
 */
export const MagnetButton = ({
  children,
  variant = 'primary',
  padding = 48,
  href,
  target,
  rel,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) => {
  const { isReduced } = useMotionPreference();
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.35 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.35 });

  const handleMouseMove = (e) => {
    if (disabled || isReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.hypot(distX, distY);

    if (distance < rect.width / 2 + padding) {
      const maxDisplacement = 6;
      const pullX = (distX / (rect.width / 2 + padding)) * maxDisplacement;
      const pullY = (distY / (rect.height / 2 + padding)) * maxDisplacement;
      x.set(pullX);
      y.set(pullY);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const isPrimary = variant === 'primary';
  const baseClasses = `group relative inline-flex items-center justify-center min-h-[48px] min-w-[48px] rounded-full px-7 sm:px-8 py-3.5 sm:py-4 font-sans font-semibold text-sm sm:text-[15px] transition-all duration-300 select-none cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB86C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090D] ${
    isPrimary
      ? 'bg-gradient-to-b from-[#FF8547] to-[#FF6B2B] border-t border-[#FFE9AE] text-[#07090D] shadow-[0_0_30px_rgba(255,107,43,0.35)] hover:shadow-[0_0_40px_rgba(255,107,43,0.5)] active:scale-[0.98]'
      : 'bg-[#102038]/85 text-[#F4EFE6] border border-[#F4EFE6]/20 backdrop-blur-md hover:bg-[#162B4C] active:scale-[0.98]'
  } ${className}`;

  const content = (
    <>
      {isPrimary && !isReduced && (
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-700 ease-out group-hover:translate-x-full group-focus:translate-x-full"
          style={{
            background: 'linear-gradient(110deg, transparent 35%, rgba(255,233,174,0.45) 50%, transparent 65%)',
          }}
          aria-hidden="true"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2.5">{children}</span>
    </>
  );

  if (href) {
    return (
      <MotionDiv
        ref={ref}
        style={{ x, y }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        <a
          href={href}
          target={target}
          rel={rel}
          onClick={onClick}
          className={baseClasses}
          {...props}
        >
          {content}
        </a>
      </MotionDiv>
    );
  }

  return (
    <MotionDiv
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={baseClasses}
        {...props}
      >
        {content}
      </button>
    </MotionDiv>
  );
};

/**
 * 4. StarBorderButton
 * Dark Prussian cobalt (#102038) pill button with an orbiting tungsten light filament.
 */
export const StarBorderButton = ({
  children,
  filamentColor = '#FF6B2B',
  href,
  target,
  rel,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) => {
  const { isReduced } = useMotionPreference();

  const containerClasses = `group relative inline-flex items-center justify-center min-h-[48px] min-w-[48px] p-[1px] rounded-full overflow-hidden select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB86C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090D] ${className}`;

  const innerClasses =
    'relative z-10 w-full h-full min-h-[46px] px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#102038]/90 backdrop-blur-md text-[#F4EFE6] font-sans font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 group-hover:bg-[#162B4C] transition-colors duration-200';

  const content = (
    <>
      {!isReduced && (
        <span
          className="pointer-events-none absolute -inset-[150%] animate-[spin_4.5s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `conic-gradient(from 0deg, transparent 0 320deg, ${filamentColor} 350deg, #FFB86C 360deg)`,
          }}
          aria-hidden="true"
        />
      )}
      {isReduced && (
        <span
          className="absolute inset-0 rounded-full border border-[#F4EFE6]/20 group-hover:border-[#FFB86C]"
          aria-hidden="true"
        />
      )}
      <span className={innerClasses}>{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={containerClasses}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={containerClasses}
      {...props}
    >
      {content}
    </button>
  );
};

/**
 * 5. ClickSpark
 * Radiates 8 crisp geometric tachometer-style vector ticks on click in #FFB86C and #FF6B2B.
 */
export const ClickSpark = ({
  children,
  sparkColor = '#FFB86C',
  sparkCount = 8,
  sparkLength = 8,
  sparkDistance = 22,
  className = '',
  onClick,
  ...props
}) => {
  const { isReduced } = useMotionPreference();
  const [sparks, setSparks] = useState([]);
  const containerRef = useRef(null);

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (isReduced || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : rect.width / 2;
    const y = e.clientY ? e.clientY - rect.top : rect.height / 2;

    const id = Date.now() + Math.random();
    setSparks((prev) => [...prev, { id, x, y }]);

    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => s.id !== id));
    }, 400);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative inline-block ${className}`}
      {...props}
    >
      {children}
      {sparks.map((spark) => (
        <svg
          key={spark.id}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 z-30 overflow-visible"
          style={{ left: spark.x, top: spark.y, width: 0, height: 0 }}
          aria-hidden="true"
        >
          {Array.from({ length: sparkCount }).map((_, i) => {
            const angle = (i * 360) / sparkCount;
            const rad = (angle * Math.PI) / 180;
            const x1 = Math.cos(rad) * 6;
            const y1 = Math.sin(rad) * 6;
            const x2 = Math.cos(rad) * (6 + sparkLength);
            const y2 = Math.sin(rad) * (6 + sparkLength);

            return (
              <motion.line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={i % 2 === 0 ? sparkColor : '#FF6B2B'}
                strokeWidth={1.5}
                strokeLinecap="round"
                initial={{ opacity: 1, scale: 0.6 }}
                animate={{
                  x2: Math.cos(rad) * sparkDistance,
                  y2: Math.sin(rad) * sparkDistance,
                  opacity: 0,
                  scale: 1.2,
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}
        </svg>
      ))}
    </div>
  );
};

/**
 * 6. SlideTextLink
 * Dual-layer vertical rolled hover link with a 2px diagonal arrow nudge and subtle bottom rule.
 */
export const SlideTextLink = ({
  children,
  href,
  onClick,
  target,
  rel,
  className = '',
  ...props
}) => {
  const { isReduced } = useMotionPreference();

  const content = (
    <span className="relative inline-flex items-center gap-1.5 overflow-hidden group">
      <span className="inline-flex items-center gap-1.5 transition-transform duration-300 ease-out group-hover:-translate-y-full">
        <span>{children}</span>
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 inline-flex items-center gap-1.5 text-[#FFB86C] translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
      >
        <span>{children}</span>
      </span>
      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#FFB86C]/40 scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
    </span>
  );

  const baseClasses = `inline-flex items-center text-[15px] sm:text-[16px] font-medium text-[#F4EFE6] hover:text-[#FFB86C] transition-colors duration-200 ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={baseClasses}
        {...props}
      >
        {isReduced ? children : content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={baseClasses}
      {...props}
    >
      {isReduced ? children : content}
    </button>
  );
};

/**
 * 7. CountUp
 * Tabular-numeral counter for project telemetry metrics.
 */
export const CountUp = ({
  to,
  from = 0,
  duration = 1.6,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) => {
  const { isReduced } = useMotionPreference();
  const [value, setValue] = useState(isReduced ? to : from);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (isReduced) {
      setValue(to);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isReduced, to]);

  useEffect(() => {
    if (!inView || isReduced) return;

    let startTime;
    let animationFrame;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * easeProgress;
      setValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setValue(to);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [inView, isReduced, from, to, duration]);

  return (
    <span ref={ref} className={`tabular-nums font-mono ${className}`}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};

/**
 * 8. SpotlightCard
 * Cursor-tracked Prussian and amber radial border illumination.
 */
export const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 184, 108, 0.12)',
  borderColor = 'rgba(76, 141, 255, 0.35)',
  ...props
}) => {
  const { isReduced } = useMotionPreference();
  const cardRef = useRef(null);
  const [pos, setPos] = useState({ x: -1000, y: -1000, active: false });

  const handleMouseMove = (e) => {
    if (isReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setPos({ x: -1000, y: -1000, active: false });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl bg-[#102038] border border-[#F4EFE6]/10 ${className}`}
      {...props}
    >
      {!isReduced && pos.active && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(350px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}
      {/* 1px Chassis Top-Edge Catchlight */}
      <div
        className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-[#FFB86C] via-[#FF6B2B]/70 to-transparent"
        aria-hidden="true"
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

/**
 * 9. TiltedCard
 * Restrained 3.5° perspective tilt for media frames only.
 */
export const TiltedCard = ({
  children,
  className = '',
  maxTilt = 3.5,
  ...props
}) => {
  const { isReduced } = useMotionPreference();
  const ref = useRef(null);

  const rotateX = useSpring(0, { stiffness: 260, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 260, damping: 25 });

  const handleMouseMove = (e) => {
    if (isReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = -((y - centerY) / centerY) * maxTilt;
    const tiltY = ((x - centerX) / centerX) * maxTilt;

    rotateX.set(tiltX);
    rotateY.set(tiltY);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  if (isReduced) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <div
      style={{ perspective: 1000 }}
      className="w-full"
    >
      <MotionDiv
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={className}
        {...props}
      >
        {children}
      </MotionDiv>
    </div>
  );
};

/**
 * 10. InteractivePillGroup
 * Framer Motion layoutId sliding pill selector with responsive padding and overflow prevention.
 */
export const InteractivePillGroup = ({
  items = [],
  activeItem,
  activeKey,
  onSelect,
  onChange,
  size = 'md',
  layoutId = 'pill-active-bg',
  className = '',
}) => {
  const currentActive = activeItem || activeKey;
  const handleSelect = (id) => {
    if (onSelect) onSelect(id);
    if (onChange) onChange(id);
  };

  const isSmall = size === 'sm';

  return (
    <div
      role="tablist"
      aria-label="Category Filter"
      className={`inline-flex items-center p-1 rounded-full bg-[#102038]/80 border border-[#F4EFE6]/10 backdrop-blur-md max-w-full overflow-x-auto ${className}`}
    >
      {items.map((item) => {
        const itemId = item.id || item.key;
        const isSelected = currentActive === itemId;
        return (
          <button
            key={itemId}
            role="tab"
            aria-selected={isSelected}
            onClick={() => handleSelect(itemId)}
            className={`relative rounded-full font-mono transition-colors duration-200 select-none cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFB86C] ${
              isSmall ? 'px-2 sm:px-3 py-1 text-[11px]' : 'px-2.5 sm:px-5 py-1.5 sm:py-2 text-xs'
            } ${
              isSelected ? 'text-[#F4EFE6] font-semibold' : 'text-[#9BA8B8] hover:text-[#F4EFE6]'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-[#162B4C] border-t border-[#FFB86C]/80 shadow-md"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2B] shadow-[0_0_6px_#FF6B2B]" />
              )}
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

/**
 * 11. AnimatedDock
 * Fixed floating dock at bottom displaying Chronograph Sector indexing (S1, S2, S3),
 * magnified items on hover, and mobile drawer trigger.
 */
export const AnimatedDock = ({
  sections = [],
  activeSection = '',
  onSectionClick,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sector indexing mapping
  const getSector = (id) => {
    if (['about', 'experience'].includes(id)) return 'S1';
    if (['podcast', 'projects', 'skills'].includes(id)) return 'S2';
    return 'S3';
  };

  const currentSector = getSector(activeSection);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center">
      {/* Desktop Floating Pill Dock */}
      <nav
        aria-label="Section Navigation Dock"
        className="hidden md:flex items-center px-5 py-2.5 gap-2 rounded-full bg-[#0C1626]/90 backdrop-blur-xl border-t border-[#FFB86C]/35 border-x border-b border-[#F4EFE6]/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
      >
        {/* Active Telemetry Sector Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 mr-1 rounded-full bg-[#162B4C] border border-[#FF6B2B]/40 text-[11px] font-mono text-[#FFB86C]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2B] animate-pulse" />
          <span>{currentSector}</span>
        </div>

        {/* Section Navigation Items */}
        {sections.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => onSectionClick(sec.id)}
              className={`relative px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 select-none cursor-pointer group flex items-center gap-1.5 ${
                isActive
                  ? 'text-[#F4EFE6] bg-[#162B4C]/80 font-medium'
                  : 'text-[#9BA8B8] hover:text-[#F4EFE6] hover:bg-white/[0.04]'
              }`}
            >
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#FF6B2B]" />
              )}
              <span>{sec.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Compact Drawer Button */}
      <div className="md:hidden relative">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle section navigation menu"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0C1626]/95 backdrop-blur-xl border-t border-[#FFB86C]/40 border-x border-b border-[#F4EFE6]/15 text-xs font-mono text-[#F4EFE6] shadow-xl"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2B]" />
          <span>SECTORS · {currentSector}</span>
          <span className="text-[#9BA8B8]">▾</span>
        </button>

        {/* Mobile Dropdown Panel */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 p-3 rounded-2xl bg-[#0C1626] border border-[#F4EFE6]/15 backdrop-blur-2xl shadow-2xl space-y-1"
            >
              <div className="px-3 py-1.5 text-[10px] font-mono text-[#9BA8B8] uppercase border-b border-white/[0.08] mb-1">
                Telemetry Sectors
              </div>
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    onSectionClick(sec.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-left transition-colors ${
                    activeSection === sec.id
                      ? 'bg-[#162B4C] text-[#FFB86C]'
                      : 'text-[#9BA8B8] hover:text-[#F4EFE6] hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{sec.label}</span>
                  <span className="text-[10px] opacity-60">{getSector(sec.id)}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
