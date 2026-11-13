/**
 * The tool wall's single source of truth: tool -> the projects and roles that used it.
 *
 * Derived at build time from the site's own data, so the wall and the case studies
 * cannot disagree:
 *  - projects.ts: a project uses a tool when its stack, icon list, description or
 *    case-study text names it (rejected alternatives, limitations and next steps are
 *    ignored, since they name things the project did not use), or when an evidence
 *    record the project cites names it (evidence.ts, e.g. "Node.js runtime").
 *  - experience.ts: a role uses a tool when its skillsDemonstrated or bullets name it.
 *  - skills.ts: picks the five rows, and its provenBy links are trusted when the skill
 *    names exactly one tool. A compound skill ("PyTorch & TensorFlow") only links a
 *    project to a tool that the project's own data also names.
 *
 * Case-study fields read: summary, architecture, chosen options with their cost and result,
 * C4 nodes and edges, metrics, contribution. Skipped: problem (it describes the status quo),
 * rejected alternatives, limitations and next steps.
 *
 * Plain data in, plain data out: no React, no DOM. Tested by toolMap.test.ts.
 */
import { allProjects, type Project } from '../../content/projects';
import { skillDomains, type SkillDomain } from '../../content/skills';
import { evidenceRegistry, type EvidenceRecord } from '../../content/evidence';
import { experiences, type ExperienceRecord } from '../../content/experience';

export type DomainId = SkillDomain['id'];

export interface ToolSpec {
  id: string;
  name: string;
  domain: DomainId;
  /** Case-sensitive unless flagged; word-bounded so "React" never matches "reactive". */
  match: RegExp;
  /** Filenames in Project.icons that mean this tool. */
  iconFiles?: string[];
}

/**
 * Haresh's decision (docs/v7-blueprint.md, Decisions §2, 2026-11-13): every requested tool
 * gets an icon. He has hands-on experience with these even though no shipped project or
 * role in the site's data uses them yet. They render, are focusable and labelled, and
 * light up no names. If data later links one of them, the test fails so this list is
 * kept honest.
 */
export const EXPERIENCE_ONLY_TOOLS = ['cpp', 'go', 'swift', 'matlab', 'docker', 'threejs'] as const;
export type ExperienceOnlyToolId = (typeof EXPERIENCE_ONLY_TOOLS)[number];

