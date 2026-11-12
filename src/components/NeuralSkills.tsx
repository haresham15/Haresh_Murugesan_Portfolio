import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ThemeSection, Reveal } from './ThemeSection';
import { skillDomains, type SkillDomain, type SkillItem } from '../content/skills';
import { getProjectBySlug } from '../content/projects';

interface ProvenProject {
  slug: string;
  name: string;
  href: string;
}

/** Highlight source: a whole domain, or a single skill inside it. */
type Focus = { domain: string; skill?: string } | null;

const shortTitle = (title: string) => title.split(' — ')[0].replace(/\s*\(.*\)$/, '');

const slugsOf = (skills: SkillItem[]) => {
  const set = new Set<string>();
  skills.forEach((s) => s.provenBy.forEach((p) => p.slug && set.add(p.slug)));
  return set;
};

export const NeuralSkills: React.FC = () => {
  const [hover, setHover] = useState<Focus>(null);
  const [pinned, setPinned] = useState<Focus>(null);
  const focus = hover ?? pinned;

  // Project index derived from content: every project that proves at least one skill.
  const projects = useMemo<ProvenProject[]>(() => {
    const seen = new Map<string, ProvenProject>();
    skillDomains.forEach((d) =>
      d.skills.forEach((s) =>
        s.provenBy.forEach((p) => {
          if (!p.slug || seen.has(p.slug)) return;
          const project = getProjectBySlug(p.slug);
          seen.set(p.slug, {
            slug: p.slug,
            name: project ? shortTitle(project.title) : shortTitle(p.title),
            href: project ? `/projects/${project.slug}` : p.href,
          });
        }),
      ),
    );
    return Array.from(seen.values());
  }, []);

  const lit = useMemo(() => {
    if (!focus) return null;
    const domain = skillDomains.find((d) => d.id === focus.domain);
    if (!domain) return null;
    const skills = focus.skill ? domain.skills.filter((s) => s.name === focus.skill) : domain.skills;
    return slugsOf(skills);
  }, [focus]);

  const focusLabel = (() => {
    if (!focus) return 'Hover a domain or skill to trace where it was used.';
    const domain = skillDomains.find((d) => d.id === focus.domain);
    return focus.skill ?? domain?.title ?? '';
  })();

  const togglePin = (d: SkillDomain) =>
    setPinned((p) => (p && p.domain === d.id && !p.skill ? null : { domain: d.id }));

  return (
    <ThemeSection
      id="skills"
      theme="obsidian"
      aria-label="Technical index"
      className="border-b border-[#18458B]/20 py-24 lg:py-36"
    >
      <div className="w-full flex flex-col">
        <Reveal className="pb-12 sm:pb-16 border-b border-[#C8D2E0]/10">
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-normal text-[#F4F6F9] leading-[0.95] tracking-[-0.02em]">
            Technical Index
          </h2>
          <p className="mt-6 max-w-[58ch] text-base sm:text-lg font-sans text-[#C8D2E0]/85 leading-relaxed">
            Five domains. Every skill points at the shipped project or role that proves it, so nothing here is a
            self-rating.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-4">
          {/* Domains */}
          <ol className="lg:col-span-8" onMouseLeave={() => setHover(null)}>
            {skillDomains.map((d, i) => {
              const domainActive = focus?.domain === d.id;
              const dimmed = focus && !domainActive;
              return (
                <Reveal
                  as="li"
                  key={d.id}
                  delay={i * 0.05}
                  y={18}
                  className="border-b border-[#C8D2E0]/10"
                >
                  <div
                    className={`grid grid-cols-[2.5rem_1fr] sm:grid-cols-[3.5rem_1fr] gap-x-2 py-8 sm:py-10 transition-opacity duration-500 ${
                      dimmed ? 'opacity-45' : 'opacity-100'
                    }`}
                  >
                  <span
                    className={`font-mono text-xs pt-2 tabular-nums transition-colors duration-300 ${
                      domainActive ? 'text-[#FF2800]' : 'text-[#7E8B9B]'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#F4F6F9] leading-tight tracking-[-0.01em]">
                    <button
                      type="button"
                      onMouseEnter={() => setHover({ domain: d.id })}
                      onFocus={() => setHover({ domain: d.id })}
                      onBlur={() => setHover(null)}
                      onClick={() => togglePin(d)}
                      aria-pressed={pinned?.domain === d.id && !pinned.skill}
                      className="text-left cursor-pointer outline-none focus-visible:underline decoration-[#FF2800] underline-offset-8"
                    >
                      {d.title}
                    </button>
                    </h3>
                    <p className="mt-3 max-w-[60ch] font-sans text-sm sm:text-base text-[#7E8B9B] leading-relaxed">
                      {d.description}
                    </p>
                    <ul className="mt-5 flex flex-wrap items-baseline gap-y-2 font-mono text-xs leading-relaxed">
                      {d.skills.map((s, k) => {
                        const skillActive = focus?.domain === d.id && focus.skill === s.name;
                        return (
                          <li key={s.name} className="flex items-baseline">
                            {k > 0 && (
                              <span aria-hidden="true" className="px-2.5 text-[#7E8B9B]/60">
                                ·
                              </span>
                            )}
                            <button
                              type="button"
                              onMouseEnter={() => setHover({ domain: d.id, skill: s.name })}
                              onFocus={() => setHover({ domain: d.id, skill: s.name })}
                              onBlur={() => setHover(null)}
                              onClick={() =>
                                setPinned((p) => (p?.skill === s.name ? null : { domain: d.id, skill: s.name }))
                              }
                              aria-pressed={pinned?.skill === s.name}
                              className={`text-left cursor-pointer outline-none transition-colors duration-200 focus-visible:text-[#F4F6F9] ${
                                skillActive ? 'text-[#FF2800]' : 'text-[#C8D2E0] hover:text-[#F4F6F9]'
                              }`}
                            >
                              {s.name}
                              {s.highlight && <span className="text-[#7E8B9B]"> ({s.highlight})</span>}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>

          {/* Cross-highlighted project index */}
          <aside className="lg:col-span-4" aria-label="Projects that prove these skills">
            <div className="lg:sticky lg:top-28 pt-8 sm:pt-10">
              <h3 className="font-mono text-xs text-[#7E8B9B]">Proven in</h3>
              <p className="mt-3 min-h-[3em] font-serif italic text-lg text-[#C8D2E0] leading-snug" aria-live="polite">
                {focusLabel}
              </p>
              <ul className="mt-6 border-t border-[#C8D2E0]/10">
                {projects.map((p) => {
                  const on = lit?.has(p.slug) ?? false;
                  const off = lit !== null && !on;
                  return (
                    <li key={p.slug} className="border-b border-[#C8D2E0]/10">
                      <Link
                        href={p.href}
                        className={`group relative flex items-center justify-between gap-4 py-3 min-h-[44px] font-sans text-sm transition-[color,opacity] duration-300 ${
                          on ? 'text-[#F4F6F9]' : off ? 'text-[#7E8B9B] opacity-40' : 'text-[#C8D2E0]'
                        } hover:text-[#F4F6F9] hover:opacity-100`}
                      >
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-[#FF2800] transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                          style={{ width: on ? 14 : 0 }}
                        />
                        <span
                          className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                          style={{ transform: on ? 'translateX(22px)' : 'none' }}
                        >
                          {p.name}
                        </span>
                        <span aria-hidden="true" className="font-mono text-xs text-[#7E8B9B] group-hover:text-[#FF2800] transition-colors">
                          →
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </ThemeSection>
  );
};

export default NeuralSkills;
