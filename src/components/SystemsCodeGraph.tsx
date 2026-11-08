import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { allProjects, Project } from '@/content/projects';
import { GridCrosshair } from './ui/EditorialPrimitives';

// ---------------------------------------------------------------------------
// 1. DATA TAXONOMY & TOPOLOGY DEFINITIONS
// ---------------------------------------------------------------------------

export type SuperClusterId = 'cluster-backend' | 'cluster-frontend';

export interface SuperCluster {
  id: SuperClusterId;
  label: string;
  shortLabel: string;
  domain: string;
  accentColor: string;
  description: string;
  count: number;
}

export interface SubCluster {
  id: string;
  parentId: SuperClusterId;
  label: string;
  shortLabel: string;
  accentColor: string;
  description: string;
  projectSlugs: string[];
}

export interface CrossTechEdge {
  source: string;
  target: string;
  sharedTech: string;
}

// Super Clusters (Tier 1)
export const SUPER_CLUSTERS: SuperCluster[] = [
  {
    id: 'cluster-frontend',
    label: 'Frontend, Spatial UI & Interactive Systems',
    shortLabel: 'Frontend & Spatial UI',
    domain: 'Next.js, React, TypeScript, 3D WebGL/Deck.GL & Telemetry Interfaces',
    accentColor: '#82B7FF',
    description: 'Hardware-accelerated rendering, 60fps Web Workers, and zero-latency client state machines.',
    count: 9,
  },
  {
    id: 'cluster-backend',
    label: 'Backend, AI/ML & Compute Engines',
    shortLabel: 'Backend & AI/ML Engines',
    domain: 'Python, PyTorch, FAISS, Computer Vision & Distributed Systems',
    accentColor: '#FF6B35',
    description: 'Vector embeddings, sub-millisecond saliency pipelines, and spatial compute runtimes.',
    count: 9,
  },
];

// Sub Clusters (Tier 2) - 4 under Backend, 3 under Frontend
export const SUB_CLUSTERS: SubCluster[] = [
  // Frontend Sub-Clusters (9 projects total)
  {
    id: 'sub-spatial-3d',
    parentId: 'cluster-frontend',
    label: '3D Spatial UI & Geospatial Dashboards',
    shortLabel: '3D Spatial UI',
    accentColor: '#82B7FF',
    description: 'Hardware-accelerated Deck.GL, Mapbox GL, and 3D point-cloud interfaces.',
    projectSlugs: ['nyc-housing-market-ai'],
  },
  {
    id: 'sub-telemetry-apps',
    parentId: 'cluster-frontend',
    label: 'Real-Time Telemetry & Productivity Systems',
    shortLabel: 'Real-Time Telemetry',
    accentColor: '#4CC38A',
    description: 'Off-main-thread Web Workers, local SQLite ring buffers, and 60fps simulation.',
    projectSlugs: ['apexis', 'tempo', 'philocracy', 'momwebsite'],
  },
  {
    id: 'sub-media-streaming',
    parentId: 'cluster-frontend',
    label: 'Media Streaming & Design Systems',
    shortLabel: 'Media & Streaming',
    accentColor: '#F5D998',
    description: 'Web Audio, DTCG design tokens, and high-fidelity brand platforms.',
    projectSlugs: ['syntinuum-podcast-website', 'murugesan-rajaram-lab', 'portfolio-website', 'anna-birthday'],
  },

  // Backend Sub-Clusters (9 projects total)
  {
    id: 'sub-cv-medical',
    parentId: 'cluster-backend',
    label: 'Computer Vision & Clinical Diagnostics',
    shortLabel: 'Computer Vision',
    accentColor: '#FF6B35',
    description: '8.09ms Grad-CAM explainability, HSV color segmentation, and histological AI.',
    projectSlugs: ['healios', 'cv-allergy-wheal'],
  },
  {
    id: 'sub-retrieval-search',
    parentId: 'cluster-backend',
    label: 'Vector Search & Information Retrieval',
    shortLabel: 'Search & Retrieval',
    accentColor: '#FF8547',
    description: 'FAISS dense semantic search, BM25 sparse fusion, and RAG architectures.',
    projectSlugs: ['tamiltrove', 'tutormatch'],
  },
  {
    id: 'sub-predictive-modeling',
    parentId: 'cluster-backend',
    label: 'Econometrics & Predictive Machine Learning',
    shortLabel: 'Econometrics & ML',
    accentColor: '#FFE9AE',
    description: 'OSRM isochrone routing, spatial transit optimization, and regression models.',
    projectSlugs: ['routerx-careline', 'cs50-ai-projects', 'carstomer'],
  },
  {
    id: 'sub-cloud-systems',
    parentId: 'cluster-backend',
    label: 'Cloud Infrastructure & Core Algorithms',
    shortLabel: 'Cloud & Serverless',
    accentColor: '#82B7FF',
    description: 'AWS Lambda microservices, DynamoDB schema modeling, and formal Java contracts.',
    projectSlugs: ['software-2-projects', 'software-1-projects'],
  },
];

// Semantic Cosine-Similarity / Shared-Stack Vector Cross-Links
export const CROSS_TECH_EDGES: CrossTechEdge[] = [
  { source: 'healios', target: 'cv-allergy-wheal', sharedTech: 'TensorFlow & OpenCV' },
  { source: 'healios', target: 'tamiltrove', sharedTech: 'Python & Vector Embeddings' },
  { source: 'healios', target: 'nyc-housing-market-ai', sharedTech: 'Spatial 3D & Elevation' },
  { source: 'tamiltrove', target: 'tutormatch', sharedTech: 'NLP & Dense Vector Search' },
  { source: 'routerx-careline', target: 'nyc-housing-market-ai', sharedTech: 'Geospatial Analytics & Python' },
  { source: 'routerx-careline', target: 'carstomer', sharedTech: 'Econometric Regressors' },
  { source: 'cs50-ai-projects', target: 'carstomer', sharedTech: 'Scikit-Learn & Classical ML' },
  { source: 'software-1-projects', target: 'software-2-projects', sharedTech: 'Java Formal Contracts' },
  { source: 'apexis', target: 'tempo', sharedTech: 'Next.js & Local SQLite' },
  { source: 'apexis', target: 'syntinuum-podcast-website', sharedTech: 'Next.js & Streaming Engine' },
  { source: 'tempo', target: 'tamiltrove', sharedTech: 'Next.js & Vector Triage' },
  { source: 'philocracy', target: 'momwebsite', sharedTech: 'Strict TypeScript & React' },
  { source: 'murugesan-rajaram-lab', target: 'portfolio-website', sharedTech: 'DTCG Design Systems & SSG' },
  { source: 'syntinuum-podcast-website', target: 'anna-birthday', sharedTech: 'Fluid Web Audio & Motion' },
  { source: 'apexis', target: 'healios', sharedTech: 'Real-Time Compute Pipelines' },
];