/** Row order follows skills.ts; tool order within a row is the order below. */
export const TOOL_SPECS: ToolSpec[] = [
  // AI & Machine Learning
  { id: 'pytorch', name: 'PyTorch', domain: 'ai-ml', match: /\bPyTorch\b/ },
  { id: 'tensorflow', name: 'TensorFlow', domain: 'ai-ml', match: /\bTensorFlow\b/, iconFiles: ['tensorflow.svg'] },
  { id: 'keras', name: 'Keras', domain: 'ai-ml', match: /\bKeras\b/ },
  { id: 'opencv', name: 'OpenCV', domain: 'ai-ml', match: /\bOpenCV\b/ },
  { id: 'tesseract', name: 'Tesseract.js', domain: 'ai-ml', match: /\bTesseract\b/ },
  { id: 'huggingface', name: 'Hugging Face', domain: 'ai-ml', match: /\bHugging ?Face\b/, iconFiles: ['huggingface.svg'] },
  { id: 'pgvector', name: 'pgvector', domain: 'ai-ml', match: /\bpgvector\b/i },
  { id: 'faiss', name: 'FAISS', domain: 'ai-ml', match: /\bFAISS\b/ },

  // Software Systems & Backend
  { id: 'fastapi', name: 'FastAPI', domain: 'systems', match: /\bFastAPI\b/, iconFiles: ['fastapi.svg'] },
  { id: 'nodejs', name: 'Node.js', domain: 'systems', match: /\bNode\.js\b/ },
  { id: 'webworkers', name: 'Web Workers', domain: 'systems', match: /\bWeb Workers?\b/ },
  { id: 'postgresql', name: 'PostgreSQL', domain: 'systems', match: /\bPostgre(?:SQL|s)\b/, iconFiles: ['sql.svg'] },
  { id: 'sqlmodel', name: 'SQLModel', domain: 'systems', match: /\bSQLModel\b/ },
  { id: 'sqlite', name: 'SQLite', domain: 'systems', match: /sqlite/i },
  { id: 'supabase', name: 'Supabase', domain: 'systems', match: /\bSupabase\b/ },
  { id: 'zod', name: 'Zod', domain: 'systems', match: /\bZod\b/ },
  // Testing sits with systems so no row exceeds nine glyphs (one line at 1440 px).
  { id: 'junit', name: 'JUnit', domain: 'systems', match: /\bJUnit\b/ },

  // Frontend & Interactive Graphics
  { id: 'nextjs', name: 'Next.js', domain: 'frontend', match: /\bNext\.js\b/, iconFiles: ['nextjs.svg'] },
  { id: 'react', name: 'React', domain: 'frontend', match: /\bReact\b/, iconFiles: ['react.svg'] },
  { id: 'tailwind', name: 'Tailwind CSS', domain: 'frontend', match: /\bTailwind\b/, iconFiles: ['tailwind.svg'] },
  { id: 'framermotion', name: 'Framer Motion', domain: 'frontend', match: /\bFramer Motion\b/ },
  { id: 'canvas', name: 'HTML5 Canvas', domain: 'frontend', match: /\bCanvas\b/ },
  { id: 'webgl', name: 'WebGL', domain: 'frontend', match: /\bWebGL\b/ },
  { id: 'threejs', name: 'Three.js', domain: 'frontend', match: /\bThree\.js\b/i },
  { id: 'deckgl', name: 'Deck.gl', domain: 'frontend', match: /\bDeck\.?gl\b/i },
  { id: 'webaudio', name: 'Web Audio API', domain: 'frontend', match: /\bWeb Audio\b/ },

  // Data & Cloud Infrastructure
  { id: 'aws', name: 'AWS', domain: 'cloud-data', match: /\bAWS\b|\bAmazon Web Services\b/ },
  { id: 'docker', name: 'Docker', domain: 'cloud-data', match: /\bDocker\b/ },
  { id: 'githubactions', name: 'GitHub Actions', domain: 'cloud-data', match: /\bGitHub Actions\b/ },
  { id: 'pandas', name: 'pandas', domain: 'cloud-data', match: /\bPandas\b/i, iconFiles: ['pandas.svg'] },
  { id: 'numpy', name: 'NumPy', domain: 'cloud-data', match: /\bNumPy\b/, iconFiles: ['numpy.svg'] },
  { id: 'scikitlearn', name: 'scikit-learn', domain: 'cloud-data', match: /\bScikit-?Learn\b/i, iconFiles: ['scitkitlearn.svg', 'scikitlearn.svg'] },
  { id: 'streamlit', name: 'Streamlit', domain: 'cloud-data', match: /\bStreamlit\b/, iconFiles: ['streamlit.svg'] },
  { id: 'openstreetmap', name: 'OpenStreetMap', domain: 'cloud-data', match: /\bOpenStreetMap\b/ },
  { id: 'osrm', name: 'OSRM', domain: 'cloud-data', match: /\bOSRM\b/ },

  // Languages & Core CS
  { id: 'python', name: 'Python', domain: 'core-cs', match: /\bPython\b/, iconFiles: ['python.svg'] },
  { id: 'typescript', name: 'TypeScript', domain: 'core-cs', match: /\bTypeScript\b/, iconFiles: ['typescript.svg'] },
  { id: 'javascript', name: 'JavaScript', domain: 'core-cs', match: /\bJavaScript\b/, iconFiles: ['javascript.svg'] },
  { id: 'java', name: 'Java', domain: 'core-cs', match: /\bJava\b/, iconFiles: ['java.svg'] },
  { id: 'r', name: 'R', domain: 'core-cs', match: /\bRStudio\b|^R\b/ },
  { id: 'cpp', name: 'C++', domain: 'core-cs', match: /C\+\+/ },
  { id: 'go', name: 'Go', domain: 'core-cs', match: /\bGolang\b|^Go$/ },
  { id: 'swift', name: 'Swift / ARKit', domain: 'core-cs', match: /\bSwift\b|\bARKit\b/ },
  { id: 'matlab', name: 'MATLAB', domain: 'core-cs', match: /\bMATLAB\b/ },
];

