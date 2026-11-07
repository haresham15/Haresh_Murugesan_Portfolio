import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { allProjects, Project, flagshipProjects } from '@/content/projects';
import { Portal } from './ui/Portal';
import { useLockBodyScroll } from '@/lib/useLockBodyScroll';
import { ThemeSection } from './ThemeSection';
import { HealiosDemo } from '@/setpieces/HealiosDemo';
import { ApexisDemo } from '@/setpieces/ApexisDemo';
import { RouteRxDemo } from '@/setpieces/RouteRxDemo';
import { TempoDemo } from '@/setpieces/TempoDemo';

const MotionDiv = motion.div as any;

// Domain Cluster Definitions
interface DomainCluster {
  id: string;
  name: string;
  shortName: string;
  color: string;
  angle: number; // orbital angle in radians
  radius: number; // distance from central core
  projectSlugs: string[];
}

const DOMAIN_CLUSTERS: DomainCluster[] = [
  {
    id: 'cluster-clinical',
    name: 'CLINICAL CV & LIDAR',
    shortName: 'Clinical CV',
    color: '#FF6B35',
    angle: 0.85 * Math.PI,
    radius: 280,
    projectSlugs: ['healios', 'cv-allergy-wheal', 'wsi-histopathology-pipeline'],
  },
  {
    id: 'cluster-motorsport',
    name: 'MOTORSPORT TELEMETRY',
    shortName: 'Motorsport Telemetry',
    color: '#10B981',
    angle: 0.15 * Math.PI,
    radius: 300,
    projectSlugs: ['apexis'],
  },
  {
    id: 'cluster-spatial',
    name: 'SPATIAL & CIVIC AI',
    shortName: 'Spatial & Civic AI',
    color: '#38BDF8',
    angle: 1.45 * Math.PI,
    radius: 320,
    projectSlugs: ['routerx-careline-hub', 'nyc-housing-market-ai', 'cyclist-crash-spatial-ai'],
  },
  {
    id: 'cluster-agentic',
    name: 'AGENTIC & CLOUD SYSTEMS',
    shortName: 'Agentic & Cloud',
    color: '#F59E0B',
    angle: 1.85 * Math.PI,
    radius: 290,
    projectSlugs: [
      'tamiltrove',
      'tempo',
      'philocracy',
      'fastapi-dynamodb-microservice',
      'aws-agentic-retrieval',
      'cs50-ai-suite',
      'syntinuum-podcast-website',
      'murugesan-rajaram-lab',
      'portfolio-website',
      'momwebsite',
      'anna-birthday',
    ],
  },
];

interface PhysicsNode {
  id: string;
  title: string;
  slug: string;
  clusterId: string;
  color: string;
  isFlagship: boolean;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  radius: number;
  isHovered: boolean;
  isBonded: boolean;
  baseOrbitAngle: number;
  baseOrbitDistance: number;
  orbitSpeed: number;
}

