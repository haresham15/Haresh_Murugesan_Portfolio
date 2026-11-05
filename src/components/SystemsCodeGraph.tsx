import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
}

export interface SubCluster {
  id: string;
  parentId: SuperClusterId;
  label: string;
  shortLabel: string;
  accentColor: string;
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
    id: 'cluster-backend',
    label: 'Backend, AI/ML & Compute Engines',
    shortLabel: 'Backend & AI',
    domain: 'Python, PyTorch, FAISS, Computer Vision & Distributed Systems',
    accentColor: '#FF6B35',
    description: 'Vector embeddings, sub-millisecond saliency pipelines, and spatial compute runtimes.',
  },
  {
    id: 'cluster-frontend',
    label: 'Frontend, Spatial UI & Interactive Systems',
    shortLabel: 'Frontend & Spatial',
    domain: 'Next.js, React, TypeScript, 3D WebGL/Deck.GL & Telemetry Interfaces',
    accentColor: '#82B7FF',
    description: 'Hardware-accelerated rendering, 60fps Web Workers, and zero-latency client state machines.',
  },
];

// Sub Clusters (Tier 2) - 4 under Backend, 3 under Frontend
export const SUB_CLUSTERS: SubCluster[] = [
  // Backend Sub-Clusters (9 projects total)
  {
    id: 'sub-cv-medical',
    parentId: 'cluster-backend',
    label: 'Computer Vision & Medical AI',
    shortLabel: 'Computer Vision',
    accentColor: '#FF6B35',
    projectSlugs: ['healios', 'cv-allergy-wheal'],
  },
  {
    id: 'sub-retrieval-search',
    parentId: 'cluster-backend',
    label: 'Information Retrieval & Search',
    shortLabel: 'Search & Retrieval',
    accentColor: '#FF6B35',
    projectSlugs: ['tamiltrove', 'tutormatch'],
  },
  {
    id: 'sub-predictive-modeling',
    parentId: 'cluster-backend',
    label: 'Predictive Modeling & Econometrics',
    shortLabel: 'Predictive Modeling',
    accentColor: '#FF8547',
    projectSlugs: ['routerx-careline', 'cs50-ai-projects', 'carstomer'],
  },
  {
    id: 'sub-cloud-systems',
    parentId: 'cluster-backend',
    label: 'Cloud & Systems Infrastructure',
    shortLabel: 'Systems & Core',
    accentColor: '#FF6B35',
    projectSlugs: ['software-2-projects', 'software-1-projects'],
  },

  // Frontend Sub-Clusters (9 projects total)
  {
    id: 'sub-spatial-3d',
    parentId: 'cluster-frontend',
    label: '3D Spatial & Geospatial Dashboards',
    shortLabel: 'Spatial & 3D',
    accentColor: '#82B7FF',
    projectSlugs: ['nyc-housing-market-ai'],
  },
  {
    id: 'sub-media-streaming',
    parentId: 'cluster-frontend',
    label: 'Media, Streaming & Brand Platforms',
    shortLabel: 'Media & Streaming',
    accentColor: '#82B7FF',
    projectSlugs: ['syntinuum-podcast-website', 'murugesan-rajaram-lab', 'portfolio-website', 'anna-birthday'],
  },
  {
    id: 'sub-telemetry-apps',
    parentId: 'cluster-frontend',
    label: 'Real-Time Telemetry & Productivity Apps',
    shortLabel: 'Telemetry & Productivity',
    accentColor: '#4CC38A',
    projectSlugs: ['apexis', 'tempo', 'philocracy', 'momwebsite'],
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

export type TechFilter = 'all' | 'python' | 'nextjs' | 'cv' | 'cloud' | 'spatial';

export const TECH_FILTERS: { id: TechFilter; label: string }[] = [
  { id: 'all', label: 'All Stacks' },
  { id: 'python', label: 'Python / AI' },
  { id: 'nextjs', label: 'Next.js / TS' },
  { id: 'cv', label: 'Computer Vision' },
  { id: 'cloud', label: 'Cloud & Core' },
  { id: 'spatial', label: 'Spatial & 3D' },
];

// ---------------------------------------------------------------------------
// 2. SIMULATION NODE DEFINITION
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 3. MAIN COMPONENT: SystemsCodeGraph (Built into Web Application)
// ---------------------------------------------------------------------------

export const SystemsCodeGraph: React.FC = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Responsive default: Hierarchy on mobile (<640px), Constellation on desktop
  const [viewMode, setViewMode] = useState<'hierarchy' | 'constellation'>('constellation');
  const [selectedSuperCluster, setSelectedSuperCluster] = useState<SuperClusterId>('cluster-backend');
  const [selectedSubCluster, setSelectedSubCluster] = useState<string | null>('sub-cv-medical');
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>('healios');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [techFilter, setTechFilter] = useState<TechFilter>('all');

  // Dynamic layout dimension tracking
  const [dimensions, setDimensions] = useState({ width: 1100, height: 640 });

  // Elastic pointer dragging state
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);

  // Fast Project Lookup Map
  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    allProjects.forEach((p) => map.set(p.slug, p));
    return map;
  }, []);

  // Update layout dimensions natively on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const width = Math.max(320, rect.width);
        const height = width < 640 ? 520 : width < 1024 ? 590 : 650;
        setDimensions({ width, height });
        if (width < 640 && viewMode === 'constellation') {
          setViewMode('hierarchy');
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [viewMode]);

  // Tech filter checker
  const matchesFilter = useCallback((p: Project, filter: TechFilter) => {
    if (filter === 'all') return true;
    const text = `${p.stack} ${p.title} ${p.category} ${p.description}`.toLowerCase();
    if (filter === 'python') return text.includes('python') || text.includes('tensorflow') || text.includes('pytorch') || text.includes('faiss');
    if (filter === 'nextjs') return text.includes('next.js') || text.includes('react') || text.includes('typescript');
    if (filter === 'cv') return text.includes('vision') || text.includes('opencv') || text.includes('grad-cam') || text.includes('lidar');
    if (filter === 'cloud') return text.includes('cloud') || text.includes('java') || text.includes('sqlite') || text.includes('workers');
    if (filter === 'spatial') return text.includes('spatial') || text.includes('osrm') || text.includes('deck.gl') || text.includes('map');
    return true;
  }, []);

  // -------------------------------------------------------------------------
  // DETERMINISTIC GEOMETRY CALCULATOR FOR NATIVE APPLICATION LAYOUT
  // Strictly prevents label overlaps through monotonic vertical stratification.
  // -------------------------------------------------------------------------
  const nodes = useMemo(() => {
    const { width, height } = dimensions;
    const centerY = height / 2;
    const isMobile = width < 640;

    const list: SimNode[] = [];

    if (viewMode === 'hierarchy') {
      // ---------------------------------------------------------------------
      // HIERARCHY DRILL-DOWN: 3-Column Left-to-Right Architectural Tree
      // ---------------------------------------------------------------------
      const activeSuper = selectedSuperCluster || 'cluster-backend';
      const activeSuperObj = SUPER_CLUSTERS.find((s) => s.id === activeSuper)!;
      const activeSub = selectedSubCluster || (activeSuper === 'cluster-backend' ? 'sub-cv-medical' : 'sub-spatial-3d');

      // Col 1: Active Macro Domain Anchor
      const col1X = isMobile ? 42 : Math.max(110, width * 0.15);
      list.push({
        id: activeSuperObj.id,
        type: 'super',
        label: activeSuperObj.shortLabel,
        sublabel: activeSuperObj.domain,
        x: col1X,
        y: centerY,
        targetX: col1X,
        targetY: centerY,
        radius: isMobile ? 18 : 24,
        color: activeSuperObj.accentColor,
        superClusterId: activeSuperObj.id,
        count: 9,
      });

      // Col 2: Domain Sub-Clusters
      const currentSubClusters = SUB_CLUSTERS.filter((s) => s.parentId === activeSuper);
      const subCount = currentSubClusters.length;
      const subColX = isMobile ? width * 0.44 : Math.max(260, width * 0.42);
      const subTopPad = isMobile ? 55 : 80;
      const subSpan = height - subTopPad * 2;
      const subSpacing = subSpan / Math.max(1, subCount - 1);

      currentSubClusters.forEach((sub, idx) => {
        const colY = subTopPad + idx * subSpacing;

        list.push({
          id: sub.id,
          type: 'sub',
          label: sub.shortLabel,
          sublabel: `${sub.projectSlugs.length} Systems`,
          x: subColX,
          y: colY,
          targetX: subColX,
          targetY: colY,
          radius: isMobile ? 13 : 17,
          color: sub.accentColor,
          parentId: activeSuperObj.id,
          superClusterId: activeSuperObj.id,
          subClusterId: sub.id,
          count: sub.projectSlugs.length,
        });
      });

      // Col 3: Production Project Leaf Nodes
      const targetSub = SUB_CLUSTERS.find((s) => s.id === activeSub) || currentSubClusters[0];
      if (targetSub) {
        const pCount = targetSub.projectSlugs.length;
        const projColX = isMobile ? width - 58 : Math.max(490, width * 0.76);
        const projTopPad = Math.max(70, centerY - ((pCount - 1) * 80) / 2);

        targetSub.projectSlugs.forEach((slug, idx) => {
          const proj = projectMap.get(slug);
          const colY = pCount === 1 ? centerY : projTopPad + idx * 80;

          list.push({
            id: slug,
            type: 'project',
            label: proj ? proj.title.split('—')[0].trim() : slug,
            sublabel: proj?.highlight || '',
            x: projColX,
            y: colY,
            targetX: projColX,
            targetY: colY,
            radius: isMobile ? 9.5 : 12.5,
            color: proj?.featured ? '#FF6B35' : '#F3EFE7',
            parentId: targetSub.id,
            superClusterId: targetSub.parentId,
            subClusterId: targetSub.id,
            project: proj,
          });
        });
      }
    } else {
      // ---------------------------------------------------------------------
      // FULL CONSTELLATION: Balanced Symmetrical Topology (Zero Label Overlaps)
      // Left Wing: 9 Backend Projects | Center: Root & Supers | Right Wing: 9 Frontend Projects
      // ---------------------------------------------------------------------
      const centerX = width / 2;

      // 1. Root Core in Center
      list.push({
        id: 'root',
        type: 'root',
        label: 'Engineering Core',
        sublabel: '18 Systems',
        x: centerX,
        y: centerY,
        targetX: centerX,
        targetY: centerY,
        radius: isMobile ? 18 : 23,
        color: '#F3EFE7',
        count: 18,
      });

      // 2. Super Clusters Left & Right
      const superSpread = Math.min(130, width * 0.12);
      SUPER_CLUSTERS.forEach((sc, i) => {
        const isLeft = i === 0;
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
          radius: isMobile ? 16 : 19,
          color: sc.accentColor,
          parentId: 'root',
          superClusterId: sc.id,
          count: 9,
        });
      });

      // 3. Monotonic Vertical Project Stratification
      // 9 Backend Projects on Left, 9 Frontend Projects on Right
      const topPad = isMobile ? 45 : 60;
      const vertSpan = height - topPad * 2;
      const vertStep = vertSpan / 8; // Exactly 8 intervals for 9 items = ~65px-72px per slot

      // Balanced horizontal spread ensuring at least 140px margin from canvas borders
      const projSpread = Math.min(width * 0.36, (width / 2) - 130);
      const subSpread = projSpread * 0.58;

      // --- Left Wing: Backend Sub-Clusters & Projects ---
      const backendSubs = SUB_CLUSTERS.filter((s) => s.parentId === 'cluster-backend');
      let backendGlobalProjIdx = 0;

      backendSubs.forEach((sub) => {
        const subProjCount = sub.projectSlugs.length;

        // Calculate each project node's exact position
        const childYs: number[] = [];
        sub.projectSlugs.forEach((slug) => {
          const proj = projectMap.get(slug);
          const py = topPad + backendGlobalProjIdx * vertStep;
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

          backendGlobalProjIdx++;
        });

        // Sub-cluster Y is the exact centroid of its child projects
        const subCentroidY = childYs.reduce((a, b) => a + b, 0) / childYs.length;
        const subX = centerX - subSpread;

        list.push({
          id: sub.id,
          type: 'sub',
          label: sub.shortLabel,
          sublabel: `${subProjCount} Systems`,
          x: subX,
          y: subCentroidY,
          targetX: subX,
          targetY: subCentroidY,
          radius: isMobile ? 12 : 15,
          color: sub.accentColor,
          parentId: 'cluster-backend',
          superClusterId: 'cluster-backend',
          subClusterId: sub.id,
          count: subProjCount,
        });
      });

      // --- Right Wing: Frontend Sub-Clusters & Projects ---
      const frontendSubs = SUB_CLUSTERS.filter((s) => s.parentId === 'cluster-frontend');
      let frontendGlobalProjIdx = 0;

      frontendSubs.forEach((sub) => {
        const subProjCount = sub.projectSlugs.length;

        const childYs: number[] = [];
        sub.projectSlugs.forEach((slug) => {
          const proj = projectMap.get(slug);
          const py = topPad + frontendGlobalProjIdx * vertStep;
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
            color: proj?.featured ? '#FF6B35' : '#F3EFE7',
            parentId: sub.id,
            superClusterId: sub.parentId,
            subClusterId: sub.id,
            project: proj,
          });

          frontendGlobalProjIdx++;
        });

        // Sub-cluster Y is centroid of its children
        const subCentroidY = childYs.reduce((a, b) => a + b, 0) / childYs.length;
        const subX = centerX + subSpread;

        list.push({
          id: sub.id,
          type: 'sub',
          label: sub.shortLabel,
          sublabel: `${subProjCount} Systems`,
          x: subX,
          y: subCentroidY,
          targetX: subX,
          targetY: subCentroidY,
          radius: isMobile ? 12 : 15,
          color: sub.accentColor,
          parentId: 'cluster-frontend',
          superClusterId: 'cluster-frontend',
          subClusterId: sub.id,
          count: subProjCount,
        });
      });
    }

    return list;
  }, [dimensions, viewMode, selectedSuperCluster, selectedSubCluster, projectMap]);

  // Node Drag Handler (pure tactile pointer movement; zero wheel trapping)
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

  // Helper to obtain current visual position (respects active pointer drag)
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
      setSelectedSuperCluster('cluster-backend');
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
      setSelectedSuperCluster(node.superClusterId || 'cluster-backend');
      return;
    }

    if (node.type === 'project' && node.project) {
      setSelectedProjectSlug(node.project.slug);
      setSelectedSubCluster(node.subClusterId || null);
      if (node.superClusterId) setSelectedSuperCluster(node.superClusterId);
    }
  };

  // Active inspected project for the integrated panel
  const activeProject = useMemo(() => {
    if (selectedProjectSlug) return projectMap.get(selectedProjectSlug) || null;
    if (hoveredNodeId) return projectMap.get(hoveredNodeId) || null;
    return allProjects[0] || null;
  }, [selectedProjectSlug, hoveredNodeId, projectMap]);

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
          return 0.2;
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
      ref={containerRef}
      className="relative w-full border border-[#F3EFE7]/[0.1] bg-[#070B12] text-[#F3EFE7] overflow-hidden select-none"
    >
      {/* Precision Corner Crosshair Fiducials */}
      <GridCrosshair className="absolute top-2 left-2 z-30 opacity-40 text-[#82B7FF]" />
      <GridCrosshair className="absolute top-2 right-2 z-30 opacity-40 text-[#82B7FF]" />
      <GridCrosshair className="absolute bottom-2 left-2 z-30 opacity-40 text-[#82B7FF]" />
      <GridCrosshair className="absolute bottom-2 right-2 z-30 opacity-40 text-[#82B7FF]" />

      {/* Top Swiss Hairline Accent */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#82B7FF] via-[#FF6B35] to-transparent z-30" />

      {/* =====================================================================
          TOP CONTROLS & BREADCRUMB BAR (Built into Web Application)
          ===================================================================== */}
      <div className="relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-3 px-5 py-3.5 border-b border-[#F3EFE7]/[0.08] bg-[#070B12]/95 backdrop-blur-md">
        
        {/* Left Side: Interactive Horizontal Path Breadcrumbs (Scrollable on Mobile with hidden scrollbar) */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto py-0.5 text-xs [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <button
            onClick={() => {
              setViewMode('constellation');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#101B30] hover:bg-[#17243A] text-[#F3EFE7] border border-[#F3EFE7]/15 rounded-[2px] transition-colors cursor-pointer shrink-0 font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#4CC38A]" />
            <span>All Systems</span>
            <span className="font-mono text-[11px] opacity-75">(18)</span>
          </button>

          <span className="text-[#7A889B] shrink-0">→</span>
          <button
            onClick={() => {
              setSelectedSubCluster(null);
              setViewMode('hierarchy');
            }}
            className="px-2.5 py-1 bg-[#101B30] hover:bg-[#17243A] text-[#FF6B35] border border-[#FF6B35]/30 rounded-[2px] transition-colors font-medium cursor-pointer shrink-0"
          >
            {selectedSuperCluster === 'cluster-backend' ? 'Backend & AI' : 'Frontend & Spatial'}
            <span className="ml-1 font-mono text-[11px] opacity-75">(9)</span>
          </button>

          {selectedSubCluster && (
            <>
              <span className="text-[#7A889B] shrink-0">→</span>
              <span className="px-2.5 py-1 bg-[#101B30] text-[#F5D998] border border-[#F5D998]/30 rounded-[2px] font-medium shrink-0">
                {SUB_CLUSTERS.find((s) => s.id === selectedSubCluster)?.shortLabel}
              </span>
            </>
          )}

          {activeProject && (
            <>
              <span className="text-[#7A889B] shrink-0">→</span>
              <span className="px-2.5 py-1 bg-[#FF6B35]/20 text-[#F3EFE7] border border-[#FF6B35]/40 rounded-[2px] font-semibold truncate max-w-[180px] shrink-0">
                {activeProject.title.split('—')[0].trim()}
              </span>
            </>
          )}
        </div>

        {/* Right Side: View Mode & Stack Filters */}
        <div className="flex items-center flex-wrap gap-2 shrink-0">
          {/* Quick Domain Switcher (When in Hierarchy Mode) */}
          {viewMode === 'hierarchy' && (
            <div className="flex items-center border border-[#F3EFE7]/15 bg-[#101B30] rounded-[2px] overflow-hidden text-xs">
              <button
                onClick={() => {
                  setSelectedSuperCluster('cluster-backend');
                  setSelectedSubCluster('sub-cv-medical');
                }}
                className={`px-2.5 py-1 transition-colors cursor-pointer font-medium ${
                  selectedSuperCluster === 'cluster-backend' ? 'bg-[#FF6B35] text-[#070B12] font-semibold' : 'text-[#A7B2C3] hover:text-[#F3EFE7]'
                }`}
              >
                Backend &amp; AI
              </button>
              <button
                onClick={() => {
                  setSelectedSuperCluster('cluster-frontend');
                  setSelectedSubCluster('sub-spatial-3d');
                }}
                className={`px-2.5 py-1 transition-colors cursor-pointer font-medium border-l border-[#F3EFE7]/15 ${
                  selectedSuperCluster === 'cluster-frontend' ? 'bg-[#82B7FF] text-[#070B12] font-semibold' : 'text-[#A7B2C3] hover:text-[#F3EFE7]'
                }`}
              >
                Frontend &amp; Spatial
              </button>
            </div>
          )}

          {/* View Mode Switcher */}
          <div className="flex items-center border border-[#F3EFE7]/15 bg-[#101B30] rounded-[2px] overflow-hidden text-xs">
            <button
              onClick={() => setViewMode('hierarchy')}
              className={`px-3 py-1.5 transition-colors cursor-pointer font-medium ${
                viewMode === 'hierarchy' ? 'bg-[#FF6B35] text-[#070B12] font-semibold' : 'text-[#A7B2C3] hover:text-[#F3EFE7]'
              }`}
            >
              Hierarchy Drill-Down
            </button>
            <button
              onClick={() => setViewMode('constellation')}
              className={`px-3 py-1.5 transition-colors cursor-pointer font-medium ${
                viewMode === 'constellation' ? 'bg-[#82B7FF] text-[#070B12] font-semibold' : 'text-[#A7B2C3] hover:text-[#F3EFE7]'
              }`}
            >
              Full Constellation <span className="font-mono text-[11px]">(18)</span>
            </button>
          </div>

          {/* Quick Filter Pills (Hidden on very narrow mobile screens to save space) */}
          <div className="hidden xl:flex items-center gap-1">
            {TECH_FILTERS.map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTechFilter(tf.id)}
                className={`px-2 py-1 text-[11px] font-sans rounded-[2px] border transition-colors cursor-pointer ${
                  techFilter === tf.id
                    ? 'bg-[#F3EFE7] text-[#070B12] font-semibold border-[#F3EFE7]'
                    : 'text-[#A7B2C3] border-transparent hover:border-[#F3EFE7]/20 hover:text-[#F3EFE7]'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================================
          INTERACTIVE CODEGRAPH STAGE (Zero Wheel Trapping; Pure Page Flow)
          ===================================================================== */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: `${dimensions.height}px` }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <svg
          ref={svgRef}
          className="w-full h-full block"
          style={{ touchAction: 'pan-y' }}
        >
          <defs>
            <radialGradient id="stageGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#101B30" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#070B12" stopOpacity="0" />
            </radialGradient>

            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Concentric Latent Radial Rings */}
          <circle cx={dimensions.width / 2} cy={dimensions.height / 2} r={130} fill="none" stroke="rgba(167, 178, 195, 0.05)" strokeDasharray="4 8" />
          <circle cx={dimensions.width / 2} cy={dimensions.height / 2} r={260} fill="none" stroke="rgba(167, 178, 195, 0.04)" strokeDasharray="4 8" />
          
          {/* Subtle Structural Axis */}
          <line x1="0" y1={dimensions.height / 2} x2={dimensions.width} y2={dimensions.height / 2} stroke="rgba(167, 178, 195, 0.05)" strokeWidth="1" />
          <line x1={dimensions.width / 2} y1="0" x2={dimensions.width / 2} y2={dimensions.height} stroke="rgba(167, 178, 195, 0.05)" strokeWidth="1" />

          {/* 1. Hierarchy Parent-to-Child Edges */}
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
                  stroke={active ? child.color : 'rgba(167, 178, 195, 0.18)'}
                  strokeWidth={active ? 2 : 1}
                  className="transition-colors duration-200"
                />
                {active && (
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

          {/* 2. Semantic Cross-Cluster Cosine-Similarity Edges */}
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
                stroke={active ? '#82B7FF' : 'rgba(130, 183, 255, 0.12)'}
                strokeWidth={active ? 1.8 : 0.8}
                strokeDasharray="4 4"
                opacity={active ? 0.95 : 0.22}
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
              >
                {/* Active Rotating Reticle Ring */}
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
                    opacity="0.35"
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
        </svg>
      </div>

      {/* =====================================================================
          INTEGRATED ARCHITECTURAL SYSTEM INSPECTION DRAWER (Built into Page Grid)
          ===================================================================== */}
      {activeProject ? (
        <div className="border-t border-[#F3EFE7]/[0.1] bg-[#0A101C] p-6 sm:p-8 relative">
          <GridCrosshair className="absolute top-2 right-2 opacity-50 text-[#82B7FF]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column (65% Width — Title, Domain & Executive Summary) */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-[#8A99AD] font-sans">
                <span className="text-[#FF6B35] font-medium">{activeProject.category}</span>
                <span className="text-[#7A889B] select-none">·</span>
                <span className="text-[#82B7FF] font-mono">Year {activeProject.year}</span>
                <span className="text-[#7A889B] select-none">·</span>
                <span className="text-[#4CC38A]">Verified Production System</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-serif text-[#F3EFE7] tracking-tight font-normal">
                {activeProject.title}
              </h4>

              <div className="text-xs sm:text-sm font-mono text-[#F5D998] font-medium flex items-center gap-2">
                <span className="text-[#FF6B35]">★</span>
                <span>{activeProject.highlight}</span>
              </div>

              <p className="text-xs sm:text-sm font-sans text-[#A7B2C3] leading-relaxed max-w-3xl pt-1">
                {activeProject.description}
              </p>

              {/* Related Cosine-Similarity Cross-Links */}
              {relatedNeighbors.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#7A889B] font-medium">Related Architecture:</span>
                  {relatedNeighbors.map((rn, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (rn.project) setSelectedProjectSlug(rn.project.slug);
                      }}
                      className="px-2.5 py-1 bg-[#101B30] hover:bg-[#17243A] text-[#82B7FF] border border-[#82B7FF]/20 rounded-[2px] transition-colors cursor-pointer text-xs font-sans flex items-center gap-1.5"
                    >
                      <span className="font-medium text-[#F3EFE7]">{rn.project?.title.split('—')[0].trim()}</span>
                      <span className="text-[#7A889B] font-mono text-[10px]">({rn.tech})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column (35% Width — Tech Stack & Direct Route Actions) */}
            <div className="lg:col-span-4 space-y-4 lg:border-l lg:border-[#F3EFE7]/[0.08] lg:pl-8">
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#7A889B] uppercase tracking-wider block">
                  Core Technologies
                </span>
                {/* Clean middle-dot typographic format per GEMINI.md Rule 9 */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#C4CDD8] font-sans">
                  {activeProject.stack.split(',').map((tech, i, arr) => (
                    <React.Fragment key={i}>
                      <span className="text-[#F3EFE7] font-medium">{tech.trim()}</span>
                      {i < arr.length - 1 && <span className="text-[#8A99AD] select-none">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row lg:flex-col gap-2.5">
                <Link
                  href={`/projects/${activeProject.slug}`}
                  className="w-full py-3 px-5 bg-[#FF6B35] hover:bg-[#FF8547] text-[#070B12] text-xs font-sans font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 select-none cursor-pointer rounded-[2px]"
                >
                  <span>Open Deep Technical Case Study</span>
                  <span>→</span>
                </Link>

                {activeProject.github && (
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-[#101B30] hover:bg-[#17243A] text-[#F3EFE7] border border-[#F3EFE7]/15 text-xs font-sans font-medium transition-colors flex items-center justify-center gap-2 select-none cursor-pointer rounded-[2px]"
                  >
                    <span>View Repository Source</span>
                    <span>↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-[#F3EFE7]/[0.1] bg-[#0A101C] p-6 text-center text-xs font-sans text-[#7A889B]">
          Active Vector Topology: 18 Systems Indexed. Click any node above to inspect architecture benchmarks and open case studies.
        </div>
      )}

      {/* Bottom Architectural Datum Line */}
      <div className="px-5 py-3 border-t border-[#F3EFE7]/[0.08] bg-[#070B12]/95 flex flex-wrap items-center justify-between text-[11px] font-sans text-[#7A889B] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4CC38A]" />
          <span>Click any system node to inspect telemetry · Drag nodes to explore topology</span>
        </div>
        <Link href="/projects" className="text-[#FF6B35] hover:text-[#F5D998] transition-colors cursor-pointer font-medium flex items-center gap-1">
          <span>Searchable Ledger Sheet</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
};

export default SystemsCodeGraph;