export interface ToolLink {
  /** `project:<slug>` or `role:<experience id>`. */
  key: string;
  kind: 'project' | 'role';
  name: string;
  href: string;
  /** 'data': the project or role names the tool. 'skills': only a single-tool skills.ts entry says so. */
  source: 'data' | 'skills';
}

export interface WallTool {
  id: string;
  name: string;
  domain: DomainId;
  links: ToolLink[];
}

export interface WallRow {
  id: DomainId;
  title: string;
  tools: WallTool[];
}

export interface WallName {
  key: string;
  kind: 'project' | 'role';
  name: string;
  href: string;
  toolIds: string[];
}

export interface ToolWall {
  rows: WallRow[];
  /** The "Proven in" column: every project or role that at least one tool links to. */
  names: WallName[];
  /** skills.ts skill names that name no tool (concepts such as C4 or Grad-CAM). */
  conceptSkills: string[];
  /** skills.ts provenBy entries that resolve to no project slug or role. */
  unresolvedProvenBy: string[];
}

export interface WallSources {
  projects: Project[];
  domains: SkillDomain[];
  evidence: Record<string, EvidenceRecord>;
  roles: ExperienceRecord[];
}

/** Short display names for roles; keyed by experience id. */
const ROLE_NAMES: Record<string, string> = {
  'cas-2026': 'CAS, AI & Software Development',
  'osu-pathology-research': 'OSU Digital Pathology Research',
  'cis-honda-99p': 'Honda 99P Labs Accelerator',
  'philocracy-leadership': 'Philocracy',
  'syntinuum-podcast': 'Syntinuum Podcast',
};

/** skills.ts writes roles as free text; these keywords pick the experience record. */
const ROLE_KEYWORDS: [RegExp, string][] = [
  [/\bCAS\b|Chemical Abstracts/, 'cas-2026'],
  [/\bOSU\b.*Pathology|Digital Pathology Research/, 'osu-pathology-research'],
  [/\bHonda\b|99P/, 'cis-honda-99p'],
];

const ROLE_HREF = '/#experience';

export const shortProjectName = (title: string) => title.split(' — ')[0].replace(/\s*\([^)]*\)\s*$/, '').trim();

function projectCorpus(p: Project, evidence: Record<string, EvidenceRecord>): string[] {
  const cs = p.caseStudy;
  const out = [p.title, p.highlight, p.description, ...p.stack.split(',').map((s) => s.trim())];
  if (cs) {
    out.push(cs.executiveSummary, cs.architecture, cs.personalContribution);
    for (const d of cs.decisions ?? []) out.push(d.optionChosen, d.costAccepted, d.measuredResult);
    for (const m of cs.metrics ?? []) out.push(m.label, m.detail);
    for (const n of cs.c4Diagram?.nodes ?? []) out.push(n.label, n.sublabel, n.description);
    for (const e of cs.c4Diagram?.edges ?? []) out.push(e.label, e.protocol ?? '');
  }
  const cited = new Set<string>();
  if (p.primaryEvidenceId) cited.add(p.primaryEvidenceId);
  for (const m of cs?.metrics ?? []) if (m.evidenceId) cited.add(m.evidenceId);
  for (const id of cited) {
    const ev = evidence[id];
    if (ev) out.push(ev.methodology, ev.hardwareOrEnv);
  }
  return out.filter(Boolean);
}

function roleCorpus(r: ExperienceRecord): string[] {
  return [...r.skillsDemonstrated, ...r.bullets];
}

const names = (spec: ToolSpec, corpus: string[]) => corpus.some((s) => spec.match.test(s));

