#!/usr/bin/env node

/**
 * project-docs validator
 *
 * Validates documentation structure, frontmatter, and content quality.
 *
 * Usage:
 *   node scripts/docs/validate-docs.mjs [options] [docs-root-path]
 *
 * Options:
 *   --strict    Enable content validation, date checks, and session activity checks
 */

import { readdir, readFile } from 'fs/promises';
import { join, relative, resolve, dirname } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
// scripts/docs/ → repo root (2 levels up)
const DEFAULT_DOCS_DIR = resolve(SCRIPT_DIR, '..', '..');

const REQUIRED_DIRS = [
  'product', 'architecture', 'context', 'references',
  'plans', 'sessions', 'handoffs', 'memory',
];

const REQUIRED_FILES = [
  'product/VISION.md',
  'product/SCOPE.md',
  'product/ROADMAP.md',
  'architecture/SYSTEM_OVERVIEW.md',
  'architecture/MODULES.md',
  'architecture/DECISIONS.md',
  'architecture/DEPENDENCIES.md',
  'context/TECH_STACK.md',
  'context/CONVENTIONS.md',
  'context/CURRENT_STATE.md',
  'context/KNOWN_ISSUES.md',
  'references/REPO_MAP.md',
  'references/KEY_FILES.md',
  'references/CRITICAL_FLOWS.md',
  'plans/PLAN_TEMPLATE.md',
  'sessions/SESSION_TEMPLATE.md',
  'handoffs/HANDOFF_TEMPLATE.md',
  'memory/RECURRING_MISTAKES.md',
  'memory/CHANGELOG_NOTES.md',
];

const REQUIRED_FRONTMATTER = ['status', 'owner', 'last_updated', 'read_policy'];

// --- Strict mode constants ---

const PLACEHOLDER_PATTERNS = [
  /last_updated:\s*YYYY-MM-DD/i,
  /owner:\s*<.*>/,
  /<!--\s*(TODO|Example|Add |List |In \d|What does)/i,
];

const REQUIRED_CONTENT_FILES = [
  'product/VISION.md',
  'context/CURRENT_STATE.md',
  'context/KNOWN_ISSUES.md',
  'context/TECH_STACK.md',
  'context/CONVENTIONS.md',
];

// Directories to skip when scanning for .md files
const SKIP_DIRS = new Set(['.', '..', '.git', '.claude', '.agents', 'node_modules', 'scripts', 'dist', 'src', 'lib', 'build', 'vendor']);

// --- Helpers ---

function parseFrontmatter(content) {
  const normalized = content.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const fields = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      fields[key] = value;
    }
  }
  return fields;
}

function isValidISODate(str) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const date = new Date(str + 'T00:00:00Z');
  return !isNaN(date.getTime()) && date.toISOString().startsWith(str);
}