export type TechFilter = 'all' | 'ai' | 'cv' | 'nextjs' | 'python' | 'cloud';

export const TECH_FILTERS: { id: TechFilter; label: string }[] = [
  { id: 'all', label: 'All (18)' },
  { id: 'ai', label: 'AI / ML' },
  { id: 'cv', label: 'Computer Vision' },
  { id: 'nextjs', label: 'Next.js / TS' },
  { id: 'python', label: 'Python' },
  { id: 'cloud', label: 'Cloud / Systems' },
];

interface SimNode {
  id: string;
  type: 'root' | 'super' | 'sub' | 'project';
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  color: string;
  parentId?: string;
  superClusterId?: SuperClusterId;
  subClusterId?: string;
  project?: Project;
  count?: number;
}

export const SystemsCodeGraph: React.FC = () => {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Layout View Mode: Guided Cluster View vs All 18 Nodes Constellation
  const [viewMode, setViewMode] = useState<'guided' | 'constellation'>('guided');
  const [selectedSuperCluster, setSelectedSuperCluster] = useState<SuperClusterId | null>('cluster-backend');
  const [selectedSubCluster, setSelectedSubCluster] = useState<string | null>('sub-cv-medical');
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>('healios');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [techFilter, setTechFilter] = useState<TechFilter>('all');
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Dynamic layout dimension tracking
  const [canvasDim, setCanvasDim] = useState({ width: 720, height: 680 });

  // Camera Pan/Zoom Matrix
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1.0 });
  const targetCamRef = useRef({ x: 0, y: 0, zoom: 1.0 });

  // Smooth camera lerp loop
  useEffect(() => {
    let animId: number;
    const lerpCamera = () => {
      setCamera((prev) => {
        const target = targetCamRef.current;
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;
        const dz = target.zoom - prev.zoom;
        if (Math.abs(dx) < 0.08 && Math.abs(dy) < 0.08 && Math.abs(dz) < 0.001) {
          return prev;
        }
        return {
          x: prev.x + dx * 0.12,
          y: prev.y + dy * 0.12,
          zoom: prev.zoom + dz * 0.12,
        };
      });
      animId = requestAnimationFrame(lerpCamera);
    };
    animId = requestAnimationFrame(lerpCamera);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Elastic pointer dragging state
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);

  // Fast Project Lookup Map
  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    allProjects.forEach((p) => map.set(p.slug, p));
    return map;
  }, []);

  // IntersectionObserver: Pause RAF/anim when off-screen
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Update layout dimensions natively on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasContainerRef.current) {
        const rect = canvasContainerRef.current.getBoundingClientRect();
        const width = Math.max(320, rect.width);
        const height = width < 768 ? 480 : 640;
        setCanvasDim({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Tech filter checker
  const matchesFilter = useCallback((p: Project, filter: TechFilter) => {
    if (filter === 'all') return true;
    const text = `${p.stack} ${p.title} ${p.category} ${p.description}`.toLowerCase();
    if (filter === 'ai') return text.includes('ai') || text.includes('ml') || text.includes('pytorch') || text.includes('faiss') || text.includes('vector');
    if (filter === 'cv') return text.includes('vision') || text.includes('opencv') || text.includes('grad-cam') || text.includes('lidar');
    if (filter === 'nextjs') return text.includes('next.js') || text.includes('react') || text.includes('typescript');
    if (filter === 'python') return text.includes('python') || text.includes('numpy') || text.includes('fastapi');
    if (filter === 'cloud') return text.includes('cloud') || text.includes('aws') || text.includes('sqlite') || text.includes('lambda') || text.includes('workers');
    return true;
  }, []);

  // -------------------------------------------------------------------------
  // DETERMINISTIC ORBITAL GEOMETRY GENERATOR
  // Locked concentric orbital lanes with mathematical zero-overlap guarantees.
  // -------------------------------------------------------------------------
  const nodes = useMemo(() => {
    const { width, height } = canvasDim;
    const centerX = width / 2;
    const centerY = height / 2;
    const isMobile = width < 640;
    const list: SimNode[] = [];

    if (viewMode === 'guided') {
      // ---------------------------------------------------------------------
      // GUIDED CLUSTER VIEW: Hierarchical Focus with Camera Centering
      // ---------------------------------------------------------------------
      if (!selectedSuperCluster) {
        // LEVEL 1: Clean Macro Overview
        // Core node in center
        list.push({
          id: 'root',
          type: 'root',
          label: 'Systems Core',
          sublabel: '18 Systems',
          x: centerX,
          y: centerY,
          targetX: centerX,
          targetY: centerY,
          radius: isMobile ? 22 : 28,
          color: '#F3EFE7',
          count: 18,
        });

        // Left Portal: Frontend, Spatial UI & Interactive
        const portalOffset = isMobile ? width * 0.28 : Math.min(200, width * 0.26);
        const leftX = centerX - portalOffset;
        list.push({
          id: 'cluster-frontend',
          type: 'super',
          label: 'Frontend & Spatial UI',
          sublabel: '[9 Systems] Click to Expand',
          x: leftX,
          y: centerY,
          targetX: leftX,
          targetY: centerY,
          radius: isMobile ? 18 : 24,
          color: '#82B7FF',
          superClusterId: 'cluster-frontend',
          count: 9,
        });

        // Right Portal: Backend, AI/ML & Compute Engines
        const rightX = centerX + portalOffset;
        list.push({
          id: 'cluster-backend',
          type: 'super',
          label: 'Backend & AI/ML Engines',
          sublabel: '[9 Systems] Click to Expand',
          x: rightX,
          y: centerY,
          targetX: rightX,
          targetY: centerY,
          radius: isMobile ? 18 : 24,
          color: '#FF6B35',
          superClusterId: 'cluster-backend',
          count: 9,
        });

        // Pre-render sub-clusters in subtle 180° orbital arcs around their portals
        // Frontend Sub-clusters (Left Arc: 120° to 240°)
        const feSubs = SUB_CLUSTERS.filter((s) => s.parentId === 'cluster-frontend');
        feSubs.forEach((sub, i) => {
          const angle = (Math.PI * 0.7) + (i * (Math.PI * 0.6) / Math.max(1, feSubs.length - 1));
          const r = isMobile ? 80 : 115;
          const sx = leftX - Math.sin(angle) * r;
          const sy = centerY + Math.cos(angle) * r;
          list.push({
            id: sub.id,
            type: 'sub',
            label: sub.shortLabel,
            sublabel: `${sub.projectSlugs.length} Systems`,
            x: sx,
            y: sy,
            targetX: sx,
            targetY: sy,
            radius: isMobile ? 12 : 15,
            color: sub.accentColor,
            parentId: 'cluster-frontend',
            superClusterId: 'cluster-frontend',
            subClusterId: sub.id,
            count: sub.projectSlugs.length,
          });
        });

        // Backend Sub-clusters (Right Arc)
        const beSubs = SUB_CLUSTERS.filter((s) => s.parentId === 'cluster-backend');
        beSubs.forEach((sub, i) => {
          const angle = (Math.PI * 0.7) + (i * (Math.PI * 0.6) / Math.max(1, beSubs.length - 1));
          const r = isMobile ? 80 : 115;
          const sx = rightX + Math.sin(angle) * r;
          const sy = centerY + Math.cos(angle) * r;
          list.push({
            id: sub.id,
            type: 'sub',
            label: sub.shortLabel,
            sublabel: `${sub.projectSlugs.length} Systems`,
            x: sx,
            y: sy,
            targetX: sx,
            targetY: sy,
            radius: isMobile ? 12 : 15,
            color: sub.accentColor,
            parentId: 'cluster-backend',
            superClusterId: 'cluster-backend',
            subClusterId: sub.id,
            count: sub.projectSlugs.length,
          });
        });

      } else {
        // LEVEL 2 / LEVEL 3: Focused Cluster Drill-Down
        const activeSuper = SUPER_CLUSTERS.find((s) => s.id === selectedSuperCluster)!;
        const currentSubs = SUB_CLUSTERS.filter((s) => s.parentId === selectedSuperCluster);
        const activeSubObj = SUB_CLUSTERS.find((s) => s.id === selectedSubCluster) || currentSubs[0];

        // 1. Center Anchor: The Active Super-Cluster Portal (Left Column)
        const anchorX = isMobile ? 54 : Math.max(120, width * 0.18);
        list.push({
          id: activeSuper.id,
          type: 'super',
          label: activeSuper.shortLabel,
          sublabel: activeSuper.domain,
          x: anchorX,
          y: centerY,
          targetX: anchorX,
          targetY: centerY,
          radius: isMobile ? 20 : 25,
          color: activeSuper.accentColor,
          superClusterId: activeSuper.id,
          count: activeSuper.count,
        });

        // 2. Middle Column: Sub-Domains in Orbital Arc / Stack
        const subColX = isMobile ? width * 0.45 : Math.max(260, width * 0.44);
        const subCount = currentSubs.length;
        const subSpan = Math.min(height - 120, subCount * (isMobile ? 70 : 85));
        const subTop = centerY - subSpan / 2 + (isMobile ? 25 : 35);
        const subStep = subSpan / Math.max(1, subCount - 1);

        currentSubs.forEach((sub, idx) => {
          const sy = subCount === 1 ? centerY : subTop + idx * subStep;
          list.push({
            id: sub.id,
            type: 'sub',
            label: sub.shortLabel,
            sublabel: `${sub.projectSlugs.length} Systems`,
            x: subColX,
            y: sy,
            targetX: subColX,
            targetY: sy,
            radius: isMobile ? 13 : 16,
            color: sub.accentColor,
            parentId: activeSuper.id,
            superClusterId: activeSuper.id,
            subClusterId: sub.id,
            count: sub.projectSlugs.length,
          });
        });

        // 3. Right Column: Expanded Project Leaf Nodes along circular orbital arc
        if (activeSubObj) {
          const pSlugs = activeSubObj.projectSlugs;
          const pCount = pSlugs.length;
          const projColX = isMobile ? width - 68 : Math.max(480, width * 0.76);
          const minSeparation = 56;
          const projSpan = Math.min(height - 100, Math.max(minSeparation * (pCount - 1), 140));
          const projTop = centerY - projSpan / 2;
          const projStep = pCount === 1 ? 0 : projSpan / Math.max(1, pCount - 1);

          pSlugs.forEach((slug, idx) => {
            const proj = projectMap.get(slug);
            const py = pCount === 1 ? centerY : projTop + idx * projStep;
            // Slight curve bowing away from center to create orbital arc feeling
            const arcOffset = pCount > 2 ? Math.sin((idx / (pCount - 1)) * Math.PI) * (isMobile ? 15 : 28) : 0;
            const px = projColX + arcOffset;

            list.push({
              id: slug,
              type: 'project',
              label: proj ? proj.title.split('—')[0].trim() : slug,
              sublabel: proj?.highlight || '',
              x: px,
              y: py,
              targetX: px,
              targetY: py,
              radius: isMobile ? 10 : 12.5,
              color: proj?.featured ? '#FF6B35' : '#F3EFE7',
              parentId: activeSubObj.id,
              superClusterId: activeSubObj.parentId,
              subClusterId: activeSubObj.id,
              project: proj,
            });
          });
        }
      }
    } else {
      // ---------------------------------------------------------------------
      // CONSTELLATION VIEW: All 18 Systems in Symmetrical Orbital Lanes
      // Left Wing: 9 Backend Systems | Center: Core | Right Wing: 9 Frontend Systems
      // ---------------------------------------------------------------------
      // Root Core
      list.push({
        id: 'root',
        type: 'root',
        label: 'Engineering Core',
        sublabel: '18 Systems',
        x: centerX,
        y: centerY,
        targetX: centerX,
        targetY: centerY,
        radius: isMobile ? 18 : 22,
        color: '#F3EFE7',
        count: 18,
      });

      // Super Clusters Left & Right
      const superSpread = Math.min(130, width * 0.16);
      SUPER_CLUSTERS.forEach((sc, i) => {
        const isLeft = sc.id === 'cluster-backend';
        const sx = centerX + (isLeft ? -superSpread : superSpread);
        const sy = centerY;

        list.push({
          id: sc.id,
          type: 'super',
          label: sc.shortLabel,
          sublabel: sc.domain,
          x: sx,
          y: sy,
          targetX: sx,
          targetY: sy,
          radius: isMobile ? 15 : 18,
          color: sc.accentColor,
          parentId: 'root',
          superClusterId: sc.id,
          count: sc.count,
        });
      });

      // Monotonic Vertical Stratification (9 left, 9 right)
      const topPad = isMobile ? 40 : 54;
      const vertSpan = height - topPad * 2;
      const vertStep = vertSpan / 8; // 9 positions
      const projSpread = Math.min(width * 0.36, (width / 2) - 105);
      const subSpread = projSpread * 0.52;

      // Backend (Left)
      const backendSubs = SUB_CLUSTERS.filter((s) => s.parentId === 'cluster-backend');
      let bIdx = 0;
      backendSubs.forEach((sub) => {
        const childYs: number[] = [];
        sub.projectSlugs.forEach((slug) => {
          const proj = projectMap.get(slug);
          const py = topPad + bIdx * vertStep;
          const px = centerX - projSpread;
          childYs.push(py);

          list.push({
            id: slug,
            type: 'project',
            label: proj ? proj.title.split('—')[0].trim() : slug,
            sublabel: proj?.highlight || '',
            x: px,
            y: py,
            targetX: px,
            targetY: py,
            radius: isMobile ? 8 : 10,
            color: proj?.featured ? '#FF6B35' : '#F3EFE7',
            parentId: sub.id,
            superClusterId: sub.parentId,
            subClusterId: sub.id,
            project: proj,
          });
          bIdx++;
        });

        const subY = childYs.reduce((a, b) => a + b, 0) / childYs.length;
        const subX = centerX - subSpread;
        list.push({
          id: sub.id,
          type: 'sub',
          label: sub.shortLabel,
          sublabel: `${sub.projectSlugs.length} Systems`,
          x: subX,
          y: subY,
          targetX: subX,
          targetY: subY,
          radius: isMobile ? 11 : 14,
          color: sub.accentColor,
          parentId: 'cluster-backend',
          superClusterId: 'cluster-backend',
          subClusterId: sub.id,
          count: sub.projectSlugs.length,
        });
      });

      // Frontend (Right)
      const frontendSubs = SUB_CLUSTERS.filter((s) => s.parentId === 'cluster-frontend');
      let fIdx = 0;
      frontendSubs.forEach((sub) => {
        const childYs: number[] = [];
        sub.projectSlugs.forEach((slug) => {
          const proj = projectMap.get(slug);
          const py = topPad + fIdx * vertStep;
          const px = centerX + projSpread;
          childYs.push(py);

          list.push({
            id: slug,
            type: 'project',
            label: proj ? proj.title.split('—')[0].trim() : slug,
            sublabel: proj?.highlight || '',
            x: px,
            y: py,
            targetX: px,
            targetY: py,
            radius: isMobile ? 8 : 10,
            color: proj?.featured ? '#82B7FF' : '#F3EFE7',
            parentId: sub.id,
            superClusterId: sub.parentId,
            subClusterId: sub.id,
            project: proj,
          });
          fIdx++;
        });

        const subY = childYs.reduce((a, b) => a + b, 0) / childYs.length;
        const subX = centerX + subSpread;
        list.push({
          id: sub.id,
          type: 'sub',
          label: sub.shortLabel,
          sublabel: `${sub.projectSlugs.length} Systems`,
          x: subX,
          y: subY,
          targetX: subX,
          targetY: subY,
          radius: isMobile ? 11 : 14,
          color: sub.accentColor,
          parentId: 'cluster-frontend',
          superClusterId: 'cluster-frontend',
          subClusterId: sub.id,
          count: sub.projectSlugs.length,
        });
      });
    }

    return list;
  }, [canvasDim, viewMode, selectedSuperCluster, selectedSubCluster, projectMap]);


  // Update camera target based on active focus node
  useEffect(() => {
    const { width, height } = canvasDim;
    const centerX = width / 2;
    const centerY = height / 2;

    if (selectedProjectSlug) {
      const pNode = nodes.find((n) => n.id === selectedProjectSlug);
      if (pNode) {
        targetCamRef.current = {
          x: (centerX - pNode.targetX) * 0.55,
          y: (centerY - pNode.targetY) * 0.55,
          zoom: 1.35,
        };
        return;
      }
    }

    if (selectedSubCluster) {
      const sNode = nodes.find((n) => n.id === selectedSubCluster);
      if (sNode) {
        targetCamRef.current = {
          x: (centerX - sNode.targetX) * 0.45,
          y: (centerY - sNode.targetY) * 0.45,
          zoom: 1.2,
        };
        return;
      }
    }

    if (selectedSuperCluster) {
      const scNode = nodes.find((n) => n.id === selectedSuperCluster);
      if (scNode) {
        targetCamRef.current = {
          x: (centerX - scNode.targetX) * 0.35,
          y: (centerY - scNode.targetY) * 0.35,
          zoom: 1.12,
        };
        return;
      }
    }

    targetCamRef.current = { x: 0, y: 0, zoom: 1.0 };
  }, [selectedProjectSlug, selectedSubCluster, selectedSuperCluster, nodes, canvasDim]);

  // Pointer drag logic
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setDraggedNodeId(id);
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setDragPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedNodeId || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setDragPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggedNodeId) {
      setDraggedNodeId(null);
      setDragPos(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const getNodePos = useCallback(
    (node: SimNode) => {
      if (draggedNodeId === node.id && dragPos) {
        return dragPos;
      }
      return { x: node.targetX, y: node.targetY };
    },
    [draggedNodeId, dragPos]
  );

  // Node Click Handlers
  const handleNodeClick = (node: SimNode) => {
    if (node.type === 'root') {
      setSelectedSuperCluster(null);
      setSelectedSubCluster(null);
      return;
    }

    if (node.type === 'super') {
      const scId = node.id as SuperClusterId;
      setSelectedSuperCluster(scId);
      const firstSub = SUB_CLUSTERS.find((s) => s.parentId === scId);
      if (firstSub) setSelectedSubCluster(firstSub.id);
      return;
    }

    if (node.type === 'sub') {
      setSelectedSubCluster(node.id);
      setSelectedSuperCluster(node.superClusterId || null);
      return;
    }

    if (node.type === 'project' && node.project) {
      setSelectedProjectSlug(node.project.slug);
      if (node.subClusterId) setSelectedSubCluster(node.subClusterId);
      if (node.superClusterId) setSelectedSuperCluster(node.superClusterId);
    }
  };

  // Currently inspected project
  const activeProject = useMemo(() => {
    if (selectedProjectSlug) return projectMap.get(selectedProjectSlug) || null;
    if (hoveredNodeId) return projectMap.get(hoveredNodeId) || null;
    return allProjects[0] || null;
  }, [selectedProjectSlug, hoveredNodeId, projectMap]);

  // Active Cluster Systems (for Right Panel State A)
  const activeClusterProjects = useMemo(() => {
    if (selectedSubCluster) {
      const sub = SUB_CLUSTERS.find((s) => s.id === selectedSubCluster);
      if (sub) {
        return sub.projectSlugs
          .map((slug) => projectMap.get(slug))
          .filter((p): p is Project => p !== undefined);
      }
    }
    if (selectedSuperCluster) {
      const subs = SUB_CLUSTERS.filter((s) => s.parentId === selectedSuperCluster);
      const slugs = subs.flatMap((s) => s.projectSlugs);
      return slugs
        .map((slug) => projectMap.get(slug))
        .filter((p): p is Project => p !== undefined);
    }
    return allProjects;
  }, [selectedSubCluster, selectedSuperCluster, projectMap]);

  // Node Opacity based on hover, tech filter, and active branch
  const getNodeOpacity = useCallback(
    (node: SimNode) => {
      if (techFilter !== 'all' && node.project) {
        if (!matchesFilter(node.project, techFilter)) return 0.18;
      }

      if (hoveredNodeId) {
        if (node.id === hoveredNodeId) return 1;
        const isConnected = CROSS_TECH_EDGES.some(
          (e) => (e.source === hoveredNodeId && e.target === node.id) || (e.target === hoveredNodeId && e.source === node.id)
        );
        const hoveredNode = nodes.find((n) => n.id === hoveredNodeId);
        const isParent = hoveredNode?.parentId === node.id || hoveredNode?.superClusterId === node.id;
        if (!isConnected && !isParent && node.type !== 'root') {
          return 0.22;
        }
      }

      return 1;
    },
    [techFilter, hoveredNodeId, matchesFilter, nodes]
  );

  // Active Project Neighbors (Cosine-Similarity vector recommendations)
  const relatedNeighbors = useMemo(() => {
    if (!activeProject) return [];
    const connectedSlugs: { slug: string; tech: string }[] = [];

    CROSS_TECH_EDGES.forEach((edge) => {
      if (edge.source === activeProject.slug) {
        connectedSlugs.push({ slug: edge.target, tech: edge.sharedTech });
      } else if (edge.target === activeProject.slug) {
        connectedSlugs.push({ slug: edge.source, tech: edge.sharedTech });
      }
    });

    return connectedSlugs
      .map((c) => ({
        project: projectMap.get(c.slug),
        tech: c.tech,
      }))
      .filter((c) => c.project !== undefined);
  }, [activeProject, projectMap]);

  return (
    <div
      ref={rootRef}
      className="relative w-full border border-[#F3EFE7]/[0.1] bg-[#070B12] text-[#F3EFE7] overflow-hidden select-none shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
    >
      {/* Precision Corner Crosshair Fiducials */}
      <GridCrosshair className="absolute top-2 left-2 z-30 opacity-40 text-[#82B7FF]" />
      <GridCrosshair className="absolute top-2 right-2 z-30 opacity-40 text-[#82B7FF]" />
      <GridCrosshair className="absolute bottom-2 left-2 z-30 opacity-40 text-[#82B7FF]" />
      <GridCrosshair className="absolute bottom-2 right-2 z-30 opacity-40 text-[#82B7FF]" />

      {/* Top Hairline Amber/Cyan Accent */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#82B7FF] via-[#FF6B35] to-[#F5D998] z-30" />

      {/* =====================================================================
          TOP CONTROLS & BREADCRUMB BAR (Never Get Lost)
          ===================================================================== */}
      <div className="relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-3 px-5 py-3 border-b border-[#F3EFE7]/[0.08] bg-[#070B12]/95 backdrop-blur-md">
        
        {/* Left Side: Clickable Breadcrumbs + Reset View Button */}
        <div className="flex items-center gap-2 overflow-x-auto py-0.5 text-xs scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setSelectedSuperCluster(null);
              setSelectedSubCluster(null);
              setSelectedProjectSlug(null);
              setViewMode('guided');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#101B30] hover:bg-[#17243A] text-[#F3EFE7] border border-[#F3EFE7]/15 rounded-[2px] transition-colors cursor-pointer shrink-0 font-medium"
            title="Reset to Root Systems View"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#4CC38A]" />
            <span>All Systems</span>
            <span className="font-mono text-[11px] opacity-75">(18)</span>
          </button>

          {selectedSuperCluster && (
            <>
              <span className="text-[#7A889B] shrink-0">/</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedSubCluster(null);
                  setSelectedProjectSlug(null);
                }}
                className="px-2 py-0.5 bg-[#101B30] hover:bg-[#17243A] text-[#FF6B35] border border-[#FF6B35]/30 rounded-[2px] transition-colors font-medium cursor-pointer shrink-0"
              >
                {selectedSuperCluster === 'cluster-backend' ? 'Backend & AI' : 'Frontend & Spatial'}
              </button>
            </>
          )}

          {selectedSubCluster && (
            <>
              <span className="text-[#7A889B] shrink-0">/</span>
              <span className="px-2 py-0.5 bg-[#101B30] text-[#F5D998] border border-[#F5D998]/30 rounded-[2px] font-medium shrink-0">
                {SUB_CLUSTERS.find((s) => s.id === selectedSubCluster)?.shortLabel}
              </span>
            </>
          )}

          {selectedProjectSlug && activeProject && (
            <>
              <span className="text-[#7A889B] shrink-0">/</span>
              <span className="px-2.5 py-0.5 bg-[#FF6B35]/20 text-[#F3EFE7] border border-[#FF6B35]/40 rounded-[2px] font-semibold truncate max-w-[160px] shrink-0">
                {activeProject.title.split('—')[0].trim()}
              </span>
            </>
          )}

          {/* Reset View Button */}
          {(selectedSuperCluster || selectedSubCluster || selectedProjectSlug || techFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSelectedSuperCluster(null);
                setSelectedSubCluster(null);
                setSelectedProjectSlug(null);
                setTechFilter('all');
              }}
              className="ml-1 text-[11px] font-mono text-[#A7B2C3] hover:text-[#FF6B35] transition-colors inline-flex items-center gap-1 cursor-pointer shrink-0"
              title="Reset entire view"
            >
              <span>↺</span>
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Center/Right: Stack Filter Pills & View Mode Toggle */}
        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          
          {/* Tech Filter Pills */}
          <div className="hidden sm:flex items-center gap-1">
            {TECH_FILTERS.map((tf) => (
              <button
                key={tf.id}
                type="button"
                onClick={() => setTechFilter(tf.id)}
                className={`px-2 py-0.5 text-[11px] font-mono rounded-[2px] border transition-colors cursor-pointer ${
                  techFilter === tf.id
                    ? 'bg-[#FF6B35] text-[#070B12] font-semibold border-[#FF6B35]'
                    : 'text-[#A7B2C3] border-transparent hover:border-[#F3EFE7]/20 hover:text-[#F3EFE7]'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle: [Guided Cluster View] vs [All 18 Nodes Constellation] */}
          <div className="flex items-center border border-[#F3EFE7]/15 bg-[#101B30] rounded-[2px] overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setViewMode('guided')}
              className={`px-3 py-1 transition-colors cursor-pointer font-medium ${
                viewMode === 'guided'
                  ? 'bg-[#FF6B35] text-[#070B12] font-semibold'
                  : 'text-[#A7B2C3] hover:text-[#F3EFE7]'
              }`}
            >
              Guided Cluster View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('constellation')}
              className={`px-3 py-1 transition-colors cursor-pointer font-medium border-l border-[#F3EFE7]/15 ${
                viewMode === 'constellation'
                  ? 'bg-[#82B7FF] text-[#070B12] font-semibold'
                  : 'text-[#A7B2C3] hover:text-[#F3EFE7]'
              }`}
            >
              All 18 Nodes Constellation
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SPLIT-SCREEN "VECTOR DATABASE STUDIO" LAYOUT (68% Canvas / 32% Inspector)
          ===================================================================== */}
      <div className="relative w-full flex flex-col lg:flex-row items-stretch lg:h-[680px]">
        
        {/* LEFT 68% (Desktop): Interactive Orbital Vector Canvas */}
        <div
          ref={canvasContainerRef}
          className="relative w-full lg:w-[68%] h-[480px] lg:h-full bg-[#070B12] overflow-hidden"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <svg
            ref={svgRef}
            className="w-full h-full block"
            style={{ touchAction: 'pan-y' }}
          >
            <defs>
              <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Concentric Latent Coordinate Rings */}
            <circle cx={canvasDim.width / 2} cy={canvasDim.height / 2} r={80} fill="none" stroke="rgba(167, 178, 195, 0.05)" strokeDasharray="3 6" />
            <circle cx={canvasDim.width / 2} cy={canvasDim.height / 2} r={170} fill="none" stroke="rgba(167, 178, 195, 0.04)" strokeDasharray="4 8" />
            <circle cx={canvasDim.width / 2} cy={canvasDim.height / 2} r={260} fill="none" stroke="rgba(167, 178, 195, 0.03)" strokeDasharray="4 8" />
            <circle cx={canvasDim.width / 2} cy={canvasDim.height / 2} r={350} fill="none" stroke="rgba(167, 178, 195, 0.02)" strokeDasharray="4 8" />
            
            {/* Subtle Structural Axis Lines */}
            <line x1="0" y1={canvasDim.height / 2} x2={canvasDim.width} y2={canvasDim.height / 2} stroke="rgba(167, 178, 195, 0.04)" strokeWidth="1" />
            <line x1={canvasDim.width / 2} y1="0" x2={canvasDim.width / 2} y2={canvasDim.height} stroke="rgba(167, 178, 195, 0.04)" strokeWidth="1" />

            {/* Camera Pan/Zoom Transform Matrix Group */}
            <g
              transform={`translate(${camera.x.toFixed(2)}, ${camera.y.toFixed(2)}) scale(${camera.zoom.toFixed(3)})`}
              style={{ transformOrigin: `${canvasDim.width / 2}px ${canvasDim.height / 2}px`, transition: 'transform 0.08s ease-out' }}
            >
            {/* 1. Hierarchy Parent-to-Child Edges & Streaming Data Packets */}
            {nodes.map((child) => {
              if (!child.parentId) return null;
              const parent = nodes.find((n) => n.id === child.parentId);
              if (!parent) return null;

              const childPos = getNodePos(child);
              const parentPos = getNodePos(parent);

              const isHovered = hoveredNodeId === child.id || hoveredNodeId === parent.id;
              const isSelected = selectedProjectSlug === child.id || selectedSubCluster === child.id || selectedSuperCluster === child.id;
              const active = isHovered || isSelected;

              const midX = (parentPos.x + childPos.x) / 2;
              const pathD = `M ${parentPos.x} ${parentPos.y} Q ${midX} ${parentPos.y} ${childPos.x} ${childPos.y}`;

              return (
                <g key={`edge-${parent.id}-${child.id}`} opacity={getNodeOpacity(child)}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={active ? child.color : 'rgba(167, 178, 195, 0.16)'}
                    strokeWidth={active ? 2 : 1}
                    className="transition-colors duration-200"
                  />
                  {active && isVisible && (
                    <circle
                      r="2.5"
                      fill={child.color === '#FF6B35' ? '#F5D998' : '#82B7FF'}
                      className="pointer-events-none"
                    >
                      <animateMotion
                        path={pathD}
                        dur="1.8s"
                        repeatCount="indefinite"
                        rotate="auto"
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* 2. Semantic Cross-Tech Cosine-Similarity Edges */}
            {CROSS_TECH_EDGES.map((edge, idx) => {
              const src = nodes.find((n) => n.id === edge.source);
              const tgt = nodes.find((n) => n.id === edge.target);
              if (!src || !tgt) return null;

              const srcPos = getNodePos(src);
              const tgtPos = getNodePos(tgt);

              const isHovered = hoveredNodeId === src.id || hoveredNodeId === tgt.id;
              const isSelected = selectedProjectSlug === src.id || selectedProjectSlug === tgt.id;
              const active = isHovered || isSelected;

              return (
                <line
                  key={`cross-${idx}-${edge.source}-${edge.target}`}
                  x1={srcPos.x}
                  y1={srcPos.y}
                  x2={tgtPos.x}
                  y2={tgtPos.y}
                  stroke={active ? '#82B7FF' : 'rgba(130, 183, 255, 0.1)'}
                  strokeWidth={active ? 1.8 : 0.8}
                  strokeDasharray="4 4"
                  opacity={active ? 0.95 : 0.18}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* 3. Render Graph Nodes */}
            {nodes.map((node) => {
              const pos = getNodePos(node);
              const isHovered = hoveredNodeId === node.id;
              const isSelected = selectedProjectSlug === node.id || selectedSubCluster === node.id || selectedSuperCluster === node.id;
              const opacity = getNodeOpacity(node);

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  opacity={opacity}
                  className="cursor-pointer transition-transform duration-300 ease-out select-none"
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => handleNodeClick(node)}
                  onPointerDown={(e) => handlePointerDown(node.id, e)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${node.label} ${node.type} node`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleNodeClick(node);
                      if (node.type === 'project' && node.project) {
                        router.push(`/projects/${node.project.slug}`);
                      }
                    }
                  }}
                  onDoubleClick={() => {
                    if (node.type === 'project' && node.project) {
                      router.push(`/projects/${node.project.slug}`);
                    }
                  }}
                >
                  {/* Active Rotating Reticle Ring (Level 3 Target) */}
                  {(isHovered || isSelected) && (
                    <circle
                      r={node.radius + 6}
                      fill="none"
                      stroke={node.color}
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      className="animate-spin-slow"
                    />
                  )}

                  {/* Outer Ring for Clusters */}
                  {node.type !== 'project' && (
                    <circle
                      r={node.radius + 3}
                      fill="none"
                      stroke={node.color}
                      strokeWidth="1"
                      opacity="0.4"
                    />
                  )}

                  {/* Core Node Circle */}
                  <circle
                    r={node.radius}
                    fill={node.type === 'project' ? (isHovered || isSelected ? node.color : '#101B30') : '#070B12'}
                    stroke={node.color}
                    strokeWidth={node.type === 'root' ? 3 : node.type === 'super' ? 2.5 : 2}
                    filter={isHovered || isSelected ? 'url(#nodeGlow)' : undefined}
                  />

                  {/* Count Badge inside Clusters */}
                  {node.count !== undefined && (
                    <text
                      y="1"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={node.type === 'root' ? '#070B12' : '#F3EFE7'}
                      fontSize={node.type === 'root' ? '12' : '10'}
                      fontFamily="monospace"
                      fontWeight="600"
                      className="pointer-events-none select-none"
                    >
                      {node.count}
                    </text>
                  )}

                  {/* Project Center Dot */}
                  {node.type === 'project' && (
                    <circle
                      r="3.5"
                      fill={isHovered || isSelected ? '#070B12' : node.color}
                      className="pointer-events-none"
                    >
                      {isHovered && <animate attributeName="r" values="3.5;5;3.5" dur="1.2s" repeatCount="indefinite" />}
                    </circle>
                  )}

                  {/* Node Label with High-Contrast Text Halo */}
                  <g className="pointer-events-none select-none">
                    <text
                      y={node.radius + 13}
                      textAnchor="middle"
                      fill="#F3EFE7"
                      stroke="#070B12"
                      strokeWidth="3.5"
                      style={{ paintOrder: 'stroke fill' }}
                      fontSize={node.type === 'super' ? '12.5' : node.type === 'sub' ? '11.5' : '11'}
                      fontFamily={node.type === 'super' ? 'Geist Serif, serif' : 'Geist, sans-serif'}
                      fontWeight={node.type === 'super' ? '500' : '400'}
                      className="tracking-tight"
                    >
                      {node.label}
                    </text>

                    {/* Distinction / Highlight for Project Nodes */}
                    {node.project && (
                      <text
                        y={node.radius + 24}
                        textAnchor="middle"
                        fill="#F5D998"
                        stroke="#070B12"
                        strokeWidth="3"
                        style={{ paintOrder: 'stroke fill' }}
                        fontSize="9"
                        fontFamily="monospace"
                        className="tracking-wider opacity-90"
                      >
                        {node.project.highlight}
                      </text>
                    )}
                  </g>
                </g>
              );
            })}
            </g>
          </svg>

          {/* Interactive Hint Banner at Bottom-Left of Canvas */}
          <div className="absolute bottom-3 left-4 pointer-events-none z-10 flex items-center gap-2 text-[11px] font-mono text-[#7A889B] bg-[#070B12]/80 px-2.5 py-1 rounded-[2px] border border-[#F3EFE7]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
            <span>Click clusters to drill down · Double-click project to open case study</span>
          </div>
        </div>

        {/* RIGHT 32% (Desktop): Persistent System Inspector & Directory Panel */}
        <div className="relative w-full lg:w-[32%] bg-[#0C1322] border-t lg:border-t-0 lg:border-l border-[#A7B2C3]/[0.12] flex flex-col justify-between overflow-y-auto">
          <GridCrosshair className="absolute top-2 right-2 opacity-30 text-[#82B7FF] pointer-events-none" />

          {/* STATE B: Project Node Selected / Hovered -> Full System Dossier Card */}
          {selectedProjectSlug && activeProject ? (
            <div className="p-6 sm:p-7 space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* Back to Cluster Directory Button */}
                <button
                  type="button"
                  onClick={() => setSelectedProjectSlug(null)}
                  className="text-xs font-mono text-[#82B7FF] hover:text-[#FF6B35] transition-colors inline-flex items-center gap-1.5 cursor-pointer pb-1 border-b border-transparent hover:border-[#FF6B35]"
                >
                  <span>←</span>
                  <span>Back to Cluster Directory</span>
                </button>

                {/* Project Header Meta */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#8A99AD]">
                    <span className="text-[#FF6B35] font-semibold">{activeProject.category}</span>
                    <span className="text-[#7A889B]">·</span>
                    <span className="text-[#82B7FF]">{activeProject.year}</span>
                    <span className="text-[#7A889B]">·</span>
                    <span className="text-[#4CC38A]">Verified System</span>
                  </div>

                  <h4 className="text-2xl sm:text-[26px] font-serif text-[#F3EFE7] leading-tight tracking-tight">
                    {activeProject.title}
                  </h4>

                  {/* Verified Benchmark Telemetry Box */}
                  <div className="p-3 bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-[2px] space-y-1 mt-2">
                    <div className="text-[10px] font-mono text-[#FF6B35] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
                      <span>Verified Benchmark Telemetry</span>
                    </div>
                    <div className="text-xs font-mono text-[#F5D998] font-medium">
                      {activeProject.highlight}
                    </div>
                  </div>
                </div>

                {/* Architectural Summary */}
                <p className="text-xs sm:text-[13px] font-sans text-[#A7B2C3] leading-relaxed pt-1">
                  {activeProject.description}
                </p>

                {/* Tech Stack (Middle-Dot format per GEMINI.md Rule 9) */}
                <div className="pt-2 border-t border-[#F3EFE7]/[0.08] space-y-1.5">
                  <span className="text-[10px] font-mono text-[#7A889B] uppercase tracking-wider block">
                    Core Architecture &amp; Stack:
                  </span>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#C4CDD8] font-sans">
                    {activeProject.stack.split(',').map((tech, i, arr) => (
                      <React.Fragment key={i}>
                        <span className="text-[#F3EFE7] font-medium">{tech.trim()}</span>
                        {i < arr.length - 1 && <span className="text-[#8A99AD] select-none">·</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Related Systems (Cosine-Similarity Recommendations) */}
                {relatedNeighbors.length > 0 && (
                  <div className="pt-2 border-t border-[#F3EFE7]/[0.08] space-y-1.5">
                    <span className="text-[10px] font-mono text-[#7A889B] uppercase tracking-wider block">
                      Related Architecture:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {relatedNeighbors.slice(0, 3).map((rn, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            if (rn.project) setSelectedProjectSlug(rn.project.slug);
                          }}
                          className="px-2 py-0.5 bg-[#101B30] hover:bg-[#17243A] text-[#82B7FF] border border-[#82B7FF]/20 rounded-[2px] transition-colors cursor-pointer text-[11px] font-sans flex items-center gap-1"
                        >
                          <span className="text-[#F3EFE7]">{rn.project?.title.split('—')[0].trim()}</span>
                          <span className="text-[#7A889B] font-mono text-[9.5px]">({rn.tech})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Solid #FF6B35 Primary CTA + Secondary Link */}
              <div className="pt-5 border-t border-[#F3EFE7]/[0.08] space-y-2">
                <Link
                  href={`/projects/${activeProject.slug}`}
                  className="w-full py-3 px-4 bg-[#FF6B35] hover:bg-[#FF8547] text-[#070B12] text-xs font-mono font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 select-none cursor-pointer rounded-[2px] shadow-[0_0_20px_rgba(255,107,53,0.3)]"
                >
                  <span>Open Project Case Study</span>
                  <span>→</span>
                </Link>

                {activeProject.github && (
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-[#101B30] hover:bg-[#17243A] text-[#F3EFE7] border border-[#F3EFE7]/15 text-xs font-mono font-medium transition-colors flex items-center justify-center gap-2 select-none cursor-pointer rounded-[2px]"
                  >
                    <span>View Repository Source</span>
                    <span>↗</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* STATE A: Cluster Selected / Idle -> List of Systems in Active Cluster */
            <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Active Cluster Title & Meta */}
                <div className="space-y-1 pb-3 border-b border-[#F3EFE7]/[0.08]">
                  <div className="text-[10px] font-mono text-[#7A889B] uppercase tracking-wider">
                    {selectedSubCluster
                      ? 'Sub-Domain Directory'
                      : selectedSuperCluster
                      ? 'Super-Cluster Directory'
                      : 'Systems Architecture Index'}
                  </div>
                  <h4 className="text-lg font-serif text-[#F3EFE7]">
                    {selectedSubCluster
                      ? SUB_CLUSTERS.find((s) => s.id === selectedSubCluster)?.label
                      : selectedSuperCluster
                      ? SUPER_CLUSTERS.find((s) => s.id === selectedSuperCluster)?.label
                      : 'All 18 Production Systems'}
                  </h4>
                  <p className="text-xs font-sans text-[#A7B2C3]">
                    {selectedSubCluster
                      ? SUB_CLUSTERS.find((s) => s.id === selectedSubCluster)?.description
                      : 'Select any system row below to inspect architectural telemetry and benchmarks.'}
                  </p>
                </div>

                {/* Clickable Indexed Systems List */}
                <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                  {activeClusterProjects.map((proj, idx) => {
                    const isSelected = selectedProjectSlug === proj.slug;
                    return (
                      <button
                        key={proj.slug}
                        type="button"
                        onClick={() => {
                          setSelectedProjectSlug(proj.slug);
                        }}
                        onMouseEnter={() => setHoveredNodeId(proj.slug)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        className={`w-full p-2.5 text-left rounded-[2px] border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#17243A] border-[#FF6B35]/40 text-[#F3EFE7]'
                            : 'bg-[#101B30]/60 hover:bg-[#101B30] border-[#F3EFE7]/[0.06] text-[#A7B2C3] hover:text-[#F3EFE7]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="font-mono text-[11px] text-[#FF6B35] font-semibold shrink-0">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="font-sans text-xs font-medium text-[#F3EFE7] truncate">
                            {proj.title.split('—')[0].trim()}
                          </span>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5 text-[10px] font-mono text-[#F5D998]">
                          <span className="hidden sm:inline opacity-80">{proj.year}</span>
                          <span className="text-[#FF6B35]">→</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Help Prompt */}
              <div className="pt-3 border-t border-[#F3EFE7]/[0.08] text-[11px] font-mono text-[#7A889B] flex items-center justify-between">
                <span>Total Indexed: {activeClusterProjects.length}</span>
                <Link href="/projects" className="text-[#FF6B35] hover:text-[#F5D998] transition-colors">
                  Tabular Ledger →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Datum Line */}
      <div className="px-5 py-2.5 border-t border-[#F3EFE7]/[0.08] bg-[#070B12]/95 flex flex-wrap items-center justify-between text-[11px] font-mono text-[#7A889B] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4CC38A]" />
          <span>Vector Latent Coordinates · Deterministic Concentric Orbital Lanes</span>
        </div>
        <div className="flex items-center gap-4">
          <span>18 Verified Systems</span>
          <Link href="/projects" className="text-[#FF6B35] hover:text-[#F5D998] transition-colors">
            Open Full Ledger →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SystemsCodeGraph;