export function buildToolWall({ projects, domains, evidence, roles }: WallSources): ToolWall {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const projectText = new Map(projects.map((p) => [p.slug, projectCorpus(p, evidence)]));
  const roleText = new Map(roles.map((r) => [r.id, roleCorpus(r)]));
  const roleById = new Map(roles.map((r) => [r.id, r]));

  const linksByTool = new Map<string, Map<string, ToolLink>>(TOOL_SPECS.map((t) => [t.id, new Map()]));
  const add = (toolId: string, link: ToolLink) => {
    const m = linksByTool.get(toolId)!;
    if (!m.has(link.key)) m.set(link.key, link);
  };
  const projectLink = (p: Project, source: ToolLink['source']): ToolLink => ({
    key: `project:${p.slug}`,
    kind: 'project',
    name: shortProjectName(p.title),
    href: `/projects/${p.slug}`,
    source,
  });
  const roleLink = (r: ExperienceRecord, source: ToolLink['source']): ToolLink => ({
    key: `role:${r.id}`,
    kind: 'role',
    name: ROLE_NAMES[r.id] ?? r.company,
    href: ROLE_HREF,
    source,
  });

  // 1. Own data: projects and roles that name the tool.
  for (const spec of TOOL_SPECS) {
    for (const p of projects) {
      const viaIcon = spec.iconFiles?.some((f) => p.icons.includes(f)) ?? false;
      if (viaIcon || names(spec, projectText.get(p.slug)!)) add(spec.id, projectLink(p, 'data'));
    }
    for (const r of roles) {
      if (names(spec, roleText.get(r.id)!)) add(spec.id, roleLink(r, 'data'));
    }
  }

  // 2. skills.ts: trusted when the skill names exactly one tool.
  const conceptSkills: string[] = [];
  const unresolvedProvenBy: string[] = [];
  for (const d of domains) {
    for (const skill of d.skills) {
      const tools = TOOL_SPECS.filter((t) => t.match.test(skill.name));
      if (tools.length === 0) conceptSkills.push(skill.name);
      for (const entry of skill.provenBy) {
        let target: { link: (s: ToolLink['source']) => ToolLink; corpus: string[] } | null = null;
        if (entry.type === 'project' && entry.slug && bySlug.has(entry.slug)) {
          const p = bySlug.get(entry.slug)!;
          target = { link: (s) => projectLink(p, s), corpus: projectText.get(p.slug)! };
        } else if (entry.type === 'experience') {
          const id = ROLE_KEYWORDS.find(([re]) => re.test(entry.title))?.[1];
          const r = id ? roleById.get(id) : undefined;
          if (r) target = { link: (s) => roleLink(r, s), corpus: roleText.get(r.id)! };
        }
        if (!target) {
          unresolvedProvenBy.push(`${skill.name} -> ${entry.title}`);
          continue;
        }
        for (const t of tools) {
          if (tools.length === 1 || names(t, target.corpus)) add(t.id, target.link('skills'));
        }
      }
    }
  }

  // 3. A role's link is redundant when a project the role itself cites carries the tool
  //    (the Syntinuum role and the Syntinuum site are one piece of work).
  for (const [, links] of linksByTool) {
    for (const [key, link] of links) {
      if (link.kind !== 'role') continue;
      const r = roleById.get(key.slice('role:'.length))!;
      if (r.projectSlugs?.some((s) => links.has(`project:${s}`))) links.delete(key);
    }
  }

  const tools: WallTool[] = TOOL_SPECS.map((t) => ({
    id: t.id,
    name: t.name,
    domain: t.domain,
    links: [...linksByTool.get(t.id)!.values()],
  }));

  const rows: WallRow[] = domains.map((d) => ({
    id: d.id,
    title: d.title,
    tools: tools.filter((t) => t.domain === d.id),
  }));

  // Names column: projects in projects.ts order, then roles in experience.ts order.
  const toolIdsByKey = new Map<string, string[]>();
  for (const t of tools) {
    for (const l of t.links) {
      const list = toolIdsByKey.get(l.key) ?? [];
      list.push(t.id);
      toolIdsByKey.set(l.key, list);
    }
  }
  const nameEntries: WallName[] = [];
  for (const p of projects) {
    const key = `project:${p.slug}`;
    const ids = toolIdsByKey.get(key);
    if (ids) nameEntries.push({ key, kind: 'project', name: shortProjectName(p.title), href: `/projects/${p.slug}`, toolIds: ids });
  }
  for (const r of roles) {
    const key = `role:${r.id}`;
    const ids = toolIdsByKey.get(key);
    if (ids) nameEntries.push({ key, kind: 'role', name: ROLE_NAMES[r.id] ?? r.company, href: ROLE_HREF, toolIds: ids });
  }

  return { rows, names: nameEntries, conceptSkills, unresolvedProvenBy };
}

export const toolWall: ToolWall = buildToolWall({
  projects: allProjects,
  domains: skillDomains,
  evidence: evidenceRegistry,
  roles: experiences,
});
