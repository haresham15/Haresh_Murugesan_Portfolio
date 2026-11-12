import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { allProjects } from '@/content/projects';
import { experiences } from '@/content/experience';
import { skillDomains } from '@/content/skills';
import { profile } from '@/content/profile';
import { usePortfolioStore } from '@/store/usePortfolioStore';

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Project' | 'Experience' | 'Skill' | 'Action';
  href?: string;
  action?: () => void;
  badge?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { setCopiedEmail } = usePortfolioStore();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle global escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Build items catalog
  const allItems: SearchItem[] = [
    // Actions
    {
      id: 'action-resume',
      title: 'View Résumé (PDF)',
      subtitle: 'Opens official PDF transcript and verified academic credentials',
      category: 'Action',
      href: '/Haresh_Murugesan_Resume.pdf',
      badge: 'PDF',
    },
    {
      id: 'action-copy-email',
      title: 'Copy Email Address',
      subtitle: 'haresham2006@gmail.com',
      category: 'Action',
      action: async () => {
        try {
          await navigator.clipboard.writeText(profile.contacts.email);
          setCopiedEmail(true);
          setTimeout(() => setCopiedEmail(false), 2000);
        } catch {
          window.prompt('Copy email:', profile.contacts.email);
        }
      },
      badge: 'Clipboard',
    },
    {
      id: 'action-podcast',
      title: 'Syntinuum Podcast Stream',
      subtitle: 'Technical founder interviews on Spotify',
      category: 'Action',
      href: 'https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98',
      badge: 'Spotify',
    },

    // Projects
    ...allProjects.map((p) => ({
      id: `project-${p.slug}`,
      title: p.title,
      subtitle: `${p.highlight} • ${p.stack}`,
      category: 'Project' as const,
      href: `/projects/${p.slug}`,
      badge: p.statusBadge,
    })),

    // Experience
    ...experiences.map((exp) => ({
      id: `exp-${exp.id}`,
      title: `${exp.role} @ ${exp.company}`,
      subtitle: `${exp.period} • ${exp.skillsDemonstrated.slice(0, 3).join(', ')}`,
      category: 'Experience' as const,
      href: '/#experience',
      badge: exp.type,
    })),

    // Skills
    ...skillDomains.flatMap((domain) =>
      domain.skills.map((skill) => ({
        id: `skill-${skill.name}`,
        title: skill.name,
        subtitle: `Proven by ${skill.provenBy.map((p) => p.title).join(', ')}`,
        category: 'Skill' as const,
        href: skill.provenBy[0]?.href || '/#skills',
        badge: domain.title,
      }))
    ),
  ];

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 15);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        executeItem(selected);
      }
    }
  };

  const executeItem = (item: SearchItem) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.href) {
      if (item.href.startsWith('http') || item.href.endsWith('.pdf')) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else {
        router.push(item.href);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="System Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#03050A]/85 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-[#060A12]/95 border border-[#18458B]/35 rounded-[2px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#18458B]/25 gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#FF2800] shrink-0">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search projects, skills, roles, or actions..."
            className="w-full bg-transparent text-sm sm:text-base text-[#F4F6F9] placeholder:text-[#7E8B9B] focus:outline-none font-sans"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-[#7E8B9B] bg-[#03050A] border border-[#18458B]/25 rounded-[2px]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <ul
          ref={listRef}
          role="listbox"
          className="overflow-y-auto p-2 divide-y divide-[#18458B]/15 max-h-[60vh] no-scrollbar"
        >
          {filteredItems.length === 0 ? (
            <li className="p-8 text-center text-sm font-sans text-[#7E8B9B]">
              No results found matching &ldquo;<span className="text-[#F4F6F9] font-mono">{query}</span>&rdquo;.
            </li>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-[2px] cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-[#0B1E40]/60 text-[#F4F6F9]' : 'text-[#7E8B9B] hover:bg-[#060A12]'
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className={`text-sm font-sans font-medium truncate ${isSelected ? 'text-[#FF2800]' : 'text-[#F4F6F9]'}`}>
                      {item.title}
                    </span>
                    <span className="text-xs font-sans text-[#7E8B9B] truncate mt-0.5">
                      {item.subtitle}
                    </span>
                  </div>

                  {item.badge && (
                    <span className="shrink-0 text-[10px] font-mono uppercase px-2 py-0.5 rounded-[2px] bg-[#03050A] border border-[#18458B]/30 text-[#2563EB]">
                      {item.badge}
                    </span>
                  )}
                </li>
              );
            })
          )}
        </ul>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2 border-t border-[#18458B]/25 bg-[#03050A] flex items-center justify-between text-[11px] font-mono text-[#7E8B9B]">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