export const UnifiedProjectField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDarkField, setIsDarkField] = useState<boolean>(false);
  const [showClassicIndex, setShowClassicIndex] = useState<boolean>(false);
  const [isDraggingNode, setIsDraggingNode] = useState<string | null>(null);
  const [hudMessage, setHudMessage] = useState<string>('DRAG OR CLICK NODES TO INSPECT ARCHITECTURE · [ESC] CLOSES · [R] RESETS FIELD');
  const [hoveredNodeTitle, setHoveredNodeTitle] = useState<string | null>(null);

  // Lock scroll when inspection drawer or classic index is open
  const isInspectionOpen = !!selectedProject || showClassicIndex;
  useLockBodyScroll(isInspectionOpen);

  // State of physics nodes
  const nodesRef = useRef<PhysicsNode[]>([]);
  const corePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mousePosRef = useRef<{ x: number; y: number; isDown: boolean }>({ x: 0, y: 0, isDown: false });
  const animFrameRef = useRef<number | null>(null);

  // Initialize node layout
  const initNodes = useCallback((width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    corePosRef.current = { x: centerX, y: centerY };

    const newNodes: PhysicsNode[] = [];

    allProjects.forEach((proj, idx) => {
      // Find cluster
      const cluster = DOMAIN_CLUSTERS.find((c) => c.projectSlugs.includes(proj.slug)) || DOMAIN_CLUSTERS[3];
      const isFlagship = flagshipProjects.some((f) => f.slug === proj.slug);
      
      // Compute orbital parameters
      const indexInCluster = cluster.projectSlugs.indexOf(proj.slug);
      const spreadAngle = (indexInCluster - (cluster.projectSlugs.length - 1) / 2) * 0.38;
      const angle = cluster.angle + spreadAngle;
      const distance = isFlagship ? cluster.radius * 0.85 : cluster.radius + (indexInCluster % 2 === 0 ? 40 : -30);

      const targetX = centerX + Math.cos(angle) * distance;
      const targetY = centerY + Math.sin(angle) * distance;

      newNodes.push({
        id: proj.slug,
        title: proj.title,
        slug: proj.slug,
        clusterId: cluster.id,
        color: cluster.color,
        isFlagship,
        x: targetX + (Math.random() - 0.5) * 40,
        y: targetY + (Math.random() - 0.5) * 40,
        targetX,
        targetY,
        vx: 0,
        vy: 0,
        radius: isFlagship ? 24 : 14,
        isHovered: false,
        isBonded: false,
        baseOrbitAngle: angle,
        baseOrbitDistance: distance,
        orbitSpeed: 0.0003 + (idx % 3) * 0.0001,
      });
    });

    nodesRef.current = newNodes;
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
        setShowClassicIndex(false);
      } else if (e.key === 'r' || e.key === 'R') {
        if (!selectedProject && !showClassicIndex && canvasRef.current) {
          initNodes(canvasRef.current.width, canvasRef.current.height);
          setHudMessage('FIELD RESET TO DETERMINISTIC ORBITS');
          setTimeout(() => {
            setHudMessage('DRAG OR CLICK NODES TO INSPECT ARCHITECTURE · [ESC] CLOSES · [R] RESETS FIELD');
          }, 2400);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, showClassicIndex, initNodes]);

  // Main Canvas Physics & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    initNodes(width, height);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      corePosRef.current = { x: width / 2, y: height / 2 };
    };

    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      const centerX = corePosRef.current.x;
      const centerY = corePosRef.current.y;

      // Draw subtle orbital guide tracks
      ctx.save();
      ctx.strokeStyle = isDarkField ? 'rgba(255, 255, 255, 0.04)' : 'rgba(9, 9, 11, 0.05)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      [220, 310, 400].forEach((r) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();

      // Draw domain cluster core labels & vector filaments
      DOMAIN_CLUSTERS.forEach((cluster) => {
        const clusterCenterX = centerX + Math.cos(cluster.angle) * cluster.radius;
        const clusterCenterY = centerY + Math.sin(cluster.angle) * cluster.radius;

        // Filament line from core to cluster anchor
        ctx.save();
        ctx.strokeStyle = `${cluster.color}25`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(clusterCenterX, clusterCenterY);
        ctx.stroke();
        ctx.restore();

        // Cluster label
        ctx.save();
        ctx.fillStyle = cluster.color;
        ctx.font = '600 11px monospace';
        ctx.letterSpacing = '1px';
        ctx.fillText(cluster.name, clusterCenterX - 45, clusterCenterY - 14);
        ctx.restore();
      });

      // Central Inspection Core Hub (Rupan-style bonding receptor)
      ctx.save();
      const corePulse = 36 + Math.sin(time * 2.5) * 3;
      ctx.strokeStyle = isDarkField ? '#FF6B35' : '#09090B';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, corePulse, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Core Ring
      ctx.fillStyle = isDarkField ? '#101B30' : '#EDE8DE';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isDarkField ? '#F5D998' : '#C83E2B';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Core Crosshair Fiducial
      ctx.strokeStyle = isDarkField ? '#F3EFE7' : '#09090B';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - 8, centerY);
      ctx.lineTo(centerX + 8, centerY);
      ctx.moveTo(centerX, centerY - 8);
      ctx.lineTo(centerX, centerY + 8);
      ctx.stroke();

      // Label below central hub
      ctx.font = '500 10px monospace';
      ctx.fillStyle = isDarkField ? '#A7B2C3' : '#525156';
      ctx.textAlign = 'center';
      ctx.fillText('INSPECTION CORE', centerX, centerY + 52);
      ctx.restore();

      // Update and Draw Nodes
      const nodes = nodesRef.current;
      const mouse = mousePosRef.current;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Orbit update if not dragging
        if (isDraggingNode !== node.id) {
          node.baseOrbitAngle += node.orbitSpeed;
          node.targetX = centerX + Math.cos(node.baseOrbitAngle) * node.baseOrbitDistance;
          node.targetY = centerY + Math.sin(node.baseOrbitAngle) * node.baseOrbitDistance;

          // Spring toward target position
          const dx = node.targetX - node.x;
          const dy = node.targetY - node.y;
          node.vx = node.vx * 0.88 + dx * 0.035;
          node.vy = node.vy * 0.88 + dy * 0.035;

          // Mouse proximity repulsion/attraction
          const mdx = node.x - mouse.x;
          const mdy = node.y - mouse.y;
          const mDist = Math.hypot(mdx, mdy);
          if (mDist < 100 && mDist > 0) {
            const force = (100 - mDist) / 100;
            node.vx += (mdx / mDist) * force * 1.5;
            node.vy += (mdy / mDist) * force * 1.5;
          }

          node.x += node.vx;
          node.y += node.vy;
        }

        // Draw elastic vector filament connecting node to its target cluster or center
        ctx.save();
        ctx.strokeStyle = `${node.color}35`;
        ctx.lineWidth = node.isFlagship ? 1.5 : 0.8;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.targetX, node.targetY);
        ctx.stroke();
        ctx.restore();

        // Draw node disc
        ctx.save();
        const isHover = node.isHovered || isDraggingNode === node.id;
        const currentRadius = isHover ? node.radius * 1.3 : node.radius;

        // Outer glow on hover or flagship
        if (node.isFlagship || isHover) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius + 6, 0, Math.PI * 2);
          ctx.fillStyle = `${node.color}22`;
          ctx.fill();
        }

        // Base disc fill
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = isDarkField ? '#07090D' : '#FFFFFF';
        ctx.fill();
        ctx.lineWidth = node.isFlagship ? 2.2 : 1.4;
        ctx.strokeStyle = isHover ? '#C83E2B' : node.color;
        ctx.stroke();

        // Inner core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.isFlagship ? 5 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Node Label
        ctx.font = node.isFlagship ? '600 12px monospace' : '400 10px monospace';
        ctx.fillStyle = isDarkField ? '#F3EFE7' : '#09090B';
        ctx.textAlign = 'center';
        const displayLabel = node.title.split('—')[0].trim();
        ctx.fillText(displayLabel, node.x, node.y + currentRadius + 14);

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [initNodes, isDarkField, isDraggingNode]);

  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosRef.current = { x, y, isDown: true };

    // Find clicked node
    const clickedNode = nodesRef.current.find((n) => Math.hypot(n.x - x, n.y - y) <= n.radius + 12);
    if (clickedNode) {
      setIsDraggingNode(clickedNode.id);
      setHudMessage(`DRAGGING [${clickedNode.title.split('—')[0].trim()}] · DROP ON CORE TO BOND`);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosRef.current.x = x;
    mousePosRef.current.y = y;

    if (isDraggingNode) {
      const dragged = nodesRef.current.find((n) => n.id === isDraggingNode);
      if (dragged) {
        dragged.x = x;
        dragged.y = y;
        dragged.vx = 0;
        dragged.vy = 0;

        // Check distance to core
        const coreDist = Math.hypot(x - corePosRef.current.x, y - corePosRef.current.y);
        if (coreDist < 50) {
          setHudMessage(`RELEASE TO BOND [${dragged.title.split('—')[0].trim()}] TO CORE`);
        }
      }
    } else {
      // Hover detection
      let hovered: PhysicsNode | null = null;
      nodesRef.current.forEach((n) => {
        const isHover = Math.hypot(n.x - x, n.y - y) <= n.radius + 8;
        n.isHovered = isHover;
        if (isHover) hovered = n;
      });

      if (hovered) {
        setHoveredNodeTitle((hovered as PhysicsNode).title);
      } else {
        setHoveredNodeTitle(null);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosRef.current.isDown = false;

    if (isDraggingNode) {
      const dragged = nodesRef.current.find((n) => n.id === isDraggingNode);
      if (dragged) {
        const coreDist = Math.hypot(x - corePosRef.current.x, y - corePosRef.current.y);
        // If dropped near core or clicked directly, bond it and open inspection!
        if (coreDist < 80 || Math.hypot(dragged.x - dragged.targetX, dragged.y - dragged.targetY) < 15) {
          const matchedProj = allProjects.find((p) => p.slug === dragged.slug);
          if (matchedProj) {
            setSelectedProject(matchedProj);
            setHudMessage(`INSPECTING SYSTEM: ${matchedProj.title}`);
          }
        }
      }
      setIsDraggingNode(null);
    } else {
      // Click without drag
      const clickedNode = nodesRef.current.find((n) => Math.hypot(n.x - x, n.y - y) <= n.radius + 8);
      if (clickedNode) {
        const matchedProj = allProjects.find((p) => p.slug === clickedNode.slug);
        if (matchedProj) {
          setSelectedProject(matchedProj);
        }
      }
    }
  };

  return (
    <ThemeSection
      id="projects"
      theme="gallery-bone"
      forceDark={isDarkField}
      className="p-0 overflow-hidden relative select-none flex flex-col justify-between"
      aria-label="Unified 18-Project Engineering Code Graph"
    >
      {/* Top Header / Mode Switcher Bar */}
      <div className="relative z-20 w-full px-[4vw] md:px-[6vw] xl:px-[7vw] pt-12 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-6 pointer-events-auto">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-[#C83E2B]">
            <span className="w-6 h-px bg-[#C83E2B]" />
            <span>02 // SELECTED WORKS &amp; FULL ARCHITECTURE GRAPH</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight ${
            isDarkField ? 'text-[#F3EFE7]' : 'text-[#09090B]'
          }`}>
            Engineering Systems Field
          </h2>
          <p className={`text-sm sm:text-base font-sans max-w-xl ${
            isDarkField ? 'text-[#A7B2C3]' : 'text-[#525156]'
          }`}>
            18 verifiable software architectures, clinical vision benchmarks, and 60 FPS client simulation runtimes.
          </p>
        </div>

        {/* Action Controls: Light/Dark Field Toggle + Classic Index Table */}
        <div className="flex items-center gap-3 text-xs font-mono shrink-0">
          <button
            onClick={() => setIsDarkField(!isDarkField)}
            className={`px-4 py-2 border rounded-[2px] transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              isDarkField
                ? 'bg-[#101B30] text-[#F3EFE7] border-[#F3EFE7]/20 hover:border-[#FF6B35]'
                : 'bg-[#EDE8DE] text-[#09090B] border-[#09090B]/20 hover:border-[#C83E2B]'
            }`}
          >
            <span>{isDarkField ? '● DARK FIELD' : '○ SWISS GALLERY LIGHT'}</span>
          </button>

          <button
            onClick={() => setShowClassicIndex(true)}
            className={`px-4 py-2 border rounded-[2px] transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              isDarkField
                ? 'bg-[#17243A] text-[#F5D998] border-[#F5D998]/30 hover:bg-[#1f304e]'
                : 'bg-[#09090B] text-[#F7F6F2] border-transparent hover:bg-[#C83E2B]'
            }`}
          >
            <span>VIEW CLASSIC INDEX [18 SYSTEMS]</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Full-Bleed Interactive Canvas Stage */}
      <div
        ref={containerRef}
        className="relative z-10 w-full h-[75vh] min-h-[580px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full block touch-none"
        />

        {/* Hovered node tool-pill */}
        {hoveredNodeTitle && !isDraggingNode && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none px-4 py-1.5 bg-[#09090B]/90 text-[#F7F6F2] border border-white/20 rounded-[2px] text-xs font-mono shadow-2xl backdrop-blur-md">
            <span>CLICK OR DRAG: </span>
            <strong className="text-[#F5D998]">{hoveredNodeTitle}</strong>
          </div>
        )}
      </div>

      {/* Floating HUD Pill at Bottom Edge (Rupan-style) */}
      <div className="relative z-20 w-full px-[4vw] md:px-[6vw] xl:px-[7vw] pb-10 flex items-center justify-between gap-4 pointer-events-auto">
        <div className={`px-4 py-2 border rounded-[2px] text-xs font-mono tracking-wider shadow-lg flex items-center gap-3 backdrop-blur-md ${
          isDarkField
            ? 'bg-[#07090D]/90 text-[#A7B2C3] border-white/10'
            : 'bg-[#EDE8DE]/90 text-[#525156] border-[#09090B]/10'
        }`}>
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>{hudMessage}</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-[#525156]">
          <span>TOTAL: 18 COMPILED NODES</span>
          <span>·</span>
          <span>4 DOMAIN CLUSTERS</span>
        </div>
      </div>

      {/* FLAGSHIP DEEP-INSPECTION SPLIT-SCREEN DRAWER / OVERLAY */}
      <Portal>
        <AnimatePresence>
          {selectedProject && (
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-[#060608]/92 backdrop-blur-2xl"
              onClick={() => setSelectedProject(null)}
            >
              <MotionDiv
                layoutId={`project-card-${selectedProject.slug}`}
                initial={{ scale: 0.94, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.94, y: 20 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="w-full max-w-[1360px] max-h-[92vh] bg-[#070B12] text-[#F3EFE7] border border-[#F3EFE7]/15 rounded-[2px] shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Drawer Top Navigation & Close Header */}
                <div className="px-6 py-4 border-b border-[#F3EFE7]/10 flex items-center justify-between bg-[#101B30]/60">
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="px-2.5 py-1 bg-[#FF6B35]/20 text-[#FF6B35] border border-[#FF6B35]/40 rounded-[2px] font-semibold">
                      {selectedProject.category.toUpperCase()}
                    </span>
                    <span className="text-[#A7B2C3]">YEAR {selectedProject.year}</span>
                    <span className="text-[#F3EFE7]/30">|</span>
                    <span className="text-[#F5D998]">{selectedProject.highlight}</span>
                  </div>

                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-1.5 text-xs font-mono bg-[#17243A] hover:bg-[#FF6B35] hover:text-[#070B12] text-[#F3EFE7] rounded-[2px] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>CLOSE</span>
                    <span>[ESC]</span>
                  </button>
                </div>

                {/* Split Screen Stage: Left Pane (Specs & Evidence) / Right Pane (Live Interactive Telemetry) */}
                <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-10">
                  
                  {/* Left Pane: Problem & Architectural Synthesis (5 Cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-raleway font-bold text-[#F3EFE7] tracking-tight mb-2">
                        {selectedProject.title}
                      </h3>
                      <p className="text-xs font-mono text-[#FF6B35]">
                        ROLE: {selectedProject.role}
                      </p>
                    </div>

                    <div className="space-y-4 text-sm font-sans text-[#A7B2C3] leading-relaxed">
                      <p>{selectedProject.caseStudy?.executiveSummary || selectedProject.description}</p>
                      {selectedProject.caseStudy?.problem && (
                        <div className="p-4 bg-[#101B30]/70 border-l-2 border-[#FF6B35] text-xs">
                          <strong className="block text-[#F3EFE7] mb-1 font-mono uppercase">
                            CORE CHALLENGE:
                          </strong>
                          <span>{selectedProject.caseStudy.problem}</span>
                        </div>
                      )}
                    </div>

                    {/* Verified Benchmark Badges */}
                    {selectedProject.caseStudy?.metrics && selectedProject.caseStudy.metrics.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-mono text-[#7A889B] uppercase tracking-wider">
                          VERIFIED BENCHMARKS:
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedProject.caseStudy.metrics.map((m, idx) => (
                            <div key={idx} className="p-3 bg-[#101B30] border border-[#F3EFE7]/10 rounded-[2px]">
                              <div className="text-xs text-[#A7B2C3]">{m.label}</div>
                              <div className="text-base font-mono font-bold text-[#4CC38A]">{m.value}</div>
                              <div className="text-[10px] text-[#7A889B] truncate">{m.detail}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tech Stack Pills */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono text-[#7A889B] uppercase tracking-wider">
                        TECHNOLOGY STACK:
                      </div>
                      <div className="text-xs font-mono text-[#82B7FF] bg-[#101B30] p-3 rounded-[2px] border border-[#F3EFE7]/10">
                        {selectedProject.stack}
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
                      <Link
                        href={`/projects/${selectedProject.slug}`}
                        className="px-5 py-3 bg-[#FF6B35] hover:bg-[#FF8547] text-[#070B12] font-semibold rounded-[2px] transition-colors flex items-center gap-2"
                      >
                        <span>Deep Technical Case Study</span>
                        <span>→</span>
                      </Link>
                      {selectedProject.github && (
                        <a
                          href={selectedProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 bg-[#101B30] hover:bg-[#17243A] text-[#F3EFE7] border border-[#F3EFE7]/15 rounded-[2px] transition-colors flex items-center gap-2"
                        >
                          <span>GitHub Source</span>
                          <span>↗</span>
                        </a>
                      )}
                      {selectedProject.demo && (
                        <a
                          href={selectedProject.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 bg-[#101B30] hover:bg-[#17243A] text-[#4CC38A] border border-[#4CC38A]/30 rounded-[2px] transition-colors flex items-center gap-2"
                        >
                          <span>Live System</span>
                          <span>↗</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Pane: Live Interactive Visual / Telemetry Simulator (7 Cols) */}
                  <div className="lg:col-span-7 flex flex-col justify-center">
                    {selectedProject.slug === 'healios' ? (
                      <HealiosDemo />
                    ) : selectedProject.slug === 'apexis' ? (
                      <ApexisDemo />
                    ) : selectedProject.slug === 'routerx-careline-hub' ? (
                      <RouteRxDemo />
                    ) : selectedProject.slug === 'tempo' ? (
                      <TempoDemo />
                    ) : (
                      <div className="w-full min-h-[420px] bg-[#101B30]/50 border border-[#F3EFE7]/10 rounded-[2px] p-6 flex flex-col justify-between">
                        <div className="flex items-center justify-between pb-3 border-b border-[#F3EFE7]/10 text-xs font-mono">
                          <span className="text-[#FF6B35]">ARCHITECTURE TOPOLOGY</span>
                          <span className="text-[#82B7FF]">{selectedProject.title}</span>
                        </div>
                        <div className="my-auto text-center space-y-4 py-8">
                          <div className="inline-block p-4 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/30 text-[#FF6B35]">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <circle cx="12" cy="12" r="3" />
                              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                          </div>
                          <div className="max-w-md mx-auto text-sm text-[#A7B2C3]">
                            Deterministic client state architecture and verified benchmark suite available in full case study.
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[#F3EFE7]/10 text-xs font-mono text-[#7A889B]">
                          <span>EVIDENCE ID: {selectedProject.primaryEvidenceId || 'VERIFIED-RECORD'}</span>
                          <Link href={`/projects/${selectedProject.slug}`} className="text-[#FF6B35] hover:underline">
                            EXPLORE C4 DIAGRAM ↗
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </MotionDiv>
            </MotionDiv>
          )}
        </AnimatePresence>
      </Portal>

      {/* CLASSIC 18-PROJECT TABLE MODAL */}
      <Portal>
        <AnimatePresence>
          {showClassicIndex && (
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-[#060608]/94 backdrop-blur-2xl"
              onClick={() => setShowClassicIndex(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[1240px] max-h-[88vh] bg-[#070B12] text-[#F3EFE7] border border-[#F3EFE7]/15 rounded-[2px] shadow-2xl flex flex-col overflow-hidden"
              >
                <div className="p-6 border-b border-[#F3EFE7]/10 flex items-center justify-between bg-[#101B30]/60">
                  <div>
                    <h3 className="text-xl font-raleway font-bold text-[#F3EFE7]">
                      Classic Architecture Index // All 18 Systems
                    </h3>
                    <p className="text-xs font-mono text-[#A7B2C3]">
                      Deterministic archive spanning clinical AI, motorsports, and serverless pipelines.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowClassicIndex(false)}
                    className="px-3 py-1.5 bg-[#17243A] hover:bg-[#FF6B35] hover:text-[#070B12] text-xs font-mono text-[#F3EFE7] rounded-[2px]"
                  >
                    CLOSE [ESC]
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[#F3EFE7]/15 text-[#7A889B]">
                        <th className="pb-3">SYSTEM TITLE</th>
                        <th className="pb-3">CATEGORY</th>
                        <th className="pb-3">YEAR</th>
                        <th className="pb-3">CORE HIGHLIGHT</th>
                        <th className="pb-3 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3EFE7]/[0.06]">
                      {allProjects.map((p) => (
                        <tr
                          key={p.slug}
                          className="hover:bg-[#101B30]/50 transition-colors group cursor-pointer"
                          onClick={() => {
                            setShowClassicIndex(false);
                            setSelectedProject(p);
                          }}
                        >
                          <td className="py-3 font-semibold text-[#F3EFE7] group-hover:text-[#F5D998]">
                            {p.title}
                          </td>
                          <td className="py-3 text-[#A7B2C3]">{p.category}</td>
                          <td className="py-3 text-[#7A889B]">{p.year}</td>
                          <td className="py-3 text-[#4CC38A]">{p.highlight}</td>
                          <td className="py-3 text-right">
                            <span className="text-[#FF6B35] group-hover:translate-x-1 inline-block transition-transform">
                              INSPECT →
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </Portal>
    </ThemeSection>
  );
};

export default UnifiedProjectField;
