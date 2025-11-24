import React from 'react';
import { motion } from 'framer-motion';

const FractalGlassBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050505]">
            {/* Vertical Color Streaks */}
            <div className="absolute inset-0 opacity-60">
                {/* Cyan Streak */}
                <motion.div
                    className="absolute top-[-20%] left-[10%] w-[20vw] h-[140%] bg-cyan-400/30 blur-[80px]"
                    animate={{
                        scaleX: [1, 1.2, 1],
                        opacity: [0.4, 0.4, 0.4],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                {/* Magenta Streak */}
                <motion.div
                    className="absolute top-[-20%] left-[40%] w-[25vw] h-[140%] bg-fuchsia-500/30 blur-[80px]"
                    animate={{
                        scaleX: [1, 1.1, 1],
                        opacity: [0.4, 0.4, 0.4],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                />
                {/*Blue Streak */}
                <motion.div
                    className="absolute top-[-20%] right-[15%] w-[20vw] h-[140%] bg-sky-500/20 blur-[80px]"
                    animate={{
                        scaleX: [1, 1.3, 1],
                        opacity: [0.4, 0.4, 0.4],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                />
                {/* Deep Blue Base */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent" />
            </div>

            {/* Ribbed Glass Texture */}
            <div
                className="absolute inset-0 opacity-90 pointer-events-none"
                style={{
                    backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.05) 4px,
            rgba(255, 255, 255, 0.05) 2px
          )`
                }}
            />
            {/* Noise Overlay */}
            <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.3' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                }}
            />

            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#050505] opacity-80 pointer-events-none" />
        </div>
    );
};

export default FractalGlassBackground;
