import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const FloatingGeometry = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = 35;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 100,
        size: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 0.5,
        color: ['#00D9FF', '#A78BFA', '#EC4899', '#3B82F6'][Math.floor(Math.random() * 4)],
      });
    }

    const drawParticle = (particle) => {
      const scale = 100 / (100 + particle.z);
      const x = (particle.x - canvas.width / 2) * scale + canvas.width / 2;
      const y = (particle.y - canvas.height / 2) * scale + canvas.height / 2;
      const size = particle.size * scale;

      ctx.fillStyle = particle.color;
      ctx.globalAlpha = Math.max(0, 1 - particle.z / 100);
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = particle.color;
      ctx.globalAlpha = Math.max(0, 0.5 - particle.z / 200);
      ctx.lineWidth = 0.5;
      ctx.stroke();
    };

    const drawConnections = () => {
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = '#00D9FF';
      ctx.lineWidth = 0.3;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.02;

      // Update and draw particles
      particles.forEach((particle, idx) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;

        // Wrap around
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.z < -50) particle.z = 100;
        if (particle.z > 100) particle.z = -50;

        // Apply subtle rotation
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const angle = Math.atan2(particle.y - centerY, particle.x - centerX);
        const distance = Math.sqrt(
          Math.pow(particle.x - centerX, 2) + Math.pow(particle.y - centerY, 2)
        );

        const newAngle = angle + 0.0005;
        particle.x = centerX + Math.cos(newAngle) * distance;
        particle.y = centerY + Math.sin(newAngle) * distance;

        drawParticle(particle);
      });

      drawConnections();
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <motion.div
      className="col-span-1 md:col-span-2 lg:col-span-4 row-span-1 bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl p-8 relative overflow-hidden h-[600px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h2 className="text-3xl font-mono font-bold text-light-gray mb-2 z-10">
          "in·no·va·tion"
        </h2>
        <p className="text-sm text-light-gray/60 font-sans z-10">
          the action or process of innovating.
          <br />
          "innovation is crucial to the continuing success of any organization"
          <br />
          A new method, idea or product that is different from the existing ones.
        </p>
        <h3 className="text-xl font-mono font-bold text-light-gray mb-2 z-10">
          Definitions from Oxford Dictionary
        </h3>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute inset-0 rounded-2xl"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0, 217, 255, 0.05), transparent)' }}
      />
    </motion.div>
  );
};

export default FloatingGeometry;