function daysSince(dateStr) {
  const then = new Date(dateStr + 'T00:00:00Z');
  const now = new Date();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function getGitCommitCount() {
  try {
    const output = execSync('git rev-list --count HEAD', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    return parseInt(output.trim(), 10);
  } catch {
    return null;
  }
}

function getCommitsSinceDate(dateStr) {
  try {
    const output = execSync(`git rev-list --count --since="${dateStr}" HEAD`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    return parseInt(output.trim(), 10);
  } catch {
    return null;
  }
}

async function getSessionFiles(docsDir) {
  const sessionsDir = join(docsDir, 'sessions');
  if (!existsSync(sessionsDir)) return [];
  const entries = await readdir(sessionsDir);
  return entries.filter(f => f.endsWith('.md') && f !== 'SESSION_TEMPLATE.md');
}

async function getLatestSessionDate(docsDir, sessionFiles) {
  let latestDate = null;
  for (const file of sessionFiles) {
    const content = await readFile(join(docsDir, 'sessions', file), 'utf-8');
    const fm = parseFrontmatter(content);
    if (fm && fm.last_updated && isValidISODate(fm.last_updated)) {
      if (!latestDate || fm.last_updated > latestDate) {
        latestDate = fm.last_updated;
      }
    }
  }
  return latestDate;
}

async function getAllMdFiles(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.') || SKIP_DIRS.has(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllMdFiles(fullPath, base));
    } else if (entry.name.endsWith('.md') && entry.name !== 'README.md' && entry.name !== 'CLAUDE.md' && entry.name !== 'AGENTS.md') {
      files.push({ path: fullPath, rel: relative(base, fullPath) });
    }
  }
  return files;
}

// --- Main ---

async function main() {
  const args = process.argv.slice(2);
  const strict = args.includes('--strict');
  const positional = args.filter(a => !a.startsWith('--'));
  const docsDir = positional[0] ? resolve(positional[0]) : DEFAULT_DOCS_DIR;

  const errors = [];
  const warnings = [];

  console.log(`\n🔍 Validating project-docs at: ${docsDir}${strict ? ' (strict mode)' : ''}\n`);

  // 1. Check required directories
  for (const dir of REQUIRED_DIRS) {
    if (!existsSync(join(docsDir, dir))) {
      errors.push(`Missing required directory: ${dir}/`);
    }
  }

  // 2. Check required files
  for (const file of REQUIRED_FILES) {
    if (!existsSync(join(docsDir, file))) {
      errors.push(`Missing required file: ${file}`);
    }
  }

  // 3. Validate frontmatter on all .md files
  const mdFiles = await getAllMdFiles(docsDir);
  for (const { path: filePath, rel } of mdFiles) {
    const content = await readFile(filePath, 'utf-8');
    const fm = parseFrontmatter(content);

    if (!fm) {
      errors.push(`Missing frontmatter: ${rel}`);
      continue;
    }

    for (const field of REQUIRED_FRONTMATTER) {
      if (!fm[field]) {
        errors.push(`Missing frontmatter field '${field}': ${rel}`);
      }
    }

    // Check for TODOs in stable files
    if (fm.status === 'stable' && content.includes('<!-- TODO:')) {
      errors.push(`TODO found in stable file: ${rel}`);
    }

  }

  // --- Strict-only checks ---
  if (strict) {
    const totalCommits = getGitCommitCount();
    const inGracePeriod = totalCommits !== null && totalCommits < 3;

    // 3b. Frontmatter date validation (skip during grace period)
    if (!inGracePeriod) {
      for (const { path: filePath, rel } of mdFiles) {
        const content = await readFile(filePath, 'utf-8');
        const fm = parseFrontmatter(content);
        if (!fm || !fm.last_updated) continue;
        const isTemplate = rel.includes('TEMPLATE') || rel.includes('ADR-TEMPLATE');
        if (isTemplate) continue;

        if (fm.last_updated.toLowerCase() === 'yyyy-mm-dd') {
          errors.push(`Placeholder date 'YYYY-MM-DD' in: ${rel}`);
        } else if (!isValidISODate(fm.last_updated)) {
          errors.push(`Invalid date format '${fm.last_updated}' in: ${rel}`);
        } else if (fm.status === 'active' && daysSince(fm.last_updated) > 30) {
          warnings.push(`Stale date (${fm.last_updated}, ${daysSince(fm.last_updated)} days old) in active file: ${rel}`);
        }
      }
    }

    // 4. Placeholder detection on required content files
    if (!inGracePeriod) {
      for (const file of REQUIRED_CONTENT_FILES) {
        const filePath = join(docsDir, file);
        if (!existsSync(filePath)) continue;
        const content = await readFile(filePath, 'utf-8');
        const matches = PLACEHOLDER_PATTERNS.filter(p => p.test(content));
        if (matches.length >= 2) {
          errors.push(`Template placeholder content detected in: ${file} (${matches.length} placeholder patterns found)`);
        }
      }
    }

    // 5. Session activity check
    if (!inGracePeriod && totalCommits !== null) {
      const sessionFiles = await getSessionFiles(docsDir);

      if (sessionFiles.length === 0) {
        if (totalCommits > 5) {
          errors.push(`No session notes found but ${totalCommits} commits exist. Create a session note using sessions/SESSION_TEMPLATE.md`);
        }
      } else {
        const latestDate = await getLatestSessionDate(docsDir, sessionFiles);
        if (latestDate) {
          const commitsSince = getCommitsSinceDate(latestDate);
          if (commitsSince !== null && commitsSince > 10) {
            warnings.push(`${commitsSince} commits since last session note (${latestDate}). Consider creating a new session note`);
          }
        }
      }
    } else if (totalCommits === null) {
      warnings.push('Git not available — skipping session activity check');
    }
  }

  // 6. Report
  console.log(`  Files checked: ${mdFiles.length}`);
  console.log(`  Errors: ${errors.length}`);
  console.log(`  Warnings: ${warnings.length}`);
  if (strict) console.log(`  Mode: strict`);

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    for (const err of errors) console.log(`  - ${err}`);
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    for (const warn of warnings) console.log(`  - ${warn}`);
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ All checks passed!\n');
  }

  // Exit code 2 blocks Claude Code hooks; exit 0 allows
  // Warnings are printed but don't block
  if (errors.length > 0) {
    process.stderr.write(`\n❌ Documentation validation failed (${errors.length} error(s)). Fix the issues above before committing.\n`);
    process.exit(2);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Validation failed:', err.message);
  process.exit(2);
});
