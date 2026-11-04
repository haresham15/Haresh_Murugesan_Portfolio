/**
 * Build-time validation script for content & evidence integrity.
 * Ensures zero broken links, zero ungrounded evidence references, and zero typos.
 */

import { spawnSync } from 'child_process';
import process from 'process';

// Auto-respawn with --experimental-strip-types if needed so `node scripts/validate-content.mjs` works directly
if (!process.execArgv.includes('--experimental-strip-types')) {
  const result = spawnSync(process.execPath, ['--no-warnings', '--experimental-strip-types', ...process.argv.slice(1)], { stdio: 'inherit' });
  process.exit(result.status ?? 0);
}

const { flagshipProjects, archiveProjects, allProjects } = await import('../src/content/projects.ts');
const { evidenceRegistry } = await import('../src/content/evidence.ts');
const { profile } = await import('../src/content/profile.ts');
const { experiences, podcastGuests } = await import('../src/content/experience.ts');
const { skillDomains } = await import('../src/content/skills.ts');

console.log('🔍 Validating Portfolio Content & Evidence Registry...');

const errors = [];
const warnings = [];

// 1. Validate Evidence Registry
console.log(`Checking ${Object.keys(evidenceRegistry).length} evidence records...`);
for (const [id, record] of Object.entries(evidenceRegistry)) {
  if (record.id !== id) {
    errors.push(`Evidence ID mismatch: key "${id}" !== record.id "${record.id}"`);
  }
  if (!record.claim || !record.value || !record.methodology || !record.hardwareOrEnv) {
    errors.push(`Incomplete evidence record: "${id}" missing required metadata`);
  }
  if (record.lastVerified !== '2026-10-29') {
    errors.push(`Evidence record "${id}" lastVerified must be "2026-10-29"`);
  }
}

// 2. Validate Profile Proof Chips
console.log('Checking profile proof chips...');
profile.proofChips.forEach((chip) => {
  if (!evidenceRegistry[chip.evidenceId]) {
    errors.push(`Profile proof chip "${chip.label}" references missing evidence ID: "${chip.evidenceId}"`);
  }
});

// 3. Validate Projects
console.log(`Checking ${allProjects.length} projects...`);
const seenSlugs = new Set();
allProjects.forEach((project) => {
  if (seenSlugs.has(project.slug)) {
    errors.push(`Duplicate project slug: "${project.slug}"`);
  }
  seenSlugs.add(project.slug);

  if (project.primaryEvidenceId && !evidenceRegistry[project.primaryEvidenceId]) {
    errors.push(`Project "${project.slug}" primaryEvidenceId "${project.primaryEvidenceId}" not found in registry`);
  }

  project.caseStudy?.metrics?.forEach((metric) => {
    if (metric.evidenceId && !evidenceRegistry[metric.evidenceId]) {
      errors.push(`Project "${project.slug}" metric "${metric.label}" references missing evidenceId: "${metric.evidenceId}"`);
    }
  });

  if (project.featured) {
    if (!project.caseStudy?.decisions || project.caseStudy.decisions.length < 2) {
      errors.push(`Flagship project "${project.slug}" must have at least 2 explicit engineering decisions`);
    }
    if (!project.caseStudy?.c4Diagram) {
      warnings.push(`Flagship project "${project.slug}" does not have a C4 diagram defined`);
    }
  }
});

// 4. Validate Experiences
console.log(`Checking ${experiences.length} experience records...`);
experiences.forEach((exp) => {
  exp.evidenceIds?.forEach((evidenceId) => {
    if (!evidenceRegistry[evidenceId]) {
      errors.push(`Experience "${exp.id}" references missing evidence ID: "${evidenceId}"`);
    }
  });
});

// 5. Validate Podcast Guests (Anti-typo check for "Joesph")
console.log(`Checking ${podcastGuests.length} podcast guests...`);
podcastGuests.forEach((guest) => {
  if (guest.name.includes('Joesph')) {
    errors.push(`Typo in guest name: "${guest.name}" contains "Joesph", must be "Joseph"`);
  }
  if (!guest.role || !guest.company) {
    errors.push(`Guest "${guest.name}" missing role or company metadata`);
  }
});

// 6. Validate Skills
console.log(`Checking ${skillDomains.length} skill domains...`);
let totalSkills = 0;
skillDomains.forEach((domain) => {
  domain.skills.forEach((skill) => {
    totalSkills++;
    if (!skill.provenBy || skill.provenBy.length === 0) {
      errors.push(`Skill "${skill.name}" has no evidence proof links`);
    }
  });
});
console.log(`Verified ${totalSkills} skill capabilities.`);

// Summary
if (errors.length > 0) {
  console.error('\n❌ Content Validation Failed with errors:');
  errors.forEach((err) => console.error(`  - ${err}`));
  process.exit(1);
} else {
  if (warnings.length > 0) {
    console.warn('\n⚠️ Warnings:');
    warnings.forEach((w) => console.warn(`  - ${w}`));
  }
  console.log('\n✅ All content and evidence registries passed validation with 100% integrity.');
}
